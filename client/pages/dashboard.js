import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { LayoutDashboard, Plus, ArrowRight, User } from 'lucide-react';

export default function Dashboard() {
  const { user, organizations } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;

  return (
    <Layout title="Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Section */}
        <div className="mb-10 animate-fade-in-down">
          <h1 className="text-3xl font-display font-semibold text-brand-900">
            Welcome back, <span className="text-brand-600">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-brand-500 max-w-xl mt-2">
            Select a workspace to manage your projects and tasks.
          </p>
        </div>

        {/* Workspaces Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-brand-900 flex items-center gap-2">
              <LayoutDashboard size={20} className="text-brand-500" /> Your Workspaces
            </h2>
            <button
              onClick={() => alert("Feature coming soon in Phase 2")}
              className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors flex items-center gap-1"
            >
              <Plus size={16} /> New Workspace
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <Link key={org._id} href={`/organizations/${org._id}`}>
                <div className="group bg-white border border-brand-200 rounded-xl p-6 hover:shadow-md hover:border-brand-300 transition-all duration-200 cursor-pointer h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100">
                        <LayoutDashboard size={20} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded-full ${org.plan === 'pro'
                        ? 'bg-brand-900 text-white'
                        : 'bg-brand-100 text-brand-600'
                        }`}>
                        {org.plan === 'pro' ? 'PRO' : 'FREE'}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-brand-900 group-hover:text-brand-700 transition-colors mb-1">
                      {org.name}
                    </h3>
                    <p className="text-sm text-brand-500 line-clamp-1">
                      {org.slug}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between pt-4 border-t border-brand-50">
                    <div className="flex -space-x-2">
                      {/* Placeholder avatars until we have member images */}
                      <div className="w-6 h-6 rounded-full bg-brand-200 border-2 border-white flex items-center justify-center text-[10px] text-brand-600 font-medium">
                        <User size={12} />
                      </div>
                      {(org.members?.length > 1) && (
                        <div className="w-6 h-6 rounded-full bg-brand-50 border-2 border-white flex items-center justify-center text-[9px] text-brand-400 font-medium">
                          +{org.members.length - 1}
                        </div>
                      )}
                    </div>

                    <span className="text-sm font-medium text-brand-600 group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1">
                      Open <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Empty State / Create New Placeholder */}
            {organizations.length === 0 && (
              <button
                onClick={() => alert("Please contact support to create an organization.")}
                className="group bg-brand-50/50 border border-dashed border-brand-300 rounded-xl p-6 hover:bg-brand-50 hover:border-brand-400 transition-all duration-200 cursor-pointer h-48 flex flex-col items-center justify-center text-center"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-brand-200 flex items-center justify-center text-brand-400 mb-3 group-hover:scale-110 transition-transform">
                  <Plus size={20} />
                </div>
                <span className="text-sm font-medium text-brand-600">Create new workspace</span>
              </button>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
