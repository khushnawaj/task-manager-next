import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import { useGetAdminStatsQuery } from '../store/services/adminApi';

export default function AdminDashboard() {
    const router = useRouter();
    const { user } = useSelector(state => state.auth);
    const { data, isLoading, error } = useGetAdminStatsQuery(undefined, {
        skip: !user || user.role !== 'admin'
    });

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.role !== 'admin') {
            router.push('/dashboard'); // Kick non-admins out
        }
    }, [user, router]);

    if (!user || user.role !== 'admin') return null;

    return (
        <Layout title="Admin Console">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                    <StatCard title="Total Users" value={data?.stats?.userCount} loading={isLoading} />
                    <StatCard title="Active Projects" value={data?.stats?.projectCount} loading={isLoading} />
                    <StatCard title="Organizations" value={data?.stats?.orgCount} loading={isLoading} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Users */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Recent Signups</h3>
                        <div className="flow-root">
                            <ul className="-my-5 divide-y divide-gray-200">
                                {isLoading ? (
                                    <li className="py-4 text-sm text-gray-500">Loading...</li>
                                ) : data?.recentUsers?.map((u) => (
                                    <li key={u._id} className="py-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                    {u.name[0]}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                                <div className="text-sm text-gray-500">{u.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                                {u.role}
                                            </span>
                                            <span className="text-xs text-brand-400 mt-1">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Recent Orgs */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">New Workspaces</h3>
                        <div className="flow-root">
                            <ul className="-my-5 divide-y divide-gray-200">
                                {isLoading ? (
                                    <li className="py-4 text-sm text-gray-500">Loading...</li>
                                ) : data?.recentOrgs?.map((org) => (
                                    <li key={org._id} className="py-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="ml-0">
                                                <div className="text-sm font-medium text-gray-900">{org.name}</div>
                                                <div className="text-sm text-gray-500">Plan: {org.plan}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(org.createdAt).toLocaleDateString()}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function StatCard({ title, value, loading }) {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {loading ? '...' : value || 0}
                </dd>
            </div>
        </div>
    );
}
