import { useState } from 'react';
import { Upload, X, Music, Video, FileText, StickyNote } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import WysiwygEditor from './WysiwygEditor';
import { MediaType, uploadFile, createMedia } from '@/hooks/useMedia';
import { toast } from 'sonner';

interface UploadFormProps {
  onSuccess?: () => void;
}

const UploadForm = ({ onSuccess }: UploadFormProps) => {
  const [mediaType, setMediaType] = useState<MediaType>('audio');
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Media Type Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {mediaTypes.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            type="button"
            onClick={() => setMediaType(type)}
            className={`glass-card p-4 flex flex-col items-center gap-2 transition-all ${
              mediaType === type 
                ? 'ring-2 ring-primary bg-primary/10' 
                : 'hover:bg-secondary/50'
            }`}
          >
            <Icon className={`h-6 w-6 ${mediaType === type ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-sm font-medium ${mediaType === type ? 'text-primary' : ''}`}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title..."
          className="bg-input border-border"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description (optional)</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description..."
          className="bg-input border-border resize-none"
          rows={3}
        />
      </div>

      {/* File Upload (not for notes) */}
      {mediaType !== 'note' && (
        <div>
          <label className="block text-sm font-medium mb-2">File</label>
          <div className="glass-card p-6 text-center">
            {file ? (
              <div className="flex items-center justify-between">
                <span className="text-sm truncate">{file.name}</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept={getAcceptedFiles()}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Upload className="h-8 w-8" />
                  <span className="text-sm">Click to upload {mediaType}</span>
                </div>
              </label>
            )}
          </div>
        </div>
      )}

      {/* WYSIWYG Editor (for notes) */}
      {mediaType === 'note' && (
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <WysiwygEditor 
            content={content} 
            onChange={setContent}
            placeholder="Write your note here..."
          />
        </div>
      )}

      {/* Thumbnail Upload */}
      {(mediaType === 'audio' || mediaType === 'video') && (
        <div>
          <label className="block text-sm font-medium mb-2">Thumbnail (optional)</label>
          <div className="glass-card p-4">
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
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                  <Upload className="h-4 w-4" />
                  <span>Upload thumbnail image</span>
                </div>
              </label>
            )}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        variant="glow" 
        size="lg" 
        className="w-full"
        disabled={uploading}
      >
        {uploading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Uploading...
          </div>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            Upload {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
          </>
        )}
      </Button>
    </form>
  );
};

export default UploadForm;
