import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Download, Eye, FileText, Globe2, Library, Lock, Music, Plus, Search, StickyNote, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MediaViewer from '@/components/MediaViewer';
import { MediaItem, useMedia, VisibilityFilter, incrementViewCount } from '@/hooks/useMedia';
import { cn } from '@/lib/utils';

const getIcon = (item: MediaItem, className = 'h-5 w-5') => {
  switch (item.type) {
    case 'audio':
      return <Music className={cn(className, 'text-orange-400')} />;
    case 'video':
      return <Video className={cn(className, 'text-rose-400')} />;
    case 'document':
      return <FileText className={cn(className, 'text-yellow-400')} />;
    case 'note':
      return <StickyNote className={cn(className, 'text-orange-500')} />;
  }
};

const Everything = () => {
  const [visibility, setVisibility] = useState<VisibilityFilter>('all');
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const { media, loading } = useMedia(undefined, visibility);

  const filteredMedia = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return media;
    return media.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      (item.description || '').toLowerCase().includes(q)
    );
  }, [media, query]);

  const handleOpenItem = async (item: MediaItem) => {
    await incrementViewCount(item.id);
    setSelectedItem(item);
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto animate-fade-in pb-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <p className="text-xs font-mono text-primary uppercase tracking-[0.24em] mb-3">Full Storage</p>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight flex items-center gap-3 uppercase">
            <div className="p-2.5 rounded-none bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5">
              <Library className="h-6 w-6 text-primary" />
            </div>
            Everything
          </h1>
          <p className="text-muted-foreground mt-2 text-sm font-medium opacity-80">
            Every stored audio log, video, document, and note in one place.
          </p>
        </div>
        <Button asChild className="rounded-none shadow-sm h-12 px-8 w-full sm:w-auto font-bold text-sm uppercase tracking-widest">
          <Link to="/admin/upload">
            <Plus className="mr-2 h-4 w-4" /> Upload Item
          </Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'public', 'private'] as VisibilityFilter[]).map((value) => (
            <Button
              key={value}
              variant={visibility === value ? 'default' : 'outline'}
              onClick={() => setVisibility(value)}
              className="rounded-none h-9 px-4 text-xs font-bold uppercase tracking-widest"
            >
              {value === 'private' && <Lock className="mr-2 h-3.5 w-3.5" />}
              {value === 'public' && <Globe2 className="mr-2 h-3.5 w-3.5" />}
              {value}
            </Button>
          ))}
        </div>
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search stored items..."
            className="pl-10 h-10 rounded-none bg-background/60"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-none bg-muted/20 animate-pulse" />)}
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="border-y border-dashed border-border/70 py-12 md:py-16 text-center">
          <h3 className="text-xl md:text-2xl font-display font-black mb-3">No stored items found</h3>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm leading-relaxed">
            Try a different search or visibility filter.
          </p>
          <Button variant="outline" asChild className="rounded-none h-11 px-8 font-bold text-xs uppercase tracking-widest">
            <Link to="/admin/upload">Upload Item</Link>
          </Button>
        </div>
      ) : (
        <div className="border-y border-border/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border/50 text-left">
                <tr>
                  <th className="p-5 font-black text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Stored Item</th>
                  <th className="p-5 font-black text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Type</th>
                  <th className="p-5 font-black text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Created</th>
                  <th className="p-5 text-center font-black text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Engagement</th>
                  <th className="p-5 text-center font-black text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredMedia.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenItem(item)}
                    className="hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-none bg-background/50 border border-border/50 flex items-center justify-center shrink-0 shadow-inner">
                          {getIcon(item, 'h-6 w-6')}
                        </div>
                        <div className="min-w-0 max-w-md">
                          <p className="font-black truncate text-base tracking-tight">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground truncate opacity-60 font-medium mt-0.5">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-sm text-muted-foreground font-mono uppercase tracking-tight">{item.type}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground font-mono uppercase tracking-tight">
                        <Calendar className="h-4 w-4 opacity-40" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-muted-foreground bg-background/40 px-3 py-1.5 rounded-none border border-white/5 shadow-inner">
                          <Eye className="h-3.5 w-3.5" /> {item.view_count}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-muted-foreground bg-background/40 px-3 py-1.5 rounded-none border border-white/5 shadow-inner">
                          <Download className="h-3.5 w-3.5" /> {item.download_count}
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className={cn(
                        'px-3 py-1 rounded-none text-[10px] font-black uppercase tracking-widest border shadow-sm inline-flex items-center gap-1.5',
                        item.is_private
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      )}>
                        {item.is_private ? <Lock className="h-3 w-3" /> : <Globe2 className="h-3 w-3" />}
                        {item.is_private ? 'Private' : 'Public'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedItem && (
        <MediaViewer item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default Everything;
