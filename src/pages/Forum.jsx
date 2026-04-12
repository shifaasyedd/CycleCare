import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle, Plus, Search, Clock, User, ArrowLeft, Send,
  Heart, MessageSquare
} from "lucide-react";
import Navbar from "../components/Navbar";

const CATEGORIES = ["General", "Health Tips", "Support", "Questions"];

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

export default function Forum() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(localStorage.getItem("cyclecare_theme") === "dark");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "", category: "General" });
  const [creating, setCreating] = useState(false);
  const [user, setUser] = useState(null);

  const API_URL = `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/forum`;
  const getToken = () => localStorage.getItem("cyclecare_token");
  const getHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
    "x-user-role": localStorage.getItem("cyclecare_role") || "",
  });

  useEffect(() => {
    const handler = () => setDark(localStorage.getItem("cyclecare_theme") === "dark");
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  useEffect(() => {
    const u = localStorage.getItem("cyclecare_user");
    if (u) setUser(JSON.parse(u));
    // Only women and girls can access the forum
    const role = localStorage.getItem("cyclecare_role");
    if (role && !["women", "girls"].includes(role)) {
      alert("The forum is only available for Women and Non-Menstruators categories.");
      navigate("/category");
    }
  }, [navigate]);

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
    overlay: "rgba(0,0,0,0.7)",
    shadow: "0 1px 3px rgba(0,0,0,0.4)",
    shadowLg: "0 12px 40px rgba(0,0,0,0.5)",
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
    overlay: "rgba(0,0,0,0.4)",
    shadow: "0 1px 3px rgba(0,0,0,0.06)",
    shadowLg: "0 12px 40px rgba(0,0,0,0.1)",
  },
  [dark]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) { navigate("/login"); return; }
      const url = activeCategory ? `${API_URL}?category=${encodeURIComponent(activeCategory)}` : API_URL;
      const res = await fetch(url, { headers: getHeaders() });
      const data = await res.json();
      if (data.success) setPosts(data.posts);
    } catch { /* ignore */ } finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_URL, activeCategory, navigate]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.body.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newPost),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => [data.post, ...prev]);
        setShowCreate(false);
        setNewPost({ title: "", body: "", category: "General" });
      }
    } catch { /* ignore */ } finally { setCreating(false); }
  };

  const currentUserId = user?.id || user?._id;

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar active="Forum" />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 32px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Community Forum</h1>
            <p style={{ fontSize: 14, color: t.textSecondary, margin: "6px 0 0" }}>Share, ask questions, and support each other</p>
          </div>
          <button onClick={() => setShowCreate(true)} style={{
            padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none",
            background: `linear-gradient(135deg, ${t.gradientStart}, ${t.gradientEnd})`, color: "white",
            boxShadow: `0 4px 16px ${t.accentSoft}`,
          }}>+ New Post</button>
        </div>

        {/* Category filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          <button onClick={() => setActiveCategory(null)} style={{
            padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
            background: !activeCategory ? `linear-gradient(135deg, ${t.gradientStart}, ${t.gradientEnd})` : "transparent",
            border: !activeCategory ? "none" : `1px solid ${t.border}`, color: !activeCategory ? "white" : t.textSecondary,
          }}>All</button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)} style={{
              padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              background: activeCategory === c ? `linear-gradient(135deg, ${t.gradientStart}, ${t.gradientEnd})` : "transparent",
              border: activeCategory === c ? "none" : `1px solid ${t.border}`, color: activeCategory === c ? "white" : t.textSecondary,
            }}>{c}</button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: t.textTertiary }}>Loading posts...</div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: t.textTertiary }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>&#128172;</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>No posts yet</div>
            <div style={{ fontSize: 13 }}>Be the first to start a conversation!</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {posts.map(post => {
              const liked = post.likes?.some(id => id === currentUserId || id?._id === currentUserId);
              return (
                <div key={post._id} onClick={() => navigate(`/forum/${post._id}`)} style={{
                  background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: "20px 24px",
                  cursor: "pointer", transition: "all 0.2s", boxShadow: t.shadow,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = t.surfaceHover; e.currentTarget.style.borderColor = t.borderStrong; }}
                onMouseLeave={e => { e.currentTarget.style.background = t.surface; e.currentTarget.style.borderColor = t.border; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: `${categoryColors[post.category] || t.accent}18`, color: categoryColors[post.category] || t.accent }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: 11, color: t.textTertiary }}>{timeAgo(post.createdAt)}</span>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{post.title}</div>
                  <div style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.5, marginBottom: 14 }}>
                    {post.body.length > 180 ? post.body.slice(0, 180) + "..." : post.body}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 11, background: `linear-gradient(135deg, ${t.gradientStart}, ${t.gradientEnd})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white", fontWeight: 700 }}>
                        {(post.user?.name || "?")[0].toUpperCase()}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{post.user?.name || "Anonymous"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: liked ? t.accent : t.textTertiary }}>
                        {liked ? "\u2764\uFE0F" : "\u2661"} {post.likes?.length || 0}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: t.textTertiary }}>
                        &#128488; {post.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: t.overlay, backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowCreate(false)}>
          <div style={{ background: t.surface, borderRadius: 20, padding: 32, maxWidth: 560, width: "90%", border: `1px solid ${t.borderStrong}`, boxShadow: t.shadowLg }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>New Post</h2>
              <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: t.textTertiary }}>&#10005;</button>
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.textSecondary, marginBottom: 6 }}>Category</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {CATEGORIES.map(c => (
                    <button key={c} type="button" onClick={() => setNewPost(p => ({ ...p, category: c }))} style={{
                      padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                      background: newPost.category === c ? `${categoryColors[c]}20` : "transparent",
                      border: `1px solid ${newPost.category === c ? categoryColors[c] : t.border}`,
                      color: newPost.category === c ? categoryColors[c] : t.textSecondary,
                    }}>{c}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.textSecondary, marginBottom: 6 }}>Title</label>
                <input value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} maxLength={200} placeholder="What's on your mind?"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.textSecondary, marginBottom: 6 }}>Body</label>
                <textarea value={newPost.body} onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))} maxLength={5000} rows={6} placeholder="Share your thoughts, questions, or tips..."
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowCreate(false)} style={{ padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "transparent", border: `1px solid ${t.border}`, color: t.textSecondary }}>Cancel</button>
                <button type="submit" disabled={creating || !newPost.title.trim() || !newPost.body.trim()} style={{
                  padding: "10px 24px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none",
                  background: `linear-gradient(135deg, ${t.gradientStart}, ${t.gradientEnd})`, color: "white",
                  opacity: creating || !newPost.title.trim() || !newPost.body.trim() ? 0.5 : 1,
                }}>{creating ? "Posting..." : "Post"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
