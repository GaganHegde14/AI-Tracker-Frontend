import React, { useState } from 'react';
import Layout from '../Components/Layout';
import { Sparkles, Calendar, Clock, Flag, Plus, X, Save, ArrowLeft, ListChecks, Hourglass, CheckCircle, PauseCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';


const EditTaskPage = () => {

    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const token = localStorage.getItem("token")
    const location = useLocation();
    const existingTask = location.state?.task;

    const [task, setTask] = useState({
        title: existingTask?.title || '',
        description: existingTask?.description || '',
        priority: existingTask?.priority || 'Low',
        dueDate: existingTask?.dueDate ? new Date(existingTask.dueDate).toISOString().split('T')[0] : '',
        timeEstimate: existingTask?.timeEstimate || '',
        completed: existingTask?.status === 'Completed',
        status: existingTask?.status || 'Pending',
        steps: existingTask?.steps || ['']
    });


    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'text-red-400 hover:text-red-300';
            case 'Medium': return 'text-yellow-400 hover:text-yellow-300';
            case 'Low': return 'text-green-400 hover:text-green-300';
            default: return 'text-zinc-400 hover:text-white';
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStepChange = (index, value) => {
        const newSteps = [...task.steps];
        newSteps[index] = value;
        setTask({
            ...task,
            steps: newSteps
        });
    };

    const addStep = () => {
        setTask({
            ...task,
            steps: [...task.steps, '']
        })
    }

    const removeStep = (index) => {
        const newSteps = task.steps.filter((_, i) => i !== index)
        setTask({
            ...task,
            steps: newSteps
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!task.title || !task.dueDate || !task.timeEstimate) {
            showNotification("Please fill in all required fields", "error");
            return;
        }
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")}/task/edit/${existingTask._id}`, task, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    if (res.status === 200) {
                        showNotification("Task Updated Successfully", "success")
                        setTimeout(() => {
                            navigate("/tasks")
                            window.location.reload()
                        }, 1000)
                    }
                })
                .catch((err) => {
                    const error = err.response.data.message || "Task Updated Failed";
                    showNotification(error, "error")
                })
        } catch (err) {
            const error = err.response.data.message || "Task Updated Failed";
            showNotification(error, "error")

        }
    };

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

            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-semibold text-white tracking-tight">Edit Task</h1>
                            <p className="text-zinc-500 text-sm mt-1">Update your task details.</p>
                        </div>
                    </div>

                    <button onClick={handleSubmit} className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-pink-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                        <Save className="w-4 h-4" />
                        Update Task
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Form Area */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Title Section */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400 block">Task Title</label>
                            <input
                                type="text"
                                name='title'
                                value={task.title}
                                onChange={handleChange}
                                placeholder="e.g., Redesign Landing Page"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-lg font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all"
                            />
                        </div>

                        {/* Description & AI */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-zinc-400">Description</label>
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    AI Enhance
                                </button>
                            </div>
                            <textarea
                                name='description'
                                value={task.description}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Describe your task here..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all resize-none"
                            />
                        </div>

                        {/* Steps */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-zinc-400 block">Action Steps</label>
                            <div className="space-y-2">
                                {task.steps.map((step, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-500">
                                            {index + 1}
                                        </div>
                                        <input
                                            value={task.steps[index]}
                                            onChange={(e) => handleStepChange(index, e.target.value)}
                                            placeholder="Add a step..."
                                            className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700 transition-all"
                                        />
                                        {task.steps.length > 1 && (
                                            <button
                                                onClick={() => removeStep(index)}
                                                className="text-zinc-600 hover:text-red-400 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addStep}
                                    className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors ml-9"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Step
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Metadata */}
                    <div className="space-y-6">
                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 space-y-6">

                            {/* Priority */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                                    <Flag className="w-4 h-4" />
                                    Priority
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Low', 'Medium', 'High'].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setTask({ ...task, priority: p })}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all focus:ring-2 focus:ring-zinc-700 ${task.priority === p ? getPriorityColor(p) + ' border-current' : 'text-zinc-400'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Due Date */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                                    <Calendar className="w-4 h-4" />
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={task.dueDate}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700 transition-all [&::-webkit-calendar-picker-indicator]:invert dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-200 dark:focus:border-zinc-600"
                                />
                            </div>

                            {/* Time Estimate */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                                    <Clock className="w-4 h-4" />
                                    Time Estimate
                                </label>
                                <input
                                    name='timeEstimate'
                                    value={task.timeEstimate}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="e.g. 2 hours"
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700 transition-all"
                                />
                            </div>

                            {/* Completed Toggle */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                                    <ListChecks className="w-4 h-4" />
                                    Status
                                </label>
                                <div className="flex flex-col gap-2">
                                    {['Pending', 'In Progress', 'Completed', 'Hold'].map((s) => {
                                        const isSelected = task.status === s;
                                        let icon;
                                        let colorClass;
                                        switch (s) {
                                            case 'Pending':
                                                icon = <Clock className="w-4 h-4" />;
                                                colorClass = 'text-blue-400';
                                                break;
                                            case 'In Progress':
                                                icon = <Hourglass className="w-4 h-4" />;
                                                colorClass = 'text-yellow-400';
                                                break;
                                            case 'Completed':
                                                icon = <CheckCircle className="w-4 h-4" />;
                                                colorClass = 'text-green-400';
                                                break;
                                            case 'Hold':
                                                icon = <PauseCircle className="w-4 h-4" />;
                                                colorClass = 'text-red-400';
                                                break;
                                            default:
                                                icon = null;
                                                colorClass = 'text-zinc-400';
                                        }
                                        return (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setTask({ ...task, status: s })}
                                                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all focus:ring-2 focus:ring-zinc-700 ${isSelected ? colorClass + ' border-current' : 'text-zinc-400'
                                                    }`}
                                            >
                                                {icon}
                                                {s}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>



                        </div>

                        {/* Improved Text Area (AI Output) */}
                        <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-5 space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-purple-400">
                                <Sparkles className="w-4 h-4" />
                                AI Improved Content
                            </div>
                            <div className="text-xs text-zinc-400 leading-relaxed italic">
                                AI suggestions will appear here after you click enhance...
                            </div>
                        </div>

                    </div>

                </form>
            </div>
        </Layout>
    );
};

export default EditTaskPage;
