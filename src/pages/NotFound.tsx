import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-purple-500/20 rounded-full blur-[80px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10 p-8 glass-card rounded-md border border-white/10"
      >
        <h1 className="mb-2 text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/20">404</h1>
        <p className="mb-8 text-xl text-muted-foreground font-light">
          The artifact you are looking for has been lost in the void.
        </p>
        <Button asChild size="lg" className="rounded-md px-8 shadow-sm">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
