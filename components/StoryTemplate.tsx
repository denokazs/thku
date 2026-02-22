import React, { forwardRef } from 'react';
import { Plane, ShieldAlert, Fingerprint, Globe, ScanLine, Crosshair } from 'lucide-react';
import { LOGO_BASE64 } from './LogoBase64';

interface StoryTemplateProps {
    confession: any;
    typeConfig: any;
}

const StoryTemplate = forwardRef<HTMLDivElement, StoryTemplateProps>(({ confession, typeConfig }, ref) => {
    if (!confession || !typeConfig) return null;

    // A more balanced font size for the text based on its length
    const textLength = confession.text.length;
    const fontSizeClass = textLength < 50 ? 'text-[72px]' : textLength < 120 ? 'text-[56px]' : 'text-[44px]';

    return (
        <div
            ref={ref}
            className="w-[1080px] h-[1920px] bg-[#07070B] relative flex flex-col justify-between overflow-hidden"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {/* --- ELEGANT BACKGROUND & TECH ELEMENTS --- */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] bg-repeat" />

            {/* Soft Glows */}
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br ${typeConfig.avatarGradient} opacity-[0.16] blur-[150px] mix-blend-screen rounded-full pointer-events-none`} />
            <div className={`absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-gradient-to-tr ${typeConfig.cardAccent} opacity-[0.12] blur-[200px] mix-blend-screen rounded-full pointer-events-none`} />

            {/* Faint Secret/Aviation Watermarks (Daha belirgin) */}
            <ScanLine className="absolute top-[25%] left-[-5%] w-[550px] h-[550px] text-white/[0.04] -rotate-12 pointer-events-none" />
            <Fingerprint className="absolute top-[60%] right-[-8%] w-[650px] h-[650px] text-white/[0.04] rotate-12 pointer-events-none" />

            {/* Crosshairs & Borders to fill space */}
            <Crosshair className="absolute top-10 left-10 w-16 h-16 text-white/[0.08] pointer-events-none" />
            <Crosshair className="absolute top-10 right-10 w-16 h-16 text-white/[0.08] pointer-events-none" />
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-white/[0.08] font-mono text-[20px] font-bold tracking-[0.5em] uppercase">SYSTEM ID: SEC-994</div>
            <div className="absolute top-1/2 left-4 -translate-y-1/2 w-[2px] h-[600px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <div className="absolute top-1/2 right-4 -translate-y-1/2 w-[2px] h-[600px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            {/* Background Giant Text Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <span className="text-[180px] font-black text-white/[0.02] -rotate-90 whitespace-nowrap tracking-[0.4em] uppercase">
                    THKU.COM.TR
                </span>
            </div>

            {/* --- TOP HEADER: SLEEK BRANDING --- */}
            <div className="w-full pt-20 px-16 flex items-center justify-between relative z-20 mt-8">
                <div className="flex items-center gap-6">
                    <div
                        className="w-[120px] h-[120px] rounded-full ring-2 ring-white/20 bg-white pb-1 shadow-[0_0_40px_rgba(255,255,255,0.15)] bg-center bg-no-repeat bg-contain"
                        style={{ backgroundImage: `url(${LOGO_BASE64})` }}
                    />
                    <div className="flex flex-col">
                        <span className="text-[44px] font-black text-white tracking-widest uppercase mb-1 drop-shadow-md">
                            THK ÜNİVERSİTESİ
                        </span>
                        <div className="flex items-center gap-3 text-[26px] font-bold text-sky-400 tracking-[0.3em] uppercase opacity-90 border-b-2 border-sky-400/30 w-fit pb-1">
                            SKY PORTAL <Plane className="w-6 h-6 -rotate-45" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3 text-right">
                    <div className="flex items-center gap-4 bg-red-500/15 border border-red-500/40 px-8 py-4 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                        <span className="text-[24px] font-bold text-red-500 tracking-widest uppercase">KİMLİK GİZLİ</span>
                    </div>
                </div>
            </div>

            {/* --- CENTER AREA: THE CONFESSION --- */}
            <div className="relative z-10 w-full flex-1 flex flex-col justify-center items-center px-16 my-10">

                {/* Embedded Badge */}
                <div className="w-full flex justify-center mb-10">
                    <div className={`inline-flex items-center gap-6 bg-[#12121A] border-[3px] ${typeConfig.cardBorder} px-12 py-6 rounded-[2rem] shadow-[0_15px_50px_rgba(0,0,0,0.6)] z-20`}>
                        <span className="text-[55px] leading-none">{typeConfig.emoji}</span>
                        <span className={`text-[36px] font-black text-transparent bg-clip-text bg-gradient-to-r ${typeConfig.cardAccent} tracking-[0.3em] uppercase pt-1`}>
                            {typeConfig.label}
                        </span>
                    </div>
                </div>

                {/* Elegant Glassmorphic Card */}
                <div className={`w-full bg-[#111116]/85 backdrop-blur-3xl border-[3px] ${typeConfig.cardBorder} rounded-[3.5rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden`}>

                    {/* Top Glow inside card */}
                    <div className={`absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r ${typeConfig.cardAccent} opacity-90`} />

                    {/* Author & Date Section */}
                    <div className="flex items-center gap-10 mb-14">
                        <div className={`w-[140px] h-[140px] rounded-[3rem] flex items-center justify-center bg-gradient-to-br ${typeConfig.avatarGradient} text-white text-[65px] font-black shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/20`}>
                            {confession.authorAvatar || confession.user.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col justify-center flex-1">
                            <span className="text-[58px] font-black text-white tracking-tight leading-none mb-4">
                                {confession.user}
                            </span>
                            <div className="text-[26px] text-slate-400 font-medium flex items-center gap-4">
                                <span className={`px-5 py-1.5 rounded-lg border border-white/10 bg-white/5 font-bold text-white/80 uppercase tracking-widest text-[20px] shadow-inner`}>
                                    İtiraf Dosyası
                                </span>
                                •
                                {new Date(confession.timestamp).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>

                    {/* Confession Text Content */}
                    <div className="relative min-h-[400px] flex items-center justify-center py-6 bg-white/[0.02] rounded-[2rem] border border-white/5 px-10 shadow-inner">
                        <p className={`${fontSizeClass} leading-[1.6] text-slate-100 font-bold whitespace-pre-wrap relative z-10 w-full text-center tracking-tight`} style={{ display: '-webkit-box', WebkitLineClamp: 12, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {confession.text}
                        </p>
                    </div>

                    {/* Tags Area */}
                    {confession.tags && confession.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-5 mt-12 pt-10 relative z-10">
                            {confession.tags.map((tag: string) => (
                                <span key={tag} className="text-[30px] font-black px-10 py-4 rounded-2xl bg-white/[0.05] border-2 border-white/10 text-sky-300 drop-shadow-md">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- BOTTOM FOOTER: PROMINENT URL --- */}
            <div className="relative z-20 w-full flex flex-col items-center pb-24 pt-12 overflow-hidden">
                {/* Cyberpunk lines */}
                <div className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
                <div className="absolute top-[8px] w-1/2 h-[1px] bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />

                <div className="flex items-center gap-6 mb-8 mt-4">
                    <span className="text-[60px] font-black text-white tracking-[0.4em] drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                        KARA<span className="text-red-500">.</span>KUTU
                    </span>
                </div>

                {/* HUGE URL DISPLAY */}
                <div className="w-full text-center bg-sky-900/20 border-y-[3px] border-sky-500/30 py-8 backdrop-blur-md shadow-[0_0_50px_rgba(14,165,233,0.15)] mt-4 relative">
                    <div className="flex items-center justify-center gap-6">
                        <Globe className="w-16 h-16 text-sky-400 -mt-1" />
                        <span className="text-[52px] text-sky-400 font-extrabold tracking-[0.3em] uppercase drop-shadow-md flex items-center">
                            THKU.COM.TR/KARA-KUTU
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
});

StoryTemplate.displayName = 'StoryTemplate';
export default StoryTemplate;
