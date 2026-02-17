import { AlertCircle, CheckSquare, BookOpen, Zap } from 'lucide-react';

export const PRIORITY_COLORS = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-blue-50 text-blue-700 border-blue-200',
    low: 'bg-gray-100 text-gray-700 border-gray-200'
};

export const STATUS_COLORS = {
    todo: 'bg-gray-100 text-gray-700',
    inprogress: 'bg-blue-100 text-blue-700',
    review: 'bg-purple-100 text-purple-700',
    done: 'bg-green-100 text-green-700'
};

export const TYPE_ICONS = {
    bug: <AlertCircle size={14} className="text-red-500" />,
    task: <CheckSquare size={14} className="text-blue-500" />,
    story: <BookOpen size={14} className="text-green-500" />,
    epic: <Zap size={14} className="text-purple-500" />
};

export const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

export const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
};
