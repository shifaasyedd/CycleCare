const express = require('express');
const ForumPost = require('../models/ForumPost');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Forum is accessible to all authenticated users
const forumAccess = async (req, res, next) => {
  next();
};

// GET /api/forum — list posts (newest first), optional ?category= filter
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      ForumPost.find(filter)
        .populate('user', 'name')
        .populate('comments.user', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ForumPost.countDocuments(filter),
    ]);

    res.json({
      success: true,
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/forum/:id — single post with comments
router.get('/:id', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('user', 'name')
      .populate('comments.user', 'name');
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/forum — create a post (optional auth)
router.post('/', async (req, res) => {
  try {
    const { title, body, category } = req.body;
    
    // Try to get user from token if provided
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) userId = user._id;
      } catch (e) { /* ignore token errors */ }
    }
    
    const post = await ForumPost.create({
      user: userId,
      title,
      body,
      category: category || 'General',
    });
    const populated = await post.populate('user', 'name');
    res.status(201).json({ success: true, post: populated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/forum/:id/like — toggle like (optional auth)
router.put('/:id/like', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

    // Optional auth - allow liking without login
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (e) { /* ignore */ }
    }

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Please login to like posts' });
    }

    const userIdStr = userId.toString();
    const idx = post.likes.findIndex(id => id.toString() === userIdStr);

    if (idx === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(idx, 1);
    }
    await post.save();

    res.json({ success: true, likes: post.likes.length, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/forum/:id/comments — add comment (optional auth)
router.post('/:id/comments', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

    // Optional auth
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) userId = user._id;
      } catch (e) { /* ignore */ }
    }

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Please login to comment' });
    }

    post.comments.push({ user: userId, body: req.body.body });
    await post.save();

    const populated = await post.populate('user', 'name');
    await populated.populate('comments.user', 'name');
    res.json({ success: true, post: populated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/forum/:id — delete own post
router.delete('/:id', protect, forumAccess, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/forum/:id/comments/:commentId — delete own comment
router.delete('/:id/comments/:commentId', protect, forumAccess, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, error: 'Comment not found' });
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    post.comments.pull(req.params.commentId);
    await post.save();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
