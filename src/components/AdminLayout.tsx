import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { isAdminLoggedIn } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/login');
    }
  }, [navigate, location.pathname]);

  if (!isAdminLoggedIn()) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative">
      {/* Swipe detection zone (Left edge) */}
      <div 
        className="fixed inset-y-0 left-0 w-6 z-[60] md:hidden"
        onPointerDown={(e) => {
          // Simple swipe detection if needed, but framer-motion Pan is better
        }}
      />
      
      <motion.div
        className="fixed inset-y-0 left-0 w-4 z-[60] md:hidden"
        onPanEnd={(_, info) => {
          if (info.offset.x > 50) setIsMobileOpen(true);
        }}
      />

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 fixed inset-y-0 left-0 z-50">
        <AdminSidebar />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center px-4 justify-between">
        <span className="font-display font-bold">ELXN.ADMIN</span>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r border-border bg-background">
            <SheetHeader className="sr-only">
              <SheetTitle>Admin Navigation</SheetTitle>
              <SheetDescription>Access different sectors of the vault</SheetDescription>
            </SheetHeader>
            <AdminSidebar onClose={() => setIsMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pl-64 transition-all duration-300">
        <div className="p-4 md:p-8 pt-20 md:pt-8 min-h-screen bg-muted/5 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
