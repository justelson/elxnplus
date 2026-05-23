import { LayoutDashboard, Music, Video, FileText, StickyNote, Upload, LogOut, Home, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { logoutAdmin } from '@/lib/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AdminSidebarProps {
  onClose?: () => void;
  className?: string;
}

const AdminSidebar = ({ onClose, className }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Music, label: 'Audio Logs', path: '/admin/audio' },
    { icon: Video, label: 'Video Feeds', path: '/admin/video' },
    { icon: FileText, label: 'Documents', path: '/admin/documents' },
    { icon: StickyNote, label: 'Personal Notes', path: '/admin/notes' },
  ];

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/login');
  };

  return (
    <aside className={cn("h-screen bg-background/95 backdrop-blur-xl border-r border-border flex flex-col z-50 transition-all duration-300", className)}>
      <div className="p-6 border-b border-border/40 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            ELXN.ADMIN
          </h1>
          <p className="text-xs font-mono text-muted-foreground/80 tracking-widest mt-1">SYSTEM CONTROL</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div key={item.path} className="relative">
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 relative z-10 transition-colors',
                  isActive 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
                )}
                onClick={() => {
                  navigate(item.path);
                  if (onClose) onClose();
                }}
              >
                <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                {item.label}
              </Button>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/40 space-y-2 bg-muted/5">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          onClick={() => navigate('/')}
        >
          <Home className="h-4 w-4" />
          Public Site
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
