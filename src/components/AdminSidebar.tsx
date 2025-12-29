import { LayoutDashboard, Music, Video, FileText, StickyNote, Upload, LogOut, Home } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { logoutAdmin } from '@/lib/auth';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'DASHBOARD', path: '/admin' },
    { icon: Upload, label: 'UPLOAD_DATA', path: '/admin/upload' },
    { icon: Music, label: 'AUDIO_LOGS', path: '/admin/audio' },
    { icon: Video, label: 'VISUAL_FEEDS', path: '/admin/video' },
    { icon: FileText, label: 'DOCUMENTS', path: '/admin/documents' },
    { icon: StickyNote, label: 'TEXT_FILES', path: '/admin/notes' },
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex w-64 h-screen sticky top-0 bg-background border-r border-border flex-col z-30">
      <div className="p-6 border-b border-border bg-muted/10">
        <h1 className="text-2xl font-display font-bold tracking-widest uppercase">ELXN.ADMIN</h1>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">System Control</p>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 rounded-none font-mono text-xs uppercase tracking-wider',
              location.pathname === item.path
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-2 bg-muted/5">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 rounded-none border-primary hover:bg-primary hover:text-primary-foreground font-mono text-xs uppercase"
          onClick={() => navigate('/')}
        >
          <Home className="h-4 w-4" />
          Public_Site
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-none text-destructive hover:bg-destructive hover:text-destructive-foreground font-mono text-xs uppercase"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          System_Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
