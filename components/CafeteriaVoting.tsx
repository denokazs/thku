'use client';

import { useState } from 'react';
import { Utensils, Check } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function CafeteriaVoting() {
    const { menuOptions, voteMenuOption } = useStore();
    const [voted, setVoted] = useState<string | null>(null);

    const handleVote = (id: string) => {
        if (!voted) {
            setVoted(id);
            voteMenuOption(id);
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                    <Utensils className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-blue-900">Anket</h3>
                    <p className="text-sm text-gray-500">Cuma günü ne çıksın?</p>
                </div>
            </div>

            <div className="space-y-4">
                {menuOptions.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => handleVote(option.id)}
                        className={`
                    relative p-4 rounded-xl border-2 cursor-pointer transition-all overflow-hidden
                    ${voted === option.id ? 'border-red-600 bg-red-50' : 'border-gray-100 hover:border-red-200 bg-gray-50'}
                `}
                    >
                        {/* Progress Bar Background */}
                        {voted && (
                            <div
                                className={`absolute inset-y-0 left-0 opacity-10 ${option.color} transition-all duration-1000 ease-out`}
                                style={{ width: `${option.votes}%` }}
                            ></div>
                        )}

                        <div className="flex justify-between items-center relative z-10">
                            <span className="font-bold text-gray-800">{option.name}</span>
                            {voted ? (
                                <span className="font-bold text-red-600">{option.votes}%</span>
                            ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                            )}
                        </div>

                        {voted === option.id && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600">
                                <Check className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <p className="text-xs text-center text-gray-400 mt-6">
                Not: Bu sadece demo veridir.
            </p>
        </div>
    );
}
