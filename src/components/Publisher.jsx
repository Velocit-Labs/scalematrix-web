import React, { useState, useEffect } from 'react';
import { FiSend, FiClock, FiCalendar, FiTrash2, FiCheckCircle, FiXCircle, FiLoader, FiAlertCircle, FiImage } from 'react-icons/fi';

export default function Publisher({ 
  caption, 
  setCaption, 
  mediaUrl, 
  setMediaUrl, 
  settings, 
  instagramConnected 
}) {
  const [isInstant, setIsInstant] = useState(true);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queue, setQueue] = useState([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch scheduled queue
  const fetchQueue = async () => {
    setIsLoadingQueue(false);
  };

  useEffect(() => {
    // Removed API call
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleCancelPost = async (id) => {
    // Removed API call
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    const date = new Date(isoStr);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 bg-neutral-950 flex flex-col md:flex-row font-sans h-[calc(100vh-80px)] overflow-hidden">
      
      {/* Left Panel: Composer Form */}
      <div className="w-full md:w-96 border-r border-neutral-850 p-8 flex flex-col justify-between h-full bg-neutral-950 overflow-y-auto">
        <form onSubmit={handlePostSubmit} className="space-y-6">
          <h3 className="text-lg font-bold text-white mb-2">Compose Instagram Post</h3>
          
          {/* Media Preview URL */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Media URL (Image / Video)</label>
            <input
              type="url"
              required
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="e.g. https://images.unsplash.com/photo-..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all duration-300"
            />
            <span className="block text-[10px] text-neutral-500 leading-normal">
              Provide a direct URL to an image (.jpg/.png) or video (.mp4) hosted on a public server.
            </span>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Post Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your post caption, tags, and calls to action here..."
              rows={6}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all duration-300 resize-none leading-relaxed"
            />
          </div>

          {/* Publishing Mode */}
          <div className="bg-neutral-900/40 p-4 rounded-2xl border border-neutral-850 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Publish Instantly</span>
              <button
                type="button"
                onClick={() => setIsInstant(!isInstant)}
                className={`w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none flex items-center p-1 ${
                  isInstant ? 'bg-purple-600' : 'bg-neutral-800'
                }`}
              >
                <span className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  isInstant ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {!isInstant && (
              <div className="space-y-3 pt-2 border-t border-neutral-850">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Schedule Date & Time</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    required={!isInstant}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="time"
                    required={!isInstant}
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-start gap-2">
              <FiCheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !mediaUrl.trim()}
            className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'bg-purple-950 text-purple-400 border border-purple-800/50 cursor-wait'
                : 'bg-purple-600 hover:bg-purple-500 text-white active:scale-98'
            }`}
          >
            {isSubmitting ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                {isInstant ? 'Publishing Post...' : 'Scheduling Post...'}
              </>
            ) : (
              <>
                {isInstant ? (
                  <>
                    <FiSend className="w-4 h-4" />
                    Publish Post Now
                  </>
                ) : (
                  <>
                    <FiClock className="w-4 h-4" />
                    Schedule for Later
                  </>
                )}
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-neutral-500 text-center leading-normal mt-6 border-t border-neutral-900 pt-4">
          Verify your account connections before posting. Media URLs must be publicly viewable.
        </p>
      </div>

      {/* Right Panel: Queue List */}
      <div className="flex-1 bg-neutral-950/20 p-8 overflow-y-auto h-full flex flex-col space-y-6">
        <div className="flex justify-between items-center border-b border-neutral-850 pb-4">
          <div>
            <h4 className="text-lg font-bold text-white">Posting Queue & History</h4>
            <p className="text-xs text-neutral-400 mt-1">Track post status, background schedules, and errors.</p>
          </div>
          <button
            onClick={fetchQueue}
            className="text-xs font-semibold text-neutral-400 hover:text-white py-1.5 px-3 rounded-lg hover:bg-neutral-900 border border-neutral-800 transition-all flex items-center gap-1.5"
          >
            {isLoadingQueue ? (
              <FiLoader className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FiCalendar className="w-3.5 h-3.5" />
            )}
            Refresh Status
          </button>
        </div>

        {queue.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border border-dashed border-neutral-850 rounded-3xl bg-neutral-900/10">
            <FiClock className="w-12 h-12 text-neutral-750 mb-4" />
            <h4 className="text-sm font-bold text-white mb-2">No Posts in Queue</h4>
            <p className="text-neutral-500 text-xs max-w-sm leading-relaxed">
              Create a scheduled post in the composer panel. Pending publications will appear here and run automatically in the background.
            </p>
          </div>
        ) : (
          <div className="bg-neutral-900/60 rounded-3xl border border-neutral-800 shadow-md overflow-hidden flex flex-col flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-850 bg-neutral-900/80 text-neutral-400 font-semibold uppercase tracking-wider">
                    <th className="py-4 px-6">Media Preview</th>
                    <th className="py-4 px-6">Caption</th>
                    <th className="py-4 px-6">Scheduled Time</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-850">
                  {queue.map((post) => (
                    <tr key={post.id} className="hover:bg-neutral-800/10 text-neutral-300 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.mediaUrl}
                            alt="Preview"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150';
                            }}
                            className="w-12 h-12 rounded-lg object-cover bg-neutral-800 border border-neutral-850 flex-shrink-0"
                          />
                          <div className="font-mono text-[9px] text-neutral-500 max-w-[120px] truncate">
                            {post.id}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        <p className="line-clamp-2 leading-relaxed text-neutral-300">
                          {post.caption || <span className="italic text-neutral-600">No caption</span>}
                        </p>
                      </td>
                      <td className="py-4 px-6 font-medium text-neutral-400">
                        {formatDate(post.scheduledAt)}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wide uppercase ${
                          post.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : post.status === 'FAILED'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : post.status === 'PUBLISHING'
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {post.status === 'PUBLISHED' && <FiCheckCircle className="w-3.5 h-3.5" />}
                          {post.status === 'FAILED' && <FiXCircle className="w-3.5 h-3.5" />}
                          {post.status === 'PUBLISHING' && <FiLoader className="w-3.5 h-3.5 animate-spin" />}
                          {post.status === 'PENDING' && <FiClock className="w-3.5 h-3.5" />}
                          {post.status}
                        </span>
                        {post.error && (
                          <div className="text-[10px] text-red-400 font-semibold mt-1 bg-red-950/20 p-2 rounded-lg border border-red-500/10 max-w-xs leading-normal">
                            ⚠️ {post.error}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {post.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancelPost(post.id)}
                            className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                            title="Cancel schedule"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
