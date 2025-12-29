import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Video, FileText, StickyNote, Eye, Download, Trash2 } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminMobileHeader from '@/components/AdminMobileHeader';
import { Button } from '@/components/ui/button';
import { useMedia, MediaType, deleteMedia, MediaItem } from '@/hooks/useMedia';
import { isAdminLoggedIn } from '@/lib/auth';
import { toast } from 'sonner';

interface MediaListProps {
  type: MediaType;
  title: string;
}

const MediaList = ({ type, title }: MediaListProps) => {
  const navigate = useNavigate();
  const { media, loading, refetch } = useMedia(type);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

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

  const getIcon = () => {
    switch (type) {
      case 'audio':
        return <Music className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'note':
        return <StickyNote className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-4 md:p-8">
        <AdminMobileHeader title={title} />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 mt-4 md:mt-0 md:mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
              {getIcon()}
              {title}
            </h1>
            <p className="text-muted-foreground">Manage your {type} files</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin/upload')}>
            Upload New
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : media.length === 0 ? (
          <div className="border border-border bg-card p-8 md:p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 border border-border bg-background flex items-center justify-center">
              {getIcon()}
            </div>
            <h3 className="text-xl font-display font-semibold mb-2">No {title} Yet</h3>
            <p className="text-muted-foreground mb-4">Start by uploading your first {type}.</p>
            <Button variant="outline" onClick={() => navigate('/admin/upload')}>
              Upload Now
            </Button>
          </div>
        ) : (
          <>
            <div className="md:hidden space-y-3">
              {media.map((item) => (
                <div key={item.id} className="border border-border bg-card p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 border border-border bg-background flex items-center justify-center">
                        {getIcon()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item)}
                      disabled={deleting === item.id}
                      className="text-destructive hover:text-destructive"
                      aria-label="Delete"
                    >
                      {deleting === item.id ? (
                        <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-none animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                    <div className="border border-border px-2 py-1 flex items-center justify-between">
                      <span>VIEWS</span>
                      <span className="text-foreground">{item.view_count}</span>
                    </div>
                    <div className="border border-border px-2 py-1 flex items-center justify-between">
                      <span>DL</span>
                      <span className="text-foreground">{item.download_count}</span>
                    </div>
                    <div className="border border-border px-2 py-1 flex items-center justify-between col-span-2">
                      <span>STATUS</span>
                      <span className={item.is_published ? 'text-foreground' : 'text-muted-foreground'}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:block border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/30">
                  <tr>
                    <th className="text-left p-4 font-medium">Title</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-center p-4 font-medium">Views</th>
                    <th className="text-center p-4 font-medium">Downloads</th>
                    <th className="text-center p-4 font-medium">Status</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {media.map((item) => (
                    <tr key={item.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 border border-border bg-background flex items-center justify-center">
                            {getIcon()}
                          </div>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            {item.description && (
                              <p className="text-sm text-muted-foreground truncate max-w-xs">{item.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-center">
                        <span className="flex items-center justify-center gap-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          {item.view_count}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="flex items-center justify-center gap-1">
                          <Download className="h-4 w-4 text-muted-foreground" />
                          {item.download_count}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 border border-border text-xs ${     
                          item.is_published
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`}>
                          {item.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(item)}
                            disabled={deleting === item.id}
                            className="text-destructive hover:text-destructive"
                          >
                            {deleting === item.id ? (
                              <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-none animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MediaList;
