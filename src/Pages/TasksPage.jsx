import React, { useState } from 'react';
import Layout from '../Components/Layout';
import { Search, Filter, MoreVertical, Calendar, Clock, Flag, CheckCircle2, Circle, X, Edit, Trash2, Plus, LayoutGrid } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../Components/ConfirmationModal';
import { useTask } from '../context/TaskContext';

const TasksPage = () => {

    const { tasks, token } = useTask();



    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [selectedTask, setSelectedTask] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const navigate = useNavigate();



    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'High': return {
                badge: 'text-red-400 bg-red-400/10 border-red-400/20',
                border: 'border-l-red-400',
                text: 'text-red-400'
            };
            case 'Medium': return {
                badge: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
                border: 'border-l-yellow-400',
                text: 'text-yellow-400'
            };
            case 'Low': return {
                badge: 'text-green-400 bg-green-400/10 border-green-400/20',
                border: 'border-l-green-400',
                text: 'text-green-400'
            };
            default: return {
                badge: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20',
                border: 'border-l-zinc-400',
                text: 'text-zinc-400'
            };
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };



    const filteredTasks = tasks.filter(task => {
        const matchesStatus = filter === 'All' || task.status === filter;
        const matchesSearch = task.title?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });




    const handelDeleteTask = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")}/task/deleteTask/${selectedTask._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    if (res.status === 200) {
                        window.location.reload();
                    }
                }
                )
                .catch(err => console.log(err))
        } catch (error) {
            console.log(error);
        }
    }


    const handleEditTask = () => {
        setSelectedTask()
        navigate('/edit-task', { state: { task: selectedTask } });
    }


    return (
        <Layout>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold text-white tracking-tight">My Tasks</h1>
                        <p className="text-zinc-500 text-sm mt-1">Manage and track your active tasks.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 md:flex-none">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-zinc-700 transition-all w-full md:w-64"
                            />
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`p-2 rounded-lg border transition-colors ${filter !== 'All' ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
                            >
                                <Filter className="w-4 h-4" />
                            </button>
                            {isFilterOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-20 overflow-hidden">
                                        {['All', 'Pending', 'In Progress', 'Completed', 'Hold'].map((f) => (
                                            <button
                                                key={f}
                                                onClick={() => {
                                                    setFilter(f);
                                                    setIsFilterOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition-colors ${filter === f ? 'text-white font-medium bg-zinc-800/50' : 'text-zinc-400'}`}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 border-b border-zinc-800/50 pb-4 overflow-x-auto">
                    {['All', 'Pending', 'Completed', 'In Progress' , 'Hold'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${filter === tab
                                ? 'bg-white text-black shadow-lg shadow-white/10'
                                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Task Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task, key) => {
                            const styles = getPriorityStyles(task.priority);
                            return (
                                <div
                                    key={key}
                                    onClick={() => setSelectedTask(task)}
                                    className={`group relative bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 hover:bg-zinc-900/60 transition-all cursor-pointer overflow-hidden backdrop-blur-sm ${styles.border} border-l-[3px]`}
                                >

                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles.badge}`}>
                                            {task.priority} Priority
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="w-4 h-4 text-zinc-500" />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                                            {task.title}
                                        </h3>
                                        <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                                            {task.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                                        <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(task.dueDate)}
                                            </div>
                                            {task.timeEstimate && (
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {task.timeEstimate}
                                                </div>
                                            )}
                                        </div>

                                        {task.status === 'Completed' ? (
                                            <div className="flex items-center gap-1.5 text-green-400 p-1.5 rounded-md bg-green-400/10">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-zinc-500 p-1.5 rounded-md bg-zinc-800/50">
                                                <Circle className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center space-y-4 bg-zinc-900/20 rounded-2xl border border-zinc-800/50 border-dashed">
                            <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800">
                                <LayoutGrid className="w-8 h-8 text-zinc-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-white">No tasks found</h3>
                                <p className="text-zinc-500 text-sm max-w-xs mx-auto mt-1">
                                    {filter === 'All'
                                        ? "You haven't created any tasks yet. Start by adding a new one."
                                        : `No ${filter.toLowerCase()} tasks available.`}
                                </p>
                            </div>
                            {filter === 'All' && (
                                <button
                                    onClick={() => navigate('/add-task')}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-pink-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create New Task
                                </button>
                            )}
                        </div>
                    )}
                </div>

            </div>

            {/* Task Details Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold text-white">Task Details</h2>
                                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityStyles(selectedTask.priority).badge}`}>
                                    {selectedTask.priority}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">

                            <div className="space-y-2">
                                <h3 className="text-2xl font-semibold text-white">{selectedTask.title}</h3>
                                <div className="flex items-center gap-6 text-sm text-zinc-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(selectedTask.dueDate)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {selectedTask.timeEstimate}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {selectedTask.status === 'Completed' ? (
                                            <div className="flex items-center gap-1.5 text-green-400 font-medium">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Done
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-zinc-500 font-medium">
                                                <Circle className="w-4 h-4" />
                                                Pending
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Description</label>
                                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                    {selectedTask.description}
                                </p>
                            </div>

                            {selectedTask.steps && selectedTask.steps.length > 0 && (
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Action Steps</label>
                                    <div className="space-y-2">
                                        {selectedTask.steps.map((step, index) => (
                                            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                                                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-500 shrink-0 mt-0.5">
                                                    {index + 1}
                                                </div>
                                                <span className="text-sm text-zinc-300">{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-900/50">
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Task
                            </button>
                            <button
                                onClick={() => handleEditTask()}
                                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-zinc-200 text-sm font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Task
                            </button>
                        </div>

                    </div>
                </div>
            )}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handelDeleteTask}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
            />
        </Layout>
    );
};

export default TasksPage;
