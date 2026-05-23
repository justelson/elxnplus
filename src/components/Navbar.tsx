import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, LogIn, LayoutDashboard, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { isAdminLoggedIn } from "@/lib/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const isAdmin = isAdminLoggedIn();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    { name: "The Vault", path: "/" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border/40 shadow-sm py-3"
          : "bg-transparent py-6 border-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 group"
        >
          <div className="p-1.5 rounded-none bg-primary shadow-lg shadow-primary/25 transition-transform group-hover:rotate-12">
            <Zap className="h-5 w-5 text-white fill-white" />
          </div>
          <span className="text-2xl font-display font-black tracking-tighter text-foreground">
            ELXN<span className="text-primary italic">.PLUS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-sm font-bold uppercase tracking-widest transition-colors hover:text-primary",
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}

          <div className="flex items-center gap-4 border-l border-border pl-6 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-none hover:bg-muted"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {isAdmin ? (
              <Button asChild variant="default" className="rounded-none px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Link to="/admin">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Admin Pan
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className="rounded-none px-6 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all">
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Access
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg font-bold uppercase tracking-widest",
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/5" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground uppercase">SYSTEM_THEME</span>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === "dark" ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
                </Button>
              </div>
              {isAdmin ? (
                <Button asChild className="w-full h-12 rounded-none">
                  <Link to="/admin" onClick={() => setIsOpen(false)}>Admin Panel</Link>
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full h-12 rounded-none">
                  <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
