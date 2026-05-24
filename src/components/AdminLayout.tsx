import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { isAdminLoggedIn } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';
import { Loader2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { motion } from 'framer-motion';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      setIsCheckingAuth(true);
      const authorized = await isAdminLoggedIn();

      if (!isMounted) return;

      setIsAuthorized(authorized);
      setIsCheckingAuth(false);

      if (!authorized) {
        navigate('/login', { replace: true });
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative">
      <motion.div
        className="fixed inset-y-0 left-0 w-4 z-[60] md:hidden"
        onPanEnd={(_, info) => {
          if (info.offset.x > 50) setIsMobileOpen(true);
        }}
      />

      <div className="hidden md:block w-64 fixed inset-y-0 left-0 z-50">
        <AdminSidebar />
      </div>

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

      <main className="flex-1 md:pl-64 transition-all duration-300">
        <div className="p-4 md:p-8 pt-20 md:pt-8 min-h-screen bg-muted/5 relative overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
