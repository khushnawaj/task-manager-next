import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../components/Layout';
import { useUpdateProfileMutation } from '../store/services/userApi';
import { setCredentials } from '../store/slices/authSlice';

export default function Profile() {
    const { user, token } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || ''); // Read only

    const [updateProfile, { isLoading }] = useUpdateProfileMutation();
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await updateProfile({ name }).unwrap();
            // Update Redux State manually since token is same
            dispatch(setCredentials({ user: result.user, accessToken: token }));
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setMessage('Failed to update profile');
        }
    };

    if (!user) return null;

    return (
        <Layout title="Your Profile">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
                        <p className="text-sm text-gray-500">Update your personal information.</p>
                    </div>

                    <div className="p-6">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="h-20 w-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-3xl border border-brand-200">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-500 shadow-sm sm:text-sm p-2 border cursor-not-allowed"
                                />
                                <p className="mt-1 text-xs text-gray-400">Email cannot be changed.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <input
                                    type="text"
                                    value={user.role}
                                    readOnly
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-500 shadow-sm sm:text-sm p-2 border cursor-not-allowed capitalize"
                                />
                            </div>

                            {message && (
                                <div className={`p-3 rounded text-sm ${message.includes('Success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message}
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
