const express = require('express');
const ForumPost = require('../models/ForumPost');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Middleware: only women and girls can access the forum
const forumAccess = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(403).json({ success: false, error: 'User not found' });

    // If DB role is not set yet, check if frontend sent it via header and sync it
    if (!['women', 'girls'].includes(user.role)) {
      const clientRole = req.headers['x-user-role'];
      if (clientRole && ['women', 'girls'].includes(clientRole)) {
        user.role = clientRole;
        await user.save();
      } else {
        return res.status(403).json({ success: false, error: 'Forum is only available for Women and Non-Menstruators categories' });
      }
    }
    next();
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/forum — list posts (newest first), optional ?category= filter
router.get('/', protect, forumAccess, async (req, res) => {
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
router.get('/:id', protect, forumAccess, async (req, res) => {
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

// POST /api/forum — create a post
router.post('/', protect, forumAccess, async (req, res) => {
  try {
    const { title, body, category } = req.body;
    const post = await ForumPost.create({
      user: req.user._id,
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

// PUT /api/forum/:id/like — toggle like
router.put('/:id/like', protect, forumAccess, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

    const userId = req.user._id.toString();
    const idx = post.likes.findIndex(id => id.toString() === userId);

    if (idx === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(idx, 1);
    }
    await post.save();

    res.json({ success: true, likes: post.likes.length, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/forum/:id/comments — add comment
router.post('/:id/comments', protect, forumAccess, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

    post.comments.push({ user: req.user._id, body: req.body.body });
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
