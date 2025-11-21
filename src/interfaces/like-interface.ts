import User from '../database/models/user.model';
import Post from '../database/models/post.model';

export interface ILike {
  user: User;
  post: Post;
  createdAt: Date;
}

