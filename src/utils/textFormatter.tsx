import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = "" }) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />);
      continue;
    }

    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      const boldText = line.slice(2, -2);
      elements.push(
        <div key={key++} className="font-semibold mb-2">
          {boldText}
        </div>
      );
    }
    else if (line.includes('**')) {
      const parts = line.split('**');
      const formattedParts = parts.map((part, index) => 
        index % 2 === 1 ? <strong key={index} className="font-semibold">{part}</strong> : part
      );
      elements.push(
        <div key={key++} className="mb-1">
          {formattedParts}
        </div>
      );
    }
    else if (line.startsWith('• ') || line.startsWith('- ')) {
      const listText = line.substring(2);
      elements.push(
        <div key={key++} className="flex items-start mb-1">
          <span className="mr-2 mt-0.5 text-xs">•</span>
          <span className="flex-1">{listText}</span>
        </div>
      );
    }
    else {
      elements.push(
        <div key={key++} className="mb-1 leading-relaxed">
          {line}
        </div>
      );
    }
  }

  return (
    <div className={className}>
      {elements}
    </div>
  );
};

export const formatMessageText = (text: string): React.ReactNode[] => {
  if (!text) return [];

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />);
      continue;
    }

    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      const boldText = line.slice(2, -2);
      elements.push(
        <div key={key++} className="font-semibold mb-2">
          {boldText}
        </div>
      );
    }
    else if (line.includes('**')) {
      const parts = line.split('**');
      const formattedParts = parts.map((part, index) => 
        index % 2 === 1 ? <strong key={index} className="font-semibold">{part}</strong> : part
      );
      elements.push(
        <div key={key++} className="mb-1">
          {formattedParts}
        </div>
      );
    }
    else if (line.startsWith('• ') || line.startsWith('- ')) {
      const listText = line.substring(2);
      elements.push(
        <div key={key++} className="flex items-start mb-1">
          <span className="mr-2 mt-0.5 text-xs">•</span>
          <span className="flex-1">{listText}</span>
        </div>
      );
    }
    else {
      elements.push(
        <div key={key++} className="mb-1 leading-relaxed">
          {line}
        </div>
      );
    }
  }

  return elements;
};

export const parseMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />');
};
