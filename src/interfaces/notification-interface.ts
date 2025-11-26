import { Types } from 'mongoose';
import type IUserModel from '../database/models/user.model';
import type IPostModel from '../database/models/post.model';

export interface INotification {
  user: IUserModel | Types.ObjectId | string;
  type: 'follow' | 'like' | 'comment';
  sender: IUserModel | Types.ObjectId | string;
  post?: IPostModel | Types.ObjectId | string | null;
  isRead: boolean;
  createdAt: Date;
}

