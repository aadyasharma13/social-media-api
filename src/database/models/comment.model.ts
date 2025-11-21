import { Document, model, Model, Schema } from "mongoose";
import { IComment } from "../../interfaces/comment-interface";
import IUserModel from "./user.model";
import { Post } from "./post.model";

export default interface ICommentModel extends IComment, Document {
  toJSONFor(user: IUserModel): any;
}

const CommentSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: Schema.Types.String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // We manually handle createdAt
});

// Increment post.commentsCount when a comment is created
CommentSchema.post('save', async function() {
  try {
    await Post.findByIdAndUpdate(this.post, {
      $inc: { commentsCount: 1 }
    });
  } catch (error) {
    console.error('Error incrementing commentsCount:', error);
  }
});

// Decrement post.commentsCount when a comment is deleted
// Handle findOneAndDelete and findByIdAndDelete
CommentSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    try {
      await Post.findByIdAndUpdate(doc.post, {
        $inc: { commentsCount: -1 }
      });
    } catch (error) {
      console.error('Error decrementing commentsCount:', error);
    }
  }
});

CommentSchema.post('findByIdAndDelete', async function(doc) {
  if (doc) {
    try {
      await Post.findByIdAndUpdate(doc.post, {
        $inc: { commentsCount: -1 }
      });
    } catch (error) {
      console.error('Error decrementing commentsCount:', error);
    }
  }
});

// Also handle remove() method (for backward compatibility)
CommentSchema.post('remove', async function() {
  try {
    await Post.findByIdAndUpdate(this.post, {
      $inc: { commentsCount: -1 }
    });
  } catch (error) {
    console.error('Error decrementing commentsCount:', error);
  }
});

CommentSchema.methods.toJSONFor = function (user: IUserModel) {
  return {
    id: this._id,
    content: this.content,
    createdAt: this.createdAt,
    user: this.user.toProfileJSONFor ? this.user.toProfileJSONFor(user) : this.user
  };
};

export const Comment: Model<ICommentModel> = model<ICommentModel>('Comment', CommentSchema);
