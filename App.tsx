import React, { useState } from 'react';
import { FileText, Code, GraduationCap, HelpCircle, Upload, Mail, Building2, CheckSquare, HardHat, Ruler, FileWarning, ClipboardCheck } from 'lucide-react';

interface Option {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const initialOptions: Option[] = [
  {
    id: 'project-details',
    icon: <HardHat className="w-6 h-6" />,
    title: 'Project Details',
    description: 'Information about project scope and requirements'
  },
  {
    id: 'code-compliance',
    icon: <Ruler className="w-6 h-6" />,
    title: 'Code & Compliance',
    description: 'Technical specifications and standards'
  },
  {
    id: 'training',
    icon: <FileWarning className="w-6 h-6" />,
    title: 'Safety Documents',
    description: 'Safety protocols and training materials'
  },
  {
    id: 'other',
    icon: <ClipboardCheck className="w-6 h-6" />,
    title: 'Other Documents',
    description: 'Additional project documentation'
  }
];

const sourceOptions: Option[] = [
  {
    id: 'uploaded-docs',
    icon: <Upload className="w-6 h-6" />,
    title: 'Uploaded Docs',
    description: 'Search through uploaded documentation'
  },
  {
    id: 'emails',
    icon: <Mail className="w-6 h-6" />,
    title: 'Emails',
    description: 'Search through email correspondence'
  },
  {
    id: 'procore',
    icon: <Building2 className="w-6 h-6" />,
    title: 'Procore',
    description: 'Search Procore project management system'
  },
  {
    id: 'all',
    icon: <CheckSquare className="w-6 h-6" />,
    title: 'Check All',
    description: 'Search across all available sources'
  }
];

function App() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [step, setStep] = useState<'topics' | 'sources' | 'chat'>('topics');
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [inputValue, setInputValue] = useState('');

  const toggleOption = (id: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => {
      if (id === 'all' && setter === setSelectedSources) {
        const allSourceIds = sourceOptions.map(opt => opt.id);
        return prev.length === allSourceIds.length ? [] : allSourceIds;
      }
      return prev.includes(id)
        ? prev.filter(optionId => optionId !== id)
        : [...prev, id];
    });
  };

  const handleContinue = () => {
    if (step === 'topics' && selectedOptions.length > 0) {
      setStep('sources');
    } else if (step === 'sources' && selectedSources.length > 0) {
      setStep('chat');
      const selectedTitles = selectedOptions
        .map(id => initialOptions.find(opt => opt.id === id)?.title)
        .filter(Boolean)
        .join(', ');
      
      setMessages([{
        text: `I'm reviewing ${selectedTitles.toLowerCase()} that have been uploaded to the platform. Ask any question...`,
        isUser: false
      }]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
    setInputValue('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "I'm here to help! Could you please provide more specific details about your request?",
        isUser: false
      }]);
    }, 1000);
  };

  if (step === 'chat') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-amber-500">
          <div className="construction-pattern p-4">
            <h1 className="text-white text-xl font-semibold flex items-center gap-2">
              <HardHat className="w-6 h-6" />
              Project Assistant
            </h1>
          </div>
          
          <div className="h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const currentOptions = step === 'topics' ? initialOptions : sourceOptions;
  const currentSelected = step === 'topics' ? selectedOptions : selectedSources;
  const currentSetter = step === 'topics' ? setSelectedOptions : setSelectedSources;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="construction-pattern rounded-t-xl p-6 border-t-4 border-amber-500">
          <div className="flex items-center gap-2 mb-2">
            <HardHat className="w-8 h-8 text-amber-500" />
            <h1 className="text-white text-2xl font-semibold">
              {step === 'topics' ? 'Project Documentation Assistant' : 'Select Information Sources'}
            </h1>
          </div>
          <p className="text-slate-300 mt-2">
            {step === 'topics' ? 'Select all relevant document types' : 'Choose where to search for information'}
          </p>
        </div>
        
        <div className="bg-white rounded-b-xl shadow-lg p-6">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {currentOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleOption(option.id, currentSetter)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 hover:border-amber-500 ${
                  currentSelected.includes(option.id)
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-slate-200'
                }`}
              >
                <div className={`${
                  currentSelected.includes(option.id)
                    ? 'text-amber-500'
                    : 'text-slate-500'
                }`}>
                  {option.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-900">{option.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{option.description}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleContinue}
            disabled={currentSelected.length === 0}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              currentSelected.length > 0
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;