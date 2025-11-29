"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Star, Send, Users, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Comment {
  id: string;
  display_name: string | null;
  comment: string;
  rating: number | null;
  is_local: boolean;
  created_at: string;
}

interface CommunityCommentsProps {
  barbershopId: string;
  barbershopName: string;
}

export function CommunityComments({ barbershopId, barbershopName }: CommunityCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [myCommentIds, setMyCommentIds] = useState<Set<string>>(new Set());
  
  // Form state
  const [newComment, setNewComment] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load my comment IDs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`my-comments-${barbershopId}`);
    if (stored) {
      setMyCommentIds(new Set(JSON.parse(stored)));
    }
  }, [barbershopId]);

  // Fetch comments
  useEffect(() => {
    async function fetchComments() {
      const { data, error } = await supabase
        .from('community_comments')
        .select('*')
        .eq('barbershop_id', barbershopId)
        .eq('is_verified', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setComments(data);
      }
      setLoading(false);
    }
    fetchComments();
  }, [barbershopId]);

  // Submit new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    
    const { data, error } = await supabase
      .from('community_comments')
      .insert({
        barbershop_id: barbershopId,
        comment: newComment.trim(),
        display_name: displayName.trim() || null,
        is_verified: true // Auto-approve for now, add moderation later
      })
      .select()
      .single();

    if (!error && data) {
      setComments(prev => [data, ...prev]);
      
      // Store this comment ID as "mine"
      const newMyCommentIds = new Set(Array.from(myCommentIds).concat([data.id]));
      setMyCommentIds(newMyCommentIds);
      localStorage.setItem(`my-comments-${barbershopId}`, JSON.stringify(Array.from(newMyCommentIds)));
      
      setNewComment("");
      setDisplayName("");
      setShowForm(false);
    }
    
    setSubmitting(false);
  };

  // Delete comment
  const handleDelete = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    const { error } = await supabase
      .from('community_comments')
      .delete()
      .eq('id', commentId);

    if (!error) {
      setComments(prev => prev.filter(c => c.id !== commentId));
      
      // Remove from my comments
      const newMyCommentIds = new Set(myCommentIds);
      newMyCommentIds.delete(commentId);
      setMyCommentIds(newMyCommentIds);
      localStorage.setItem(`my-comments-${barbershopId}`, JSON.stringify(Array.from(newMyCommentIds)));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return diffInHours < 1 ? "Just now" : `${diffInHours}h ago`;
    }
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#0072C6]" />
          Community Says
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs font-bold uppercase tracking-widest bg-[#CE1126] text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
        >
          Add Comment
        </button>
      </div>

      {/* Add Comment Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-2xl space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Local Regular, Cruise Visitor, etc."
              className="w-full px-4 py-3 rounded-full border border-gray-200 focus:border-[#CE1126] focus:outline-none text-sm"
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
              Your Experience
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="How was your cut? What should others know?"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#CE1126] focus:outline-none text-sm resize-none"
              rows={3}
              maxLength={500}
              required
            />
            <div className="text-xs text-gray-400 mt-1">{newComment.length}/500</div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-2 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-3 h-3" />
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No community comments yet.</p>
            <p className="text-xs">Be the first to share your experience!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#FCD116]/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-[#0072C6]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        {comment.display_name || "Anonymous"}
                      </span>
                      {myCommentIds.has(comment.id) && (
                        <span className="text-xs bg-[#CE1126] text-white px-2 py-0.5 rounded-full font-bold">
                          YOU
                        </span>
                      )}
                      {/* Debug info */}
                      <span className="text-xs text-gray-300 ml-2">
                        ID: {comment.id.slice(-4)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                  </div>
                </div>
                
                {/* Delete button for my comments OR claim button for unclaimed */}
                {myCommentIds.has(comment.id) ? (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-red-600 transition-colors flex items-center gap-1"
                    title="Delete your comment"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const newMyCommentIds = new Set(Array.from(myCommentIds).concat([comment.id]));
                      setMyCommentIds(newMyCommentIds);
                      localStorage.setItem(`my-comments-${barbershopId}`, JSON.stringify(Array.from(newMyCommentIds)));
                    }}
                    className="bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-gray-500 transition-colors"
                    title="Claim this comment as yours"
                  >
                    Mine
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed pl-11">
                {comment.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
