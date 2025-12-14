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
        return <Music className="h-6 w-6" />;
      case 'video':
        return <Video className="h-6 w-6" />;
      case 'document':
        return <FileText className="h-6 w-6" />;
      case 'note':
        return <StickyNote className="h-6 w-6" />;
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
    if (!bytes) return '0 KB';
    const mb = bytes / (1024 * 1024);
    return mb > 1 ? `${mb.toFixed(1)}MB` : `${(bytes / 1024).toFixed(0)}KB`;
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="group relative border border-border bg-card hover:bg-accent/5 transition-colors duration-200">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="p-4 flex flex-col h-full rounded-none">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 border border-border bg-background">
              {getIcon()}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-border px-1">
              {item.type}
            </div>
          </div>

          <div className="flex-1 min-w-0 mb-4">
            <h3 className="font-display font-bold text-lg leading-tight truncate uppercase tracking-tight mb-1">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-xs font-mono text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-px bg-border border border-border text-[10px] font-mono text-muted-foreground mb-4">
            <div className="bg-card p-1 flex items-center justify-between">
              <span>VIEWS</span>
              <span className="text-foreground">{item.view_count}</span>
            </div>
            <div className="bg-card p-1 flex items-center justify-between">
              <span>DL</span>
              <span className="text-foreground">{item.download_count}</span>
            </div>
            <div className="bg-card p-1 col-span-2 flex items-center justify-between">
              <span>SIZE</span>
              <span className="text-foreground">{formatFileSize(item.file_size)}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-none border-primary hover:bg-primary hover:text-primary-foreground font-mono text-xs uppercase tracking-widest"
              onClick={handleView}
            >
              Access
            </Button>
            {item.file_url && (
              <Button
                variant="outline"
                size="icon"
                className="rounded-none border-border hover:border-primary"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
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
