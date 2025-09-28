import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Block, BlockType } from '../types';
import EditableBlock from './EditableBlock';
import SlashCommandMenu from './SlashCommandMenu';

interface BlockEditorProps {
  pageId: string;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ pageId }) => {
  const { getPageBlocks, addBlock, updateBlock, deleteBlock } = useApp();
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedSlashIndex, setSelectedSlashIndex] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  const blocks = getPageBlocks(pageId);

  const blockTypes: BlockType[] = [
    { type: 'text', label: 'Text', icon: '📝', description: 'Einfacher Textblock' },
    { type: 'heading', label: 'Überschrift', icon: '📋', description: 'Großer Überschriftentext' },
    { type: 'todo', label: 'Aufgabe', icon: '☑️', description: 'Checkbox mit Text' },
    { type: 'image', label: 'Bild', icon: '🖼️', description: 'Bild hochladen und anzeigen' },
    { type: 'toggle', label: 'Umschalter', icon: '▶️', description: 'Einklappbarer Inhaltsblock' },
    { type: 'divider', label: 'Trennlinie', icon: '➖', description: 'Horizontale Trennlinie' },
    { type: 'code', label: 'Code', icon: '💻', description: 'Codeblock mit Syntax' }
  ];

  const handleBlockContentChange = (blockId: string, content: string) => {
    updateBlock(blockId, { content });

    // Handle slash command detection
    if (content.endsWith('/')) {
      const blockElement = document.getElementById(`block-${blockId}`);
      if (blockElement) {
        const rect = blockElement.getBoundingClientRect();
        setSlashMenuPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX
        });
        setShowSlashMenu(true);
        setFocusedBlockId(blockId);
        setSelectedSlashIndex(0);
      }
    } else {
      setShowSlashMenu(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string, parentBlockId?: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    switch (e.key) {
      case 'Enter':
        if (showSlashMenu) {
          e.preventDefault();
          handleSlashMenuSelect(blockTypes[selectedSlashIndex]);
        } else {
          e.preventDefault();
          const newBlock = addBlock(pageId, blockId, parentBlockId);
          setTimeout(() => {
            const newBlockElement = document.getElementById(`block-${newBlock.id}`);
            const input = newBlockElement?.querySelector('input, textarea, [contenteditable]') as HTMLElement;
            input?.focus();
          }, 0);
        }
        break;

      case 'Backspace':
        if (block.content === '') {
          e.preventDefault();
          const allBlocks = parentBlockId ? 
            blocks.filter(b => b.parentBlockId === parentBlockId) : 
            blocks.filter(b => !b.parentBlockId);
          
          const blockIndex = allBlocks.findIndex(b => b.id === blockId);
          if (blockIndex > 0) {
            const prevBlock = allBlocks[blockIndex - 1];
            deleteBlock(blockId);
            setTimeout(() => {
              const prevBlockElement = document.getElementById(`block-${prevBlock.id}`);
              const input = prevBlockElement?.querySelector('input, textarea, [contenteditable]') as HTMLElement;
              input?.focus();
            }, 0);
          }
        }
        break;

      case 'ArrowUp':
        if (showSlashMenu) {
          e.preventDefault();
          setSelectedSlashIndex(prev => prev > 0 ? prev - 1 : blockTypes.length - 1);
        }
        break;

      case 'ArrowDown':
        if (showSlashMenu) {
          e.preventDefault();
          setSelectedSlashIndex(prev => prev < blockTypes.length - 1 ? prev + 1 : 0);
        }
        break;

      case 'Escape':
        if (showSlashMenu) {
          e.preventDefault();
          setShowSlashMenu(false);
          // Remove the trailing slash
          updateBlock(blockId, { content: block.content.slice(0, -1) });
        }
        break;
    }
  };

  const handleSlashMenuSelect = (blockType: BlockType) => {
    if (focusedBlockId) {
      const block = blocks.find(b => b.id === focusedBlockId);
      if (block) {
        const updates: Partial<Block> = {
          type: blockType.type,
          content: blockType.type === 'divider' ? '' : block.content.slice(0, -1)
        };

        // Add type-specific defaults
        if (blockType.type === 'todo') {
          updates.checked = false;
        } else if (blockType.type === 'toggle') {
          updates.isExpanded = false;
          updates.children = [];
        } else if (blockType.type === 'code') {
          updates.language = 'javascript';
        }

        updateBlock(focusedBlockId, updates);
      }
    }
    setShowSlashMenu(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (showSlashMenu && !editorRef.current?.contains(e.target as Node)) {
      setShowSlashMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSlashMenu]);

  // Ensure there's always at least one block
  useEffect(() => {
    if (blocks.length === 0) {
      addBlock(pageId);
    }
  }, [blocks.length, pageId, addBlock]);

  return (
    <div ref={editorRef} className="relative">
      <div className="space-y-2">
        {blocks.map((block) => (
          <EditableBlock
            key={block.id}
            block={block}
            onContentChange={handleBlockContentChange}
            onKeyDown={handleKeyDown}
            onToggleCheck={(checked) => updateBlock(block.id, { checked })}
            onUpdateBlock={(updates) => updateBlock(block.id, updates)}
          />
        ))}
      </div>

      {showSlashMenu && (
        <SlashCommandMenu
          position={slashMenuPosition}
          blockTypes={blockTypes}
          selectedIndex={selectedSlashIndex}
          onSelect={handleSlashMenuSelect}
          onClose={() => setShowSlashMenu(false)}
        />
      )}
    </div>
  );
};

export default BlockEditor;
