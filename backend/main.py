import os
import asyncio
from typing import List, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from dotenv import load_dotenv
from firecrawl import FirecrawlApp
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import Field

load_dotenv()

app = FastAPI(title="SiteScope AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firecrawl and Gemini
firecrawl_api_key = os.getenv("FIRECRAWL_API_KEY")
gemini_api_key = os.getenv("GEMINI_API_KEY")

if not firecrawl_api_key or firecrawl_api_key == "YOUR_PROVIDED_KEY":
    print("Warning: FIRECRAWL_API_KEY not set correctly")
if not gemini_api_key or gemini_api_key == "YOUR_PROVIDED_KEY":
    print("Warning: GEMINI_API_KEY not set")

firecrawl = FirecrawlApp(api_key=firecrawl_api_key)
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=gemini_api_key, temperature=0)

# Define schemas for structured output
class ProductService(BaseModel):
    name: str = Field(description="Name of the product or service")
    description: str = Field(description="Detailed description of the product or service")

class ContactInfo(BaseModel):
    addresses: List[str] = Field(description="List of physical addresses found (e.g., Head Office, Branch Office)")
    emails: List[str] = Field(description="List of contact email addresses found")
    phones: List[str] = Field(description="List of contact phone numbers found")

class SWOTAnalysis(BaseModel):
    strengths: List[str] = Field(description="Internal positive factors and advantages")
    weaknesses: List[str] = Field(description="Internal negative factors and areas for improvement")
    opportunities: List[str] = Field(description="External positive factors and potential growth areas")
    threats: List[str] = Field(description="External negative factors and potential risks")

class SEOMetadata(BaseModel):
    title: str = Field(description="The primary SEO page title")
    description: str = Field(description="The primary meta description")
    primary_keywords: List[str] = Field(description="Top 5-10 SEO keywords identified from the content")

class BusinessIntelligenceReport(BaseModel):
    company_overview: str = Field(description="1-2 paragraphs summarizing the company from a professional perspective")
    products_services: List[ProductService] = Field(description="List of products and services offered with descriptions")
    uniqueness: List[str] = Field(description="3-5 key brand differentiators that make this company stand out")
    target_audience: str = Field(description="A description of the primary and secondary target customers/audience")
    tech_stack: List[str] = Field(description="Key technologies, tools, or software platforms mentioned or identifiable (e.g., AWS, React, Salesforce)")
    swot_analysis: SWOTAnalysis = Field(description="Detailed SWOT analysis of the business")
    seo_metadata: SEOMetadata = Field(description="SEO insights including title, description and keywords")
    brand_voice: str = Field(description="Description of the company's brand voice and tone (e.g., Professional, Playful, Authoritative)")
    social_links: List[str] = Field(description="List of social media profile URLs found (LinkedIn, Twitter, Facebook, Instagram, etc.)")
    policies: str = Field(description="Concise summary of privacy, terms, and compliance policies if found")
    contact_info: ContactInfo = Field(description="Contact information details. IMPORTANT: Search thoroughly in footer and header sections across ALL pages for Head Office and Branch Office details.")

parser = PydanticOutputParser(pydantic_object=BusinessIntelligenceReport)

class AnalyzeRequest(BaseModel):
    url: HttpUrl

@app.get("/")
async def root():
    return {"message": "SiteScope AI API is running"}

async def crawl_and_analyze(url: str):
    try:
        # 1. Crawl the website
        # Using the crawl endpoint to find top 5 relevant pages
        # Note: firecrawl-py's crawl is synchronous in the basic SDK, we run it in a thread
        loop = asyncio.get_event_loop()
        
        # Simplified crawl approach: crawl with limit
        crawl_result = await loop.run_in_executor(
            None,
            lambda: firecrawl.crawl(
                url, 
                limit=10, 
                scrape_options={'formats': ['markdown']}
            )
        )
        
        if not crawl_result or not crawl_result.data:
            raise Exception("Crawl failed or returned no data")

        # Combine markdown content from all pages
        combined_markdown = ""
        for page in crawl_result.data:
            url_source = page.metadata.source_url if page.metadata else 'Unknown'
            combined_markdown += f"\n\n--- PAGE: {url_source} ---\n\n"
            combined_markdown += page.markdown or ''

        # 2. Analyze with Gemini
        prompt = ChatPromptTemplate.from_template(
            "You are an expert business intelligence analyst and SEO specialist. Analyze the following combined content from a website and extract structured intelligence.\n\n"
            "Your analysis MUST include:\n"
            "1. A deep SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats).\n"
            "2. SEO Metadata (Identify the likely main title, description, and top keywords).\n"
            "3. Brand Voice (Assess the tone and personality of the writing).\n"
            "4. Thorough contact extraction (Search footers/headers across all pages for multiple office locations, emails, and phone numbers).\n"
            "5. Social media profile links.\n\n"
            "Be precise, professional, and provide actionable insights.\n\n"
            "CONTENT:\n{content}\n\n"
            "{format_instructions}"
        )
        
        chain = prompt | llm | parser
        
        report = await loop.run_in_executor(
            None,
            lambda: chain.invoke({
                "content": combined_markdown[:150000],  # Increased context window for 2.5-Flash
                "format_instructions": parser.get_format_instructions()
            })
        )
        
        return report

    except Exception as e:
        print(f"Error in crawl_and_analyze: {e}")
        raise e

@app.post("/analyze")
async def analyze_website(request: AnalyzeRequest):
    try:
        # For simplicity in this demo, we'll await the result directly
        # In a real app with many users, we'd use a task ID and polling
        report = await crawl_and_analyze(str(request.url))
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
