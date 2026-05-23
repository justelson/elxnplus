import { Music, Video, FileText, StickyNote, Eye, Download, TrendingUp, Plus } from 'lucide-react';
import { useMedia, incrementViewCount, MediaItem } from '@/hooks/useMedia';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
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
    { label: 'Audio Logs', value: stats.audio, icon: Music, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: 'Video Feeds', value: stats.video, icon: Video, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { label: 'Documents', value: stats.documents, icon: FileText, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { label: 'Personal Notes', value: stats.notes, icon: StickyNote, color: "text-tangerine-500", bg: "bg-orange-400/10", border: "border-orange-400/20" },
  ];

  const recentMedia = media.slice(0, 5);

  return (
    <div className="space-y-6 md:space-y-10 max-w-7xl mx-auto animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight uppercase">System Overview</h1>
          <p className="text-muted-foreground mt-1">Status and analytics for Elson's Digital Vault.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Button 
            key={stat.label}
            variant="outline" 
            asChild
            className="h-auto py-4 flex flex-col gap-2 rounded-lg border-white/5 bg-background/40 hover:bg-primary/5 hover:border-primary/30 transition-all group"
          >
            <Link to={`/admin/upload/${stat.label.toLowerCase().includes('audio') ? 'audio' : stat.label.toLowerCase().includes('video') ? 'video' : stat.label.toLowerCase().includes('document') ? 'document' : 'note'}`}>
              <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Add {stat.label.split(' ')[0]}</span>
            </Link>
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {[1,2,3,4].map(i => <div key={i} className="h-32 rounded-lg bg-muted/20 animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-lg border ${stat.border} ${stat.bg} backdrop-blur-sm relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-md bg-background/50 border border-white/5 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/70">{stat.label}</span>
                </div>
                <div className="relative z-10">
                  <p className="text-4xl font-display font-black">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
             <div className="p-6 md:p-8 rounded-lg border border-border bg-card/40 backdrop-blur-sm shadow-sm">
                <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-3">Cumulative Reach</h3>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-display font-black text-foreground">{stats.totalViews}</p>
                  <span className="text-sm font-medium text-muted-foreground">Total Views</span>
                </div>
             </div>
             <div className="p-6 md:p-8 rounded-lg border border-border bg-card/40 backdrop-blur-sm shadow-sm">
                <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-3">Storage Efficiency</h3>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-display font-black text-foreground">{stats.totalDownloads}</p>
                  <span className="text-sm font-medium text-muted-foreground">Total Downloads</span>
                </div>
             </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border border-border bg-card/30 backdrop-blur-md overflow-hidden shadow-md">
            <div className="p-6 border-b border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold uppercase tracking-tight">Recent Archives</h2>
              </div>
              <Link to="/admin/audio" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            
            {recentMedia.length === 0 ? (
              <div className="p-16 text-center text-muted-foreground">
                <p className="font-light italic">The archives are currently empty.</p>
                <Button variant="link" asChild className="mt-2 text-primary">
                  <Link to="/admin/upload">Upload your first artifact</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {recentMedia.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenItem(item)}
                    className="p-4 md:p-5 flex items-center gap-4 hover:bg-primary/5 transition-colors group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-md bg-background/50 border border-border/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {item.type === 'audio' && <Music className="h-5 w-5 text-orange-400" />}
                      {item.type === 'video' && <Video className="h-5 w-5 text-rose-400" />}
                      {item.type === 'document' && <FileText className="h-5 w-5 text-yellow-400" />}
                      {item.type === 'note' && <StickyNote className="h-5 w-5 text-tangerine-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-sm md:text-base">{item.title}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground font-mono uppercase tracking-widest mt-0.5">
                        {new Date(item.created_at).toLocaleDateString()} • {(item.file_size ? (item.file_size / 1024 / 1024).toFixed(1) + ' MB' : '0 MB')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] md:text-xs text-muted-foreground font-mono tabular-nums">
                      <span className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-lg border border-white/5">
                        <Eye className="h-3.5 w-3.5" />
                        {item.view_count}
                      </span>
                      <span className="hidden sm:flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-lg border border-white/5">
                        <Download className="h-3.5 w-3.5" />
                        {item.download_count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {selectedItem && (
        <MediaViewer 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
