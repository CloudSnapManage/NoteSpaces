
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Note } from '../types';
import NoteCard from '../components/NoteCard';
import { Loader2, Search, Sparkles, BookOpen, Users, Globe, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      setError(null);
      // Fetch notes with Author profile, Likes count, and Comments count
      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          profiles (username, avatar_url),
          likes (count),
          comments (count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      console.error('Error fetching notes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = note.title.toLowerCase().includes(searchLower);
    const contentMatch = note.content.toLowerCase().includes(searchLower);
    const tagMatch = note.tags?.some(tag => tag.toLowerCase().includes(searchLower));
    return titleMatch || contentMatch || tagMatch;
  });

  if (authLoading) return <div className="h-96" />;

  // --- LANDING PAGE (Public) ---
  if (!user) {
    return (
      <div className="bg-[#F5F6FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-100 text-brand-600 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm animate-fade-in">
              <Sparkles className="h-3 w-3" />
              #1 Note Sharing Platform
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-heading font-bold text-navy-900 mb-8 leading-[1.1] animate-fade-in" style={{animationDelay: '100ms'}}>
              Share knowledge. <br />
              <span className="text-brand-500">Study together.</span>
            </h1>
            
            <p className="text-xl text-navy-500 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '200ms'}}>
              Access thousands of high-quality college notes, summaries, and cheat sheets shared by top students from around the world.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{animationDelay: '300ms'}}>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-600 text-white text-lg font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 hover:shadow-brand-500/40 flex items-center justify-center gap-2"
              >
                Join for Free <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-fade-in" style={{animationDelay: '500ms'}}>
             {[
               { icon: BookOpen, title: 'Open Library', desc: 'Unlimited access to notes from every major.' },
               { icon: Users, title: 'Student Community', desc: 'Connect with peers in your field of study.' },
               { icon: Globe, title: 'Accessible Anywhere', desc: 'Study on the go with our mobile-first design.' }
             ].map((f, i) => (
               <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                 <div className="h-14 w-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mx-auto mb-6">
                   <f.icon className="h-7 w-7" />
                 </div>
                 <h3 className="text-xl font-bold text-navy-900 mb-3">{f.title}</h3>
                 <p className="text-navy-500 leading-relaxed">{f.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD (Logged In) ---
  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-heading font-bold text-navy-900 mb-2">Discovery Feed</h1>
        <p className="text-navy-500 text-lg">Explore {notes.length} notes from the community.</p>
      </div>

      {/* Search Bar */}
      <div className="mb-10">
        <div className="relative max-w-3xl">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search topics, tags, or titles..."
            className="pl-12 block w-full rounded-2xl border-none bg-white py-4 pr-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] ring-1 ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 text-brand-500 animate-spin" />
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-gray-200">
           <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <Search className="h-8 w-8 text-gray-300" />
           </div>
           <h3 className="text-lg font-bold text-navy-900">No notes found</h3>
           <p className="text-navy-500 mt-2">Try searching for something else.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div key={note.id}>
              <NoteCard note={note} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
