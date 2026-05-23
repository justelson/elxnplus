import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowLeft, Hexagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginAdmin } from '@/lib/auth';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);

    const result = await loginAdmin(username, password);
    
    setLoading(false);

    if (result.success) {
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[20%] w-[800px] h-[800px] rounded-full bg-primary/20 blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[20%] -left-[20%] w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-[100px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md z-10"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8 gap-2 hover:bg-background/20"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="glass-card p-8 md:p-12 rounded-sm border border-white/10 shadow-md backdrop-blur-md bg-black/40">
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-sm bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25">
              <Hexagon className="h-10 w-10 text-white fill-white/20" />
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter credentials to access the command center
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">Email</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@example.com"
                  className="pl-11 h-12 bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/10 transition-all rounded-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-11 h-12 bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/10 transition-all rounded-sm"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium rounded-sm bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                'Initialize Session'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
