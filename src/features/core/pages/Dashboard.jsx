import React, { useEffect, useState } from 'react';
import { Layout } from '../../../shared/components/Layout';
import { useAuth } from '../../../shared/context/AuthContext';
import { getInterviews } from '../../../shared/services/supabase';
import { Card, CardHeader, CardBody } from '../../../shared/components/Card';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, BarChart, Bar,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { TrendingUp, AlertCircle, Award, Zap, BrainCircuit, Target, Sparkles, ChevronRight } from 'lucide-react';
import { AuthRequired } from '../../../shared/components/AuthRequired';
import { cn } from '../../../shared/utils/cn';

export function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        averageScore: 0,
        totalInterviews: 0,
        topWeaknesses: [],
        holisticData: []
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch basic interview data from Supabase
                const data = await getInterviews(user.id);
                
                // Fetch local module stats
                const flashcards = JSON.parse(localStorage.getItem('nextoffer_ai_flashcard_mastery') || '{}');
                const bugHunt = JSON.parse(localStorage.getItem('nextoffer_ai_bughunt_stats') || '{"bestScore": 0, "totalAttempts": 0}');
                const negotiation = JSON.parse(localStorage.getItem('nextoffer_ai_negotiation_outcomes') || '[]');
                const pitch = JSON.parse(localStorage.getItem('nextoffer_ai_last_pitch_score') || '0');

                // Aggregate Holistic Data for Radar Chart
                const flashcardMastery = Object.values(flashcards).reduce((acc, lvl) => acc + (lvl >= 3 ? 1 : 0), 0);
                const technicalScore = Math.min(10, (bugHunt.bestScore / 10) * 10 || 5);
                const softSkills = Math.min(10, ((parseFloat(pitch) || 5) + 5) / 1.5); // Derived from pitch coach
                
                const negotiationMastery = negotiation.length > 0 
                    ? negotiation.reduce((acc, curr) => acc + curr.score, 0) / negotiation.length 
                    : 0;
                const logicScore = JSON.parse(localStorage.getItem('nextoffer_ai_logic_mastery') || '0');
                
                const holistic = [
                    { subject: 'Technical', A: technicalScore, fullMark: 10 },
                    { subject: 'Soft Skills', A: softSkills, fullMark: 10 },
                    { subject: 'Logic', A: Math.max(5, logicScore), fullMark: 10 },
                    { subject: 'Negotiation', A: negotiationMastery || 5, fullMark: 10 },
                    { subject: 'Architecture', A: data.length > 0 ? 8 : 5, fullMark: 10 },
                ];

                calculateStats(data, holistic);
            } catch (error) {
                // DEBUG: console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadData();
        } else if (!authLoading) {
             setLoading(false);
        }
    }, [user, authLoading]);

    const calculateStats = (data, holistic) => {
        // Calculate Average Score Trend
        const scores = data
            .filter(i => i.ratings)
            .map(i => ({
                date: new Date(i.created_at).toLocaleDateString(),
                technical: i.ratings.technical || 0,
                communication: i.ratings.communication || 0,
                problemSolving: i.ratings.problem_solving || 0,
                average: ((i.ratings.technical || 0) + (i.ratings.communication || 0) + (i.ratings.problem_solving || 0)) / 3
            }))
            .reverse();

        // Calculate Weaknesses
        const topicCounts = {};
        data.forEach(i => {
            if (i.topics) {
                i.topics.forEach(topic => {
                    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
                });
            }
        });

        const weaknesses = Object.entries(topicCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const totalAvg = scores.length > 0
            ? scores.reduce((acc, curr) => acc + curr.average, 0) / scores.length
            : 0;

        setStats({
            averageScore: totalAvg.toFixed(1),
            totalInterviews: data.length,
            topWeaknesses: weaknesses,
            chartData: scores,
            holisticData: holistic
        });
    };

    if (authLoading || loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </Layout>
        );
    }

    if (!user) {
        return <AuthRequired title="Dashboard Access" message="Please sign in to view your interview analytics and progress." />;
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-300 font-medium">Holistic Career Readiness & Analytics</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                            <Sparkles className="text-emerald-600" size={20} />
                            <span className="text-emerald-800 font-black text-sm uppercase tracking-widest">Elite Member</span>
                        </div>
                    </div>
                </div>

                {/* AI Career Pulse & Radar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 p-10 rounded-[2.5rem] bg-slate-900 text-white border-transparent shadow-2xl overflow-hidden relative group">
                        <div className="absolute -right-20 -top-20 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700">
                            <BrainCircuit size={400} />
                        </div>
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    <Zap size={14} className="fill-current" /> AI Career Pulse
                                </div>
                                <h2 className="text-4xl font-black leading-tight">Your Holistic <br/> Interview Readiness</h2>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    We've aggregated your performance across technical challenges, soft skills practice, and mock interviews to map your professional profile.
                                </p>
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center justify-between text-sm font-bold">
                                        <span className="text-slate-400 uppercase tracking-widest text-[10px]">Readiness Score</span>
                                        <span className="text-primary-400">82%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: '82%' }}
                                            className="h-full bg-gradient-to-r from-primary-600 to-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.holisticData}>
                                        <PolarGrid stroke="#ffffff20" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                        <Radar
                                            name="Skills"
                                            dataKey="A"
                                            stroke="#6366f1"
                                            fill="#6366f1"
                                            fillOpacity={0.6}
                                        />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 gap-6">
                        <MetricSimpleCard 
                            icon={<Award className="text-indigo-600" />} 
                            label="Average Score" 
                            val={`${stats.averageScore}/10`} 
                            color="indigo"
                        />
                        <MetricSimpleCard 
                            icon={<TrendingUp className="text-emerald-600" />} 
                            label="Total Sessions" 
                            val={stats.totalInterviews} 
                            color="emerald"
                        />
                        <MetricSimpleCard 
                            icon={<AlertCircle className="text-red-500" />} 
                            label="Top Weakness" 
                            val={stats.topWeaknesses[0]?.name || 'None'} 
                            color="red"
                        />
                    </div>
                </div>

                {/* Legacy Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="p-8 rounded-[2.5rem] border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-6">
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">Performance Trend</h2>
                        </CardHeader>
                        <CardBody className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                    <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="smooth" dataKey="technical" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} name="Technical" />
                                    <Line type="smooth" dataKey="communication" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Communication" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardBody>
                    </Card>

                    <Card className="p-8 rounded-[2.5rem] border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-6">
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">Weakness Frequency</h2>
                        </CardHeader>
                        <CardBody className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.topWeaknesses} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#ef4444" radius={[0, 8, 8, 0]} barSize={20} name="Occurrences" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}

const MetricSimpleCard = ({ icon, label, val, color }) => {
    const colors = {
        indigo: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30",
        emerald: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30",
        red: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30",
    };

    return (
        <Card className={cn("p-6 rounded-[2rem] border transition-all hover:shadow-xl", colors[color])}>
            <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center">
                        {icon}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">{label}</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white">{val}</p>
                    </div>
            </div>
        </Card>
    );
};
