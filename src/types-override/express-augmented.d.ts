import Post from "../database/models/post.model";
import Comment from "../database/models/comment.model";
import User from "../database/models/user.model";

declare module "express" {

  export interface Request {
    post?: Post;
    comment?: Comment;
    profile?: User;
    payload?: {
      id: string,
      username: string,
      exp: number,
      iat: number
    };
  }
}
