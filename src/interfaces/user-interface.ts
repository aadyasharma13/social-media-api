import User from "../database/models/user.model";

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
  following: User[];
}


export interface IProfile {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}
