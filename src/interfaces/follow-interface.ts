import User from '../database/models/user.model';

export interface IFollow {
  follower: User;
  following: User;
  createdAt: Date;
}

