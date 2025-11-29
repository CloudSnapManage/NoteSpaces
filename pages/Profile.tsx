
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Note, Profile as ProfileType } from '../types';
import NoteCard from '../components/NoteCard';
import { Loader2, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    if (user) fetchProfileAndNotes();
  }, [user]);

  const fetchProfileAndNotes = async () => {
    try {
      if (!user) return;
      
      // Fetch Profile
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(profileData);

      // Fetch Notes with Likes count
      const { data: notesData } = await supabase
        .from('notes')
        .select(`*, likes(count), comments(count)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      const fetchedNotes = notesData || [];
      setNotes(fetchedNotes);

      // Calculate Total Likes
      const likesSum = fetchedNotes.reduce((acc, note) => {
        const count = note.likes?.[0]?.count || 0;
        return acc + count;
      }, 0);
      setTotalLikes(likesSum);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-500" /></div>;

  const username = profile?.username || 'Student';
  const joinDate = user?.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : '2025';

  return (
    <div className="animate-fade-in -mt-4 lg:-mt-8">
      {/* Banner */}
      <div className="h-64 w-full bg-gradient-to-r from-brand-600 to-[#7B2CBF] rounded-b-[3rem] shadow-lg mb-20 relative">
        {/* Profile Card Overlay */}
        <div className="absolute -bottom-16 left-8 sm:left-12 flex items-end">
           <div className="h-32 w-32 sm:h-40 sm:w-40 bg-white p-1.5 rounded-[2rem] shadow-xl">
              <div className="h-full w-full bg-navy-900 rounded-[1.7rem] flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                   <img src={profile.avatar_url} className="h-full w-full object-cover" alt="Profile" />
                ) : (
                   <span className="text-6xl font-heading font-bold text-white">{username[0].toUpperCase()}</span>
                )}
              </div>
           </div>
        </div>
        
        {/* Stats Card Overlay (Right Side) */}
        <div className="hidden sm:flex absolute -bottom-10 right-12 bg-white rounded-2xl shadow-xl p-6 items-center gap-8 border border-gray-100">
           <div className="text-center">
              <div className="text-2xl font-bold text-navy-900">{notes.length}</div>
              <div className="text-xs font-bold text-navy-400 uppercase tracking-wider">Notes</div>
           </div>
           <div className="w-px h-8 bg-gray-100"></div>
           <div className="text-center">
              <div className="text-2xl font-bold text-navy-900">0</div>
              <div className="text-xs font-bold text-navy-400 uppercase tracking-wider">Followers</div>
           </div>
           <div className="w-px h-8 bg-gray-100"></div>
           <div className="text-center">
              <div className="text-2xl font-bold text-navy-900">{totalLikes}</div>
              <div className="text-xs font-bold text-navy-400 uppercase tracking-wider">Likes</div>
           </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 mb-12">
         <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-navy-900">{username}</h1>
            <p className="text-navy-500 text-lg">Computer Science Student</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-navy-400">
               <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Stanford University</span>
               <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Joined {joinDate}</span>
            </div>
         </div>

         <div className="flex items-center gap-3 mb-6">
           <div className="h-8 w-1 bg-accent rounded-full"></div>
           <h2 className="text-xl font-heading font-bold text-navy-900">My Notes</h2>
         </div>

         {notes.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-3xl border border-gray-100">
              <p className="text-navy-400">No notes yet.</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {notes.map(note => <NoteCard key={note.id} note={note} />)}
            </div>
         )}
      </div>
    </div>
  );
};

export default Profile;
