import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, Globe, Shield, Zap, Mail, Phone, MapPin, CheckCircle2, AlertCircle, Users, Cpu, Share2, FileLineChart } from 'lucide-react'
import axios from 'axios'

interface ProductService {
  name: string
  description: string
}

interface ContactInfo {
  addresses: string[]
  emails: string[]
  phones: string[]
}

interface SWOT {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

interface SEO {
  title: string
  description: string
  primary_keywords: string[]
}

interface Report {
  company_overview: string
  products_services: ProductService[]
  uniqueness: string[]
  target_audience: string
  tech_stack: string[]
  swot_analysis: SWOT
  seo_metadata: SEO
  brand_voice: string
  social_links: string[]
  policies: string
  contact_info: ContactInfo
}

const API_BASE = "http://localhost:8000"

export default function App() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [report, setReport] = useState<Report | null>(null)
  const [error, setError] = useState<string | null>(null)

  const steps = [
    { label: "Deep Crawling (Limit 10)...", icon: Globe },
    { label: "Extracting contact sectors...", icon: Search },
    { label: "Business Analysis...", icon: Shield },
    { label: "Assembling Intelligence...", icon: CheckCircle2 }
  ]

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    setReport(null)
    setError(null)
    setStep(0)

    // Simulate progress while waiting for backend
    const interval = setInterval(() => {
      setStep(prev => (prev < 3 ? prev + 1 : prev))
    }, 15000) // Longer interval as crawl limit increased

    try {
      const response = await axios.post(`${API_BASE}/analyze`, { url })
      setReport(response.data)
      setStep(3)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to analyze website. Please check the URL and try again.")
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center text-slate-100">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mt-12 mb-16 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          SiteScope AI
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-light">
          Global Business Intelligence. Crawl up to 10 pages and extract deep insight with Gemini 2.5 Flash.
        </p>

        <form onSubmit={handleAnalyze} className="relative max-w-2xl mx-auto">
          <div className={`relative flex items-center transition-all duration-300 ${loading ? 'scale-95 opacity-50' : 'scale-100'}`}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 pl-14 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-xl"
              required
            />
            <Search className="absolute left-5 text-slate-500" size={24} />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold transition-all disabled:hidden"
            >
              Analyze
            </button>
          </div>
          {loading && (
            <div className="pulse-ring" />
          )}
        </form>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-12 backdrop-blur-md"
          >
            <div className="flex flex-col gap-6">
              {steps.map((s, i) => (
                <div key={i} className={`flex items-center gap-4 transition-all duration-500 ${i === step ? 'text-blue-400 translate-x-2' : i < step ? 'text-emerald-400' : 'text-slate-600 opacity-50'}`}>
                  <div className={`p-2 rounded-lg transition-colors ${i === step ? 'bg-blue-500/20' : i < step ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
                    {i === step ? <Loader2 className="animate-spin" size={20} /> : <s.icon size={20} />}
                  </div>
                  <span className="text-lg font-medium">{s.label}</span>
                  {i < step && <CheckCircle2 size={18} className="ml-auto" />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-2xl bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4 text-red-400 mb-12"
        >
          <AlertCircle className="shrink-0" />
          <p>{error}</p>
        </motion.div>
      )}

      {/* Results Dashboard */}
      <AnimatePresence>
        {report && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
          >
            {/* Overview - Span 2 */}
            <div className="md:col-span-2 glass-card rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="text-blue-400" /> Company Overview
              </h2>
              <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                {report.company_overview}
              </p>
            </div>

            {/* Contact Info */}
            <div className="glass-card rounded-3xl p-8 row-span-2">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Mail className="text-indigo-400" /> Contact Details
              </h2>
              <div className="flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                    <MapPin size={16} /> Locations
                  </div>
                  <div className="space-y-4">
                    {report.contact_info.addresses && report.contact_info.addresses.length > 0 ? report.contact_info.addresses.map((addr, i) => (
                      <p key={i} className="text-slate-200 text-sm leading-relaxed p-3 bg-white/5 rounded-xl border border-white/5">
                        {addr}
                      </p>
                    )) : <p className="text-slate-500 italic">No address found</p>}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                    <Mail size={16} /> Emails
                  </div>
                  <div className="space-y-3">
                    {report.contact_info.emails && report.contact_info.emails.length > 0 ? report.contact_info.emails.map((email, i) => (
                      <a key={i} href={`mailto:${email}`} className="block text-blue-400 text-sm hover:underline">
                        {email}
                      </a>
                    )) : <p className="text-slate-500 italic">No email found</p>}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                    <Phone size={16} /> Phone Numbers
                  </div>
                  <div className="space-y-3">
                    {report.contact_info.phones && report.contact_info.phones.length > 0 ? report.contact_info.phones.map((phone, i) => (
                      <a key={i} href={`tel:${phone}`} className="block text-slate-200 text-sm hover:text-blue-400 transition-colors">
                        {phone}
                      </a>
                    )) : <p className="text-slate-500 italic">No phone found</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Products & Services */}
            <div className="md:col-span-2 glass-card rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-8">Products & Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.products_services.map((ps, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition-colors">
                    <h3 className="font-bold text-lg mb-2 text-blue-300">{ps.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{ps.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-card rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Share2 className="text-blue-400" /> Social Presence
              </h2>
              <div className="flex flex-wrap gap-3">
                {report.social_links && report.social_links.length > 0 ? report.social_links.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/5 hover:bg-blue-500/20 border border-white/10 px-4 py-2 rounded-xl text-sm text-blue-300 transition-all truncate max-w-full"
                  >
                    {new URL(link).hostname.replace('www.', '')}
                  </a>
                )) : <p className="text-slate-500 italic">No social links found</p>}
              </div>
            </div>

            {/* Target Audience */}
            <div className="md:col-span-1 glass-card rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users className="text-purple-400" /> Target Audience
              </h2>
              <p className="text-slate-300 leading-relaxed">
                {report.target_audience}
              </p>
            </div>

            {/* Uniqueness */}
            <div className="md:col-span-1 glass-card rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Zap className="text-yellow-400" /> Differentiators
              </h2>
              <ul className="space-y-4">
                {report.uniqueness.map((u, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={18} />
                    <span className="text-slate-300">{u}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="md:col-span-1 glass-card rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Cpu className="text-emerald-400" /> Technology Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {report.tech_stack && report.tech_stack.length > 0 ? report.tech_stack.map((tech, i) => (
                  <span key={i} className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded-lg text-sm font-medium">
                    {tech}
                  </span>
                )) : <p className="text-slate-500 italic">No tech stack info found</p>}
              </div>
            </div>

            {/* SEO & Brand Section */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* SEO Insights */}
              <div className="md:col-span-2 glass-card rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Search className="text-blue-400" /> SEO Insights
                </h2>
                <div className="space-y-6">
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest block mb-2">Meta Title</span>
                    <p className="text-slate-200 text-lg font-medium">{report.seo_metadata.title}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest block mb-2">Meta Description</span>
                    <p className="text-slate-400 text-sm leading-relaxed">{report.seo_metadata.description}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest block mb-4">Primary Keywords</span>
                    <div className="flex flex-wrap gap-2">
                      {report.seo_metadata.primary_keywords.map((kw, i) => (
                        <span key={i} className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Voice */}
              <div className="glass-card rounded-3xl p-8 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Zap className="text-orange-400" /> Brand Voice
                </h2>
                <p className="text-slate-300 leading-relaxed italic text-lg">
                  "{report.brand_voice}"
                </p>
              </div>
            </div>

            {/* SWOT Analysis */}
            <div className="md:col-span-3 glass-card rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Shield className="text-emerald-400" /> Strategic SWOT Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Strengths */}
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6">
                  <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2 uppercase tracking-tighter">
                    <CheckCircle2 size={16} /> Strengths
                  </h3>
                  <ul className="space-y-3">
                    {report.swot_analysis.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-slate-300 flex gap-2">
                        <span className="text-emerald-500">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Weaknesses */}
                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
                  <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2 uppercase tracking-tighter">
                    <AlertCircle size={16} /> Weaknesses
                  </h3>
                  <ul className="space-y-3">
                    {report.swot_analysis.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-slate-300 flex gap-2">
                        <span className="text-red-500">•</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Opportunities */}
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6">
                  <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2 uppercase tracking-tighter">
                    <Zap size={16} /> Opportunities
                  </h3>
                  <ul className="space-y-3">
                    {report.swot_analysis.opportunities.map((o, i) => (
                      <li key={i} className="text-sm text-slate-300 flex gap-2">
                        <span className="text-blue-500">•</span> {o}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Threats */}
                <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-6">
                  <h3 className="text-orange-400 font-bold mb-4 flex items-center gap-2 uppercase tracking-tighter">
                    <Globe size={16} /> Threats
                  </h3>
                  <ul className="space-y-3">
                    {report.swot_analysis.threats.map((t, i) => (
                      <li key={i} className="text-sm text-slate-300 flex gap-2">
                        <span className="text-orange-500">•</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Policies */}
            <div className="md:col-span-3 glass-card rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileLineChart className="text-slate-400" size={20} /> Policies & Compliance
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                {report.policies}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto py-8 text-slate-500 text-sm">
        &copy; 2025 SiteScope AI • Powered by Gemini 2.5 Flash & Firecrawl
      </footer>
    </div>
  )
}
