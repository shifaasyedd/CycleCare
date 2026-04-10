import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../assets/cyclecare-logo.png";

const categoryColors = {
  General: "#6366F1",
  "Health Tips": "#10B981",
  Support: "#F59E0B",
  Questions: "#3B82F6",
};

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function ForumPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const API_URL = `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/forum`;
  const getToken = () => localStorage.getItem("cyclecare_token");

  useEffect(() => {
    const saved = localStorage.getItem("cyclecare_theme");
    if (saved === "dark") setDark(true);
    const u = localStorage.getItem("cyclecare_user");
    if (u) setUser(JSON.parse(u));
  }, []);
  useEffect(() => { localStorage.setItem("cyclecare_theme", dark ? "dark" : "light"); }, [dark]);

  const t = useMemo(
    () => dark ? {
    bg: "#06060B",
    surface: "rgba(18, 18, 28, 0.95)",
    surfaceHover: "rgba(28, 28, 42, 0.95)",
    border: "rgba(255, 105, 150, 0.15)",
    borderStrong: "rgba(255, 105, 150, 0.3)",
    text: "#F1EEF6",
    textSecondary: "rgba(241, 238, 246, 0.6)",
    textTertiary: "rgba(241, 238, 246, 0.4)",
    accent: "#FF6B8B",
    accentSoft: "rgba(255, 107, 139, 0.12)",
    gradientStart: "#FF6B8B",
    gradientEnd: "#FF8EAA",
    input: "rgba(255,255,255,0.06)",
    shadow: "0 1px 3px rgba(0,0,0,0.4)",
  } : {
    bg: "#F8F6FA",
    surface: "rgba(255, 255, 255, 0.95)",
    surfaceHover: "rgba(255, 255, 255, 1)",
    border: "rgba(229, 76, 111, 0.1)",
    borderStrong: "rgba(229, 76, 111, 0.2)",
    text: "#1A1225",
    textSecondary: "rgba(26, 18, 37, 0.6)",
    textTertiary: "rgba(26, 18, 37, 0.4)",
    accent: "#E54C6F",
    accentSoft: "rgba(229, 76, 111, 0.08)",
    gradientStart: "#E54C6F",
    gradientEnd: "#FF8EAA",
    input: "rgba(0,0,0,0.03)",
    shadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  [dark]);

  const currentUserId = user?.id || user?._id;

  const fetchPost = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) { navigate("/login"); return; }
      const res = await fetch(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setPost(data.post);
      else navigate("/forum");
    } catch { navigate("/forum"); } finally { setLoading(false); }
  }, [API_URL, id, navigate]);

  useEffect(() => { fetchPost(); }, [fetchPost]);

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_URL}/${id}/like`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setPost(prev => ({
          ...prev,
          likes: data.liked
            ? [...(prev.likes || []), currentUserId]
            : (prev.likes || []).filter(lid => (lid?._id || lid) !== currentUserId),
        }));
      }
    } catch { /* ignore */ }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ body: commentBody }),
      });
      const data = await res.json();
      if (data.success) {
        setPost(data.post);
        setCommentBody("");
      }
    } catch { /* ignore */ } finally { setSubmitting(false); }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) navigate("/forum");
    } catch { /* ignore */ }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setPost(prev => ({ ...prev, comments: prev.comments.filter(c => c._id !== commentId) }));
      }
    } catch { /* ignore */ }
  };

  const isAuthor = post && currentUserId && (post.user?._id || post.user) === currentUserId;
  const liked = post?.likes?.some(lid => (lid?._id || lid) === currentUserId);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "#06060B" : "#F8F6FA", color: dark ? "#F1EEF6" : "#1A1225", fontFamily: "'Inter', sans-serif" }}>
      Loading...
    </div>
  );
  if (!post) return null;

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: dark ? "rgba(6,6,11,0.85)" : "rgba(248,246,250,0.85)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${t.border}`, padding: "0 32px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
              <img src={logo} alt="CycleCare" style={{ height: 28 }} />
              <span style={{ fontSize: 15, fontWeight: 700 }}>CycleCare</span>
            </div>
          </div>
          <div style={{ padding: "6px 12px", borderRadius: 8, background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", border: `1px solid ${t.border}`, cursor: "pointer", fontSize: 13 }} onClick={() => setDark(v => !v)}>
            {dark ? "Light" : "Dark"}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 32px 80px" }}>
        {/* Back link */}
        <Link to="/forum" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: t.textSecondary, textDecoration: "none", marginBottom: 24, fontWeight: 500 }}>
          &#8592; Back to Forum
        </Link>

        {/* Post */}
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: "28px 32px", boxShadow: t.shadow, marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: `${categoryColors[post.category] || t.accent}18`, color: categoryColors[post.category] || t.accent }}>
              {post.category}
            </span>
            <span style={{ fontSize: 12, color: t.textTertiary }}>{timeAgo(post.createdAt)}</span>
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.3, letterSpacing: -0.3 }}>{post.title}</h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: t.textSecondary, margin: "0 0 24px", whiteSpace: "pre-wrap" }}>{post.body}</p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: `1px solid ${t.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: `linear-gradient(135deg, ${t.gradientStart}, ${t.gradientEnd})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white", fontWeight: 700 }}>
                {(post.user?.name || "?")[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{post.user?.name || "Anonymous"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={handleLike} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: liked ? t.accentSoft : "transparent", border: `1px solid ${liked ? t.accent : t.border}`, color: liked ? t.accent : t.textSecondary,
              }}>
                {liked ? "\u2764\uFE0F" : "\u2661"} {post.likes?.length || 0}
              </button>
              {isAuthor && (
                <button onClick={handleDeletePost} style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444",
                }}>Delete</button>
              )}
            </div>
          </div>
        </div>

        {/* Comments */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 20px" }}>
            Comments ({post.comments?.length || 0})
          </h3>

          {/* Add comment */}
          <form onSubmit={handleComment} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 20, boxShadow: t.shadow }}>
            <textarea value={commentBody} onChange={e => setCommentBody(e.target.value)} placeholder="Write a comment..." rows={3} maxLength={2000}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: 12 }} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" disabled={submitting || !commentBody.trim()} style={{
                padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none",
                background: `linear-gradient(135deg, ${t.gradientStart}, ${t.gradientEnd})`, color: "white",
                opacity: submitting || !commentBody.trim() ? 0.5 : 1,
              }}>{submitting ? "Posting..." : "Comment"}</button>
            </div>
          </form>

          {/* Comment list */}
          {(!post.comments || post.comments.length === 0) ? (
            <div style={{ textAlign: "center", padding: 40, color: t.textTertiary, fontSize: 13 }}>
              No comments yet. Be the first to reply!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {post.comments.map(comment => {
                const isCommentAuthor = currentUserId && (comment.user?._id || comment.user) === currentUserId;
                return (
                  <div key={comment._id} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: "16px 20px", boxShadow: t.shadow }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 12, background: `linear-gradient(135deg, ${t.gradientStart}, ${t.gradientEnd})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white", fontWeight: 700 }}>
                          {(comment.user?.name || "?")[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{comment.user?.name || "Anonymous"}</span>
                        <span style={{ fontSize: 11, color: t.textTertiary }}>{timeAgo(comment.createdAt)}</span>
                      </div>
                      {isCommentAuthor && (
                        <button onClick={() => handleDeleteComment(comment._id)} style={{
                          background: "none", border: "none", fontSize: 11, cursor: "pointer", color: t.textTertiary, padding: "2px 6px",
                        }}>&#10005;</button>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: t.textSecondary, whiteSpace: "pre-wrap" }}>{comment.body}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
