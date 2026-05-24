import { Music, Video, FileText, StickyNote, Eye, Download, TrendingUp, Plus, Library } from 'lucide-react';
import { useMedia, incrementViewCount, MediaItem } from '@/hooks/useMedia';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import MediaViewer from '@/components/MediaViewer';

const Dashboard = () => {
  const { media, loading } = useMedia(undefined, 'all');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const handleOpenItem = async (item: MediaItem) => {
    await incrementViewCount(item.id);
    setSelectedItem(item);
  };

  const stats = {
    audio: media.filter(m => m.type === 'audio').length,
    video: media.filter(m => m.type === 'video').length,
    documents: media.filter(m => m.type === 'document').length,
    notes: media.filter(m => m.type === 'note').length,
    totalViews: media.reduce((acc, m) => acc + m.view_count, 0),
    totalDownloads: media.reduce((acc, m) => acc + m.download_count, 0),
  };

  const statCards = [
    { label: 'Audio Logs', value: stats.audio, icon: Music, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', uploadPath: '/admin/upload/audio' },
    { label: 'Video Feeds', value: stats.video, icon: Video, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', uploadPath: '/admin/upload/video' },
    { label: 'Documents', value: stats.documents, icon: FileText, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', uploadPath: '/admin/upload/document' },
    { label: 'Personal Notes', value: stats.notes, icon: StickyNote, color: 'text-tangerine-500', bg: 'bg-orange-400/10', border: 'border-orange-400/20', uploadPath: '/admin/upload/note' },
  ];

  const recentMedia = media.slice(0, 6);

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto animate-fade-in pb-10">
      <div className="rounded-none border border-border bg-card/40 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-mono text-primary uppercase tracking-[0.24em] mb-3">Admin Home</p>
            <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase">Home</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Quick status for the vault, recent stored items, and explicit upload actions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="outline" className="rounded-none h-11 px-5 font-bold uppercase tracking-widest text-xs">
              <Link to="/admin/everything">
                <Library className="mr-2 h-4 w-4" /> View Everything
              </Link>
            </Button>
            <Button asChild className="rounded-none h-11 px-5 font-bold uppercase tracking-widest text-xs">
              <Link to="/admin/upload">
                <Plus className="mr-2 h-4 w-4" /> Upload Item
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 rounded-none bg-muted/20 animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className={`p-5 rounded-none border ${stat.border} ${stat.bg} backdrop-blur-sm relative overflow-hidden`}
              >
                <div className="flex justify-between items-start mb-5">
                  <div className={`p-2.5 rounded-none bg-background/50 border border-white/5 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/70">{stat.label}</span>
                </div>
                <p className="text-4xl font-display font-black">{stat.value}</p>
                <Button asChild variant="link" className="mt-3 h-auto p-0 text-xs font-bold uppercase tracking-widest text-primary">
                  <Link to={stat.uploadPath}>Upload {stat.label}</Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="p-6 rounded-none border border-border bg-card/40 backdrop-blur-sm shadow-sm">
              <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-3">Stored Items</h3>
              <p className="text-5xl font-display font-black text-foreground">{media.length}</p>
            </div>
            <div className="p-6 rounded-none border border-border bg-card/40 backdrop-blur-sm shadow-sm">
              <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-3">Total Views</h3>
              <p className="text-5xl font-display font-black text-foreground">{stats.totalViews}</p>
            </div>
            <div className="p-6 rounded-none border border-border bg-card/40 backdrop-blur-sm shadow-sm">
              <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-3">Total Downloads</h3>
              <p className="text-5xl font-display font-black text-foreground">{stats.totalDownloads}</p>
            </div>
          </div>

          <div className="rounded-none border border-border bg-card/30 backdrop-blur-md overflow-hidden shadow-md">
            <div className="p-6 border-b border-border/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold uppercase tracking-tight">Recently Stored</h2>
              </div>
              <Link to="/admin/everything" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>

            {recentMedia.length === 0 ? (
              <div className="p-16 text-center text-muted-foreground">
                <p className="font-light italic">No stored items yet.</p>
                <Button variant="link" asChild className="mt-2 text-primary">
                  <Link to="/admin/upload">Upload your first item</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {recentMedia.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleOpenItem(item)}
                    className="w-full text-left p-4 md:p-5 flex items-center gap-4 hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-none bg-background/50 border border-border/50 flex items-center justify-center shrink-0">
                      {item.type === 'audio' && <Music className="h-5 w-5 text-orange-400" />}
                      {item.type === 'video' && <Video className="h-5 w-5 text-rose-400" />}
                      {item.type === 'document' && <FileText className="h-5 w-5 text-yellow-400" />}
                      {item.type === 'note' && <StickyNote className="h-5 w-5 text-tangerine-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-sm md:text-base">{item.title}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground font-mono uppercase tracking-widest mt-0.5">
                        {item.type} • {new Date(item.created_at).toLocaleDateString()} • {(item.file_size ? (item.file_size / 1024 / 1024).toFixed(1) + ' MB' : '0 MB')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] md:text-xs text-muted-foreground font-mono tabular-nums">
                      <span className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-none border border-white/5">
                        <Eye className="h-3.5 w-3.5" />
                        {item.view_count}
                      </span>
                      <span className="hidden sm:flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-none border border-white/5">
                        <Download className="h-3.5 w-3.5" />
                        {item.download_count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {selectedItem && (
        <MediaViewer item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default Dashboard;
