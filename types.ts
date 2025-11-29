
export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  updated_at?: string;
  is_admin?: boolean;
}

export interface Comment {
  id: string;
  user_id: string;
  note_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  image_url?: string;
  tags: string[];
  created_at: string;
  profiles?: Profile; // Joined data
  likes?: { count: number }[]; // For counting likes
  comments?: { count: number }[]; // For counting comments
}

export interface AuthState {
  user: any | null; // using any for Supabase user object wrapper simplicity
  session: any | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
}
