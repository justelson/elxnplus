import { LayoutDashboard, Music, Video, FileText, StickyNote, Upload, LogOut, Home } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { logoutAdmin } from '@/lib/auth';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Upload, label: 'Upload', path: '/admin/upload' },
    { icon: Music, label: 'Audio', path: '/admin/audio' },
    { icon: Video, label: 'Video', path: '/admin/video' },
    { icon: FileText, label: 'Documents', path: '/admin/documents' },
    { icon: StickyNote, label: 'Notes', path: '/admin/notes' },
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-card/50 backdrop-blur-xl border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-display font-bold gradient-text">ElsonDev</h1>
        <p className="text-sm text-muted-foreground">Media Hub</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3',
              location.pathname === item.path && 'bg-primary/20 text-primary'
            )}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => navigate('/')}
        >
          <Home className="h-5 w-5" />
          View Public Site
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
