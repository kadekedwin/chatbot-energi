'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useRef, useState } from 'react';
import { Send, Leaf, BarChart3, TrendingUp, Users, GraduationCap } from 'lucide-react';
import { RobotAvatar, EnerNovaLoading } from './Logo';
import extractedMetadata from '@/lib/journals_metadata';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { 
  RenewableEnergyPotentialChart, 
  NickelProductionChart, 
  BatteryComparisonChart,
  EnvironmentalImpactChart,
  EnergyMixPieChart 
} from './energy-charts';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  showChart?: 'renewable' | 'nickel' | 'battery' | 'environmental' | 'energymix';
  metadata?: {
    questionType?: string;
    mode?: string;
  };
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Halo! Saya **EnerNova AI**, asisten Eco-Futurist untuk riset energi terbarukan Anda. Tanyakan apa saja tentang nikel, baterai EV, atau teknologi masa depan! 🌿⚡',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showAuthors, setShowAuthors] = useState(false);

  const uniqueAuthors = Array.from(
    new Set(
      extractedMetadata
        .filter(j => j.detectedAuthor && !j.detectedAuthor.includes('Perlu Review Manual'))
        .map(j => j.detectedAuthor)
    )
  ).sort();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const stop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = (input || '').trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          message: trimmed,
          conversationHistory: messages.slice(-5).map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      const reply = data?.data?.message ?? 'Maaf, tidak ada respons.';
      const metadata = data?.data?.metadata;

      const lowerContent = reply.toLowerCase();
      let chartType: ChatMessage['showChart'] = undefined;
      
      if (lowerContent.includes('energi terbarukan') || lowerContent.includes('renewable energy') || 
          lowerContent.includes('solar') || lowerContent.includes('wind') || lowerContent.includes('potensi')) {
        chartType = 'renewable';
      } else if (lowerContent.includes('nikel') || lowerContent.includes('nickel') || 
                 lowerContent.includes('produksi') || lowerContent.includes('hilirisasi')) {
        chartType = 'nickel';
      } else if (lowerContent.includes('baterai') || lowerContent.includes('battery') || 
                 lowerContent.includes('nmc') || lowerContent.includes('lfp')) {
        chartType = 'battery';
      } else if (lowerContent.includes('emisi') || lowerContent.includes('lingkungan') || 
                 lowerContent.includes('environmental') || lowerContent.includes('co2')) {
        chartType = 'environmental';
      } else if (lowerContent.includes('energy mix') || lowerContent.includes('distribusi energi')) {
        chartType = 'energymix';
      }

      const aiMsg: ChatMessage = {
        id: Date.now().toString() + '-ai',
        role: 'assistant',
        content: reply,
        showChart: chartType,
        metadata: metadata,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      if ((err as any).name === 'AbortError') {
        console.warn('Request aborted');
      } else {
        console.error('Chat Error:', err);
        alert('Terjadi kesalahan koneksi. Silakan coba lagi.');
      }
    } finally {
      abortRef.current = null;
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {}
      {showAuthors && (
        <div className="w-80 bg-white border-r-2 border-emerald-200 shadow-lg flex flex-col">
          <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                <h3 className="font-bold text-lg">Daftar Author</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAuthors(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>
            <p className="text-xs text-emerald-100 mt-1">{uniqueAuthors.length} Penulis Terdeteksi</p>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {uniqueAuthors.map((author, idx) => {
                const journalCount = extractedMetadata.filter(j => j.detectedAuthor === author).length;
                const firstJournal = extractedMetadata.find(j => j.detectedAuthor === author);
                
                return (
                  <Card key={idx} className="p-3 hover:shadow-md transition-shadow border-emerald-100">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 border-2 border-emerald-200">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs font-bold">
                          {author.split(' ').slice(0, 2).map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-800 truncate">{author}</p>
                        {firstJournal?.authorInstitution && firstJournal.authorInstitution !== 'Not specified' && (
                          <p className="text-xs text-slate-500 truncate">🏛️ {firstJournal.authorInstitution}</p>
                        )}
                        {firstJournal?.publicationYear && (
                          <p className="text-xs text-blue-600 mt-1">📅 {firstJournal.publicationYear}</p>
                        )}
                        <p className="text-xs text-emerald-600 mt-1 font-medium">
                          📚 {journalCount} jurnal
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {}
    <Card className="flex-1 flex flex-col shadow-2xl border-2 border-emerald-500/20 bg-white">`
      
      {/* --- HEADER dengan tema Emerald-Teal --- */}
      <CardHeader className="border-b bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-4 px-6">
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-xl p-3 rounded-xl border border-white/30 shadow-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">EnerNova AI</span>
              <p className="text-sm text-emerald-100 font-normal">Eco-Futurist Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAuthors(!showAuthors)}
              className="text-white hover:bg-white/20 gap-2"
            >
              <Users className="w-4 h-4" />
              <span className="text-sm">{uniqueAuthors.length} Authors</span>
            </Button>
            
            {isLoading && (
              <Button variant="ghost" size="sm" onClick={() => stop()} className="text-white hover:bg-white/20 h-9 px-4 text-sm font-medium">
                ■ Stop
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>`

      {}
      <CardContent className="flex-1 p-0 overflow-hidden bg-gradient-to-br from-slate-50 to-emerald-50/30">
        <ScrollArea className="h-full p-6">
          <div className="flex flex-col gap-6">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${
                  m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {}
                {m.role === 'user' ? (
                  <Avatar className="h-10 w-10 mt-1 shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold">
                      YOU
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-12 w-12 mt-1 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-emerald-500 shadow-xl">
                    <RobotAvatar size={48} className="drop-shadow-xl" />
                  </div>
                )}

                {}
                <div
                  className={`rounded-2xl p-5 max-w-[75%] shadow-lg ${
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-emerald-600 to-emerald-500 text-white rounded-tr-none'
                      : 'bg-white border-2 border-teal-200 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {m.role === 'user' ? (
                    
                    <p className="whitespace-pre-wrap text-base leading-relaxed">{m.content}</p>
                  ) : (
                    
                    <div className="prose prose-sm max-w-none prose-headings:text-emerald-700 prose-a:text-teal-600 prose-strong:text-emerald-800 prose-code:bg-emerald-100 prose-code:text-emerald-700 prose-pre:bg-slate-800">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          
                          table: ({node, ...props}) => (
                            <div className="overflow-x-auto my-3 border-2 border-emerald-200 rounded-lg">
                              <table className="w-full text-left text-sm border-collapse" {...props} />
                            </div>
                          ),
                          th: ({node, ...props}) => <th className="border-b-2 border-emerald-200 bg-emerald-50 p-3 font-semibold text-emerald-700" {...props} />,
                          td: ({node, ...props}) => <td className="border-b border-emerald-100 p-3" {...props} />,
                          a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" className="text-teal-600 underline hover:text-teal-800 font-medium" {...props} />,
                          p: ({node, ...props}) => <p className="my-2 leading-relaxed" {...props} />,
                          ul: ({node, ...props}) => <ul className="my-2 ml-4 list-disc" {...props} />,
                          ol: ({node, ...props}) => <ol className="my-2 ml-4 list-decimal" {...props} />,
                          li: ({node, ...props}) => <li className="my-1" {...props} />,
                          code: ({node, ...props}) => <code className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-sm" {...props} />,
                          pre: ({node, ...props}) => <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto my-3" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-emerald-800" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-emerald-700 mt-4 mb-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-xl font-bold text-emerald-700 mt-3 mb-2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-lg font-bold text-emerald-700 mt-2 mb-1" {...props} />
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  )}
                  
                  {}
                  {m.showChart && m.role === 'assistant' && (
                    <div className="mt-4 border-t-2 border-teal-200 pt-4">
                      <div className="flex items-center gap-2 mb-3 text-teal-700">
                        <BarChart3 className="w-5 h-5" />
                        <span className="font-semibold">Visualisasi Data Interaktif</span>
                      </div>
                      {m.showChart === 'renewable' && <RenewableEnergyPotentialChart />}
                      {m.showChart === 'nickel' && <NickelProductionChart />}
                      {m.showChart === 'battery' && <BatteryComparisonChart />}
                      {m.showChart === 'environmental' && <EnvironmentalImpactChart />}
                      {m.showChart === 'energymix' && <EnergyMixPieChart />}
                    </div>
                  )}
                  
                  {}
                  {m.metadata?.mode && m.role === 'assistant' && (
                    <div className="mt-3 pt-3 border-t border-teal-100">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full border border-teal-200">
                        <TrendingUp className="w-3 h-3" />
                        {m.metadata.mode}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {}
            {isLoading && (
              <div className="flex gap-3">
                 <div className="h-12 w-12 mt-1 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-emerald-500 shadow-xl animate-pulse">
                   <RobotAvatar size={48} />
                 </div>
                 <div className="bg-white border-2 border-teal-200 rounded-2xl rounded-tl-none p-5 shadow-lg">
                   <div className="flex gap-2 items-center">
                     <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                     <span className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                     <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                   </div>
                 </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {}
      <CardFooter className="p-5 border-t bg-white shadow-inner">
        <form onSubmit={handleSubmit} className="flex w-full gap-3">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Tanyakan tentang teknologi energi terbarukan..."
            className="flex-1 py-6 px-5 rounded-full border-2 border-emerald-300 focus-visible:ring-4 focus-visible:ring-teal-300 shadow-sm text-base"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="h-12 px-6 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
    </div>
  );
}