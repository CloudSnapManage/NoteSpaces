
import React from 'react';
import { Link } from 'react-router-dom';
import { Note } from '../types';
import { Clock, Heart, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const formattedDate = note.created_at && !isNaN(new Date(note.created_at).getTime())
    ? format(new Date(note.created_at), 'MMM d')
    : 'Unknown';

  // Use random gradient placeholder if no image
  const placeholderGradient = `linear-gradient(135deg, #E0E7FF 0%, #F5F3FF 100%)`;

  // Safe access to counts
  const likesCount = note.likes && note.likes[0] ? note.likes[0].count : 0;
  const commentsCount = note.comments && note.comments[0] ? note.comments[0].count : 0;

  return (
    <Link to={`/note/${note.id}`} className="block h-full group">
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col relative">
        
        {/* Image / Banner Area */}
        <div className="h-40 overflow-hidden relative">
           {note.image_url ? (
             <img
              src={note.image_url}
              alt={note.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
           ) : (
             <div className="w-full h-full" style={{ background: placeholderGradient }}>
               <div className="w-full h-full flex items-center justify-center opacity-10">
                 <span className="text-4xl font-heading font-bold text-brand-300 select-none">Aa</span>
               </div>
             </div>
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="flex flex-wrap gap-2 mb-3">
            {note.tags && note.tags.slice(0, 3).map((tag, index) => {
              // Alternate colors for tags to make them look distinct
              const colors = [
                'bg-blue-50 text-blue-600',
                'bg-purple-50 text-purple-600',
                'bg-orange-50 text-orange-600'
              ];
              const colorClass = colors[index % colors.length];
              return (
                <span
                  key={index}
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${colorClass}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
          
          <h3 className="text-lg font-heading font-bold text-navy-900 mb-2 leading-tight group-hover:text-brand-600 transition-colors">
            {note.title}
          </h3>
          
          <p className="text-navy-500 text-sm line-clamp-2 mb-5 leading-relaxed">
            {note.content}
          </p>
          
          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                   {note.profiles?.avatar_url ? (
                     <img src={note.profiles.avatar_url} alt="User" className="h-full w-full object-cover" />
                   ) : (
                     <div className="h-full w-full bg-navy-800 flex items-center justify-center text-white text-[10px] font-bold">
                       {note.profiles?.username?.[0]?.toUpperCase() || 'U'}
                     </div>
                   )}
                </div>
             </div>

             <div className="flex items-center gap-4 text-xs font-medium text-navy-400">
                <div className="flex items-center gap-1" title={`${likesCount} Likes`}>
                   <Heart className="h-3.5 w-3.5" />
                   <span>{likesCount}</span> 
                </div>
                <div className="flex items-center gap-1" title={`${commentsCount} Comments`}>
                   <MessageSquare className="h-3.5 w-3.5" />
                   <span>{commentsCount}</span>
                </div>
                <div className="flex items-center gap-1">
                   <Clock className="h-3.5 w-3.5" />
                   <span>{formattedDate}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
