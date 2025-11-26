import { Types } from 'mongoose';

export interface IFollow {
  follower: Types.ObjectId | string;
  following: Types.ObjectId | string;
  createdAt: Date;
}

