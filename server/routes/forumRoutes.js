const express = require("express");
const router = express.Router();
const ForumPost = require("../models/ForumPost");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const User = require('../models/users');

const authenticateUser = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

// ✅ GET all posts (including votes)
router.get("/posts", async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ createdAt: -1 });

    // Include vote counts in the response
    const postsWithVotes = posts.map(post => ({
      ...post.toObject(),
      voteCount: post.votes.filter(vote => vote.voteType === "upvote").length -
                 post.votes.filter(vote => vote.voteType === "downvote").length
    }));

    res.json(postsWithVotes);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// ✅ Get a post with replies
router.get("/posts/:postId", async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("❌ Error fetching post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create a new post (Requires Authentication)
router.post("/posts", isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const user = req.user; // User should be set by `isAuthenticated`

    console.log("🔍 Incoming Data:", req.body);
    console.log("👤 Authenticated User:", user);

    if (!title || !content || !user.id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPost = new ForumPost({
      title,
      content,
      author: user.name,
      authorId: user.id,
      votes: [], // Initialize votes as an empty array
    });

    await newPost.save();
    console.log("✅ Post Saved:", newPost);

    res.status(201).json(newPost);
  } catch (error) {
    console.error("❌ Error saving post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/posts/:postId/vote", isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const { voteType } = req.body;
    const userId = req.user._id; // Ensure req.user is set by authentication middleware

    if (!["upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ✅ Find if the user already voted
    const existingVoteIndex = post.votes.findIndex(vote => vote.userId.equals(userId));

    if (existingVoteIndex !== -1) {
      // ✅ If user already voted, update or remove their vote
      if (post.votes[existingVoteIndex].voteType === voteType) {
        post.votes.splice(existingVoteIndex, 1); // Remove vote if same type
      } else {
        post.votes[existingVoteIndex].voteType = voteType; // Update vote
      }
    } else {
      // ✅ If user hasn't voted, add new vote
      post.votes.push({ userId, voteType });
    }

    await post.save();

    res.json({ message: "Vote updated successfully", voteCount: post.voteCount });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/posts/:postId/replies", isAuthenticated, async (req, res) => {
  try {
      const { postId } = req.params;
      const { content, parentReplyId } = req.body;
      const user = req.user;
  
      if (!content || !user) {
      return res.status(400).json({ message: "Reply content is required" });
      }
  
      const post = await ForumPost.findById(postId);
      if (!post) {
      return res.status(404).json({ message: "Post not found" });
      }
  
      // Determine reply level
      let level = 0;
      if (parentReplyId) {
      const parentReply = post.replies.id(parentReplyId);
      if (parentReply) {
          level = parentReply.level + 1;
      }
      }
  
      const reply = {
      userId: user._id,
      username: user.name,
      content,
      createdAt: new Date(),
      votes: [],
      postId: postId,
      parentReplyId: parentReplyId || null,
      level: level
      };
  
      post.replies.push(reply);
      await post.save();
  
      // Return organized threaded replies
      // First, convert replies to plain objects with calculated properties
      const allReplies = post.replies.map(reply => ({
      ...reply.toObject(),
      voteCount: reply.voteCount,
      postId: post._id,
      childReplies: []
      }));
  
      // Organize into threads
      const threadsMap = new Map();
      const rootReplies = [];
  
      // First pass: create a map of all replies
      allReplies.forEach(reply => {
      threadsMap.set(reply._id.toString(), reply);
      });
  
      // Second pass: build the hierarchy
      allReplies.forEach(reply => {
      if (!reply.parentReplyId) {
          rootReplies.push(reply);
      } else {
          const parentId = reply.parentReplyId.toString();
          const parent = threadsMap.get(parentId);
          if (parent) {
          parent.childReplies.push(reply);
          } else {
          rootReplies.push(reply);
          }
      }
      });
  
      // Sort replies by newest first
      rootReplies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Sort children
      rootReplies.forEach(function sortChildren(reply) {
      reply.childReplies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      reply.childReplies.forEach(sortChildren);
      });
  
      res.status(201).json(rootReplies);
  } catch (error) {
      console.error("❌ Error saving reply:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
  });

router.post("/posts/:postId/replies/:replyId/vote", isAuthenticated, async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    const { voteType } = req.body;
    const userId = req.user._id;

    if (!["upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const reply = post.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    // Find if the user already voted on this reply
    const existingVoteIndex = reply.votes.findIndex(vote => vote.userId.equals(userId));

    if (existingVoteIndex !== -1) {
      // If user already voted, update or remove their vote
      if (reply.votes[existingVoteIndex].voteType === voteType) {
        reply.votes.splice(existingVoteIndex, 1); // Remove vote if same type
      } else {
        reply.votes[existingVoteIndex].voteType = voteType; // Update vote
      }
    } else {
      // If user hasn't voted, add new vote
      reply.votes.push({ userId, voteType });
    }

    await post.save();

    // Calculate vote count for the specific reply
    const voteCount = reply.voteCount;

    res.json({ 
      message: "Reply vote updated successfully", 
      voteCount,
      replyId
    });
  } catch (error) {
    console.error("Reply vote error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/posts/:postId/replies", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await ForumPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Convert replies to objects with vote counts
    const allReplies = post.replies.map(reply => ({
      ...reply.toObject(),
      voteCount: reply.voteCount,
      postId: post._id
    }));

    // Organize replies into threads
    const threadsMap = new Map();
    const rootReplies = [];

    // First pass: create a map of all replies
    allReplies.forEach(reply => {
      reply.childReplies = [];
      threadsMap.set(reply._id.toString(), reply);
    });

    // Second pass: build the hierarchy
    allReplies.forEach(reply => {
      if (!reply.parentReplyId) {
        // This is a root level reply
        rootReplies.push(reply);
      } else {
        // This is a child reply
        const parentId = reply.parentReplyId.toString();
        const parent = threadsMap.get(parentId);
        if (parent) {
          parent.childReplies.push(reply);
        } else {
          // Parent not found, treat as root reply
          rootReplies.push(reply);
        }
      }
    });

    // Sort root replies by newest first
    rootReplies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Sort children by newest first within their parent threads
    rootReplies.forEach(function sortChildren(reply) {
      reply.childReplies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      reply.childReplies.forEach(sortChildren);
    });

    res.json(rootReplies);
  } catch (error) {
    console.error("❌ Error fetching replies:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Middleware to check user permissions for post
const checkPostPermissions = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Modify logic to allow only author to edit, but allow both admin and author to delete
    const isAdmin = req.user.role === 'admin';
    const isAuthor = post.authorId.toString() === req.user._id.toString();

    // Check if the route is for editing or deleting
    const isEditRoute = req.method === 'PUT';
    const isDeleteRoute = req.method === 'DELETE';

    if (isEditRoute) {
      // Only allow author to edit, not admin
      if (isAuthor) {
        req.post = post;
        next();
      } else {
        return res.status(403).json({ message: 'Not authorized to edit this post' });
      }
    } else if (isDeleteRoute) {
      // Allow both admin and author to delete
      if (isAdmin || isAuthor) {
        req.post = post;
        next();
      } else {
        return res.status(403).json({ message: 'Not authorized to delete this post' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update post route
router.put("/posts/:postId", authenticateUser, checkPostPermissions, async (req, res) => {
  try {
    const { title, content } = req.body;

    // Update logic remains the same, but now guaranteed to be authorized
    const updatedPost = await ForumPost.findByIdAndUpdate(
      req.params.postId, 
      { 
        title, 
        content, 
        updatedAt: new Date() 
      }, 
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
});

// Delete post route
router.delete("/posts/:postId", authenticateUser, checkPostPermissions, async (req, res) => {
  try {
    // Delete post logic
    await ForumPost.findByIdAndDelete(req.params.postId);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});

// Middleware to check reply permissions
const checkReplyPermissions = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const reply = post.replies.id(req.params.replyId);
    
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Check if the route is for editing or deleting
    const isEditRoute = req.method === 'PUT';
    const isDeleteRoute = req.method === 'DELETE';

    // Check if user is admin or reply author
    const isAdmin = req.user.role === 'admin';
    const isAuthor = reply.userId.toString() === req.user._id.toString();

    if (isEditRoute) {
      // Only allow author to edit, not admin
      if (isAuthor) {
        req.post = post;
        req.reply = reply;
        next();
      } else {
        return res.status(403).json({ message: 'Not authorized to edit this reply' });
      }
    } else if (isDeleteRoute) {
      // Allow both admin and author to delete
      if (isAdmin || isAuthor) {
        req.post = post;
        req.reply = reply;
        next();
      } else {
        return res.status(403).json({ message: 'Not authorized to delete this reply' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update the existing reply update route to maintain threading
router.put('/posts/:postId/replies/:replyId', authenticateUser, checkReplyPermissions, async (req, res) => {
  try {
      const { content } = req.body;
  
      // Find the post and update the specific reply
      const post = await ForumPost.findById(req.params.postId);
      const reply = post.replies.id(req.params.replyId);
      
      reply.content = content;
      reply.updatedAt = new Date();
      
      await post.save();
  
      // Return threaded replies
      // Use the same approach as the GET route to organize replies into threads
      const allReplies = post.replies.map(reply => ({
      ...reply.toObject(),
      voteCount: reply.voteCount,
      postId: post._id,
      childReplies: []
      }));
  
      const threadsMap = new Map();
      const rootReplies = [];
  
      allReplies.forEach(reply => {
      threadsMap.set(reply._id.toString(), reply);
      });
  
      allReplies.forEach(reply => {
      if (!reply.parentReplyId) {
          rootReplies.push(reply);
      } else {
          const parentId = reply.parentReplyId.toString();
          const parent = threadsMap.get(parentId);
          if (parent) {
          parent.childReplies.push(reply);
          } else {
          rootReplies.push(reply);
          }
      }
      });
  
      rootReplies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      rootReplies.forEach(function sortChildren(reply) {
      reply.childReplies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      reply.childReplies.forEach(sortChildren);
      });
  
      res.json(rootReplies);
  } catch (error) {
      res.status(500).json({ message: 'Error updating reply', error: error.message });
  }
  });


// Update the existing reply delete route to maintain threading
router.delete('/posts/:postId/replies/:replyId', authenticateUser, checkReplyPermissions, async (req, res) => {
  try {
      const post = await ForumPost.findById(req.params.postId);
      
      // Find the reply to be deleted
      const replyToDelete = post.replies.id(req.params.replyId);
      
      if (replyToDelete) {
      // Option 1: Delete the reply and all its children
      const deleteReplyAndChildren = (replyId) => {
          // Get all direct children
          const childIds = post.replies
          .filter(r => r.parentReplyId && r.parentReplyId.toString() === replyId.toString())
          .map(r => r._id);
          
          // Recursively delete all children
          childIds.forEach(childId => deleteReplyAndChildren(childId));
          
          // Delete the reply itself
          post.replies.pull(replyId);
      };
      
      // Start deletion from the target reply
      deleteReplyAndChildren(req.params.replyId);
      
      await post.save();
  
      // Return threaded replies using the same approach as other routes
      const allReplies = post.replies.map(reply => ({
          ...reply.toObject(),
          voteCount: reply.voteCount,
          postId: post._id,
          childReplies: []
      }));
  
      const threadsMap = new Map();
      const rootReplies = [];
  
      allReplies.forEach(reply => {
          threadsMap.set(reply._id.toString(), reply);
      });
  
      allReplies.forEach(reply => {
          if (!reply.parentReplyId) {
          rootReplies.push(reply);
          } else {
          const parentId = reply.parentReplyId.toString();
          const parent = threadsMap.get(parentId);
          if (parent) {
              parent.childReplies.push(reply);
          } else {
              rootReplies.push(reply);
          }
          }
      });
  
      rootReplies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      rootReplies.forEach(function sortChildren(reply) {
          reply.childReplies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          reply.childReplies.forEach(sortChildren);
      });
  
      res.json(rootReplies);
      } else {
      res.status(404).json({ message: 'Reply not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error deleting reply', error: error.message });
  }
  });

// Add search route to your Express router
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      const posts = await ForumPost.find().sort({ createdAt: -1 });
      return res.json(posts);
    }

    // Text search using MongoDB's $text operator (requires text indexes)
    const textSearchResults = await ForumPost.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } });

    // Regex search for more flexible matching
    const regexSearch = new RegExp(q, "i");
    const regexResults = await ForumPost.find({
      $or: [
        { title: regexSearch },
        { content: regexSearch },
        { author: regexSearch },
        { "replies.content": regexSearch },
        { "replies.username": regexSearch }
      ]
    }).sort({ createdAt: -1 });

    // Combine and deduplicate results
    const combinedResults = [...textSearchResults];
    
    // Add regex results that aren't already in the text search results
    regexResults.forEach(post => {
      if (!combinedResults.some(p => p._id.toString() === post._id.toString())) {
        combinedResults.push(post);
      }
    });

    // Add vote counts to response
    const postsWithVotes = combinedResults.map(post => ({
      ...post.toObject(),
      voteCount: post.votes.filter(vote => vote.voteType === "upvote").length -
                post.votes.filter(vote => vote.voteType === "downvote").length
    }));

    res.json(postsWithVotes);
  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).json({ message: "Error searching posts" });
  }
});

// You can extend the search route to support filtering by:
router.get("/advanced-search", async (req, res) => {
  try {
    const { 
      q, // basic search term
      author, // filter by author
      dateFrom, // filter by date range
      dateTo,
      hasReplies, // filter posts with/without replies
      sortBy // sort results (newest, oldest, most voted)
    } = req.query;
    
    // Build the query object
    const query = {};
    
    // Add text search if provided
    if (q) {
      query.$or = [
        { title: new RegExp(q, "i") },
        { content: new RegExp(q, "i") },
        { author: new RegExp(q, "i") },
        { "replies.content": new RegExp(q, "i") },
        { "replies.username": new RegExp(q, "i") }
      ];
    }
    
    // Add author filter
    if (author) {
      query.author = new RegExp(author, "i");
    }
    
    // Add date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }
    
    // Add replies filter
    if (hasReplies === "true") {
      query["replies.0"] = { $exists: true };
    } else if (hasReplies === "false") {
      query["replies.0"] = { $exists: false };
    }
    
    // Determine sort order
    let sortOption = { createdAt: -1 }; // Default: newest first
    
    if (sortBy === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sortBy === "most_voted") {
      // We'll need to sort after fetching results since voteCount is a virtual
    }
    
    // Execute query
    let results = await ForumPost.find(query).sort(sortOption);
    
    // Handle special sorting case
    if (sortBy === "most_voted") {
      results.sort((a, b) => b.voteCount - a.voteCount);
    }
    
    // Format results
    const postsWithVotes = results.map(post => ({
      ...post.toObject(),
      voteCount: post.voteCount
    }));
    
    res.json(postsWithVotes);
  } catch (error) {
    console.error("❌ Advanced search error:", error);
    res.status(500).json({ message: "Error performing advanced search" });
  }
});

module.exports = router;
