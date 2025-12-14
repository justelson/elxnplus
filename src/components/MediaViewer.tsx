import { X, Download } from 'lucide-react';
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

  const renderContent = () => {
    switch (item.type) {
      case 'audio':
        return (
          <div className="w-full max-w-xl p-8">
            <div className="glass-card p-8">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center animate-pulse-glow">
                <div className="w-16 h-16 rounded-full bg-primary/50" />
              </div>
              <h2 className="text-2xl font-display font-bold text-center mb-4">{item.title}</h2>
              <audio controls className="w-full" autoPlay>
                <source src={item.file_url || ''} />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="w-full max-w-4xl p-4">
            <video controls className="w-full rounded-xl" autoPlay>
              <source src={item.file_url || ''} />
              Your browser does not support the video element.
            </video>
          </div>
        );
      
      case 'document':
        return (
          <div className="w-full max-w-4xl p-4">
            <div className="glass-card p-8 text-center">
              <h2 className="text-2xl font-display font-bold mb-4">{item.title}</h2>
              {item.description && (
                <p className="text-muted-foreground mb-6">{item.description}</p>
              )}
              {item.file_url?.endsWith('.pdf') ? (
                <iframe 
                  src={item.file_url} 
                  className="w-full h-[60vh] rounded-lg border border-border"
                />
              ) : (
                <Button variant="glow" size="lg" onClick={handleDownload}>
                  <Download className="h-5 w-5" />
                  Download Document
                </Button>
              )}
            </div>
          </div>
        );
      
      case 'note':
        return (
          <div className="w-full max-w-3xl p-4 max-h-[80vh] overflow-auto">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-display font-bold mb-6">{item.title}</h2>
              {item.description && (
                <p className="text-muted-foreground mb-6 italic">{item.description}</p>
              )}
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: item.content || '' }}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center animate-fade-in">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>
      
      {renderContent()}
    </div>
  );
};

export default MediaViewer;
