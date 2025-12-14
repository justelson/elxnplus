import { Music, Video, FileText, StickyNote, Eye, Download, TrendingUp } from 'lucide-react';
import { useMedia } from '@/hooks/useMedia';
import AdminSidebar from '@/components/AdminSidebar';
import { isAdminLoggedIn } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { media, loading } = useMedia();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  const stats = {
    audio: media.filter(m => m.type === 'audio').length,
    video: media.filter(m => m.type === 'video').length,
    documents: media.filter(m => m.type === 'document').length,
    notes: media.filter(m => m.type === 'note').length,
    totalViews: media.reduce((acc, m) => acc + m.view_count, 0),
    totalDownloads: media.reduce((acc, m) => acc + m.download_count, 0),
  };

  const statCards = [
    { label: 'Audio Files', value: stats.audio, icon: Music, gradient: 'from-primary/20 to-primary/5' },
    { label: 'Videos', value: stats.video, icon: Video, gradient: 'from-accent/20 to-accent/5' },
    { label: 'Documents', value: stats.documents, icon: FileText, gradient: 'from-blue-500/20 to-blue-500/5' },
    { label: 'Notes', value: stats.notes, icon: StickyNote, gradient: 'from-yellow-500/20 to-yellow-500/5' },
    { label: 'Total Views', value: stats.totalViews, icon: Eye, gradient: 'from-green-500/20 to-green-500/5' },
    { label: 'Total Downloads', value: stats.totalDownloads, icon: Download, gradient: 'from-purple-500/20 to-purple-500/5' },
  ];

  const recentMedia = media.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your media.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="glass-card p-6 animate-slide-up hover-glow"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4`}>
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-3xl font-display font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-display font-semibold">Recent Uploads</h2>
              </div>
              
              {recentMedia.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No uploads yet. Start by uploading some media!</p>
              ) : (
                <div className="space-y-4">
                  {recentMedia.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.type === 'audio' ? 'bg-primary/20' :
                        item.type === 'video' ? 'bg-accent/20' :
                        item.type === 'document' ? 'bg-blue-500/20' :
                        'bg-yellow-500/20'
                      }`}>
                        {item.type === 'audio' && <Music className="h-5 w-5 text-primary" />}
                        {item.type === 'video' && <Video className="h-5 w-5 text-accent" />}
                        {item.type === 'document' && <FileText className="h-5 w-5 text-blue-500" />}
                        {item.type === 'note' && <StickyNote className="h-5 w-5 text-yellow-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {item.view_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
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
      </main>
    </div>
  );
};

export default Dashboard;
