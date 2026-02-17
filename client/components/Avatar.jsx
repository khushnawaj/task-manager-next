import React from 'react';

export default function Avatar({ user, className = "w-8 h-8 p-1" }) {
    if (!user) return <div className={`bg-zinc-800 rounded-lg ${className}`} />;

    const initials = user.name ? user.name.charAt(0).toUpperCase() : '?';

    if (user.avatarUrl) {
        return (
            <div className={`relative rounded-lg overflow-hidden bg-zinc-950 border border-white/5 ${className}`}>
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-center rounded-lg bg-zinc-950 border border-white/5 text-zinc-400 font-bold shadow-inner ${className}`}>
            {initials}
        </div>
    );
}
