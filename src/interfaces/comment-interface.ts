import { Types } from 'mongoose';
import type IUserModel from '../database/models/user.model';
import type IPostModel from '../database/models/post.model';

export interface IComment {
  post: IPostModel | Types.ObjectId | string;
  user: IUserModel | Types.ObjectId | string;
  content: string;
  createdAt: Date;
}
