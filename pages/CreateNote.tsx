import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import { Save, Loader2, ArrowLeft, X } from 'lucide-react';

const CreateNote: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const { error } = await supabase.from('notes').insert([{ user_id: user.id, title, content, image_url: imageUrl, tags }]);
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to publish');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
       {/* Header Action Bar */}
       <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors text-navy-500">
             <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold text-navy-900">Create New Note</h1>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="px-6 py-2.5 bg-navy-900 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Post Note
          </button>
       </div>

       <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden min-h-[80vh]">
          {/* Cover Image Area */}
          <div className="p-8 pb-0">
             <div className="border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50 p-1">
                <ImageUpload currentImage={imageUrl} onUploadComplete={setImageUrl} onClear={() => setImageUrl(null)} />
             </div>
          </div>

          <div className="p-8 md:p-12 space-y-8">
             {/* Title */}
             <div className="space-y-2">
                <label className="text-xs font-bold text-navy-400 uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  placeholder="Enter note title..."
                  className="w-full text-4xl font-heading font-bold text-navy-900 placeholder:text-gray-300 border-none focus:ring-0 p-0 bg-transparent"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  autoFocus
                />
             </div>

             {/* Tags */}
             <div className="space-y-2">
                <label className="text-xs font-bold text-navy-400 uppercase tracking-wider"># Tags</label>
                <input
                  type="text"
                  placeholder="biology, week1, exam-prep..."
                  className="w-full bg-gray-50 rounded-xl border-none py-3 px-4 text-navy-700 placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500/20"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                />
             </div>

             {/* Content */}
             <div className="space-y-2">
                 <label className="text-xs font-bold text-navy-400 uppercase tracking-wider">Content</label>
                 <textarea
                    placeholder="Start typing your note here..."
                    className="w-full h-[50vh] resize-none border-none p-0 text-lg leading-relaxed text-navy-700 placeholder:text-gray-300 focus:ring-0"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                 />
             </div>
          </div>
       </div>
    </div>
  );
};

export default CreateNote;