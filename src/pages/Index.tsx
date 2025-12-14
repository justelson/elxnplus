import { Music, Video, FileText, StickyNote, Lock, Cpu, Activity, Battery, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useMedia, MediaType } from '@/hooks/useMedia';
import MediaCard from '@/components/MediaCard';
import { useState, useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<MediaType | 'all'>('all');
  const { media, loading } = useMedia();
  const [systemTime, setSystemTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredMedia = activeFilter === 'all'
    ? media
    : media.filter(item => item.type === activeFilter);

  const filters: { type: MediaType | 'all'; label: string }[] = [
    { type: 'all', label: 'ALL_DATA' },
    { type: 'audio', label: 'AUDIO_LOGS' },
    { type: 'video', label: 'VISUAL_FEEDS' },
    { type: 'document', label: 'DOCUMENTS' },
    { type: 'note', label: 'TEXT_FILES' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-primary selection:text-primary-foreground">
      {/* System HUD Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary">
              <Cpu className="h-5 w-5" />
              <span className="font-display font-bold text-xl tracking-widest hidden sm:inline">ELXN.PLUS</span>
              <span className="font-display font-bold text-xl tracking-widest sm:hidden">ELXN+</span>
            </div>
            <div className="hidden md:flex h-6 w-px bg-border mx-2" />
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="animate-pulse flex items-center gap-1"><Activity className="h-3 w-3" /> SYS.ONLINE</span>
              <span>::</span>
              <span>v2.0.4</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end text-[10px] leading-tight text-muted-foreground">
              <span>{systemTime.toLocaleTimeString()}</span>
              <span>{systemTime.toLocaleDateString()}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="rounded-none border-primary hover:bg-primary hover:text-primary-foreground uppercase text-xs tracking-wider"
            >
              <Lock className="h-3 w-3 mr-2" />
              Admin_Access
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="border-b border-border bg-muted/20">
          <div className="container mx-auto px-4 py-1 flex justify-between items-center text-[10px] uppercase text-muted-foreground tracking-widest">
            <div className="flex gap-4">
              <span className="flex items-center gap-1"><Wifi className="h-3 w-3" /> NET_OK</span>
              <span className="flex items-center gap-1"><Battery className="h-3 w-3" /> PWR_STABLE</span>
            </div>
            <div className="flex gap-4">
              <span>MEM_USAGE: 42%</span>
              <span>SEC_LEVEL: ALPHA</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Interface */}
      <main className="container mx-auto px-4 py-8">
        {/* Control Panel (Filters) */}
        <div className="mb-8 border border-border p-1 bg-card">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
            {filters.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`py-2 px-4 text-xs font-bold font-mono uppercase tracking-wider transition-all
                  ${activeFilter === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-accent hover:text-accent-foreground text-muted-foreground'}
                `}
              >
                [{label}]
              </button>
            ))}
          </div>
        </div>

        {/* Data Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-2 text-primary">
              <Cpu className="h-8 w-8 animate-spin" />
              <span className="text-xs font-mono animate-pulse">LOADING_DATA_STREAMS...</span>
            </div>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="border border-dashed border-border p-20 text-center">
            <h3 className="text-xl font-display font-medium mb-2 uppercase">No Data Found</h3>
            <p className="text-muted-foreground text-xs font-mono">System cache is empty. Awaiting input.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedia.map((item, index) => (
              <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <MediaCard item={item} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
