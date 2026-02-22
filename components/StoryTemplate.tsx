import React, { forwardRef } from 'react';
import { Plane } from 'lucide-react';

interface StoryTemplateProps {
    confession: any;
    typeConfig: any;
}

const StoryTemplate = forwardRef<HTMLDivElement, StoryTemplateProps>(({ confession, typeConfig }, ref) => {
    if (!confession || !typeConfig) return null;

    return (
        <div
            ref={ref}
            className="w-[1080px] h-[1920px] bg-[#080810] relative flex border-8 border-transparent overflow-hidden"
            style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.05) 2px, transparent 2px)`,
                backgroundSize: '40px 40px',
            }}
        >
            {/* Ambient glows */}
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br ${typeConfig.avatarGradient} rounded-full blur-[200px] opacity-30`} />
            <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] opacity-20 bg-gradient-to-tr ${typeConfig.cardAccent} rounded-full blur-[150px]`} />

            {/* Content Container */}
            <div className="relative z-10 w-full flex flex-col justify-center px-24 py-32">

                {/* Header branding */}
                <div className="flex items-center gap-6 mb-16 justify-center opacity-80">
                    <div className="w-16 h-16 bg-red-600 rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xl">
                        <Plane className="w-8 h-8 -rotate-45" />
                    </div>
                    <div className="text-4xl font-black tracking-tighter text-white uppercase">
                        THK ÜNİVERSİTESİ <span className="font-light text-red-500">- SKY PORTAL</span>
                    </div>
                </div>

                <div className="text-center mb-16">
                    <h1 className="text-6xl font-black tracking-widest text-white mb-4">KARA<span className="text-red-500">.</span>KUTU</h1>
                    <div className="inline-flex items-center gap-4 bg-white/10 px-8 py-3 rounded-full border border-white/20">
                        <span className="text-3xl">{typeConfig.emoji}</span>
                        <span className="text-2xl font-bold text-white uppercase tracking-widest">{typeConfig.label}</span>
                    </div>
                </div>

                {/* Confession Card */}
                <div className={`relative bg-gradient-to-br ${typeConfig.cardBg} border-4 ${typeConfig.cardBorder} rounded-3xl p-16 shadow-2xl`}>
                    <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${typeConfig.cardAccent} rounded-t-3xl`} />

                    <div className="flex items-center gap-6 mb-12">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br ${typeConfig.avatarGradient} text-white text-3xl font-black shadow-xl`}>
                            {confession.authorAvatar || confession.user.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-2">{confession.user}</div>
                            <div className="text-xl text-slate-400 font-mono">
                                {new Date(confession.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    <p className="text-[42px] leading-[1.6] text-white font-medium whitespace-pre-wrap">
                        {confession.text}
                    </p>

                    {confession.tags && confession.tags.length > 0 && (
                        <div className="flex flex-wrap gap-4 mt-12">
                            {confession.tags.map((tag: string) => (
                                <span key={tag} className="text-2xl font-bold px-6 py-2 rounded-full bg-white/10 text-white border border-white/20">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer instructions */}
                <div className="absolute bottom-24 left-0 right-0 text-center opacity-60">
                    <p className="text-3xl tracking-widest text-white font-bold mb-2">thku.com.tr/kara-kutu</p>
                    <p className="text-xl text-slate-400">Sen de içini dök, kimse bilmesin.</p>
                </div>
            </div>
        </div>
    );
});

StoryTemplate.displayName = 'StoryTemplate';
export default StoryTemplate;
