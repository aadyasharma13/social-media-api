import { Types } from 'mongoose';
import type IUserModel from '../database/models/user.model';
import type IPostModel from '../database/models/post.model';

export interface ILike {
  user: IUserModel | Types.ObjectId | string;
  post: IPostModel | Types.ObjectId | string;
  createdAt: Date;
}

