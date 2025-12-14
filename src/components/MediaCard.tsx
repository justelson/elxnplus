import { Music, Video, FileText, StickyNote, Download, Eye, Play } from 'lucide-react';
import { Button } from './ui/button';
import { MediaItem, incrementDownloadCount, incrementViewCount } from '@/hooks/useMedia';
import { useState } from 'react';
import MediaViewer from './MediaViewer';

interface MediaCardProps {
  item: MediaItem;
}

const MediaCard = ({ item }: MediaCardProps) => {
  const [showViewer, setShowViewer] = useState(false);

  const getIcon = () => {
    switch (item.type) {
      case 'audio':
        return <Music className="h-8 w-8" />;
      case 'video':
        return <Video className="h-8 w-8" />;
      case 'document':
        return <FileText className="h-8 w-8" />;
      case 'note':
        return <StickyNote className="h-8 w-8" />;
    }
  };

  const getGradient = () => {
    switch (item.type) {
      case 'audio':
        return 'from-primary/20 to-primary/5';
      case 'video':
        return 'from-accent/20 to-accent/5';
      case 'document':
        return 'from-blue-500/20 to-blue-500/5';
      case 'note':
        return 'from-yellow-500/20 to-yellow-500/5';
    }
  };

  const handleView = async () => {
    await incrementViewCount(item.id);
    setShowViewer(true);
  };

  const handleDownload = async () => {
    if (item.file_url) {
      await incrementDownloadCount(item.id);
      window.open(item.file_url, '_blank');
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return mb > 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="glass-card group overflow-hidden hover-glow animate-slide-up">
        <div className={`h-32 bg-gradient-to-br ${getGradient()} flex items-center justify-center relative overflow-hidden`}>
          {item.thumbnail_url ? (
            <img 
              src={item.thumbnail_url} 
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
            />
          ) : null}
          <div className="relative z-10 text-primary group-hover:scale-110 transition-transform">
            {getIcon()}
          </div>
          {(item.type === 'audio' || item.type === 'video') && (
            <button 
              onClick={handleView}
              className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Play className="h-12 w-12 text-primary" />
            </button>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-display font-semibold text-foreground truncate mb-1">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {item.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {item.view_count}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {item.download_count}
            </span>
            {item.file_size && (
              <span>{formatFileSize(item.file_size)}</span>
            )}
            {item.duration && (
              <span>{formatDuration(item.duration)}</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="glass" 
              size="sm" 
              className="flex-1"
              onClick={handleView}
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
            {item.file_url && (
              <Button 
                variant="glow" 
                size="sm" 
                className="flex-1"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        </div>
      </div>

      {showViewer && (
        <MediaViewer item={item} onClose={() => setShowViewer(false)} />
      )}
    </>
  );
};

export default MediaCard;
