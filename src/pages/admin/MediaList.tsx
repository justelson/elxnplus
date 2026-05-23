import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Video, FileText, StickyNote, Eye, Download, Trash2, Plus, Calendar, MoreVertical, Globe2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMedia, MediaType, deleteMedia, MediaItem, setMediaPrivate, VisibilityFilter } from '@/hooks/useMedia';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MediaListProps {
  type: MediaType;
  title: string;
}

const MediaList = ({ type, title }: MediaListProps) => {
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState<VisibilityFilter>('all');
  const { media, loading, refetch } = useMedia(type, visibility);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updatingPrivacy, setUpdatingPrivacy] = useState<string | null>(null);

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    
    setDeleting(item.id);
    const result = await deleteMedia(item.id);
    setDeleting(null);

    if (result.success) {
      toast.success('Media deleted successfully');
      refetch();
    } else {
      toast.error(result.error || 'Failed to delete media');
    }
  };

  const handlePrivacyToggle = async (item: MediaItem) => {
    setUpdatingPrivacy(item.id);
    const result = await setMediaPrivate(item.id, !item.is_private);
    setUpdatingPrivacy(null);

    if (result.success) {
      toast.success(item.is_private ? 'Media is now public' : 'Media is now private');
      refetch();
    } else {
      toast.error(result.error || 'Failed to update privacy');
    }
  };

  const getIcon = (className = "h-5 w-5") => {
    switch (type) {
      case 'audio':
        return <Music className={cn(className, "text-orange-400")} />;
      case 'video':
        return <Video className={cn(className, "text-rose-400")} />;
      case 'document':
        return <FileText className={cn(className, "text-yellow-400")} />;
      case 'note':
        return <StickyNote className={cn(className, "text-orange-500")} />;
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight flex items-center gap-3">
             <div className="p-2.5 rounded-none bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5">
              {getIcon("h-6 w-6")}
             </div>
            {title}
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm font-medium opacity-70 tracking-tight">System archive for all {type} assets.</p>
        </div>
        <Button onClick={() => navigate(`/admin/upload/${type}`)} className="rounded-none shadow-sm h-12 px-8 w-full sm:w-auto font-bold text-sm uppercase tracking-widest">
          <Plus className="mr-2 h-4 w-4" /> New Archive
        </Button>
      </div>

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

      {loading ? (
        <div className="space-y-4">
           {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-none bg-muted/20 animate-pulse" />)}
        </div>
      ) : media.length === 0 ? (
        <div className="border-y border-dashed border-border/70 py-12 md:py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-none bg-muted/30 flex items-center justify-center border border-white/5">
            {getIcon("h-10 w-10 opacity-40")}
          </div>
          <h3 className="text-xl md:text-2xl font-display font-black mb-3">No Artifacts Detected</h3>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm leading-relaxed">
            This sector of the vault is currently empty. Initialize a new upload to begin archiving your {type} collection.
          </p>
          <Button variant="outline" onClick={() => navigate('/admin/upload')} className="rounded-none h-11 px-8 font-bold text-xs uppercase tracking-widest">
            Initialize Upload
          </Button>
        </div>
      ) : (
        <>
          {/* Mobile Card List */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            <AnimatePresence>
              {media.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card/50 backdrop-blur-md border border-border p-5 rounded-none flex flex-col gap-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-none bg-background/60 border border-border flex items-center justify-center shrink-0 shadow-inner">
                        {getIcon("h-6 w-6")}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black truncate text-[15px] tracking-tight">{item.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-mono tracking-widest mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none bg-background/40">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 rounded-none p-1 shadow-md bg-popover/90 backdrop-blur-md border-white/10">
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-none h-11 font-bold text-xs uppercase tracking-widest cursor-pointer"
                          onClick={() => handleDelete(item)}
                          disabled={deleting === item.id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Artifact
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-muted-foreground bg-background/50 px-2.5 py-1.5 rounded-none border border-white/5 shadow-inner">
                        <Eye className="h-3 w-3" /> {item.view_count}
                      </div>
                      {type !== 'note' && (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-muted-foreground bg-background/50 px-2.5 py-1.5 rounded-none border border-white/5 shadow-inner">
                          <Download className="h-3 w-3" /> {item.download_count}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePrivacyToggle(item)}
                      disabled={updatingPrivacy === item.id}
                      className={cn(
                        "px-3 py-1 rounded-none text-[9px] font-black uppercase tracking-widest border shadow-sm flex items-center gap-1.5",
                        item.is_private
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      )}
                    >
                      {item.is_private ? <Lock className="h-3 w-3" /> : <Globe2 className="h-3 w-3" />}
                      {item.is_private ? 'PRIVATE' : 'PUBLIC'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block border-y border-border/70 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30 border-b border-border/50 text-left">
                  <tr>
                    <th className="p-5 font-black text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Artifact Asset</th>
                    <th className="p-5 font-black text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Creation Date</th>
                    <th className="p-5 text-center font-black text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Engagement</th>
                    <th className="p-5 text-center font-black text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Status</th>
                    <th className="p-5 text-right font-black text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  <AnimatePresence>
                    {media.map((item, index) => (
                      <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-primary/5 transition-all duration-300"
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-none bg-background/50 border border-border/50 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
                              {getIcon("h-6 w-6")}
                            </div>
                            <div className="min-w-0 max-w-md">
                              <p className="font-black truncate text-base tracking-tight">{item.title}</p>
                              {item.description && (
                                <p className="text-xs text-muted-foreground truncate opacity-60 font-medium mt-0.5">{item.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
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
                              {type !== 'note' && (
                                <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-muted-foreground bg-background/40 px-3 py-1.5 rounded-none border border-white/5 shadow-inner">
                                  <Download className="h-3.5 w-3.5" /> {item.download_count}
                                </div>
                              )}
                           </div>
                        </td>
                        <td className="p-5 text-center">
                          <button
                            type="button"
                            onClick={() => handlePrivacyToggle(item)}
                            disabled={updatingPrivacy === item.id}
                            className={cn(
                              "px-3 py-1 rounded-none text-[10px] font-black uppercase tracking-widest border shadow-sm inline-flex items-center gap-1.5",
                              item.is_private
                                ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            )}
                          >
                            {item.is_private ? <Lock className="h-3 w-3" /> : <Globe2 className="h-3 w-3" />}
                            {item.is_private ? 'PRIVATE' : 'PUBLIC'}
                          </button>
                        </td>
                        <td className="p-5 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(item)}
                            disabled={deleting === item.id}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-none h-10 w-10 shadow-sm"
                          >
                            {deleting === item.id ? (
                              <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="h-4.5 w-4.5" />
                            )}
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MediaList;
