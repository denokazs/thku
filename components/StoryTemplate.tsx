import React, { forwardRef } from 'react';
import { Plane, Quote, Clock, Shield } from 'lucide-react';

interface StoryTemplateProps {
    confession: any;
    typeConfig: any;
}

const StoryTemplate = forwardRef<HTMLDivElement, StoryTemplateProps>(({ confession, typeConfig }, ref) => {
    if (!confession || !typeConfig) return null;

    return (
        <div
            ref={ref}
            className="w-[1080px] h-[1920px] bg-[#030305] relative flex flex-col items-center border-[12px] border-[#08080C] overflow-hidden"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {/* Background Mesh Effect */}
            <div className={`absolute top-[-10%] w-[1200px] h-[1200px] bg-gradient-to-br ${typeConfig.avatarGradient} opacity-[0.12] blur-[150px] mix-blend-plus-lighter rounded-full pointer-events-none`} />
            <div className={`absolute bottom-[-10%] w-[1500px] h-[1000px] bg-gradient-to-tl ${typeConfig.cardAccent} opacity-[0.08] blur-[220px] mix-blend-plus-lighter rounded-full pointer-events-none`} />
            <div className="absolute inset-0 bg-[#000000] opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] bg-repeat opacity-[0.04]" />

            {/* Top Branding Section */}
            <div className="relative z-20 w-full pt-20 px-16 flex justify-between items-start">
                <div className="flex items-center gap-6">
                    <img src="/logo.jpeg" alt="Logo" className="w-[84px] h-[84px] rounded-full shadow-[0_0_40px_rgba(255,255,255,0.1)] border-2 border-white/10 object-contain bg-white/5" />
                    <div className="flex flex-col">
                        <span className="text-4xl font-extrabold text-white tracking-widest uppercase">
                            THK Üni
                        </span>
                        <span className="text-[22px] font-medium text-slate-400 tracking-[0.3em] uppercase mt-1 flex items-center gap-3">
                            Sky Portal <Plane className="w-5 h-5 opacity-50" />
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-end pt-2">
                    <div className={`px-6 py-2.5 rounded-full border border-white/10 flex items-center gap-3 backdrop-blur-md bg-white/[0.03]`}>
                        <Shield className="w-5 h-5 text-slate-400" />
                        <span className="text-xl font-bold text-slate-300 tracking-widest uppercase">100% Anonim</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 w-full flex-1 flex flex-col justify-center px-16 pb-20">

                {/* Type Badge */}
                <div className="flex justify-center mb-[-40px] relative z-20">
                    <div className={`bg-gradient-to-r ${typeConfig.cardBg} border border-white/20 px-10 py-5 rounded-[2rem] flex items-center justify-center gap-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]`}>
                        <span className="text-5xl drop-shadow-lg">{typeConfig.emoji}</span>
                        <span className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${typeConfig.cardAccent} tracking-[0.2em] uppercase`}>
                            {typeConfig.label}
                        </span>
                    </div>
                </div>

                {/* The Glassmorphic Card */}
                <div className="w-full bg-[#111116]/60 backdrop-blur-[60px] border-[1.5px] border-white/10 rounded-[4rem] p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">

                    {/* Glowing Top Border inside Card */}
                    <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-60`} />
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r ${typeConfig.cardAccent} blur-[1px]`} />

                    {/* Author Info */}
                    <div className="flex items-center gap-8 mb-16 relative">
                        <div className="relative">
                            <div className={`absolute inset-0 bg-gradient-to-br ${typeConfig.avatarGradient} rounded-full blur-xl opacity-40`} />
                            <div className={`w-[110px] h-[110px] rounded-full flex items-center justify-center bg-gradient-to-br ${typeConfig.avatarGradient} text-white text-5xl font-black border-4 border-[#1c1c24] relative z-10`}>
                                {confession.authorAvatar || confession.user.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-[46px] font-bold text-white tracking-tight mb-2 flex items-center gap-4">
                                {confession.user}
                                <span className={`text-xl px-4 py-1.5 rounded-full border border-white/10 bg-white/5 font-semibold text-white/50`}>
                                    İtirafçı
                                </span>
                            </span>
                            <span className="text-2xl text-slate-400 font-medium flex items-center gap-2">
                                <Clock className="w-6 h-6 opacity-60" />
                                {new Date(confession.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                            </span>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="relative mb-8">
                        <Quote className={`absolute -top-12 -left-8 w-24 h-24 text-white/5 -rotate-6`} />
                        <p className="text-[48px] leading-[1.4] text-slate-100 font-medium whitespace-pre-wrap relative z-10 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 10, WebkitBoxOrient: 'vertical' }}>
                            {confession.text}
                        </p>
                    </div>

                    {/* Tags */}
                    {confession.tags && confession.tags.length > 0 && (
                        <div className="flex flex-wrap gap-4 mt-16 pt-12 border-t border-white/5 relative">
                            {confession.tags.map((tag: string) => (
                                <span key={tag} className={`text-[25px] font-bold px-8 py-3.5 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 text-slate-200 shadow-inner backdrop-blur-md`}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Beautiful Footer */}
            <div className="relative z-20 w-full flex flex-col items-center pb-20">
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-32 h-[1px] bg-gradient-to-r from-transparent to-white/20" />
                    <span className="text-5xl font-black text-white tracking-[0.4em]">KARA<span className="text-red-500">.</span>KUTU</span>
                    <div className="w-32 h-[1px] bg-gradient-to-l from-transparent to-white/20" />
                </div>
                <span className="text-[26px] text-slate-400 font-medium tracking-widest text-[#94a3b8] mix-blend-screen">
                    sen de içini dök...
                </span>
            </div>

        </div>
    );
});

StoryTemplate.displayName = 'StoryTemplate';
export default StoryTemplate;
