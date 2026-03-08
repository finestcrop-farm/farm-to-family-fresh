import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Bot, User, HeadphonesIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import BottomNav from '@/components/BottomNav';

interface Message {
  id: string;
  sender_type: 'user' | 'ai' | 'admin';
  content: string;
  created_at: string;
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<'ai' | 'human'>('ai');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load or create conversation
  useEffect(() => {
    const initConversation = async () => {
      if (!user) return;

      const { data: existing } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existing) {
        setConversationId(existing.id);
        setChatMode(existing.status === 'human' ? 'human' : 'ai');
        // Load messages
        const { data: msgs } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', existing.id)
          .order('created_at', { ascending: true });
        if (msgs) setMessages(msgs as Message[]);
      } else {
        const { data: newConv } = await supabase
          .from('chat_conversations')
          .insert({ user_id: user.id, status: 'ai' })
          .select()
          .single();
        if (newConv) {
          setConversationId(newConv.id);
          // Welcome message
          const welcomeMsg: Message = {
            id: 'welcome',
            sender_type: 'ai',
            content: "👋 Hi! I'm your FreshMart assistant. I can help you with:\n\n- 📦 **Order status & tracking**\n- 🛒 **Product recommendations**\n- 💳 **Payment & refund queries**\n- 🚚 **Delivery information**\n- ❓ **General FAQs**\n\nType your question or tap **Talk to Human** to connect with our support team!",
            created_at: new Date().toISOString(),
          };
          setMessages([welcomeMsg]);
        }
      }
    };

    initConversation();
  }, [user]);

  // Realtime subscription for new messages (for admin replies)
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        const newMsg = payload.new as Message;
        setMessages(prev => {
          if (prev.find(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Optimistic update
    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      sender_type: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);

    // Save to DB
    await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      sender_type: 'user',
      content: userMessage,
    });

    if (chatMode === 'ai') {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('chat-ai', {
          body: {
            message: userMessage,
            conversationId,
            history: messages.slice(-10).map(m => ({
              role: m.sender_type === 'user' ? 'user' : 'assistant',
              content: m.content,
            })),
          },
        });

        if (error) throw error;

        const aiReply: Message = {
          id: `ai-${Date.now()}`,
          sender_type: 'ai',
          content: data.reply || "I'm sorry, I couldn't process that. Please try again.",
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiReply]);

        // Save AI reply to DB
        await supabase.from('chat_messages').insert({
          conversation_id: conversationId,
          sender_type: 'ai',
          content: aiReply.content,
        });
      } catch (err) {
        console.error('AI chat error:', err);
        const errorMsg: Message = {
          id: `err-${Date.now()}`,
          sender_type: 'ai',
          content: "Sorry, I'm having trouble right now. Please try again or tap **Talk to Human** for support.",
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const escalateToHuman = async () => {
    if (!conversationId) return;

    setChatMode('human');
    await supabase.from('chat_conversations')
      .update({ status: 'human' })
      .eq('id', conversationId);

    const escalationMsg: Message = {
      id: `esc-${Date.now()}`,
      sender_type: 'ai',
      content: "🤝 I've connected you to our support team. An agent will respond shortly. Our average response time is under 5 minutes during business hours (9 AM - 9 PM).",
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, escalationMsg]);

    await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      sender_type: 'ai',
      content: escalationMsg.content,
    });
  };

  const startNewChat = async () => {
    if (!user) return;
    const { data: newConv } = await supabase
      .from('chat_conversations')
      .insert({ user_id: user.id, status: 'ai' })
      .select()
      .single();
    if (newConv) {
      setConversationId(newConv.id);
      setChatMode('ai');
      setMessages([{
        id: 'welcome-new',
        sender_type: 'ai',
        content: "👋 Hi again! How can I help you today?",
        created_at: new Date().toISOString(),
      }]);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20 flex flex-col items-center justify-center px-4">
        <Bot className="w-16 h-16 text-primary mb-4" />
        <h2 className="font-heading text-xl font-bold text-foreground mb-2">Login Required</h2>
        <p className="text-muted-foreground mb-6 text-center">Please login to use chat support</p>
        <Button onClick={() => navigate('/auth')}>Login / Sign Up</Button>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground sticky top-0 z-50 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            {chatMode === 'ai' ? (
              <Bot className="w-6 h-6" />
            ) : (
              <HeadphonesIcon className="w-6 h-6" />
            )}
            <div>
              <h1 className="font-heading text-lg font-bold">
                {chatMode === 'ai' ? 'AI Assistant' : 'Support Chat'}
              </h1>
              <p className="text-xs opacity-80">
                {chatMode === 'ai' ? 'Powered by AI • Always available' : 'Connected to support team'}
              </p>
            </div>
          </div>
          <button onClick={startNewChat} className="text-xs bg-primary-foreground/10 px-3 py-1.5 rounded-full">
            New Chat
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2 animate-fade-in",
              msg.sender_type === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {msg.sender_type !== 'user' && (
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                msg.sender_type === 'ai' ? 'bg-primary/10' : 'bg-accent/10'
              )}>
                {msg.sender_type === 'ai' ? (
                  <Bot className="w-4 h-4 text-primary" />
                ) : (
                  <HeadphonesIcon className="w-4 h-4 text-accent" />
                )}
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                msg.sender_type === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-muted text-foreground rounded-bl-md'
              )}
            >
              {msg.sender_type === 'user' ? (
                <p>{msg.content}</p>
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>
            {msg.sender_type === 'user' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Escalate Banner */}
      {chatMode === 'ai' && (
        <div className="px-4 py-2 border-t border-border bg-muted/50">
          <button 
            onClick={escalateToHuman}
            className="flex items-center gap-2 text-sm text-primary font-medium w-full justify-center py-1"
          >
            <HeadphonesIcon className="w-4 h-4" />
            Talk to Human Support
          </button>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-background">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={chatMode === 'ai' ? "Ask me anything..." : "Type your message..."}
            className="flex-1 px-4 py-3 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || isLoading}
            size="icon"
            className="rounded-xl h-12 w-12"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Chat;
