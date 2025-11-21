import User from '../database/models/user.model';
import Post from '../database/models/post.model';

export interface INotification {
  user: User;
  type: 'follow' | 'like' | 'comment';
  sender: User;
  post: Post | null;
  isRead: boolean;
  createdAt: Date;
}

