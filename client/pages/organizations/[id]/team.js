import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../../components/Layout';
import { useGetOrganizationQuery, useUpdateMemberRoleMutation, useRemoveMemberMutation } from '../../../store/services/organizationApi';
import { useGetPendingInvitesQuery, useCreateInviteMutation } from '../../../store/services/invitationApi';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, UserPlus, Shield, MoreHorizontal, Mail,
    Trash2, ChevronRight, CheckCircle2, AlertCircle, X,
    ShieldCheck, ShieldAlert, User as UserIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function TeamPage() {
    const router = useRouter();
    const { id: organizationId } = router.query;
    const { user } = useSelector(state => state.auth);

    const { data: orgData, isLoading: orgLoading } = useGetOrganizationQuery(organizationId, { skip: !organizationId });
    const { data: invitesData, isLoading: invitesLoading } = useGetPendingInvitesQuery(organizationId, { skip: !organizationId });

    const [createInvite] = useCreateInviteMutation();
    const [updateRole] = useUpdateMemberRoleMutation();
    const [removeMember] = useRemoveMemberMutation();

    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');
    const [isInviting, setIsInviting] = useState(false);

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            await createInvite({ email: inviteEmail, role: inviteRole, organizationId }).unwrap();
            toast.success('Invitation dispatched successfully');
            setInviteEmail('');
            setIsInviting(false);
        } catch (err) {
            toast.error(err.data?.error || 'Dispatch failure');
        }
    };

    const handleRemove = async (userId) => {
        if (!confirm('Execute member removal protocol?')) return;
        try {
            await removeMember({ organizationId, userId }).unwrap();
            toast.success('Member decommissioned');
        } catch (err) {
            toast.error('Decommission failure');
        }
    };

    if (!user || orgLoading) return <Layout title="Team Intelligence">
        <div className="flex items-center justify-center h-[60vh]">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
    </Layout>;

    const organization = orgData?.organization;
    const invites = invitesData?.invites || [];

    // Check if current user is manager/admin
    const currentUserId = user._id || user.id;
    const currentUserRole = organization?.members.find(m => (m.userId?._id || m.userId) === currentUserId)?.role;
    const canManage = currentUserRole === 'admin' || currentUserRole === 'manager' || user.role === 'admin';

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'border-purple-500/20 text-purple-400 bg-purple-500/5';
            case 'manager': return 'border-amber-500/20 text-amber-400 bg-amber-500/5';
            case 'observer': return 'border-zinc-500/20 text-zinc-400 bg-zinc-500/5';
            default: return 'border-brand-500/20 text-brand-400 bg-brand-500/5';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <ShieldAlert size={12} />;
            case 'manager': return <ShieldCheck size={12} />;
            case 'observer': return <Activity size={12} />;
            default: return <UserIcon size={12} />;
        }
    };

    return (
        <Layout title="Team Intelligence">
            <div className="max-w-6xl mx-auto space-y-10 py-4">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-2">
                            <Users size={12} /> Personnel Management
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Team Intelligence</h1>
                        <p className="text-sm font-medium text-zinc-500 max-w-md">
                            Manage access, roles, and administrative permissions for <span className="text-zinc-300 font-bold">{organization?.name}</span>.
                        </p>
                    </div>

                    {canManage && (
                        <button
                            onClick={() => setIsInviting(true)}
                            className="btn-primary h-11 px-6 gap-2.5"
                        >
                            <UserPlus size={18} />
                            <span>Invite Personnel</span>
                        </button>
                    )}
                </header>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Members List - Main Body */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Operatives</h3>
                            <span className="text-[10px] font-bold bg-zinc-900 border border-white/5 text-zinc-500 px-2 py-0.5 rounded-full">{organization?.members.length} Total</span>
                        </div>

                        <div className="grid gap-4">
                            {organization?.members.map((member) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={member._id}
                                    className="group bg-zinc-900 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 hover:border-white/10 transition-all duration-300 shadow-premium-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-center text-white font-bold text-sm shadow-inner group-hover:text-brand-400 transition-colors overflow-hidden">
                                            {member.userId?.avatarUrl ? (
                                                <img src={member.userId.avatarUrl} alt={member.userId.name} className="w-full h-full object-cover" />
                                            ) : (
                                                member.userId?.name?.[0].toUpperCase() || '?'
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-white tracking-tight">{member.userId?.name || 'Decommissioned Node'}</span>
                                                {member.userId?._id === user._id && (
                                                    <span className="text-[9px] font-bold uppercase tracking-widest bg-zinc-950 border border-white/5 px-1.5 py-0.5 rounded text-zinc-600">You</span>
                                                )}
                                            </div>
                                            <div className="text-[11px] text-zinc-600 font-medium flex items-center gap-1.5 mt-0.5">
                                                <Mail size={10} /> {member.userId?.email}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${getRoleBadgeColor(member.role)}`}>
                                            {getRoleIcon(member.role)}
                                            {member.role}
                                        </div>

                                        {canManage && member.userId?._id !== user._id && (
                                            <button
                                                onClick={() => handleRemove(member.userId._id)}
                                                className="p-2 text-zinc-700 hover:text-rose-400 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Area - Pending Invites */}
                    <div className="space-y-8">
                        {/* Pending Section */}
                        <div className="space-y-4">
                            <h3 className="px-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">Pending Dispatch</h3>
                            <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-[60px] -mr-16 -mt-16" />

                                {invites.length === 0 ? (
                                    <div className="text-center py-6 space-y-3">
                                        <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center mx-auto text-zinc-700 border border-white/5">
                                            <Mail size={20} />
                                        </div>
                                        <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">No pending dispatches</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 relative z-10">
                                        {invites.map((invite) => (
                                            <div key={invite._id} className="pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                                <div className="text-[11px] font-bold text-white truncate">{invite.email}</div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-600">as {invite.role}</span>
                                                    <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-700">Expires {new Date(invite.expiresAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Org Context */}
                        <div className="bg-zinc-900 border border-border p-6 rounded-2xl shadow-premium-sm">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Workspace Intelligence</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-zinc-600">ID Verification</span>
                                    <span className="text-zinc-400 font-mono">#{organizationId?.slice(-8).toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-zinc-600">Auth Tier</span>
                                    <span className="text-emerald-400">Enterprise</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-zinc-600">Status</span>
                                    <span className="flex items-center gap-1 text-emerald-400">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Protected
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {isInviting && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsInviting(false)}
                            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] p-8 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-white tracking-tight">Personnel Dispatch</h3>
                                    <button onClick={() => setIsInviting(false)} className="text-zinc-600 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleInvite} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Endpoint</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="operatve@company.com"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Access Protocol</label>
                                        <select
                                            value={inviteRole}
                                            onChange={(e) => setInviteRole(e.target.value)}
                                            className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                                        >
                                            <option value="member">Member (Regular)</option>
                                            <option value="manager">Manager (Elevated)</option>
                                            <option value="observer">Observer (Read-Only)</option>
                                            <option value="admin">Administrator (Universal)</option>
                                        </select>
                                    </div>

                                    <button type="submit" className="btn-primary w-full h-12 text-sm font-bold uppercase tracking-widest shadow-brand-500/10">
                                        Initiate Dispatch
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
}

export async function getServerSideProps() {
    return { props: {} };
}
