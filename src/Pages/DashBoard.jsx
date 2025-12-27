
import React, { useState } from 'react';
import Layout from '../Components/Layout';
import StatsCard from '../Components/StatsCard';
import { Search, Bell, Filter, MoreHorizontal, Calendar, CheckCircle2, Clock, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '../context/TaskContext';


const DashBoard = () => {



  const { tasks, status } = useTask();

  const navigate = useNavigate()
  const [filter, setFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const stats = [
    { title: 'Total Tasks', value: status.totalTask, icon: CheckCircle2, trend: 0 },
    { title: 'In Progress', value: status.inProgressTask, icon: Clock, trend: 0 },
    { title: 'Pending Reviews', value: status.isPendingTask, icon: AlertCircle, trend: 0 },
    { title: 'Completed', value: status.completeTask, icon: CheckCircle2, trend: 0 },
  ];



  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  const recentTasks = filteredTasks.slice(0, 5);

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Medium': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Low': return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
      default: return 'text-zinc-400 bg-zinc-400/10';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'In Progress': return 'text-blue-400';
      case 'Completed': return 'text-emerald-400';
      case 'Pending': return 'text-amber-400';
      default: return 'text-zinc-400';
    }
  };

  return (

    <Layout className="scrollbar-hide">
      <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-1">Overview of your productivity and tasks.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-end md:justify-end">
            {/* <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-700 focus:bg-zinc-800/50 transition-all w-64 text-zinc-200 placeholder:text-zinc-600"
                />
              </div> */}

            {/* + */}

            <button onClick={() => navigate('/add-task')} className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors">
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Recent Tasks */}
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-[#09090b]">
            <h2 className="text-sm font-semibold text-white">Recent Tasks</h2>
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${filter !== 'All' ? 'bg-zinc-800 text-white border-zinc-700' : 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
              >
                <Filter className="w-3.5 h-3.5" />
                {filter === 'All' ? 'Filter' : filter}
              </button>

              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute right-0 mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-20 overflow-hidden">
                    {['All', 'Pending', 'In Progress', 'Completed'].map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          setFilter(f);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-zinc-800 transition-colors ${filter === f ? 'text-white font-medium bg-zinc-800/50' : 'text-zinc-400'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-zinc-900/20">
                  <th className="p-4 pl-6 text-xs font-medium text-zinc-500 uppercase tracking-wider whitespace-nowrap">Task</th>
                  <th className="p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider whitespace-nowrap">Priority</th>
                  <th className="p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider whitespace-nowrap">Due</th>
                  <th className="p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {recentTasks.map((task, index) => (
                  <tr key={index} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="p-4 pl-6">
                      <span className="font-medium text-zinc-300 group-hover:text-white transition-colors text-sm whitespace-nowrap">{task.title}</span>
                    </td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${getStatusStyle(task.status)} whitespace-nowrap`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                        {task.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wide ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-zinc-500 flex items-center gap-2 whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5" />
                        {(() => {
                          const now = new Date();
                          const due = new Date(task.dueDate);
                          const diff = due.getTime() - now.getTime();

                          if (diff < 0) return 'Overdue';
                          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                          if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
                          return 'Due soon';
                        })()}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <button
                        onClick={() => navigate(`/tasks`)}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-zinc-800/50">
            {recentTasks.map((task, index) => (
              <div key={index} className="p-4 space-y-3 bg-zinc-900/10 active:bg-zinc-800/30 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-zinc-200 line-clamp-1">{task.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`flex items-center gap-1.5 text-[10px] font-medium ${getStatusStyle(task.status)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                        {task.status}
                      </span>
                      <span className="text-zinc-700 text-[10px]">•</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border uppercase tracking-wide ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/tasks`)}
                    className="p-1.5 -mr-2 rounded hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {(() => {
                    const now = new Date();
                    const due = new Date(task.dueDate);
                    const diff = due.getTime() - now.getTime();
                    if (diff < 0) return 'Overdue';
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    if (days > 0) return `${days} days left`;
                    return 'Due soon';
                  })()}
                </div>
              </div>
            ))}
            {recentTasks.length === 0 && (
              <div className="p-8 text-center text-zinc-500 text-sm">
                No recent tasks
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>

  );
};

export default DashBoard;