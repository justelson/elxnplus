import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type MediaType = 'audio' | 'video' | 'document' | 'note';

export interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  type: MediaType;
  file_url: string | null;
  thumbnail_url: string | null;
  content: string | null;
  file_size: number | null;
  duration: number | null;
  download_count: number;
  view_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const useMedia = (type?: MediaType) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let query = supabase.from('media').select('*').order('created_at', { ascending: false });
      
      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMedia(data as MediaItem[] || []);
    } catch (err) {
      console.error('Error fetching media:', err);
      setError('Failed to load media');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return { media, loading, error, refetch: fetchMedia };
};

export const uploadFile = async (file: File, folder: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('media').getPublicUrl(fileName);
    return data.publicUrl;
  } catch (err) {
    console.error('Upload error:', err);
    return null;
  }
};

export const createMedia = async (mediaData: Omit<Partial<MediaItem>, 'id' | 'created_at' | 'updated_at'> & { title: string; type: MediaType }): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.from('media').insert([mediaData]);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Create media error:', err);
    return { success: false, error: 'Failed to create media' };
  }
};

export const updateMedia = async (id: string, mediaData: Partial<MediaItem>): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.from('media').update(mediaData).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Update media error:', err);
    return { success: false, error: 'Failed to update media' };
  }
};

export const deleteMedia = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Delete media error:', err);
    return { success: false, error: 'Failed to delete media' };
  }
};

export const incrementViewCount = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('increment_media_view', { media_id: id });
    if (error) throw error;
  } catch (err) {
    console.error('Error incrementing view count:', err);
  }
};

export const incrementDownloadCount = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('increment_media_download', { media_id: id });
    if (error) throw error;
  } catch (err) {
    console.error('Error incrementing download count:', err);
  }
};

export const downloadMedia = async (id: string, fileUrl: string, fileName: string): Promise<void> => {
  try {
    // 1. Increment count
    await incrementDownloadCount(id);

    // 2. Direct download
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error downloading media:', err);
    // Fallback to opening in new tab if blob download fails
    window.open(fileUrl, '_blank');
  }
};
