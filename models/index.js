const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

const { belongsTo } = require("./User");

Post.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasMany(Post, {
  onDelete: "cascade",
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
});

Post.hasMany(Comment, {
  onDelete: "cascade",
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasMany(Comment, {
  onDelete: "cascade",
});

module.exports = { User, Post, Comment };
