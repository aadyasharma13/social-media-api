import { Types } from 'mongoose';
import type IUserModel from '../database/models/user.model';

export interface IUser {
  email: string;
  username: string;
  bio?: string;
  image?: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
  dob?: Date;
  role?: 'user' | 'admin';
  following: Array<IUserModel | Types.ObjectId | string>;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface IProfile {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}
