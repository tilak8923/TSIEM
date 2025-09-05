'use client';

import { useState, useRef, useEffect } from 'react';
import { useFlowState } from '@genkit-ai/next/client';
import { provideCommandLineAssistance } from '@/ai/flows/provide-command-line-assistance';
import { cn } from '@/lib/utils';
import { Terminal } from 'lucide-react';

interface HistoryItem {
  type: 'command' | 'response';
  content: string;
}

export function TerminalUI() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const {run: getAssistance, output, running} = useFlowState(provideCommandLineAssistance);
  const endOfHistoryRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  useEffect(() => {
    if (output) {
      setHistory((prev) => [...prev, { type: 'response', content: output.response }]);
    }
  }, [output]);

  useEffect(() => {
    endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, running]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || running) return;
    
    setHistory((prev) => [...prev, { type: 'command', content: input }]);
    await getAssistance({ command: input });
    setInput('');
  };
  
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  }

  return (
    <div 
        className="h-full w-full bg-black text-primary font-mono p-4 overflow-y-auto flex flex-col"
        onClick={handleTerminalClick}
    >
      <div className="flex-grow">
        {history.map((item, index) => (
          <div key={index} className="mb-2">
            {item.type === 'command' ? (
              <div className="flex items-center">
                <span className="text-primary mr-2">{'>'}</span>
                <span>{item.content}</span>
              </div>
            ) : (
              <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: item.content.replace(/ /g, '\u00A0')}}></div>
            )}
          </div>
        ))}
        {running && 
            <div className="flex items-center">
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Executing...</span>
            </div>
        }
        <div ref={endOfHistoryRef} />
      </div>
      <form onSubmit={handleFormSubmit} className="flex items-center">
        <label htmlFor="terminal-input" className="text-primary mr-2">{'>'}</label>
        <input
          ref={inputRef}
          id="terminal-input"
          type="text"
          value={input}
          onChange={handleInputChange}
          className="bg-transparent border-none text-primary w-full focus:outline-none focus:ring-0"
          autoComplete="off"
          disabled={running}
        />
      </form>
    </div>
  );
}
