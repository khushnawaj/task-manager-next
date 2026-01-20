import { useRouter } from 'next/router';
import { useGetProjectTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from '../../../../store/services/tasksApi';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Link from 'next/link';
import useSocket from '../../../../hooks/useSocket';

// Simple Column Component
const TaskColumn = ({ title, status, tasks, onStatusChange, onDelete }) => (
  <div className="flex-1 min-w-[300px] bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 flex flex-col">
    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
        <h3 className="font-bold text-gray-300 uppercase tracking-widest text-sm">{title}</h3>
        <span className="bg-gray-700 text-xs px-2 py-0.5 rounded-full text-gray-400">{tasks.length}</span>
    </div>
    <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
        {tasks.map(task => (
            <div key={task._id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{task.title}</h4>
                    <button onClick={() => onDelete(task._id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        &times;
                    </button>
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
                <div className="flex justify-between items-center mt-2">
                    <div className="flex -space-x-1">
                        {(task.assignees || []).map((u, i) => (
                             <div key={i} title={u.name} className="w-6 h-6 rounded-full bg-blue-600 border border-gray-800 flex items-center justify-center text-[10px] text-white">
                                {u.name?.[0]}
                             </div>
                        ))}
                    </div>
                    
                    <select 
                        value={task.status} 
                        onChange={(e) => onStatusChange(task._id, e.target.value)}
                        className="bg-gray-900 text-xs text-gray-400 border border-gray-700 rounded px-1 py-0.5 focus:outline-none focus:border-blue-500"
                    >
                        <option value="todo">To Do</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>
            </div>
        ))}
    </div>
  </div>
);

import TaskComments from '../../../../components/TaskComments';
import { useGenerateTasksMutation } from '../../../../store/services/aiApi';

export default function ProjectBoard() {
  const router = useRouter();
  const { id: organizationId, projectId } = router.query;
  const { user } = useSelector(state => state.auth);
  
  // Realtime
  useSocket(projectId);
  
  const { data: tasks = [], isLoading, error } = useGetProjectTasksQuery(projectId, { skip: !projectId });
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  
  // AI
  const [generateTasks, { isLoading: isGenerating }] = useGenerateTasksMutation();
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiGoal, setAiGoal] = useState("");

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState(null); // For Modal

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
        await createTask({ projectId, title: newTaskTitle, status: 'todo' }).unwrap();
        setNewTaskTitle("");
    } catch (err) {
        console.error(err);
    }
  };
  
  const handleAiGenerate = async (e) => {
      e.preventDefault();
      if (!aiGoal.trim()) return;
      try {
          const { tasks: generatedTasks } = await generateTasks({ goal: aiGoal, projectId }).unwrap();
          // Create them all
          for (const t of generatedTasks) {
              await createTask({ projectId, title: t.title, description: t.description, status: 'todo' }).unwrap();
          }
          setShowAiModal(false);
          setAiGoal("");
      } catch (err) {
          alert("AI Generation failed. Ensure API Key is set.");
          console.error(err);
      }
  };
  
  const handleStatusChange = (taskId, newStatus) => {
      updateTask({ id: taskId, status: newStatus });
  };
  
  const handleDelete = (e, taskId) => {
      e.stopPropagation();
      if (confirm("Delete this task?")) {
          deleteTask(taskId);
          if (selectedTask?._id === taskId) setSelectedTask(null);
      }
  };

  const columns = {
    todo: tasks.filter(t => t.status === 'todo'),
    inprogress: tasks.filter(t => t.status === 'inprogress'),
    done: tasks.filter(t => t.status === 'done'),
  };
  
  const ColumnTask = ({ task }) => (
     <div 
        onClick={() => setSelectedTask(task)}
        className="glass-card p-4 rounded-xl group cursor-pointer relative overflow-hidden"
     >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-slate-100 text-sm leading-snug">{task.title}</h4>
            <button onClick={(e) => handleDelete(e, task._id)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity px-2">
                &times;
            </button>
        </div>
        {task.description && <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>}
        
        <div className="flex justify-between items-center mt-2 pt-3 border-t border-white/5">
            <div className="flex -space-x-2">
                {(task.assignees || []).map((u, i) => (
                        <div key={i} title={u.name} className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-white overflow-hidden">
                        {u.name?.[0]}
                        </div>
                ))}
                {(task.assignees?.length === 0) && <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 border-dashed flex items-center justify-center text-[10px] text-slate-500">+</div>}
            </div>
            
            <select 
                value={task.status} 
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className="bg-slate-900/50 text-[10px] text-slate-400 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-indigo-500 hover:bg-slate-800 transition-colors"
            >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
            </select>
        </div>
    </div>
  );

  if (!user) return null;

  return (
    <Layout title="Project Board" transparentNav>
        <div className="h-[calc(100vh-64px)] flex flex-col font-sans overflow-hidden bg-slate-900/50">
            {/* Header / Toolbar */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-white/5 bg-slate-900/30 backdrop-blur-sm">
                 <div className="flex items-center gap-4">
                    <Link href={`/organizations/${organizationId}`} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                        &larr; Back
                    </Link>
                    <div className="h-4 w-px bg-slate-700"></div>
                    <span className="text-white font-bold tracking-tight">Project Board</span>
                 </div>
                 
                 <div className="flex gap-3">
                    <button 
                        onClick={() => setShowAiModal(true)}
                        className="bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 text-white text-xs px-4 py-2 rounded-lg font-bold shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-transform hover:scale-105"
                    >
                        <span>✨</span> AI Director
                    </button>
                 </div>
            </div>

            {/* Board Content */}
            <div className="flex-1 p-6 overflow-x-auto relative">
                <div className="flex gap-6 h-full min-w-max pb-4">
                    <TaskColumn title="To Do" status="todo" tasks={columns.todo}>
                        <form onSubmit={handleCreate} className="mb-4">
                            <input 
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="+ New Task"
                                className="w-full glass-input px-4 py-3 text-sm shadow-sm"
                            />
                        </form>
                    </TaskColumn>

                    <TaskColumn title="In Progress" status="inprogress" tasks={columns.inprogress} />

                    <TaskColumn title="Done" status="done" tasks={columns.done} />
                </div>
            </div>
            
             {/* AI Modal */}
             {showAiModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-lg p-8 rounded-3xl relative animate-fade-in">
                        <button onClick={() => setShowAiModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">&times;</button>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-2xl mb-6 shadow-lg shadow-pink-500/20">
                            ✨
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">AI Director</h2>
                        <p className="text-slate-400 text-sm mb-6">Describe your goal, and I'll generate actionable tasks for your team.</p>
                        
                        <form onSubmit={handleAiGenerate}>
                            <textarea
                                value={aiGoal}
                                onChange={e => setAiGoal(e.target.value)}
                                placeholder="e.g. Launch a marketing campaign for Q4..."
                                className="w-full glass-input p-4 resize-none h-32 mb-6 text-sm"
                            />
                            <button 
                                type="submit" 
                                disabled={isGenerating}
                                className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Thinking...
                                    </>
                                ) : "Generate Plan"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Task Modal Overlay */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
                    <div className="w-full max-w-lg glass-panel h-full shadow-2xl p-0 flex flex-col animate-slide-in-right border-l border-white/10">
                        <div className="p-6 border-b border-white/5 flex justify-between items-start bg-slate-900/50">
                            <div>
                                <h2 className="text-xl font-bold text-white leading-tight mb-1">{selectedTask.title}</h2>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${selectedTask.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                    {selectedTask.status}
                                </span>
                            </div>
                            <button onClick={() => setSelectedTask(null)} className="text-slate-500 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-2 rounded-lg">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <div className="mb-8">
                                <h3 className="text-slate-500 font-bold uppercase text-xs mb-3 tracking-wider flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                                    Description
                                </h3>
                                <div className="text-slate-300 text-sm leading-relaxed p-4 bg-slate-900/50 rounded-xl border border-white/5 min-h-[100px]">
                                    {selectedTask.description || <span className="text-slate-600 italic">No description provided.</span>}
                                </div>
                            </div>

                            <div className="border-t border-white/5 pt-6">
                                <TaskComments taskId={selectedTask._id} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </Layout>
  );
}
