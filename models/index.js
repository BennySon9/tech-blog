const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

User.hasMany(Post, {
  onDelete: "cascade",
});

Post.belongsTo(User, {
  foreignKey: "user_id",
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
});

User.hasMany(Comment, {
  onDelete: "cascade",
});

Post.hasMany(Comment, {
  onDelete: "cascade",
});

module.exports = { User, Post, Comment };
