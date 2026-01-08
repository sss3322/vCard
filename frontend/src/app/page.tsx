import Link from "next/link";
import { ArrowRight, UserCircle, Share2, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Test<span className="font-light text-slate-400">vCard</span>
        </div>
        <div className="space-x-4 flex items-center">
          <Link href="/auth/login" className="text-slate-600 hover:text-indigo-600 font-medium transition">Login</Link>
          <Link href="/auth/register" className="px-5 py-2.5 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition shadow-lg shadow-slate-200">Get Started</Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-10 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

        <div className="space-y-6 max-w-3xl z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold border border-indigo-100 mb-4">
            ✨ The future of networking is here
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">
            Your Digital ID, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-violet-600">Reimagined.</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Create a stunning, shareable digital business card in seconds.
            Impress connections with a premium design that works everywhere.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 z-10">
          <Link href="/auth/register" className="group px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg flex items-center gap-2 hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 ring-4 ring-indigo-50">
            Create my vCard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/v/demo" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition shadow-sm">
            View Demo
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left max-w-5xl w-full z-10">
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100/50 transition duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
              <UserCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900">Professional Profile</h3>
            <p className="text-slate-500 leading-relaxed text-sm">Showcase your career, skills, and bio in a sleek, mobile-optimized format.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-violet-100/50 transition duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-4 text-violet-600">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900">Instant Sharing</h3>
            <p className="text-slate-500 leading-relaxed text-sm">Share your card via QR code, link, or NFC instantly. No app required.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-fuchsia-100/50 transition duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-fuchsia-50 rounded-xl flex items-center justify-center mb-4 text-fuchsia-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900">Premium Design</h3>
            <p className="text-slate-500 leading-relaxed text-sm">Stand out with modern aesthetics, glassmorphism, and smooth animations.</p>
          </div>
        </div>
      </main>

      <footer className="py-10 text-center text-slate-400 text-sm border-t border-slate-100 bg-slate-50">
        <p>© {new Date().getFullYear()} Test vCard. Crafted with ❤️.</p>
      </footer>
    </div>
  );
}
