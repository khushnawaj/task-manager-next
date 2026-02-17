```javascript
import { useState } from 'react';
import { useGetTaskCommentsQuery, useCreateCommentMutation } from "../store/services/tasksApi";
import { useSelector } from "react-redux";

export default function TaskComments({ taskId }) {
  const { user } = useSelector(state => state.auth);
  const { data: comments = [], isLoading } = useGetTaskCommentsQuery(taskId);
  const [createComment] = useCreateCommentMutation();
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
        await createComment({ taskId, text }).unwrap();
        setText("");
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div>
        <h3 className="text-brand-500 font-bold uppercase text-xs mb-4 tracking-wider flex items-center gap-2">
            Comments
        </h3>
        
        <div className="mb-6 max-h-60 overflow-y-auto pr-2 space-y-4">
            {isLoading ? (
                <div className="text-brand-400 text-sm italic">Loading comments...</div>
            ) : comments.length === 0 ? (
                <div className="text-brand-400 text-sm italic py-2">No comments yet.</div>
            ) : (
                comments.map((c) => (
                    <div key={c._id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-600 flex-shrink-0">
                            {c.user?.name?.[0] || '?'}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-sm font-semibold text-brand-900">{c.user?.name}</span>
                                <span className="text-xs text-brand-400">{new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div className="bg-brand-50 rounded-lg p-3 text-sm text-brand-700 leading-relaxed border border-brand-100">
                                {c.text}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
            <input 
                value={text} 
                onChange={e => setText(e.target.value)}
                placeholder="Write a comment..."
                className="input-field"
            />
            <button type="submit" className="btn-secondary px-4">
                Send
            </button>
        </form>
    </div>
  );
}
```
