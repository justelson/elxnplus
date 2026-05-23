import { X, Download, FileText, Music, Video, StickyNote, Calendar, Database } from 'lucide-react';
import { Button } from './ui/button';
import { MediaItem, incrementDownloadCount, downloadMedia } from '@/hooks/useMedia';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';

interface MediaViewerProps {
  item: MediaItem;
  onClose: () => void;
}

const MediaViewer = ({ item, onClose }: MediaViewerProps) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.file_url) {
      await downloadMedia(item.id, item.file_url, item.title);
    }
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'audio': return <Music className="h-5 w-5 text-orange-400" />;
      case 'video': return <Video className="h-5 w-5 text-rose-400" />;
      case 'document': return <FileText className="h-5 w-5 text-yellow-400" />;
      case 'note': return <StickyNote className="h-5 w-5 text-orange-500" />;
    }
  }

  const renderContent = () => {
    if (!item.file_url && item.type !== 'note') return null;

    switch (item.type) {
      case 'audio':
        return (
          <div className="w-full max-w-md mx-auto space-y-8 px-4">
            <div className="aspect-square bg-gradient-to-br from-orange-500/20 to-amber-500/10 rounded-sm flex items-center justify-center border border-white/10 shadow-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-noise opacity-20" />
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-glow">
                <Music className="h-10 w-10 md:h-12 md:w-12 text-primary" />
              </div>
            </div>
            <audio controls className="w-full shadow-lg rounded-full" autoPlay>
              <source src={item.file_url!} />
              Your browser does not support the audio element.
            </audio>
          </div>
        );

      case 'video':
        return (
          <div className="w-full max-w-5xl mx-auto rounded-sm md:rounded-sm overflow-hidden shadow-md border border-white/10 bg-black">
            <video controls className="w-full aspect-video" autoPlay>
              <source src={item.file_url!} />
              Your browser does not support the video element.
            </video>
          </div>
        );

      case 'document':
        return (
          <div className="w-full h-[70vh] md:h-[80vh] bg-white rounded-sm overflow-hidden shadow-md">
            {item.file_url!.endsWith('.pdf') ? (
              <iframe
                src={item.file_url!}
                className="w-full h-full"
                title="Document Viewer"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-900 p-8">
                <FileText className="h-16 w-16 mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Preview unavailable</p>
                <Button onClick={handleDownload} className="rounded-sm">
                  Download to View
                </Button>
              </div>
            )}
          </div>
        );

      case 'note':
        return (
          <div className="w-full max-w-3xl mx-auto bg-card border border-white/10 p-5 md:p-10 rounded-sm md:rounded-sm shadow-md max-h-[75vh] md:max-h-[80vh] overflow-y-auto">
            <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-headings:font-display prose-headings:font-bold prose-p:font-light prose-p:leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content || '') }} />
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-2xl p-4 md:p-8"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          className="relative w-full h-full flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-9 w-9 md:h-10 md:w-10 border-white/10 hover:bg-white/10 shrink-0"
                onClick={onClose}
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <div className="min-w-0">
                <h2 className="text-base md:text-xl font-display font-bold leading-none flex items-center gap-2 truncate">
                  <span className="shrink-0">{getTypeIcon()}</span>
                  <span className="truncate">{item.title}</span>
                </h2>
                <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-muted-foreground mt-1.5 md:mt-2 font-mono uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  {item.file_size && item.type !== 'note' && (
                    <>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="flex items-center gap-1">
                        <Database className="h-3 w-3" />
                        {(item.file_size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {item.file_url && (
              <Button onClick={handleDownload} className="rounded-sm gap-2 shadow-sm shrink-0">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            {renderContent()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MediaViewer;
