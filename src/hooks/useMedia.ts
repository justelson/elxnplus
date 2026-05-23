import { useState, useEffect, useCallback } from 'react';
import { convex } from '@/integrations/convex/client';
import { api } from '../../convex/_generated/api';

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
      const data = await convex.query(api.media.list, type ? { type } : {});
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

export const uploadFile = async (_file?: File, _folder?: string): Promise<string | null> => {
  console.warn('Admin uploads are disabled until Convex admin auth is wired.');
  return null;
};

export const createMedia = async (_mediaData?: unknown): Promise<{ success: boolean; error?: string }> => {
  return {
    success: false,
    error: 'Admin uploads are disabled until Convex admin auth is wired.',
  };
};

export const updateMedia = async (_id?: string, _mediaData?: unknown): Promise<{ success: boolean; error?: string }> => {
  return {
    success: false,
    error: 'Admin edits are disabled until Convex admin auth is wired.',
  };
};

export const deleteMedia = async (_id?: string): Promise<{ success: boolean; error?: string }> => {
  return {
    success: false,
    error: 'Admin deletes are disabled until Convex admin auth is wired.',
  };
};

export const incrementViewCount = async (id: string): Promise<void> => {
  try {
    await convex.mutation(api.media.incrementViewCount, { id: id as never });
  } catch (err) {
    console.error('Error incrementing view count:', err);
  }
};

export const incrementDownloadCount = async (id: string): Promise<void> => {
  try {
    await convex.mutation(api.media.incrementDownloadCount, { id: id as never });
  } catch (err) {
    console.error('Error incrementing download count:', err);
  }
};

export const downloadMedia = async (id: string, fileUrl: string, fileName: string): Promise<void> => {
  try {
    await incrementDownloadCount(id);

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
    window.open(fileUrl, '_blank');
  }
};
