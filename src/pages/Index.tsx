import { Music, Video, FileText, StickyNote, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useMedia, MediaType } from '@/hooks/useMedia';
import MediaCard from '@/components/MediaCard';
import { useState } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<MediaType | 'all'>('all');
  const { media, loading } = useMedia();

  const filteredMedia = activeFilter === 'all' 
    ? media 
    : media.filter(item => item.type === activeFilter);

  const filters: { type: MediaType | 'all'; icon: typeof Music; label: string }[] = [
    { type: 'all', icon: Sparkles, label: 'All' },
    { type: 'audio', icon: Music, label: 'Audio' },
    { type: 'video', icon: Video, label: 'Video' },
    { type: 'document', icon: FileText, label: 'Documents' },
    { type: 'note', icon: StickyNote, label: 'Notes' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[150px]" />
        
        <nav className="relative z-10 container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-display font-bold gradient-text">ElsonDev Media</h1>
          <Button 
            variant="glass" 
            onClick={() => navigate('/login')}
            className="gap-2"
          >
            <Lock className="h-4 w-4" />
            Admin
          </Button>
        </nav>

        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up">
            <span className="glow-text">Media</span> Hub
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Explore audio, videos, documents, and notes. Download and enjoy high-quality content.
          </p>
        </div>
      </header>

      {/* Filter Tabs */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {filters.map(({ type, icon: Icon, label }) => (
            <Button
              key={type}
              variant={activeFilter === type ? 'glow' : 'glass'}
              size="lg"
              onClick={() => setActiveFilter(type)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-2">No Media Yet</h3>
            <p className="text-muted-foreground">Content will appear here once uploaded.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item, index) => (
              <div key={item.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <MediaCard item={item} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 ElsonDev Media Hub. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with passion
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
