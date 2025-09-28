import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, Upload } from 'lucide-react';
import { Block } from '../types';
import { useApp } from '../context/AppContext';

interface EditableBlockProps {
  block: Block;
  onContentChange: (blockId: string, content: string) => void;
  onKeyDown: (e: React.KeyboardEvent, blockId: string, parentBlockId?: string) => void;
  onToggleCheck?: (checked: boolean) => void;
  onUpdateBlock: (updates: Partial<Block>) => void;
}

const EditableBlock: React.FC<EditableBlockProps> = ({
  block,
  onContentChange,
  onKeyDown,
  onToggleCheck,
  onUpdateBlock
}) => {
  const { getChildBlocks, toggleBlockExpansion, addBlock } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const childBlocks = block.type === 'toggle' ? getChildBlocks(block.id) : [];

  const handleClick = () => {
    if (block.type !== 'divider') {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.target.name === 'language') {
      onUpdateBlock({ language: e.target.value });
    } else {
      onContentChange(block.id, e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    onKeyDown(e, block.id, block.parentBlockId);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggleCheck?.(e.target.checked);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        onUpdateBlock({ src });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleExpansion = () => {
    toggleBlockExpansion(block.id);
  };

  const handleAddChildBlock = () => {
    const newBlock = addBlock(block.pageId, undefined, block.id);
    setTimeout(() => {
      const newBlockElement = document.getElementById(`block-${newBlock.id}`);
      const input = newBlockElement?.querySelector('input, textarea, [contenteditable]') as HTMLElement;
      input?.focus();
    }, 0);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Set cursor to end
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const getPlaceholder = () => {
    if (block.content === '') {
      return "Tippe '/' für Befehle";
    }
    return '';
  };

  const renderTextBlock = () => {
    if (isEditing || block.content === '') {
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={block.content}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base leading-relaxed resize-none"
        />
      );
    }

    return (
      <div
        onClick={handleClick}
        className="w-full text-gray-900 dark:text-gray-100 text-base leading-relaxed cursor-text min-h-[1.5rem] py-1"
      >
        {block.content || <span className="text-gray-400 dark:text-gray-500">Tippe '/' für Befehle</span>}
      </div>
    );
  };

  const renderHeadingBlock = () => {
    if (isEditing || block.content === '') {
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={block.content}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-2xl font-bold leading-tight resize-none"
        />
      );
    }

    return (
      <div
        onClick={handleClick}
        className="w-full text-gray-900 dark:text-gray-100 text-2xl font-bold leading-tight cursor-text min-h-[2rem] py-1"
      >
        {block.content || <span className="text-gray-400 dark:text-gray-500 text-2xl font-bold">Tippe '/' für Befehle</span>}
      </div>
    );
  };

  const renderTodoBlock = () => {
    return (
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={block.checked || false}
          onChange={handleCheckboxChange}
          className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-transparent dark:bg-slate-700"
        />
        <div className="flex-1">
          {isEditing || block.content === '' ? (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={block.content}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholder()}
              className={`w-full bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-base leading-relaxed resize-none ${
                block.checked ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'
              }`}
            />
          ) : (
            <div
              onClick={handleClick}
              className={`w-full text-base leading-relaxed cursor-text min-h-[1.5rem] py-1 ${
                block.checked ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {block.content || <span className="text-gray-400 dark:text-gray-500 no-underline">Tippe '/' für Befehle</span>}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderImageBlock = () => {
    return (
      <div className="space-y-3">
        {block.src ? (
          <div className="relative group">
            <img
              src={block.src}
              alt="Uploaded content"
              className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-slate-700"
              style={{ maxWidth: '600px' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black bg-opacity-50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <Upload className="mr-2" size={20} />
              Bild ersetzen
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            <Upload className="mx-auto mb-2 text-gray-400 dark:text-gray-500" size={32} />
            <p className="text-gray-500 dark:text-gray-400">Klicken, um ein Bild hochzuladen</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    );
  };

  const renderToggleBlock = () => {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleExpansion}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            {block.isExpanded ? (
              <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
            )}
          </button>
          <div className="flex-1">
            {isEditing || block.content === '' ? (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={block.content}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={getPlaceholder()}
                className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base leading-relaxed resize-none"
              />
            ) : (
              <div
                onClick={handleClick}
                className="w-full text-gray-900 dark:text-gray-100 text-base leading-relaxed cursor-text min-h-[1.5rem] py-1"
              >
                {block.content || <span className="text-gray-400 dark:text-gray-500">Tippe '/' für Befehle</span>}
              </div>
            )}
          </div>
        </div>
        
        {block.isExpanded && (
          <div className="ml-6 space-y-2 border-l-2 border-gray-200 dark:border-slate-700 pl-4">
            {childBlocks.map((childBlock) => (
              <EditableBlock
                key={childBlock.id}
                block={childBlock}
                onContentChange={onContentChange}
                onKeyDown={onKeyDown}
                onToggleCheck={(checked) => onUpdateBlock({ checked })}
                onUpdateBlock={onUpdateBlock}
              />
            ))}
            <button
              onClick={handleAddChildBlock}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm transition-colors"
            >
              + Block hinzufügen
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderDividerBlock = () => {
    return <hr className="border-gray-300 dark:border-slate-700 my-4" />;
  };

  const renderCodeBlock = () => {
    const languages = [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'python', label: 'Python' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'html', label: 'HTML' },
      { value: 'css', label: 'CSS' },
      { value: 'json', label: 'JSON' },
      { value: 'plaintext', label: 'Plain Text' }
    ];

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Codeblock</span>
          <select
            name="language"
            value={block.language || 'javascript'}
            onChange={handleChange}
            className="text-xs px-2 py-1 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
        
        <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-4">
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={block.content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsEditing(true)}
            onBlur={handleBlur}
            placeholder="Geben Sie hier Ihren Code ein..."
            className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm font-mono leading-relaxed resize-none"
            rows={Math.max(3, block.content.split('\n').length)}
          />
        </div>
      </div>
    );
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'heading':
        return renderHeadingBlock();
      case 'todo':
        return renderTodoBlock();
      case 'image':
        return renderImageBlock();
      case 'toggle':
        return renderToggleBlock();
      case 'divider':
        return renderDividerBlock();
      case 'code':
        return renderCodeBlock();
      default:
        return renderTextBlock();
    }
  };

  return (
    <div
      id={`block-${block.id}`}
      className={`group relative rounded-md transition-colors ${
        block.type === 'divider' ? '' : 'px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700/50'
      } ${block.parentBlockId ? 'ml-4' : ''}`}
    >
      {renderBlock()}
    </div>
  );
};

export default EditableBlock;
