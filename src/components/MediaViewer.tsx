import { X, Download, FileText, Music, Video, StickyNote } from 'lucide-react';
import { Button } from './ui/button';
import { MediaItem, incrementDownloadCount } from '@/hooks/useMedia';

interface MediaViewerProps {
  item: MediaItem;
  onClose: () => void;
}

const MediaViewer = ({ item, onClose }: MediaViewerProps) => {
  const handleDownload = async () => {
    if (item.file_url) {
      await incrementDownloadCount(item.id);
      window.open(item.file_url, '_blank');
    }
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'audio': return <Music className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'note': return <StickyNote className="h-4 w-4" />;
    }
  }

  const renderContent = () => {
    switch (item.type) {
      case 'audio':
        return (
          <div className="w-full max-w-xl">
            <div className="bg-card border border-border p-1">
              <div className="bg-black/5 p-8 flex flex-col items-center gap-8 relative overflow-hidden border-b border-border">
                {/* Audio Visualizer Placeholder */}
                <div className="flex items-end justify-center gap-1 h-32 w-full opacity-50">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 bg-primary animate-[pulse_1s_ease-in-out_infinite]"
                      style={{
                        height: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    />
                  ))}
                </div>

                <div className="w-24 h-24 flex items-center justify-center border-2 border-primary rounded-full relative z-10 bg-background/50 backdrop-blur-sm">
                  <Music className="h-10 w-10 text-primary" />
                </div>
              </div>

              <div className="p-4 bg-muted/10 font-mono text-xs">
                <audio controls className="w-full h-8" autoPlay>
                  <source src={item.file_url || ''} />
                  SYSTEM_AUDIO_DRIVER_ERROR
                </audio>
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="w-full max-w-4xl">
            <div className="bg-card border border-border p-1">
              <div className="relative border border-muted/20 bg-black">
                {/* Video Frame Decorations */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/20 pointer-events-none z-10" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/20 pointer-events-none z-10" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/20 pointer-events-none z-10" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/20 pointer-events-none z-10" />

                <video controls className="w-full bg-black aspect-video relative z-0" autoPlay>
                  <source src={item.file_url || ''} />
                  SYSTEM_VIDEO_DRIVER_ERROR
                </video>
              </div>
            </div>
          </div>
        );

      case 'document':
        return (
          <div className="w-full max-w-4xl h-[70vh] flex flex-col">
            <div className="bg-card border-x border-b border-border p-4 flex-1 flex flex-col items-center justify-center gap-4">
              {item.file_url?.endsWith('.pdf') ? (
                <iframe
                  src={item.file_url}
                  className="w-full h-full border border-border bg-background"
                />
              ) : (
                <div className="text-center p-12 border border-dashed border-border bg-accent/5">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="mb-6 font-mono text-sm text-muted-foreground">PREVIEW_UNAVAILABLE. DOWNLOAD_REQUIRED.</p>
                  <Button variant="outline" size="lg" onClick={handleDownload} className="rounded-none border-primary hover:bg-primary hover:text-primary-foreground font-mono uppercase">
                    <Download className="h-4 w-4 mr-2" />
                    Download_File
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 'note':
        return (
          <div className="w-full max-w-2xl max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="bg-card border-x border-b border-border p-8 prose prose-invert max-w-none font-mono text-sm">
              <div dangerouslySetInnerHTML={{ __html: item.content || '' }} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">

      <div className="relative w-full max-w-4xl flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="bg-primary/5 border border-primary/20 p-2 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2 px-2">
            <span className="text-primary">{getTypeIcon()}</span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
              DATA_VIEWER :: {item.title || 'UNKNOWN_FILE'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors border border-transparent hover:border-destructive/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Container */}
        <div className="relative flex justify-center">
          {renderContent()}
        </div>

        {/* Modal Footer Info */}
        <div className="bg-card border-x border-b border-border p-1 flex justify-between items-center text-[10px] font-mono text-muted-foreground px-4 py-2">
          <span>ID: {item.id.slice(0, 8)}...</span>
          <div className="flex gap-4">
            {item.file_size && <span>SIZE: {(item.file_size / 1024).toFixed(1)}KB</span>}
            {item.duration && <span>DUR: {item.duration}s</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaViewer;
