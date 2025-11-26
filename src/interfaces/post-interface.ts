import { Types } from 'mongoose';
import type IUserModel from '../database/models/user.model';
import type ICommentModel from '../database/models/comment.model';


export interface IPost {
  content: string;
  imageUrl: string | null;
  author: IUserModel | Types.ObjectId | string;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
  comments: Array<ICommentModel | Types.ObjectId | string>;
}


export interface IQuery {
  author: string;
}

