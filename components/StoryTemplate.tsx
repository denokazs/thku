import React, { forwardRef } from 'react';
import { Plane, ShieldAlert, Fingerprint, MapPin, ScanLine } from 'lucide-react';

interface StoryTemplateProps {
    confession: any;
    typeConfig: any;
}

const StoryTemplate = forwardRef<HTMLDivElement, StoryTemplateProps>(({ confession, typeConfig }, ref) => {
    if (!confession || !typeConfig) return null;

    // A more balanced font size for the text based on its length
    const textLength = confession.text.length;
    const fontSizeClass = textLength < 50 ? 'text-[64px]' : textLength < 120 ? 'text-[52px]' : 'text-[44px]';

    return (
        <div
            ref={ref}
            className="w-[1080px] h-[1920px] bg-[#07070B] relative flex flex-col justify-between overflow-hidden"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {/* --- ELEGANT BACKGROUND --- */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] bg-repeat" />

            {/* Soft Glows */}
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br ${typeConfig.avatarGradient} opacity-[0.15] blur-[150px] mix-blend-screen rounded-full pointer-events-none`} />
            <div className={`absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-gradient-to-tr ${typeConfig.cardAccent} opacity-[0.1] blur-[200px] mix-blend-screen rounded-full pointer-events-none`} />

            {/* Faint Secret/Aviation Watermarks */}
            <ScanLine className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] text-white/[0.02] -rotate-12 pointer-events-none" />
            <Fingerprint className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] text-white/[0.02] rotate-12 pointer-events-none" />

            {/* --- TOP HEADER: SLEEK BRANDING --- */}
            <div className="w-full pt-20 px-16 flex items-center justify-between relative z-20">
                <div className="flex items-center gap-6">
                    <img src="/logo.jpeg" alt="THK Logo" className="w-[100px] h-[100px] rounded-full ring-2 ring-white/20 object-contain bg-white pb-1 shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
                    <div className="flex flex-col">
                        <span className="text-[40px] font-black text-white tracking-widest uppercase mb-1 drop-shadow-md">
                            THK ÜNİVERSİTESİ
                        </span>
                        <div className="flex items-center gap-3 text-[22px] font-bold text-sky-400 tracking-[0.3em] uppercase opacity-90">
                            SKY PORTAL <Plane className="w-6 h-6 -rotate-45" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3 text-right">
                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 px-6 py-2.5 rounded-2xl shadow-inner">
                        <ShieldAlert className="w-7 h-7 text-red-500" />
                        <span className="text-[20px] font-bold text-red-500 tracking-widest uppercase">GİZLİ KİMLİK</span>
                    </div>
                    <div className="text-[18px] font-mono font-medium text-slate-400 bg-white/5 px-5 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                        <MapPin className="w-5 h-5" /> thku.com.tr
                    </div>
                </div>
            </div>

            {/* --- CENTER AREA: THE CONFESSION --- */}
            <div className="relative z-10 w-full flex-1 flex flex-col justify-center items-center px-16">

                {/* Embedded Badge (Not overlapping, sits cleanly on top) */}
                <div className="w-full flex justify-center mb-8">
                    <div className={`inline-flex items-center gap-5 bg-[#12121A] border-2 ${typeConfig.cardBorder} px-10 py-5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-20`}>
                        <span className="text-[50px] leading-none">{typeConfig.emoji}</span>
                        <span className={`text-[32px] font-black text-transparent bg-clip-text bg-gradient-to-r ${typeConfig.cardAccent} tracking-[0.3em] uppercase pt-1`}>
                            {typeConfig.label}
                        </span>
                    </div>
                </div>

                {/* Elegant Glassmorphic Card */}
                <div className={`w-full bg-[#111116]/80 backdrop-blur-2xl border-2 ${typeConfig.cardBorder} rounded-[3rem] p-16 shadow-[0_40px_100px_rgba(0,0,0,0.7)] relative overflow-hidden`}>

                    {/* Top Glow inside card */}
                    <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${typeConfig.cardAccent} opacity-80`} />

                    {/* Author & Date Section */}
                    <div className="flex items-center gap-8 mb-12">
                        <div className={`w-[130px] h-[130px] rounded-[2.5rem] flex items-center justify-center bg-gradient-to-br ${typeConfig.avatarGradient} text-white text-[60px] font-black shadow-[0_20px_40px_rgba(0,0,0,0.4)]`}>
                            {confession.authorAvatar || confession.user.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col justify-center flex-1">
                            <span className="text-[54px] font-black text-white tracking-tight leading-none mb-3">
                                {confession.user}
                            </span>
                            <div className="text-[24px] text-slate-400 font-medium flex items-center gap-3">
                                <span className={`px-4 py-1 rounded-lg border border-white/10 bg-white/5 font-semibold text-white/70 uppercase tracking-widest text-[18px]`}>
                                    İtiraf Dosyası
                                </span>
                                •
                                {new Date(confession.timestamp).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    {/* Confession Text Content */}
                    <div className="relative min-h-[350px] flex items-center justify-center py-6">
                        <p className={`${fontSizeClass} leading-[1.6] text-slate-100 font-semibold whitespace-pre-wrap relative z-10 w-full text-center`} style={{ display: '-webkit-box', WebkitLineClamp: 12, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {confession.text}
                        </p>
                    </div>

                    {/* Tags Area */}
                    {confession.tags && confession.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4 mt-10 pt-10 border-t border-white/10 relative z-10">
                            {confession.tags.map((tag: string) => (
                                <span key={tag} className="text-[28px] font-bold px-8 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-300">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- BOTTOM FOOTER --- */}
            <div className="relative z-20 w-full flex flex-col items-center pb-20 pt-10">
                <div className="flex items-center gap-6 mb-4">
                    <div className="w-20 h-[2px] bg-gradient-to-r from-transparent to-red-500/50" />
                    <span className="text-[60px] font-black text-white tracking-[0.4em] drop-shadow-lg">
                        KARA<span className="text-red-500">.</span>KUTU
                    </span>
                    <div className="w-20 h-[2px] bg-gradient-to-l from-transparent to-red-500/50" />
                </div>
                <div className="text-[24px] text-slate-400 font-medium tracking-[0.5em] uppercase">
                    thku.com.tr/kara-kutu
                </div>
            </div>

        </div>
    );
});

StoryTemplate.displayName = 'StoryTemplate';
export default StoryTemplate;
