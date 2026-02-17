import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../../components/Layout';
import { useGetOrganizationQuery, useUpdateMemberRoleMutation, useRemoveMemberMutation } from '../../../store/services/organizationApi';
import { useGetPendingInvitesQuery, useCreateInviteMutation } from '../../../store/services/invitationApi';

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
    const [message, setMessage] = useState('');

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            await createInvite({ email: inviteEmail, role: inviteRole, organizationId }).unwrap();
            setMessage('Invitation sent!');
            setInviteEmail('');
        } catch (err) {
            setMessage('Failed to send invite.');
        }
    };

    if (!user || orgLoading) return <Layout>Loading...</Layout>;

    const organization = orgData?.organization;
    const invites = invitesData?.invites || [];

    // Check if current user is manager/admin
    const currentUserRole = organization?.members.find(m => m.userId?._id === user.id)?.role;
    const canManage = currentUserRole === 'admin' || currentUserRole === 'manager' || user.role === 'admin';

    return (
        <Layout title="Team Management">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
                    <p className="text-gray-500">Manage access and roles for your organization.</p>
                </div>

                {/* Invite Section */}
                {canManage && (
                    <div className="bg-white p-6 rounded-lg shadow mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Invite New Member</h3>
                        <form onSubmit={handleInvite} className="flex gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    className="mt-1 block w-64 rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    value={inviteRole}
                                    onChange={e => setInviteRole(e.target.value)}
                                    className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                                >
                                    <option value="member">Member</option>
                                    <option value="manager">Manager</option>
                                    <option value="observer">Observer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                            >
                                Send Invite
                            </button>
                        </form>
                        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
                    </div>
                )}

                {/* Members List */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <ul className="divide-y divide-gray-200">
                        {organization?.members.map((member) => (
                            <li key={member._id} className="px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                                            {member.userId?.name?.[0] || '?'}
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{member.userId?.name || 'Unknown User'}</div>
                                        <div className="text-sm text-gray-500">{member.userId?.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 capitalize`}>
                                        {member.role}
                                    </span>
                                    {canManage && (
                                        <button
                                            onClick={() => removeMember({ organizationId, userId: member.userId._id })}
                                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pending Invites */}
                {canManage && invites.length > 0 && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Invitations</h3>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {invites.map((invite) => (
                                <li key={invite._id} className="px-6 py-4 flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{invite.email}</div>
                                        <div className="text-sm text-gray-500">Role: <span className="capitalize">{invite.role}</span></div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
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
