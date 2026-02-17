import { useRouter } from 'next/router';
import { useGetProjectsQuery, useCreateProjectMutation } from '../../../store/services/projectsApi';
import { useGetOrganizationQuery } from '../../../store/services/organizationApi';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Folder, ChevronRight, Plus, Calendar, User, AlignLeft, Hash, Activity, Shield, X, MoreVertical, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrganizationDashboard() {
    const router = useRouter();
    const { id: organizationId } = router.query;
    const { user, initialized } = useSelector(state => state.auth);
    const [page, setPage] = useState(1);

    const { data: projectData, isLoading: projectsLoading, error } = useGetProjectsQuery({ organizationId, page }, { skip: !organizationId || !initialized });
    const projects = projectData?.projects || [];
    const meta = projectData?.meta;

    const { data: orgData } = useGetOrganizationQuery(organizationId, { skip: !organizationId || !initialized });

    const [createProject] = useCreateProjectMutation();
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (initialized && !user) router.push('/login');
    }, [user, initialized, router]);

    const [formData, setFormData] = useState({
        name: "",
        key: "",
        description: "",
        startDate: "",
        endDate: "",
        leadId: ""
    });

    useEffect(() => {
        if (user && !formData.leadId) {
            setFormData(prev => ({ ...prev, leadId: user.id || user._id }));
        }
    }, [user, isCreating]);

    const handleCreated = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.key.trim()) return;
        try {
            await createProject({
                ...formData,
                organizationId
            }).unwrap();
            setFormData({ name: "", key: "", description: "", startDate: "", endDate: "", leadId: user?._id });
            setIsCreating(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        const generated = name.replace(/[^a-zA-Z0-9]/g, "").substring(0, 3).toUpperCase();
        setFormData(prev => ({
            ...prev,
            name,
            key: (prev.key === "" || prev.key.length < 3) ? generated : prev.key
        }));
    };

    if (!initialized || !user) return null;

    return (
        <Layout title="Projects">
            <div className="max-w-6xl mx-auto">
                {/* Breadcrumbs & Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                            <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">Dashboard</Link>
                            <ChevronRight size={12} className="text-zinc-700" />
                            <span className="text-zinc-400">Projects</span>
                        </div>
                        <h1 className="text-4xl font-bold text-zinc-50 tracking-tight">
                            {orgData?.organization?.name || 'Projects'}
                        </h1>
                        <p className="text-zinc-500 mt-1 text-sm font-medium">
                            Manage and organize your project portfolio here.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link href={`/organizations/${organizationId}/team`} className="btn-secondary">
                            <User size={16} />
                            Team
                        </Link>
                        <button onClick={() => setIsCreating(true)} className="btn-primary">
                            <Plus size={16} strokeWidth={2.5} />
                            Create Project
                        </button>
                    </div>
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {projectsLoading ? (
                        [1, 2, 3].map(n => (
                            <div key={n} className="h-64 bg-zinc-900 border border-border rounded-2xl animate-pulse shimmer" />
                        ))
                    ) : projects.length === 0 ? (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/50">
                            <Folder size={48} className="text-zinc-700 mb-6" strokeWidth={1.5} />
                            <h3 className="text-xl font-bold text-zinc-300">No projects yet</h3>
                            <p className="text-zinc-500 text-sm mt-1 mb-8 max-w-xs text-center font-medium">
                                Start by creating a project to organize tasks and collaborate with your team.
                            </p>
                            <button onClick={() => setIsCreating(true)} className="btn-primary">
                                Create your first project
                            </button>
                        </div>
                    ) : (
                        projects.map((project, i) => (
                            <Link key={project._id} href={`/organizations/${organizationId}/projects/${project._id}`}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative p-7 bg-zinc-900 border border-border rounded-2xl hover:border-brand-500/50 hover:shadow-premium-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-zinc-950 border border-white/5 rounded-xl flex items-center justify-center font-bold text-zinc-400 group-hover:text-brand-400 group-hover:bg-zinc-900 transition-all duration-300 shadow-inner">
                                                {project.key || project.name[0]}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-zinc-100 tracking-tight leading-tight group-hover:text-white transition-colors">{project.name}</h3>
                                                <p className="text-xs font-medium text-zinc-500 mt-0.5">{project.key}</p>
                                            </div>
                                        </div>
                                        <button className="text-zinc-600 hover:text-zinc-400 transition-colors p-1">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>

                                    <p className="text-sm text-zinc-500 font-medium leading-relaxed line-clamp-2 mb-10 flex-1">
                                        {project.description || "Project management and task orchestration."}
                                    </p>

                                    <div className="pt-6 border-t border-border flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                                                <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_5px_currentColor]" />
                                                Active
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                                <AlignLeft size={12} />
                                                {project.tasks?.length || 0} Tasks
                                            </div>
                                        </div>

                                        <div className="flex -space-x-1.5">
                                            {[1, 2].map((_, idx) => (
                                                <div key={idx} className="h-6 w-6 rounded-full ring-2 ring-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 border border-white/5">
                                                    {String.fromCharCode(65 + idx)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hover Arrow */}
                                    <div className="absolute top-7 right-7 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                        <ArrowRight size={16} className="text-brand-500" />
                                    </div>
                                </motion.div>
                            </Link>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {meta && meta.pages > 1 && (
                    <div className="flex justify-between items-center mb-12 bg-zinc-900/50 p-4 rounded-xl border border-border">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            Showing Page {meta.page} of {meta.pages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-400 transition-all"
                            >
                                <ChevronRight size={16} className="rotate-180" />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
                                disabled={page === meta.pages}
                                className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-400 transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Create Project Modal */}
                <AnimatePresence>
                    {isCreating && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setIsCreating(false)}
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="relative w-full max-w-xl bg-zinc-950 border border-border-strong rounded-3xl shadow-premium-xl overflow-hidden"
                            >
                                <div className="p-8 border-b border-border flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold text-zinc-50 tracking-tight">Create Project</h2>
                                        <p className="text-zinc-500 text-sm font-medium mt-1">Initialize a new project workspace.</p>
                                    </div>
                                    <button onClick={() => setIsCreating(false)} className="text-zinc-500 hover:text-zinc-100 transition-colors p-2 hover:bg-zinc-900 rounded-xl">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleCreated} className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1">Project Name</label>
                                            <input
                                                autoFocus
                                                value={formData.name}
                                                onChange={handleNameChange}
                                                className="input-field"
                                                placeholder="Forge Infrastructure"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1">Key</label>
                                            <input
                                                value={formData.key}
                                                onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase() })}
                                                className="input-field font-mono uppercase"
                                                placeholder="NEX"
                                                required
                                                maxLength={5}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1">Lead</label>
                                        <div className="relative">
                                            <select
                                                value={formData.leadId}
                                                onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                                                className="input-field appearance-none"
                                            >
                                                {orgData?.organization?.members.map(m => (
                                                    <option key={m.userId?._id} value={m.userId?._id} className="bg-zinc-950 text-white">{m.userId?.name}</option>
                                                ))}
                                            </select>
                                            <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 rotate-90 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            className="input-field resize-none h-24"
                                            placeholder="Write a brief overview of the project objectives..."
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button type="button" onClick={() => setIsCreating(false)} className="btn-secondary flex-1">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn-primary flex-1">
                                            Create Project
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
}

export async function getServerSideProps() {
    return { props: {} };
}
