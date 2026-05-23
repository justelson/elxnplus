import { useState } from 'react';
import { Upload, X, Music, Video, FileText, StickyNote } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import WysiwygEditor from './WysiwygEditor';
import { MediaType, uploadFile, createMedia } from '@/hooks/useMedia';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface UploadFormProps {
  onSuccess?: () => void;
  initialType?: MediaType;
}

const UploadForm = ({ onSuccess, initialType }: UploadFormProps) => {
  const [mediaType, setMediaType] = useState<MediaType>(initialType || 'audio');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const mediaTypes: { type: MediaType; icon: typeof Music; label: string }[] = [
    { type: 'audio', icon: Music, label: 'Audio' },
    { type: 'video', icon: Video, label: 'Video' },
    { type: 'document', icon: FileText, label: 'Document' },
    { type: 'note', icon: StickyNote, label: 'Note' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (mediaType !== 'note' && !file) {
      toast.error('Please select a file');
      return;
    }

    if (mediaType === 'note' && !content.trim()) {
      toast.error('Please add some content');
      return;
    }

    setUploading(true);

    try {
      let fileUrl = null;
      let thumbnailUrl = null;
      let fileSize = null;

      if (file) {
        fileUrl = await uploadFile(file, mediaType);
        fileSize = file.size;
        if (!fileUrl) throw new Error('Failed to upload file');
      }

      if (thumbnail) {
        thumbnailUrl = await uploadFile(thumbnail, 'thumbnails');
      }

      const result = await createMedia({
        title,
        description: description || null,
        type: mediaType,
        file_url: fileUrl,
        thumbnail_url: thumbnailUrl,
        content: mediaType === 'note' ? content : null,
        file_size: fileSize,
      });

      if (!result.success) throw new Error(result.error);

      toast.success('Media uploaded successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setContent('');
      setFile(null);
      setThumbnail(null);
      
      onSuccess?.();
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const getAcceptedFiles = () => {
    switch (mediaType) {
      case 'audio':
        return 'audio/*';
      case 'video':
        return 'video/*';
      case 'document':
        return '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx';
      default:
        return '*';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Media Type Selection - Only show if no initialType is provided */}
      {!initialType && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mediaTypes.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => setMediaType(type)}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-sm border transition-all duration-300",
                mediaType === type 
                  ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10 scale-105" 
                  : "bg-card/50 border-border text-muted-foreground hover:bg-card hover:border-border/80 hover:scale-[1.02]"
              )}
            >
              <Icon className="h-6 w-6 mb-3" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium ml-1">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Enter ${mediaType} title...`}
            className="h-12 bg-white/5 border-white/10 rounded-sm focus:border-primary/50 transition-all"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium ml-1">Description (optional)</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a brief description..."
            className="min-h-[100px] bg-white/5 border-white/10 rounded-sm focus:border-primary/50 transition-all resize-y"
          />
        </div>

        {/* File Upload */}
        {mediaType !== 'note' && (
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">File</label>
            <div className={cn(
              "border-2 border-dashed rounded-sm p-8 transition-colors text-center",
              file ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/30 hover:bg-white/5"
            )}>
              {file ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-sm bg-primary/20">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setFile(null)}
                    className="hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-4">
                  <input
                    type="file"
                    accept={getAcceptedFiles()}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <div className="p-4 rounded-full bg-white/5">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {mediaType === 'audio' && 'MP3, WAV up to 50MB'}
                      {mediaType === 'video' && 'MP4, MOV up to 100MB'}
                      {mediaType === 'document' && 'PDF, DOCX up to 20MB'}
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>
        )}

        {/* WYSIWYG Editor */}
        {mediaType === 'note' && (
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Content</label>
            <div className="rounded-sm border border-white/10 bg-white/5 overflow-hidden">
              <WysiwygEditor 
                content={content} 
                onChange={setContent}
                placeholder="Start writing..."
              />
            </div>
          </div>
        )}

        {/* Thumbnail Upload */}
        {(mediaType === 'audio' || mediaType === 'video') && (
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Thumbnail (optional)</label>
            <div className={cn(
              "border border-dashed rounded-sm p-4 transition-colors",
              thumbnail ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/30 hover:bg-white/5"
            )}>
              {thumbnail ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm truncate">{thumbnail.name}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setThumbnail(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer flex items-center justify-center gap-3 py-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload cover image</span>
                </label>
              )}
            </div>
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        size="lg" 
        className="w-full h-12 rounded-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
        disabled={uploading}
      >
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
          </>
        )}
      </Button>
    </form>
  );
};

export default UploadForm;
