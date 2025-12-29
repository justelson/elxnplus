import { LayoutDashboard, Music, Video, FileText, StickyNote, Upload, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { logoutAdmin } from '@/lib/auth';
import { useLocation, useNavigate } from 'react-router-dom';

interface AdminMobileHeaderProps {
  title: string;
}

const AdminMobileHeader = ({ title }: AdminMobileHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Upload, label: 'Upload', path: '/admin/upload' },
    { icon: Music, label: 'Audio', path: '/admin/audio' },
    { icon: Video, label: 'Video', path: '/admin/video' },
    { icon: FileText, label: 'Docs', path: '/admin/documents' },
    { icon: StickyNote, label: 'Notes', path: '/admin/notes' },
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate('/login');
  };

  return (
    <div className="md:hidden sticky top-0 z-30 border-b border-border bg-background">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">ELXN.ADMIN</p>
          <h1 className="text-base font-display font-bold uppercase tracking-wider">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-border"
            onClick={() => navigate('/')}
            aria-label="Public site"
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={handleLogout}
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-3">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap border border-border px-3 py-2 text-[11px] font-mono uppercase tracking-wider',
              location.pathname === item.path
                ? 'bg-foreground text-background'
                : 'bg-background text-foreground'
            )}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminMobileHeader;
