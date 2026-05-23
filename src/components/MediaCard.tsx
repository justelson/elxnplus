import { Music, Video, FileText, StickyNote, Download, Eye, Play, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { MediaItem, incrementDownloadCount, incrementViewCount, downloadMedia } from '@/hooks/useMedia';
import { useState } from 'react';
import MediaViewer from './MediaViewer';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MediaCardProps {
  item: MediaItem;
}

const MediaCard = ({ item }: MediaCardProps) => {
  const [showViewer, setShowViewer] = useState(false);

  const getTheme = () => {
    switch (item.type) {
      case 'audio':
        return {
          icon: <Music className="h-5 w-5 text-orange-400" />,
          gradient: "from-orange-500/20 to-amber-500/5",
          border: "group-hover:border-orange-500/30",
          glow: "group-hover:shadow-orange-500/10"
        };
      case 'video':
        return {
          icon: <Video className="h-5 w-5 text-rose-400" />,
          gradient: "from-rose-500/20 to-orange-500/5",
          border: "group-hover:border-rose-500/30",
          glow: "group-hover:shadow-rose-500/10"
        };
      case 'document':
        return {
          icon: <FileText className="h-5 w-5 text-yellow-400" />,
          gradient: "from-yellow-500/20 to-orange-500/5",
          border: "group-hover:border-yellow-500/30",
          glow: "group-hover:shadow-yellow-500/10"
        };
      case 'note':
        return {
          icon: <StickyNote className="h-5 w-5 text-tangerine-400" />,
          gradient: "from-orange-400/20 to-yellow-500/5",
          border: "group-hover:border-orange-400/30",
          glow: "group-hover:shadow-orange-400/10"
        };
      default:
        return {
          icon: <FileText className="h-5 w-5 text-primary" />,
          gradient: "from-primary/20 to-primary/5",
          border: "group-hover:border-primary/30",
          glow: "group-hover:shadow-primary/10"
        };
    }
  };

  const theme = getTheme();

  const handleView = async () => {
    await incrementViewCount(item.id);
    setShowViewer(true);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.file_url) {
      await downloadMedia(item.id, item.file_url, item.title);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '0 KB';
    const mb = bytes / (1024 * 1024);
    return mb > 1 ? `${mb.toFixed(1)}MB` : `${(bytes / 1024).toFixed(0)}KB`;
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "group relative overflow-hidden rounded-sm border border-white/5 bg-card/40 backdrop-blur-md shadow-sm transition-all duration-300 h-[280px] flex flex-col cursor-pointer",
          "bg-gradient-to-br", theme.gradient, theme.border, theme.glow
        )}
        onClick={handleView}
      >
        <div className="p-6 flex flex-col h-full relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-sm bg-white/5 border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors">
              {theme.icon}
            </div>
            <div className="flex items-center gap-2">
               {item.file_url && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-white/10 hover:text-primary transition-colors"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60 bg-white/5 px-2 py-1 rounded-sm border border-white/5">
                {item.type}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="font-display font-bold text-xl leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-sm text-muted-foreground/70 line-clamp-3 leading-relaxed font-light">
                {item.description}
              </p>
            )}
          </div>

          {/* Footer Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto text-[11px] font-mono text-muted-foreground/60">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span>{item.view_count || 0}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5" />
                <span>{item.download_count || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="opacity-70">{formatFileSize(item.file_size)}</span>
              <div className="h-1 w-1 rounded-full bg-white/20"></div>
              <motion.div 
                whileHover={{ x: 3 }}
                className="text-primary flex items-center gap-1 font-bold cursor-pointer"
              >
                VIEW <ArrowRight className="h-3 w-3" />
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </motion.div>

      {showViewer && (
        <MediaViewer item={item} onClose={() => setShowViewer(false)} />
      )}
    </>
  );
};

export default MediaCard;
