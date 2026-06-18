import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sendChatMessage, getWeeklyReport } from '../../api/coach.api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import AppLayout from '../../components/layout/AppLayout';
import { MessageSquare, FileText, Send, Sparkles } from 'lucide-react';

export const Coach = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'report'
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: "Hi! I'm EcoWise, your AI sustainability coach. Ask me to 'recommend reduction tips', 'explain my carbon score', or 'give me my weekly report'!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  
  const chatBottomRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Load weekly narrative report
  useEffect(() => {
    const fetchReport = async () => {
      setReportLoading(true);
      try {
        const res = await getWeeklyReport();
        setWeeklyReport(res.data.report);
      } catch (err) {
        console.error(err);
        setWeeklyReport("Report failed to compile. Please log your carbon entry first.");
      } finally {
        setReportLoading(false);
      }
    };
    if (activeTab === 'report') {
      fetchReport();
    }
  }, [activeTab]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || chatLoading) return;

    const userMessage = inputValue;
    setInputValue('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatLoading(true);

    try {
      const res = await sendChatMessage(userMessage);
      setChatMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
      
      // Award 5 green points for chatting (reflected on user refresh)
      await refreshUser();
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I lost connection to my neural database. Please try again in a bit!" }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto h-[calc(100vh-140px)]">
        
        {/* Toggle Tabs */}
        <div className="flex bg-bg-surface border border-green-500/10 p-1 rounded-2xl w-full sm:w-fit self-center">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === 'chat'
                ? 'bg-accent-green text-bg-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <MessageSquare size={16} />
            AI Chat Companion
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === 'report'
                ? 'bg-accent-green text-bg-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <FileText size={16} />
            Weekly Narrative Report
          </button>
        </div>

        {/* Chat Companion Tab View */}
        {activeTab === 'chat' && (
          <Card className="flex-1 border border-green-500/10 flex flex-col justify-between h-[450px] relative overflow-hidden bg-gradient-to-b from-bg-surface to-bg-primary/20">
            {/* Messages box */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed font-semibold ${
                      msg.sender === 'user'
                        ? 'bg-accent-green text-bg-primary font-bold rounded-tr-none'
                        : 'bg-bg-elevated/70 text-text-primary border border-green-500/10 rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-bg-elevated/70 text-text-muted border border-green-500/10 px-4 py-3 rounded-2xl rounded-tl-none text-xs font-bold flex items-center gap-2">
                    <Sparkles size={14} className="animate-spin text-accent-green" />
                    <span>Analyzing footprint data...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="border-t border-green-500/10 p-4 bg-bg-surface/50 flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask EcoWise: 'What tips do you have for meat-eaters?'"
                className="flex-1 bg-bg-primary border border-green-500/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-green"
              />
              <Button type="submit" variant="primary" className="!p-3.5 flex items-center justify-center">
                <Send size={18} />
              </Button>
            </form>
          </Card>
        )}

        {/* Weekly Narrative Report Tab View */}
        {activeTab === 'report' && (
          <Card className="flex-1 border border-green-500/10 overflow-y-auto p-8 no-scrollbar bg-bg-surface/30">
            {reportLoading ? (
              <div className="h-full flex flex-col items-center justify-center gap-3">
                <Sparkles size={36} className="animate-spin text-accent-green" />
                <span className="text-sm font-bold text-text-muted">Compiling environmental narrative report...</span>
              </div>
            ) : (
              <article className="prose prose-invert max-w-none prose-sm text-text-primary whitespace-pre-line leading-relaxed">
                {weeklyReport}
              </article>
            )}
          </Card>
        )}

      </div>
    </AppLayout>
  );
};
export default Coach;
