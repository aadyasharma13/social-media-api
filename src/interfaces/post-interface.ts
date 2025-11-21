import User from '../database/models/user.model';
import Comment from '../database/models/comment.model';


export interface IPost {
  content: string;
  imageUrl: string | null;
  author: User;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[]
}


export interface IQuery {
  author: string;
}

