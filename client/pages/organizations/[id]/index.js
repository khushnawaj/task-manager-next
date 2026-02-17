import { useRouter } from 'next/router';
import { useGetProjectsQuery, useCreateProjectMutation } from '../../../store/services/projectsApi';
import { useGetOrganizationQuery } from '../../../store/services/organizationApi';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Folder, ChevronRight, Plus, Calendar, User, AlignLeft, Hash, Activity } from 'lucide-react';

export default function OrganizationDashboard() {
    const router = useRouter();
    const { id: organizationId } = router.query;
    const { user } = useSelector(state => state.auth);

    const { data: projects = [], isLoading: projectsLoading, error } = useGetProjectsQuery(organizationId, { skip: !organizationId });
    const { data: orgData } = useGetOrganizationQuery(organizationId, { skip: !organizationId });

    const [createProject] = useCreateProjectMutation();

    // Modal State
    const [isCreating, setIsCreating] = useState(false);

    // Form State
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

    // Auto-generate key
    const handleNameChange = (e) => {
        const name = e.target.value;
        const generated = name.replace(/[^a-zA-Z0-9]/g, "").substring(0, 3).toUpperCase();

        setFormData(prev => ({
            ...prev,
            name,
            key: (prev.key === "" || prev.key.length < 3) ? generated : prev.key
        }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.key.trim()) return;
        try {
            await createProject({
                ...formData,
                organizationId
            }).unwrap();
            setFormData({ name: "", key: "", description: "", startDate: "", endDate: "", leadId: user._id });
            setIsCreating(false);
        } catch (err) {
            console.error(err);
            alert("Failed to create project. Key might be duplicate.");
        }
    };

    if (!user) return null;

    return (
        <Layout title="Workspace">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-brand-200">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Link href="/dashboard" className="text-sm font-medium text-brand-500 hover:text-brand-900 transition-colors">
                                Workspaces
                            </Link>
                            <span className="text-brand-300">/</span>
                            <span className="text-sm font-medium text-brand-900">Projects</span>
                        </div>
                        <h1 className="text-3xl font-display font-semibold text-brand-900">Projects</h1>
                        <p className="text-brand-500 mt-1">Manage your team's initiatives and tasks.</p>
                    </div>

                    <div className="mt-4 sm:mt-0 flex gap-3">
                        <Link
                            href={`/organizations/${organizationId}/team`}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <User size={16} /> Team
                        </Link>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus size={16} /> New Project
                        </button>
                    </div>
                </div>

                {/* Create Project Modal */}
                {isCreating && (
                    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsCreating(false)}></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2" id="modal-title">
                                            <Folder size={20} className="text-brand-500" /> Create New Project
                                        </h3>
                                        <div className="mt-4">
                                            <form onSubmit={handleCreate} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                                        Project Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="mt-1 relative rounded-md shadow-sm">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <Folder size={14} className="text-gray-400" />
                                                        </div>
                                                        <input
                                                            value={formData.name}
                                                            onChange={handleNameChange}
                                                            className="block w-full pl-10 border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500 sm:text-sm p-2 border"
                                                            placeholder="e.g. Q4 Marketing"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                                            Key <Hash size={12} />
                                                        </label>
                                                        <input
                                                            value={formData.key}
                                                            onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase() })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-brand-500 focus:border-brand-500 uppercase font-mono"
                                                            placeholder="Q4M"
                                                            required
                                                            maxLength={5}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                                            Lead <User size={12} />
                                                        </label>
                                                        <select
                                                            value={formData.leadId}
                                                            onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-brand-500 focus:border-brand-500"
                                                        >
                                                            {orgData?.organization?.members.map(m => (
                                                                <option key={m.userId?._id} value={m.userId?._id}>{m.userId?.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                                        Description <AlignLeft size={12} />
                                                    </label>
                                                    <textarea
                                                        value={formData.description}
                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                        rows={3}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-brand-500 focus:border-brand-500"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                                            Start Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={formData.startDate}
                                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-brand-500 focus:border-brand-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                                            End Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={formData.endDate}
                                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-brand-500 focus:border-brand-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-600 text-base font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:w-auto sm:text-sm">
                                                        Create Project
                                                    </button>
                                                    <button type="button" onClick={() => setIsCreating(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:mt-0 sm:w-auto sm:text-sm">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Project Grid */}
                {projectsLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-red-600 font-medium">Unable to load projects.</p>
                        <p className="text-red-500 text-sm mt-1">Please check your permissions or network connection.</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-24 bg-brand-50/50 rounded-xl border border-dashed border-brand-300">
                        <div className="mx-auto h-12 w-12 text-brand-400 mb-3 flex items-center justify-center">
                            <Folder size={48} strokeWidth={1} />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-brand-900">No projects</h3>
                        <p className="mt-1 text-sm text-brand-500">Get started by creating a new project.</p>
                        <div className="mt-6">
                            <button onClick={() => setIsCreating(true)} className="btn-secondary mx-auto w-auto flex items-center gap-2">
                                <Plus size={16} /> Create Project
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map(project => (
                            <Link key={project._id} href={`/organizations/${organizationId}/projects/${project._id}`}>
                                <div className="group bg-white border border-brand-200 rounded-xl p-6 hover:shadow-md hover:border-brand-300 transition-all cursor-pointer h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="h-10 w-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100 font-bold">
                                                {project.key || project.name[0]}
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-400">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-brand-900 mb-2 group-hover:text-brand-600 transition-colors">
                                            {project.name}
                                        </h3>
                                        <p className="text-sm text-brand-500 line-clamp-2">
                                            {project.description || "No description provided."}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-brand-100 flex items-center justify-between">
                                        <span className={`text-[10px] px-2 py-0.5 rounded border capitalize flex items-center gap-1 ${!project.status || project.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500'}`}>
                                            <Activity size={10} /> {project.status || 'Active'}
                                        </span>
                                        <div className="flex -space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-brand-200 border-2 border-white flex items-center justify-center text-[10px] text-brand-600 font-medium">
                                                {user.name[0]}
                                            </div>
                                            {(project.members?.length > 1) && (
                                                <div className="w-6 h-6 rounded-full bg-brand-100 border-2 border-white flex items-center justify-center text-[10px] text-brand-500 font-medium">
                                                    +{project.members.length - 1}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}

// Enable SSR for authenticated routes
export async function getServerSideProps() {
    return { props: {} };
}
