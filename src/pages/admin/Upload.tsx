import UploadForm from '@/components/UploadForm';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaType } from '@/hooks/useMedia';

const Upload = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto animate-fade-in pb-10">
      <div className="flex flex-col gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(type ? `/admin/${type === 'note' ? 'notes' : type === 'document' ? 'documents' : type}` : '/admin')}
          className="w-fit -ml-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight uppercase">
            {type ? `Upload ${type === 'note' ? 'Personal Note' : type}` : 'Upload Item'}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Add a stored item to the digital vault.</p>
        </div>
      </div>

      <div className="border-t border-border/60 pt-6 md:pt-8">
        <UploadForm 
          initialType={type as MediaType} 
          onSuccess={() => navigate(type ? `/admin/${type === 'note' ? 'notes' : type === 'document' ? 'documents' : type}` : '/admin')} 
        />
      </div>
    </div>
  );
};

export default Upload;
