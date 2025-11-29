import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  onClear: () => void;
  currentImage: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadComplete, onClear, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('note-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('note-images')
        .getPublicUrl(filePath);

      onUploadComplete(data.publicUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      {currentImage ? (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm group h-64 bg-gray-100">
          <img
            src={currentImage}
            alt="Note attachment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button
              type="button"
              onClick={onClear}
              className="px-4 py-2 bg-white rounded-full text-red-600 font-medium shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Remove Image
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-brand-50 hover:border-brand-300 transition-all duration-300 group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <Loader2 className="h-10 w-10 text-brand-500 animate-spin mb-3" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ImageIcon className="h-6 w-6 text-brand-500" />
              </div>
            )}
            <p className="mb-1 text-sm text-navy-600 font-medium">
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-navy-400">PNG, JPG or GIF (MAX. 5MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}
      {error && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><X className="h-3 w-3"/> {error}</p>}
    </div>
  );
};

export default ImageUpload;