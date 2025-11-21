import User from "../database/models/user.model";
import Post from "../database/models/post.model";

export interface IComment {
  post: Post;
  user: User;
  content: string;
  createdAt: Date;
}
