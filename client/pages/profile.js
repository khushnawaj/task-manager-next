import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../components/Layout';
import { useUpdateProfileMutation, useUploadAvatarMutation } from '../store/services/userApi';
import { setAuth } from '../store/slices/authSlice';
import { User, Mail, Shield, Save, Check, Info, Camera, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useRouter } from 'next/router';

export default function Profile() {
    const { user, token, initialized } = useSelector(state => state.auth);
    const router = useRouter();
    const dispatch = useDispatch();

    const [name, setName] = useState(user?.name || '');
    const [title, setTitle] = useState(user?.title || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    const [email, setEmail] = useState(user?.email || ''); // Read only

    const [updateProfile, { isLoading }] = useUpdateProfileMutation();
    const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
    const [status, setStatus] = useState({ type: '', message: '' });

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (initialized && !user) {
            router.push('/login');
        } else if (user) {
            setName(user.name);
            setTitle(user.title || '');
            setBio(user.bio || '');
            setAvatarUrl(user.avatarUrl || '');
            setEmail(user.email);
        }
    }, [user, initialized, router]);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await uploadAvatar(formData).unwrap();
            setAvatarUrl(result.url);
            setStatus({ type: 'success', message: 'Image uploaded. Click Save to apply.' });
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: 'Image upload failed.' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await updateProfile({ name, title, bio, avatarUrl }).unwrap();
            dispatch(setAuth({ user: result.user, token }));
            setStatus({ type: 'success', message: 'Profile updated successfully.' });
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: 'Update failed.' });
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        }
    };

    if (!initialized || !user) return null;

    return (
        <Layout title="User Profile">
            <div className="max-w-2xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900 border border-border rounded-2xl shadow-premium-xl overflow-hidden"
                >
                    {/* Header Strip */}
                    <div className="px-8 py-6 border-b border-border bg-active/20 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Identity & Access</h2>
                            <p className="text-xs font-medium text-zinc-500 mt-1 uppercase tracking-widest">Personal node configuration</p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-600">
                            <Save size={20} />
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex items-center gap-8 mb-12">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="h-24 w-24 rounded-2xl bg-zinc-950 border border-border flex items-center justify-center text-brand-500 font-bold text-4xl shadow-inner relative group overflow-hidden cursor-pointer"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                {isUploading ? (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors z-20 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <Camera size={24} className="text-white drop-shadow-md" />
                                    </div>
                                )}

                                {avatarUrl ? (
                                    <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <div className="absolute inset-0 bg-brand-500/5 group-hover:bg-brand-500/10 transition-colors" />
                                        <span className="relative z-10">{name?.charAt(0)?.toUpperCase()}</span>
                                    </>
                                )}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">{name}</h3>
                                {title && (
                                    <p className="text-sm font-medium text-zinc-400 mt-1">{title}</p>
                                )}
                                <div className="flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-zinc-800 border border-white/5 w-fit">
                                    <Shield size={12} className="text-brand-400" />
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{user.role}</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                                        <User size={12} /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input-field py-2.5 text-base"
                                        placeholder="Engineer Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                                        job Title
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="input-field py-2.5 text-base"
                                        placeholder="Senior Engineer"
                                    />
                                </div>
                            </div>



                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                                    Bio / Description
                                </label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="input-field py-2.5 text-sm min-h-[100px]"
                                    placeholder="Brief technical biography..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                                    <Mail size={12} /> Communication Endpoint
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        readOnly
                                        className="input-field py-2.5 text-base bg-zinc-950/50 text-zinc-500 border-dashed cursor-not-allowed opacity-80"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[9px] font-bold text-zinc-600 uppercase">
                                        Locked
                                        <Save size={10} />
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {status.message && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`flex items-center gap-3 p-4 rounded-xl border ${status.type === 'success'
                                            ? 'bg-success/10 border-success/20 text-success'
                                            : 'bg-danger/10 border-danger/20 text-danger'
                                            }`}
                                    >
                                        <div className={`p-1.5 rounded-lg ${status.type === 'success' ? 'bg-success/20' : 'bg-danger/20'}`}>
                                            {status.type === 'success' ? <Check size={14} /> : <Info size={14} />}
                                        </div>
                                        <span className="text-sm font-semibold tracking-tight">{status.message}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex justify-end pt-4 border-t border-border">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary h-12 px-10 text-sm font-bold shadow-brand-500/20"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Synchronizing...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Save size={16} />
                                            Save Parameters
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
