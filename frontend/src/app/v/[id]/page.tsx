import { notFound } from 'next/navigation';
import { User, Phone, Mail, Link as LinkIcon, Download, Instagram, Linkedin, Twitter, Github, Globe, ExternalLink, Sparkles, PlayCircle } from 'lucide-react';
import Link from 'next/link';

// Helper to get YouTube Thumbnail
function getVideoThumbnail(url: string) {
    if (!url) return null;

    // YouTube
    const ytRegExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const ytMatch = url.match(ytRegExp);
    if (ytMatch && ytMatch[2].length === 11) {
        return `https://img.youtube.com/vi/${ytMatch[2]}/maxresdefault.jpg`;
    }

    // Vimeo
    const vimeoRegExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
    const vimeoMatch = url.match(vimeoRegExp);
    if (vimeoMatch) {
        // Vimeo thumbnails require an API call usually, but we can try a simple placeholder or just return null for now
        // For now, let's just support YouTube specifically as it's most common
    }

    return null;
}

async function getVCard(id: string) {
    try {
        const res = await fetch(`http://localhost:3001/vcard/${id}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export default async function PublicVCard({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const card = await getVCard(id);

    if (!card) return notFound();

    const videoThumbnail = getVideoThumbnail(card.videoUrl);

    const getSocialIcon = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes('instagram')) return <Instagram size={18} />;
        if (p.includes('linkedin')) return <Linkedin size={18} />;
        if (p.includes('twitter') || p.includes('x')) return <Twitter size={18} />;
        if (p.includes('github')) return <Github size={18} />;
        return <Globe size={18} />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">

            {/* Animated orbs */}
            <div className="fixed top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="fixed top-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="fixed bottom-0 left-1/2 w-96 h-96 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-lg relative z-10">

                {/* Main Card Container */}
                <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-indigo-200/50 overflow-hidden border border-white/50">

                    {/* Header with Avatar */}
                    <div className="relative">
                        <div className="h-48 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)'
                            }}></div>
                        </div>

                        {/* Avatar */}
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-50 p-1 shadow-2xl">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden">
                                        <User size={56} className="text-gray-300" strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                    <Sparkles size={18} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="pt-20 pb-8 px-8">

                        {/* Name & Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{card.name}</h1>
                            <p className="text-lg text-indigo-600 font-semibold mb-1">{card.jobTitle}</p>
                            <p className="text-sm text-gray-500 font-medium">{card.companyName}</p>
                        </div>

                        {/* Description */}
                        {(card.heading || card.description) && (
                            <div className="mb-8 text-center">
                                {card.heading && (
                                    <p className="text-gray-700 font-medium mb-2 italic">"{card.heading}"</p>
                                )}
                                {card.description && (
                                    <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
                                )}
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="space-y-3 mb-8">
                            {card.contactDetails?.map((contact: any, idx: number) => {
                                if (contact.type === 'MOBILE') {
                                    return (
                                        <a
                                            key={idx}
                                            href={`tel:${contact.value}`}
                                            className="group relative flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                        >
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Phone size={22} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white/80 text-xs font-medium">Call me</p>
                                                <p className="text-white font-semibold">{contact.value}</p>
                                            </div>
                                        </a>
                                    );
                                }
                                if (contact.type === 'EMAIL') {
                                    return (
                                        <a
                                            key={idx}
                                            href={`mailto:${contact.value}`}
                                            className="group relative flex items-center gap-4 p-4 bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
                                        >
                                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Mail size={22} className="text-gray-600 group-hover:text-indigo-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-500 text-xs font-medium">Email me</p>
                                                <p className="text-gray-900 font-semibold truncate">{contact.value}</p>
                                            </div>
                                        </a>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        {/* Web Links */}
                        {card.webLinks && card.webLinks.length > 0 && (
                            <div className="space-y-3 mb-8">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Links</h3>
                                {card.webLinks.map((link: any, idx: number) => (
                                    <Link
                                        href={link.url}
                                        target="_blank"
                                        key={idx}
                                        className="group flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-indigo-50 hover:to-purple-50 border border-gray-200 hover:border-indigo-200 rounded-xl transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                                    >
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-all">
                                            <LinkIcon size={18} className="text-gray-400 group-hover:text-indigo-600" />
                                        </div>
                                        <p className="flex-1 font-semibold text-gray-700 group-hover:text-indigo-700">{link.title || 'Portfolio'}</p>
                                        <ExternalLink size={16} className="text-gray-400 group-hover:text-indigo-500" />
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Social Links */}
                        {card.socialLinks && card.socialLinks.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Connect with me</h3>
                                <div className="flex flex-wrap gap-3">
                                    {card.socialLinks.map((link: any, idx: number) => (
                                        <Link
                                            href={link.url}
                                            target="_blank"
                                            key={idx}
                                            className="group w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-indigo-500 hover:to-purple-500 border border-gray-200 hover:border-transparent rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-1"
                                            title={link.platform}
                                        >
                                            <span className="text-gray-600 group-hover:text-white transition-colors">
                                                {getSocialIcon(link.platform)}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Video */}
                        {card.videoUrl && (
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Featured Video</h3>
                                <Link
                                    href={card.videoUrl}
                                    target="_blank"
                                    className="group relative block aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-300"
                                >
                                    {videoThumbnail ? (
                                        <img
                                            src={videoThumbnail}
                                            alt="Video Thumbnail"
                                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-60" />
                                    )}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white ring-4 ring-white/10 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                                            <PlayCircle size={32} fill="currentColor" className="text-white" />
                                        </div>
                                    </div>

                                    {/* YouTube Tag */}
                                    {card.videoUrl.includes('youtube.com') || card.videoUrl.includes('youtu.be') ? (
                                        <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                            YouTube
                                        </div>
                                    ) : null}
                                </Link>
                            </div>
                        )}

                        {/* Save Contact Button */}
                        <button className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-1">
                            <Download size={20} />
                            <span>Save Contact</span>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
                        Powered by <span className="text-indigo-600">vCard Editor</span>
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes blob {
                        0% { transform: translate(0px, 0px) scale(1); }
                        33% { transform: translate(30px, -50px) scale(1.1); }
                        66% { transform: translate(-20px, 20px) scale(0.9); }
                        100% { transform: translate(0px, 0px) scale(1); }
                    }
                    .animate-blob {
                        animation: blob 7s infinite;
                    }
                    .animation-delay-2000 {
                        animation-delay: 2s;
                    }
                    .animation-delay-4000 {
                        animation-delay: 4s;
                    }
                `
            }} />
        </div>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const card = await getVCard(id);
    if (!card) return { title: 'vCard Not Found' };

    return {
        title: `${card.name} | Business Card`,
        description: `${card.jobTitle} at ${card.companyName}`,
    }
}