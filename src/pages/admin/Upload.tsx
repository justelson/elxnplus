import AdminSidebar from '@/components/AdminSidebar';
import UploadForm from '@/components/UploadForm';
import { isAdminLoggedIn } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Upload = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Upload Media</h1>
            <p className="text-muted-foreground">Add new audio, video, documents, or notes to your library.</p>
          </div>

          <div className="glass-card p-6 animate-slide-up">
            <UploadForm onSuccess={() => navigate('/admin')} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
