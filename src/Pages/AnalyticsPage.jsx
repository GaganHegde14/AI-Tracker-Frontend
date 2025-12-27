import React, { useMemo } from 'react';
import Layout from '../Components/Layout';
import { PieChart, TrendingUp, CheckCircle, Clock, AlertCircle, BarChart2, Calendar } from 'lucide-react';
import { useTask } from '../context/TaskContext';

const AnalyticsPage = () => {

    const { tasks, status } = useTask();

    // Stats configuration using real status data
    const stats = [
        { label: 'Total Tasks', value: status?.totalTask || 0, change: '+12%', icon: BarChart2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Completed', value: status?.completeTask || 0, change: '+8%', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
        { label: 'Pending', value: status?.isPendingTask || 0, change: '-2%', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { label: 'Overdue', value: 0, change: '+0%', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' }, // Mocking overdue for now as it's not in status context
    ];

    const weeklyActivity = useMemo(() => {
        const counts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        const now = new Date();
        const day = now.getDay(); // 0 is Sunday
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday

        const startOfWeek = new Date(now);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7); // Covers exactly 7 days
        endOfWeek.setHours(0, 0, 0, 0); // Comparison limit (exclusive)

        if (tasks && Array.isArray(tasks)) {
            tasks.forEach(task => {
                if (task.dueDate) {
                    // Robust handling: simple string split to treat as local date
                    // Assuming format YYYY-MM-DD or ISO
                    let taskDate;
                    if (task.dueDate.includes('T')) {
                        taskDate = new Date(task.dueDate);
                    } else {
                        const [y, m, d] = task.dueDate.split('-').map(Number);
                        taskDate = new Date(y, m - 1, d);
                    }

                    if (taskDate >= startOfWeek && taskDate < endOfWeek) {
                        const dayName = taskDate.toLocaleDateString('en-US', { weekday: 'short' });
                        if (counts[dayName] !== undefined) {
                            counts[dayName]++;
                        }
                    }
                }
            });
        }

        const maxVal = Math.max(...Object.values(counts), 1);

        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
            day,
            value: ((counts[day] || 0) / maxVal) * 100
        }));
    }, [tasks]);

    const tasksByCategory = [
        { name: 'Marketing', value: 35, color: 'bg-blue-500' },
        { name: 'Development', value: 45, color: 'bg-purple-500' },
        { name: 'Design', value: 20, color: 'bg-pink-500' },
    ];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-white tracking-tight">Analytics Overview</h1>
                        <p className="text-zinc-500 text-sm mt-1">Track your productivity and task performance.</p>
                    </div>
                    <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                        {['Week', 'Month', 'Year'].map((period, idx) => (
                            <button key={period} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${idx === 0 ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
                                {period}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-2xl hover:bg-zinc-900/80 transition-all hover:border-zinc-700/50 group">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full bg-zinc-800 ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Weekly Activity Chart */}
                    <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-semibold text-white">Weekly Activity</h3>
                            <button className="text-zinc-500 hover:text-white transition-colors">
                                <AlertCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="h-64 flex items-end justify-between gap-4">
                            {weeklyActivity.map((day, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-3 group">
                                    <div className="w-full relative h-full flex items-end bg-zinc-800/20 rounded-lg overflow-hidden">
                                        <div
                                            className="w-full bg-purple-500/80 hover:bg-purple-500 transition-all duration-300 rounded-t-lg relative group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                            style={{ height: `${day.value}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-zinc-500 group-hover:text-white transition-colors">{day.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent & Categories */}
                    <div className="space-y-8">

                        {/* Categories */}
                        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-6">Task Distribution</h3>
                            <div className="space-y-6">
                                {tasksByCategory.map((cat, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-zinc-300 font-medium">{cat.name}</span>
                                            <span className="text-zinc-500">{cat.value}%</span>
                                        </div>
                                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${cat.color} rounded-full`}
                                                style={{ width: `${cat.value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pro Tip */}
                        <div className="bg-linear-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Productivity Tip</h4>
                                    <p className="text-xs text-zinc-400 leading-relaxed">
                                        You're most productive on Wednesdays. Try scheduling your most complex tasks for mid-week to maximize efficiency.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>

    );

};


export default AnalyticsPage;
