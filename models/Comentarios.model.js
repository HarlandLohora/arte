const { Schema, model } = require("mongoose");

const commentsSchema = new Schema(
  {
    content: {
      type: String,
    },
    date: {
      type: Date,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Comments = model("Comments", commentsSchema);

module.exports = Comments;
