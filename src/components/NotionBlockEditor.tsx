import { useEffect, useRef } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import '@blocknote/react/style.css';

interface NotionBlockEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const NotionBlockEditor = ({ content, onChange, placeholder = 'Start writing...' }: NotionBlockEditorProps) => {
  const hasHydrated = useRef(false);
  const editor = useCreateBlockNote({
    placeholders: {
      default: placeholder,
      heading: 'Heading',
      bulletListItem: 'List',
      numberedListItem: 'List',
    },
  });

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      if (hasHydrated.current) return;
      hasHydrated.current = true;

      if (!content.trim()) return;

      try {
        const blocks = await editor.tryParseHTMLToBlocks(content);
        if (!cancelled && blocks.length > 0) {
          editor.replaceBlocks(editor.document, blocks);
        }
      } catch (error) {
        console.error('Failed to hydrate BlockNote content:', error);
      }
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [content, editor]);

  return (
    <div className="rounded-none border border-white/10 bg-card/30 overflow-hidden focus-within:ring-1 focus-within:ring-primary/50 [&_.bn-container]:min-h-[360px] [&_.bn-editor]:min-h-[360px] [&_.bn-editor]:px-5 [&_.bn-editor]:py-4">
      <BlockNoteView
        editor={editor}
        theme="dark"
        onChange={async () => {
          const html = await editor.blocksToHTMLLossy(editor.document);
          onChange(html);
        }}
      />
    </div>
  );
};

export default NotionBlockEditor;
