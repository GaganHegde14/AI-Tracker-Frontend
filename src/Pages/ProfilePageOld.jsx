import React, { useState, useEffect } from 'react';
import Layout from '../Components/Layout';
import { 
  Camera, 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Trash2, 
  Save, 
  LogOut, 
  Plus,
  Edit3,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Quote
} from 'lucide-react';
import ConfirmationModal from '../Components/ConfirmationModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTask } from '../context/TaskContext';
import { useNotification } from '../context/NotificationContext';





const ProfilePage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { info, setInfo } = useTask()

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditingQuote, setIsEditingQuote] = useState(false);
    const [motivationalQuote, setMotivationalQuote] = useState(() => 
        localStorage.getItem('userMotivationalQuote') || "Every small step brings you closer to your goals. Keep moving forward! 🚀"
    );
    const [tempQuote, setTempQuote] = useState(motivationalQuote);
    const fileInputRef = React.useRef(null);

    // Predefined inspirational quotes for random generation
    const inspirationalQuotes = [
        "Success is not final, failure is not fatal: it is the courage to continue that counts. 💪",
        "The future belongs to those who believe in the beauty of their dreams. ✨",
        "Progress, not perfection. Every step forward matters. 🎯",
        "Your only limit is your mind. Think bigger, achieve more. 🧠",
        "Great things never come from comfort zones. Push your boundaries! 🚀",
        "The best time to plant a tree was 20 years ago. The second best time is now. 🌱",
        "Don't watch the clock; do what it does. Keep going. ⏰",
        "Success is the sum of small efforts repeated day in and day out. 📈",
        "Believe you can and you're halfway there. The journey begins with belief. 🌟",
        "Excellence is never an accident. It's the result of focus and determination. 🎖️"
    ];

    // Save quote to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('userMotivationalQuote', motivationalQuote);
    }, [motivationalQuote]);

    const generateRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
        const newQuote = inspirationalQuotes[randomIndex];
        setMotivationalQuote(newQuote);
        setTempQuote(newQuote);
    };

    const saveQuote = () => {
        setMotivationalQuote(tempQuote);
        setIsEditingQuote(false);
        showNotification("Motivational quote updated! 🎉", "success");
    };

    const cancelEditQuote = () => {
        setTempQuote(motivationalQuote);
        setIsEditingQuote(false);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleProfilePicUpdate(file);
        }
    };

    const handleProfilePicUpdate = async (file) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('profilePic', file);

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")}/profilePic`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.status === 200) {
                showNotification("Profile picture updated successfully", "success")
                if (setInfo && res.data.data) {
                    setInfo(prev => ({ ...prev, profilePic: res.data.data }));
                }
                // Reload to ensure everything is synced if state update isn't enough or possible
                setTimeout(() => {
                    window.location.reload();
                }, 1500)
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update profile picture";
            showNotification(errorMessage, "error");
        } finally {
            setIsUploading(false);
        }
    };



    const [users, setUsers] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsers(prev => ({ ...prev, [name]: value }));
    };

    // const getUserInfo = async () => {
    //     try {
    //         await axios.get(`${import.meta.env.VITE_BACKEND_URL}/userinfo`, {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem('token')}`
    //             }
    //         })
    //             .then((res) => {
    //                 setInfo(res.data)
    // 
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             })
    //     } catch (error) {
    //         console.log(error);
    // 
    //     }
    // }




    // useEffect(() => {
    //     getUserInfo()
    // }, [])


    const handelSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")}/updatePassword`, users, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((res) => {
                    if (res.status === 200) {
                        showNotification("Password Updated Successfully", "success")
                        setTimeout(() => {
                            navigate('/login')
                        }, 1000)
                    }
                })
                .catch((err) => {
                    const error = err.response.data.message || "Password Updated Failed";
                    showNotification(error, "error")
                })
        } catch (err) {
            const error = err.response.data.message || "Password Updated Failed";
            showNotification(error, "error")
        }
    }

    const handleLogout = () => {

        showNotification("Logout Successfully", "success")
        setTimeout(() => {
            localStorage.removeItem('token');
            navigate('/login');
        }, 1000)
    }

    const handleDeleteAccount = async () => {

        try {
            const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")}/deleteAccount`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.status === 200) {
                showNotification("Account Deleted Successfully", "success")
                setTimeout(() => {
                    localStorage.removeItem('token');
                    navigate('/');
                }, 1000)
            }
        } catch (err) {
            const error = err.response.data.message || "Account Deleted Failed";
            showNotification(error, "error")
        }
    }

    return (
        <Layout className="hide-scrollbar">
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
                <div>
                    <h1 className="text-3xl font-semibold text-white tracking-tight">Profile Settings</h1>
                    <p className="text-zinc-500 text-sm mt-1">Manage your account preferences and personal details.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Avatar & Quick Info */}
                    <div className="space-y-6">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center space-y-4">
                            <div className="relative group cursor-pointer">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-800 group-hover:border-zinc-700 transition-colors bg-zinc-800 relative">
                                    <img
                                        src={info?.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${info?.name || 'User'}`}
                                        alt="Profile"
                                        className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : ''}`}
                                    />
                                    {isUploading && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Desktop Hover Overlay */}
                                <div
                                    className="hidden md:flex absolute inset-0 bg-black/50 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Camera className="w-6 h-6 text-white" />
                                </div>

                                {/* Mobile Upload Button */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="md:hidden absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full border-4 border-zinc-900 text-white shadow-lg transform translate-x-1/4 translate-y-1/4 active:scale-95 transition-transform"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-white">{info?.name || "User Name"}</h2>
                                <p className="text-sm text-zinc-500">{info?.email || "user@example.com"}</p>
                            </div>
                            <div className="w-full pt-4 border-t border-zinc-800">
                                <div className="flex items-center justify-between text-sm text-zinc-400">
                                    <span>Focus Type</span>
                                    <span className="px-2 py-1 rounded-md bg-zinc-800 text-white text-xs font-medium"></span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full p-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 text-zinc-400 hover:text-white group"
                        >
                            <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                            <span>Log Out</span>
                        </button>
                    </div>

                    {/* Right Column: Edit Forms */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Personal Info */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                <User className="w-4 h-4 text-purple-400" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400">Username</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder={info?.name}
                                            value={info?.name || ''}
                                            readOnly
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 transition-all"
                                        />
                                        <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            readOnly
                                            placeholder={info?.email}
                                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-zinc-500 cursor-not-allowed focus:outline-none"
                                        />
                                        <Mail className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                </div>
                            </div>
                        </section>

                        {/* Profile Type */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                <Shield className="w-4 h-4 text-blue-400" />
                                Profile Type
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {profileTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setUsers(prev => ({ ...prev, profileType: type.id }))}
                                        className={`p-4 rounded-xl border text-left transition-all ${users.profileType === type.id
                                            ? 'bg-zinc-800 border-zinc-600 ring-1 ring-zinc-600'
                                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50'
                                            }`}
                                    >
                                        <type.icon className={`w-5 h-5 mb-3 ${users.profileType === type.id ? 'text-white' : 'text-zinc-500'
                                            }`} />
                                        <div className="text-sm font-medium text-white">{type.label}</div>
                                        <div className="text-xs text-zinc-500 mt-1">{type.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Password */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                <Lock className="w-4 h-4 text-green-400" />
                                Security
                            </h3>
                            <form
                                onSubmit={handelSubmit}
                                className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400">Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={users.currentPassword}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-400">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={users.newPassword}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-400">Confirm Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={users.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"

                                        className="flex items-center gap-2 px-6 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors">
                                        <Save className="w-4 h-4" />
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* Danger Zone */}
                        <div className="pt-8 border-t border-zinc-800">
                            <div className="flex items-center justify-between p-4 border border-red-500/20 bg-red-500/5 rounded-xl">
                                <div>
                                    <h4 className="text-red-400 font-medium text-sm">Delete Account</h4>
                                    <p className="text-red-400/60 text-xs mt-1">This action cannot be undone. All your data will be lost.</p>
                                </div>
                                <button

                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 text-xs font-medium rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20">
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete Account
                                </button>
                            </div>
                        </div>

                        <ConfirmationModal
                            isOpen={isDeleteModalOpen}
                            onConfirm={handleDeleteAccount}
                            onClose={() => setIsDeleteModalOpen(false)}
                            title="Delete Account"
                            message="Are you sure you want to delete this account? This action cannot be undone."
                        />

                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;
