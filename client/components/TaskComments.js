import { useState } from 'react';
import { useGetTaskCommentsQuery, useCreateCommentMutation } from '../../store/services/commentsApi';
import { useSelector } from 'react-redux';

export default function TaskComments({ taskId }) {
    const { data: comments = [], isLoading } = useGetTaskCommentsQuery(taskId);
    const [createComment] = useCreateCommentMutation();
    const [text, setText] = useState("");
    const { user } = useSelector(state => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!text.trim()) return;
        try {
            await createComment({ taskId, text }).unwrap();
            setText("");
        } catch(err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-gray-400 font-bold uppercase text-xs mb-4 tracking-wider">Comments</h3>
            
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
                {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}
                {comments.length === 0 && !isLoading && <p className="text-gray-600 text-sm italic">No comments yet.</p>}
                
                {comments.map(c => (
                    <div key={c._id} className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-600 border border-gray-700 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                             {c.author?.avatarUrl ? <img src={c.author.avatarUrl} className="w-full h-full rounded-full" /> : c.author?.name?.[0]}
                         </div>
                         <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-white font-semibold text-sm">{c.author?.name || 'Unknown'}</span>
                                <span className="text-gray-600 text-xs">{new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div className="text-gray-300 text-sm bg-gray-800 p-2 rounded-lg rounded-tl-none border border-gray-700 mt-1">
                                {c.text}
                            </div>
                         </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="relative">
                <input 
                    className="w-full bg-gray-900 border border-gray-600 rounded-full px-4 py-2 pr-10 text-white focus:outline-none focus:border-blue-500 text-sm transition-colors"
                    placeholder="Write a comment..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
                <button type="submit" disabled={!text.trim()} className="absolute right-2 top-1.5 text-blue-500 hover:text-blue-400 disabled:opacity-50">
                    <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
            </form>
        </div>
    );
}
