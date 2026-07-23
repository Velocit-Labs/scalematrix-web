import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiPlus, FiArrowLeft, FiArrowRight, FiLoader, FiZap, FiCheckCircle } from 'react-icons/fi';

export default function Planner({ settings, setActiveView, setSharedMediaUrl, setSharedCaption }) {
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [campaignOutline, setCampaignOutline] = useState('');
  const [isGeneratingCampaign, setIsGeneratingCampaign] = useState(false);

  const fetchScheduled = async () => {
    setIsLoading(false);
  };

  useEffect(() => {
    // Removed API call
  }, []);

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const days = getDaysInMonth();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getPostsForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return scheduledPosts.filter(post => {
      if (!post.scheduledAt) return false;
      return post.scheduledAt.startsWith(dateString);
    });
  };

  const generateCampaignOutline = async () => {
    setIsGeneratingCampaign(false);
    setCampaignOutline('');
  };

  return (
    <div className="flex-1 bg-neutral-950 p-8 text-neutral-200 overflow-y-auto font-sans flex flex-col space-y-6">
      
      {/* Upper header action area (borderless) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-neutral-900 p-6 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400">
            <FiCalendar className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Growth Schedule Planner</span>
          </div>
          <h3 className="text-sm font-extrabold text-white">Content Calendar</h3>
          <p className="text-xs text-neutral-400">
            Plan timelines, rearrange schedule slots, and construct high-conversion weekly campaigns.
          </p>
        </div>
        <button
          onClick={generateCampaignOutline}
          disabled={isGeneratingCampaign}
          className="py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          {isGeneratingCampaign ? (
            <>
              <FiLoader className="w-3.5 h-3.5 animate-spin" />
              Building Campaign...
            </>
          ) : (
            <>
              <FiZap className="w-3.5 h-3.5" />
              AI Campaign Outline
            </>
          )}
        </button>
      </div>

      {/* Calendar Grid Section */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left: Monthly Calendar (borderless) */}
        <div className="lg:col-span-3 bg-neutral-900 p-6 rounded-3xl flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-extrabold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h4>
            <div className="flex gap-2">
              <button 
                onClick={prevMonth}
                className="p-2 bg-neutral-950 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors animate-none"
              >
                <FiArrowLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 bg-neutral-950 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors animate-none"
              >
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2.5 text-center text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2.5 flex-1 auto-rows-fr">
            {days.map((date, idx) => {
              const dayPosts = getPostsForDate(date);
              const isToday = date && date.toDateString() === new Date().toDateString();
              
              return (
                <div 
                  key={idx} 
                  className={`min-h-[90px] p-2 rounded-xl flex flex-col justify-between transition-all select-none ${
                    !date 
                      ? 'bg-transparent' 
                      : isToday
                        ? 'bg-purple-950/20'
                        : 'bg-neutral-950 hover:bg-neutral-850'
                  }`}
                  onClick={() => {
                    if (date) {
                      setSharedMediaUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800');
                      setSharedCaption('');
                      setActiveView('publishing');
                    }
                  }}
                >
                  {date ? (
                    <>
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                          isToday ? 'bg-purple-600 text-white' : 'text-neutral-400'
                        }`}>
                          {date.getDate()}
                        </span>
                        {dayPosts.length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        )}
                      </div>
                      
                      <div className="space-y-1 mt-2">
                        {dayPosts.slice(0, 2).map(p => (
                          <div 
                            key={p.id} 
                            title={p.caption}
                            className="bg-neutral-900 rounded px-1.5 py-0.5 text-[8px] font-bold text-neutral-350 truncate leading-normal"
                          >
                            {p.caption || 'Video Reel'}
                          </div>
                        ))}
                        {dayPosts.length > 2 && (
                          <div className="text-[7px] text-purple-400 font-bold pl-1">
                            +{dayPosts.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  ) : <div />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Campaign Outlines (borderless) */}
        <div className="bg-neutral-900 p-6 rounded-3xl space-y-6 h-full flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-white">Campaign Blueprint</h4>
            <p className="text-[11px] text-neutral-400 leading-normal">
              Map and plan post schedules according to strategic product launches or event spikes.
            </p>

            {campaignOutline ? (
              <div className="bg-neutral-950 p-4 rounded-2xl text-[10px] text-neutral-300 font-mono space-y-2 max-h-[360px] overflow-y-auto leading-relaxed">
                <CampaignMarkdownViewer content={campaignOutline} />
              </div>
            ) : (
              <div className="p-8 rounded-2xl text-center space-y-2 bg-neutral-950/20">
                <FiZap className="w-8 h-8 text-neutral-700 mx-auto" />
                <span className="text-[10px] text-neutral-500 block leading-normal">
                  Generate a structured 7-day campaign strategy template instantly.
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveView('publishing')}
            className="w-full py-3 px-4 bg-neutral-950 hover:bg-neutral-850 text-xs font-bold rounded-xl text-neutral-300 hover:text-white flex items-center justify-center gap-2 transition-all mt-4"
          >
            <FiPlus className="w-4 h-4" />
            Schedule New Post
          </button>
        </div>

      </div>

    </div>
  );
}

function CampaignMarkdownViewer({ content }) {
  if (!content) return null;
  const lines = content.split('\n');
  const rendered = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      rendered.push(
        <h6 key={idx} className="text-[10px] font-bold text-white mt-3 mb-1" >
          {trimmed.slice(4)}
        </h6>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const parsed = trimmed.slice(2)
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
      rendered.push(
        <li key={idx} className="list-disc ml-3 mb-1" dangerouslySetInnerHTML={{ __html: parsed }} />
      );
    } else if (trimmed !== '') {
      const parsed = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
      rendered.push(
        <p key={idx} className="mb-2" dangerouslySetInnerHTML={{ __html: parsed }} />
      );
    }
  });

  return <div className="space-y-0.5">{rendered}</div>;
}
