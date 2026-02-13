'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, BookOpen, GraduationCap, Clock, AlertCircle, FileText } from 'lucide-react';
import { ACADEMIC_CALENDAR, EventType } from '@/data/academic-calendar';

const getEventIcon = (type: EventType) => {
    switch (type) {
        case 'start': return <BookOpen className="w-5 h-5 text-green-600" />;
        case 'end': return <GraduationCap className="w-5 h-5 text-red-600" />;
        case 'exam': return <FileText className="w-5 h-5 text-amber-600" />;
        case 'registration': return <Clock className="w-5 h-5 text-blue-600" />;
        case 'grade': return <AlertCircle className="w-5 h-5 text-purple-600" />;
        default: return <Calendar className="w-5 h-5 text-gray-500" />;
    }
};

const getEventColor = (type: EventType) => {
    switch (type) {
        case 'start': return 'bg-green-50 border-green-100 text-green-700';
        case 'end': return 'bg-red-50 border-red-100 text-red-700';
        case 'exam': return 'bg-amber-50 border-amber-100 text-amber-700';
        case 'registration': return 'bg-blue-50 border-blue-100 text-blue-700';
        case 'grade': return 'bg-purple-50 border-purple-100 text-purple-700';
        default: return 'bg-gray-50 border-gray-100 text-gray-700';
    }
};

export default function AcademicCalendar() {
    const [activeTab, setActiveTab] = useState('fall');

    const activeSemester = ACADEMIC_CALENDAR.find(s => s.id === activeTab);

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
            {/* Header Tabs */}
            <div className="flex bg-slate-100 p-2 overflow-x-auto">
                {ACADEMIC_CALENDAR.map((semester) => (
                    <button
                        key={semester.id}
                        onClick={() => setActiveTab(semester.id)}
                        className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === semester.id
                                ? 'bg-white text-blue-900 shadow-sm'
                                : 'text-slate-500 hover:text-blue-800 hover:bg-slate-200/50'
                            }`}
                    >
                        {semester.title}
                    </button>
                ))}
            </div>

            <div className="p-8">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 relative"
                >
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-[24px] top-4 bottom-4 w-1 bg-slate-100 rounded-full"></div>

                    {activeSemester?.events.map((event) => {
                        // Check if event is 'past' or 'future' simply by date for visual cues
                        const now = new Date();
                        const startDate = new Date(event.startDate);
                        const isPast = startDate < now;
                        const isToday = startDate.toDateString() === now.toDateString();

                        return (
                            <div key={event.id} className="relative pl-16 group">
                                {/* Bullet Point */}
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 z-10 transition-colors ${isToday ? 'bg-red-600 border-red-100 scale-125' :
                                        isPast ? 'bg-slate-300 border-slate-100' : 'bg-white border-blue-600'
                                    }`}></div>

                                <div className={`p-4 rounded-2xl border transition-all hover:shadow-md ${isToday ? 'bg-red-50 border-red-100 ring-2 ring-red-200' :
                                        'bg-white border-slate-100 hover:border-blue-100'
                                    }`}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${getEventColor(event.type)}`}>
                                                {getEventIcon(event.type)}
                                            </div>
                                            <div>
                                                <h4 className={`font-bold text-lg ${isPast ? 'text-slate-500' : 'text-slate-800'}`}>
                                                    {event.title}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                        {new Date(event.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                    {event.endDate && (
                                                        <>
                                                            <ChevronRight className="w-3 h-3 text-slate-400" />
                                                            <span className="text-sm font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                                {new Date(event.endDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {isToday && (
                                            <div className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse self-start md:self-center">
                                                BUGÜN
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </motion.div>
            </div>
        </div>
    );
}
