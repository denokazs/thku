import React, { forwardRef } from 'react';
import { Plane, ShieldAlert, Fingerprint, Scan, Wifi, Zap } from 'lucide-react';

interface StoryTemplateProps {
    confession: any;
    typeConfig: any;
}

const StoryTemplate = forwardRef<HTMLDivElement, StoryTemplateProps>(({ confession, typeConfig }, ref) => {
    if (!confession || !typeConfig) return null;

    return (
        <div
            ref={ref}
            className="w-[1080px] h-[1920px] bg-[#05050A] relative flex flex-col justify-between py-20 px-16 overflow-hidden"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {/* --- BACKGROUND EFFECTS --- */}
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] bg-repeat" />

            {/* Giant Glows */}
            <div className={`absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-br ${typeConfig.avatarGradient} opacity-20 blur-[200px] mix-blend-screen rounded-full pointer-events-none`} />
            <div className={`absolute bottom-[-10%] left-[-10%] w-[1200px] h-[1200px] bg-gradient-to-tr ${typeConfig.cardAccent} opacity-15 blur-[250px] mix-blend-screen rounded-full pointer-events-none`} />

            {/* --- MEGA WATERMARKS --- */}
            <div className="absolute top-[18%] right-[-15%] w-[800px] h-[800px] border-[40px] border-white/5 rounded-full flex items-center justify-center opacity-30 select-none">
                <Plane className="w-[450px] h-[450px] text-white/5 -rotate-45" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] text-center z-0 opacity-[0.02] pointer-events-none">
                <span className="text-[280px] font-black tracking-[0.2em] uppercase origin-center -rotate-45 block leading-none">
                    TOP SECRET
                </span>
            </div>

            {/* --- TOP HEADER: BIG LOGO & BRANDING --- */}
            <div className="relative z-20 w-full flex items-center justify-between bg-white/[0.03] border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-8">
                    <img src="/logo.jpeg" alt="THK Logo" className="w-[120px] h-[120px] rounded-full ring-4 ring-white/10 object-contain bg-white pb-1 shadow-lg" />
                    <div className="flex flex-col justify-center">
                        <span className="text-[52px] font-black text-white tracking-widest uppercase mb-1 leading-none shadow-black drop-shadow-lg">
                            THK ÜNİVERSİTESİ
                        </span>
                        <div className="flex items-center gap-4 text-[26px] font-bold text-sky-400 tracking-[0.4em] uppercase bg-sky-900/20 px-5 py-2 rounded-xl w-fit border border-sky-500/30">
                            SKY PORTAL <Plane className="w-7 h-7 -rotate-45" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-4 text-right">
                    <div className="flex items-center gap-4 bg-red-600/15 border-2 border-red-500/30 px-8 py-4 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <ShieldAlert className="w-10 h-10 text-red-500" />
                        <span className="text-[28px] font-black text-red-500 tracking-widest uppercase">KİMLİK GİZLİ</span>
                    </div>
                    <div className="text-[22px] font-mono font-bold text-emerald-400 flex items-center gap-3 bg-emerald-900/20 px-6 py-2 rounded-lg border border-emerald-500/20">
                        <Wifi className="w-6 h-6" /> ŞİFRELİ AĞ
                    </div>
                </div>
            </div>

            {/* --- CENTER AREA: BADGE & CONFESSION --- */}
            <div className="relative z-10 w-full flex-1 flex flex-col justify-center items-center py-16">

                {/* BIG CATEGORY BADGE */}
                <div className="mb-14 relative w-full flex justify-center">
                    <div className={`relative z-20 inline-flex items-center gap-8 bg-gradient-to-r ${typeConfig.cardBg} border-4 ${typeConfig.cardBorder} px-16 py-8 rounded-full shadow-[0_30px_100px_rgba(0,0,0,0.8)]`}>
                        <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl rounded-full" />
                        <span className="text-[90px] drop-shadow-2xl relative z-10 leading-none">{typeConfig.emoji}</span>
                        <span className={`text-[55px] font-black text-transparent bg-clip-text bg-gradient-to-r ${typeConfig.cardAccent} tracking-[0.3em] uppercase relative z-10 leading-none pt-2`}>
                            {typeConfig.label}
                        </span>
                    </div>
                </div>

                {/* GIANT CONFESSION CARD */}
                <div className="w-full bg-gradient-to-br from-[#12121A]/95 to-[#08080C]/95 backdrop-blur-3xl border-4 border-white/10 rounded-[4rem] p-20 shadow-[0_80px_200px_rgba(0,0,0,0.9)] relative overflow-hidden group">

                    {/* Visual Decor inside card */}
                    <Fingerprint className="absolute top-16 right-16 w-64 h-64 text-white/[0.02] rotate-12 pointer-events-none" />
                    <Scan className="absolute bottom-16 left-16 w-64 h-64 text-white/[0.02] -rotate-12 pointer-events-none" />

                    <div className={`absolute top-0 left-0 right-0 h-6 bg-gradient-to-r ${typeConfig.cardAccent} opacity-90`} />
                    <div className={`absolute top-6 left-1/2 -translate-x-1/2 w-32 h-2 bg-white/20 rounded-b-full`} />

                    {/* Author & Date Section */}
                    <div className="flex items-center gap-12 mb-16 relative z-10 bg-white/[0.02] p-8 rounded-[3rem] border border-white/5">
                        <div className={`w-[160px] h-[160px] rounded-[3rem] flex items-center justify-center bg-gradient-to-br ${typeConfig.avatarGradient} text-white text-[80px] font-black border-[10px] border-[#20202A] shadow-2xl transform -rotate-3`}>
                            {confession.authorAvatar || confession.user.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col flex-1">
                            <div className="flex items-center justify-between w-full mb-4">
                                <span className="text-[65px] font-black text-white tracking-tight leading-none drop-shadow-md">
                                    {confession.user}
                                </span>
                                <span className={`text-[28px] font-bold px-8 py-3 rounded-full border-2 border-rose-500/30 bg-rose-500/10 text-rose-400 tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(244,63,94,0.3)]`}>
                                    ANONİM DOSYA
                                </span>
                            </div>
                            <div className="text-[32px] text-slate-400 font-bold font-mono flex items-center gap-4">
                                <Zap className="w-8 h-8 text-amber-500" />
                                KAYIT: {new Date(confession.timestamp).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>

                    {/* Confession Text Content */}
                    <div className="relative min-h-[450px] flex items-center justify-center">
                        <p className="text-[65px] leading-[1.6] text-slate-100 font-bold whitespace-pre-wrap relative z-10 w-full text-center drop-shadow-xl" style={{ display: '-webkit-box', WebkitLineClamp: 12, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {confession.text}
                        </p>
                    </div>

                    {/* Tags Area */}
                    {confession.tags && confession.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-6 mt-16 pt-16 border-t-4 border-white/10 relative z-10">
                            {confession.tags.map((tag: string) => (
                                <span key={tag} className="text-[38px] font-black px-12 py-5 rounded-full bg-white/[0.04] border-2 border-white/20 text-sky-400 shadow-lg backdrop-blur-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- BOTTOM FOOTER --- */}
            <div className="relative z-20 w-full flex flex-col items-center bg-gradient-to-r from-red-950/40 via-red-900/30 to-red-950/40 border-y-4 border-red-500/30 py-12 backdrop-blur-lg shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-10 mb-6">
                    <div className="flex items-center gap-3 opacity-50">
                        <div className="w-24 h-3 bg-red-500 rounded-full" />
                        <div className="w-6 h-3 bg-red-500 rounded-full" />
                    </div>
                    <span className="text-[90px] font-black text-white tracking-[0.4em] leading-none drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                        KARA<span className="text-red-500">.</span>KUTU
                    </span>
                    <div className="flex items-center gap-3 opacity-50">
                        <div className="w-6 h-3 bg-red-500 rounded-full" />
                        <div className="w-24 h-3 bg-red-500 rounded-full" />
                    </div>
                </div>
                <div className="text-[34px] text-red-300 font-black tracking-[0.6em] uppercase px-16 py-5 bg-red-950/50 rounded-2xl border-2 border-red-500/40 shadow-inner">
                    SİZİN SIRRINIZ, BİZİM KUTUMUZDA.
                </div>
            </div>

        </div>
    );
});

StoryTemplate.displayName = 'StoryTemplate';
export default StoryTemplate;
