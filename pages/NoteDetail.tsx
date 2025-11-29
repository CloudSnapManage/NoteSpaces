import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Note, Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { Loader2, ArrowLeft, Trash2, Calendar, Share2, Copy, Printer, ShieldAlert, Heart, MessageSquare, Send, X } from 'lucide-react';
import { format } from 'date-fns';

const NoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchNoteData(id);
    }
  }, [id, user?.id]); // Only re-run if ID changes or User ID changes (for like status)

  const fetchNoteData = async (noteId: string) => {
    try {
      setLoading(true);

      // Execute all fetches in PARALLEL for speed
      const [noteResult, commentsResult, likesResult, userLikeResult] = await Promise.all([
        // 1. Fetch Note
        supabase.from('notes').select(`*, profiles (username, avatar_url)`).eq('id', noteId).single(),
        
        // 2. Fetch Comments
        supabase.from('comments').select(`*, profiles (username, avatar_url)`).eq('note_id', noteId).order('created_at', { ascending: true }),
        
        // 3. Fetch Likes Count
        supabase.from('likes').select('*', { count: 'exact', head: true }).eq('note_id', noteId),

        // 4. Check if User Liked (only if logged in)
        user ? supabase.from('likes').select('user_id').eq('note_id', noteId).eq('user_id', user.id).single() : Promise.resolve({ data: null, error: null })
      ]);

      if (noteResult.error) throw noteResult.error;
      
      setNote(noteResult.data);
      setComments(commentsResult.data || []);
      setLikesCount(likesResult.count || 0);
      setIsLiked(!!userLikeResult.data);

    } catch (error) {
      console.error('Error fetching note data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    if (!user || !note) return alert("Please log in to like notes.");
    
    // Optimistic update
    const previousState = isLiked;
    const previousCount = likesCount;
    
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      if (previousState) {
        // Unlike
        await supabase.from('likes').delete().eq('note_id', note.id).eq('user_id', user.id);
      } else {
        // Like
        await supabase.from('likes').insert([{ note_id: note.id, user_id: user.id }]);
      }
    } catch (error) {
      // Revert if error
      setIsLiked(previousState);
      setLikesCount(previousCount);
      console.error("Error toggling like:", error);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !note || !newComment.trim()) return;

    setCommentLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          content: newComment,
          note_id: note.id,
          user_id: user.id
        }])
        .select('*, profiles(username, avatar_url)')
        .single();

      if (error) throw error;
      
      setComments([...comments, data]);
      setNewComment('');
    } catch (error) {
      console.error("Failed to post comment", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    
    // Optimistic UI update
    const originalComments = [...comments];
    setComments(comments.filter(c => c.id !== commentId));

    try {
      const { error } = await supabase.from('comments').delete().eq('id', commentId);
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting comment", error);
      alert("Failed to delete comment");
      setComments(originalComments); // Revert on error
    }
  };

  const handleDeleteNote = async () => {
    if (!note) return;
    const canDelete = (user && user.id === note.user_id) || isAdmin;
    if (!canDelete) return;

    if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) return;

    try {
      const { error } = await supabase.from('notes').delete().eq('id', note.id);
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Ensure you have permission.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-10 w-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!note) {
    return (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Note not found</h2>
            <Link to="/" className="text-brand-600 font-medium hover:underline">Back to Feed</Link>
        </div>
    )
  }

  const isOwner = user && user.id === note.user_id;
  const canDelete = isOwner || isAdmin;

  return (
    <div className="max-w-4xl mx-auto pb-16 animate-fade-in">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-navy-500 hover:text-brand-600 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Feed
      </Link>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden mb-8">
        {/* Cover Image */}
        {note.image_url && (
          <div className="w-full h-64 sm:h-96 bg-gray-100 relative group">
            <img 
              src={note.image_url} 
              alt={note.title} 
              className="w-full h-full object-contain bg-navy-900/5 backdrop-blur-sm" 
            />
          </div>
        )}

        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="mb-8 border-b border-gray-100 pb-8">
            <div className="flex flex-wrap gap-2 mb-4">
               {note.tags && note.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-brand-50 text-brand-700 border border-brand-100 rounded-full text-xs font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-navy-900 mb-6 leading-tight">
              {note.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-3 bg-white/50 p-2 pr-4 rounded-full border border-white shadow-sm">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {note.profiles?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-900">{note.profiles?.username || 'Anonymous'}</p>
                  <div className="flex items-center text-xs text-navy-500 gap-1">
                    <Calendar className="h-3 w-3" />
                    {note.created_at && !isNaN(new Date(note.created_at).getTime()) 
                      ? format(new Date(note.created_at), 'MMMM d, yyyy') 
                      : 'Unknown Date'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                    isLiked 
                      ? 'bg-pink-50 text-pink-600' 
                      : 'bg-white text-navy-500 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  {likesCount}
                </button>

                <button onClick={handleCopy} className="p-2.5 rounded-full text-navy-500 hover:bg-brand-50 hover:text-brand-600 transition-colors" title="Copy Link">
                  <Copy className="h-5 w-5" />
                </button>
                <button onClick={() => window.print()} className="p-2.5 rounded-full text-navy-500 hover:bg-brand-50 hover:text-brand-600 transition-colors" title="Print/PDF">
                  <Printer className="h-5 w-5" />
                </button>
                
                {canDelete && (
                  <>
                    <div className="w-px h-6 bg-gray-200 mx-1"></div>
                    <button
                      onClick={handleDeleteNote}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors text-sm font-medium"
                    >
                      {isAdmin && !isOwner ? <ShieldAlert className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-indigo max-w-none text-navy-700 leading-8">
            {note.content.split('\n').map((paragraph, index) => (
              paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 sm:p-10">
        <h3 className="text-xl font-heading font-bold text-navy-900 mb-6 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </h3>

        {/* Comment List */}
        <div className="space-y-6 mb-8">
          {comments.length === 0 ? (
            <p className="text-navy-400 italic text-sm">No comments yet. Be the first to discuss!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 group">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                  {comment.profiles?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-grow">
                  <div className="bg-white/60 p-4 rounded-2xl rounded-tl-none shadow-sm border border-white/60 relative">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-navy-900">{comment.profiles?.username || 'User'}</span>
                      <span className="text-xs text-navy-400">
                        {comment.created_at && !isNaN(new Date(comment.created_at).getTime()) 
                          ? format(new Date(comment.created_at), 'MMM d, h:mm a') 
                          : ''}
                      </span>
                    </div>
                    <p className="text-navy-700 text-sm leading-relaxed">{comment.content}</p>
                    
                    {/* Delete Comment Button */}
                    {(isAdmin || (user && user.id === comment.user_id)) && (
                       <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="absolute -right-2 -top-2 p-1.5 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                        title="Delete comment"
                       >
                         <X className="h-3 w-3" />
                       </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handlePostComment} className="flex gap-4 items-start">
             <div className="flex-shrink-0 h-10 w-10 rounded-full bg-navy-800 flex items-center justify-center text-white font-bold text-sm">
                {user.email?.[0]?.toUpperCase() || 'Me'}
             </div>
             <div className="flex-grow relative">
               <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ask a question or share your thoughts..."
                  className="w-full rounded-2xl border-gray-200 bg-white shadow-inner focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 p-4 text-sm text-navy-800 pr-12 resize-none"
                  rows={2}
                  onKeyDown={(e) => {
                    if(e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handlePostComment(e);
                    }
                  }}
               />
               <button 
                type="submit" 
                disabled={commentLoading || !newComment.trim()}
                className="absolute right-2 bottom-2 p-2 bg-brand-600 text-white rounded-xl shadow-lg hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
               >
                 {commentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
               </button>
             </div>
          </form>
        ) : (
          <div className="text-center p-6 bg-brand-50 rounded-2xl border border-brand-100">
            <p className="text-brand-800 text-sm">
              <Link to="/login" className="font-bold underline">Log in</Link> to join the discussion.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteDetail;