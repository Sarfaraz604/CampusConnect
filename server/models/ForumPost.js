const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }, // Optional field for tracking edits
  parentReplyId: { type: mongoose.Schema.Types.ObjectId, default: null }, // Reference to parent reply
  level: { type: Number, default: 0 }, // Nesting level (0 for direct replies to post)
  votes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      voteType: { type: String, enum: ["upvote", "downvote"] },
    },
  ]
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

// Add virtual for vote count to reply schema
replySchema.virtual('voteCount').get(function() {
  return this.votes.reduce((total, vote) => 
    (vote.voteType === "upvote" ? total + 1 : total - 1), 0);
});

// Add virtual to find child replies
replySchema.virtual('childReplies').get(function() {
  // This will be populated in the API route
  return [];
});

const forumPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }, // Optional field for tracking edits
  votes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      voteType: { type: String, enum: ["upvote", "downvote"] },
    },
  ],
  replies: [replySchema]
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

forumPostSchema.index({ 
  title: 'text', 
  content: 'text', 
  author: 'text',
  'replies.content': 'text',
  'replies.username': 'text'
});

// Virtual field to calculate total votes for the post
forumPostSchema.virtual('voteCount').get(function () {
  return this.votes.reduce((total, vote) => 
    (vote.voteType === "upvote" ? total + 1 : total - 1), 0);
});

const ForumPost = mongoose.model("ForumPost", forumPostSchema);
module.exports = ForumPost;