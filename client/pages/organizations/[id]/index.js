import { useRouter } from 'next/router';
import { useGetProjectsQuery, useCreateProjectMutation } from '../../../store/services/projectsApi';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar'; // Assuming it exists or I'll create a layout

export default function OrganizationDashboard() {
  const router = useRouter();
  const { id: organizationId } = router.query;
  const { user } = useSelector(state => state.auth);
  
  // Skip query if no ID
  const { data: projects = [], isLoading, error } = useGetProjectsQuery(organizationId, { skip: !organizationId });
  const [createProject] = useCreateProjectMutation();
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    try {
        await createProject({ name: newProjectName, organizationId }).unwrap();
        setNewProjectName("");
        setIsCreating(false);
    } catch (err) {
        console.error(err);
    }
  };

  if (!user) return null; // Or redirect

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
        {/* Simple Navbar */}
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center shadow-md">
            <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 font-medium">
                &larr; Back to Dashboard
            </Link>
            <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Workspace
            </div>
            <div className="flex gap-4 items-center">
                <Link href={`/organizations/${organizationId}/billing`} className="text-gray-400 hover:text-white text-sm font-medium hover:underline">
                    Billing
                </Link>
                <div className="w-10"></div>
            </div>
        </div>

        <div className="max-w-6xl mx-auto p-8">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                    <p className="text-gray-400">Manage your tasks and goals.</p>
                </div>
                <button 
                  onClick={() => setIsCreating(!isCreating)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                >
                  {isCreating ? "Cancel" : "+ New Project"}
                </button>
            </header>

            {isCreating && (
                <form onSubmit={handleCreate} className="mb-8 bg-gray-800 p-6 rounded-xl border border-gray-700 animate-fade-in-down">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Project Name</label>
                    <div className="flex gap-4">
                        <input 
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="e.g. Website Redesign"
                            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            autoFocus
                        />
                        <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold">
                            Create
                        </button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading projects...</div>
            ) : error ? (
                <div className="text-center py-20 text-red-400">Error loading projects. Ensure you have access.</div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-700 border-dashed">
                    <p className="text-gray-400 text-lg">No projects yet.</p>
                    <p className="text-gray-600">Create one to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <Link key={project._id} href={`/organizations/${organizationId}/projects/${project._id}`}>
                            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 hover:bg-gray-750 transition-all cursor-pointer shadow-lg group h-40 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">{project.name}</h3>
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{project.description || "No description"}</p>
                                </div>
                                <div className="flex justify-between items-center border-t border-gray-700 pt-4 mt-2">
                                    <div className="flex -space-x-2">
                                        {/* Avatar placeholders */}
                                        <div className="w-6 h-6 rounded-full bg-purple-500 border border-gray-800"></div>
                                        <div className="w-6 h-6 rounded-full bg-blue-500 border border-gray-800"></div>
                                    </div>
                                    <span className="text-xs text-gray-500 font-mono">
                                        Tasks: {project.taskCount || '?'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}
