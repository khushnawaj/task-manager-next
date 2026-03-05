import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsers() {
    const router = useRouter();
    const { user, initialized } = useSelector(state => state.auth);

    useEffect(() => {
        if (initialized) {
            if (!user || user.role !== 'admin') {
                router.push('/dashboard');
            }
        }
    }, [user, initialized, router]);

    if (!initialized || !user || user.role !== 'admin') return null;

    return (
        <Layout title="User Management - Admin">
            <div className="max-w-6xl mx-auto py-8">
                <Link href="/admin" className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors mb-8">
                    <ArrowLeft size={14} /> Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-3.5 bg-zinc-950 border border-border rounded-2xl text-purple-400 shadow-inner">
                            <Shield size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1.5">
                                Admin Dashboard
                            </div>
                            <h1 className="text-4xl font-bold text-zinc-50 tracking-tight">User Management</h1>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-border rounded-2xl p-12 text-center shadow-premium-lg">
                    <h3 className="text-lg font-bold text-zinc-300 mb-2">User Directory Module</h3>
                    <p className="text-zinc-500 font-medium text-sm">
                        This view would contain the data grid for managing and editing users across the platform.
                    </p>
                </div>
            </div>
        </Layout>
    );
}
