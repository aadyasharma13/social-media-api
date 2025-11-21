import { Document, Model, model, Schema } from 'mongoose';
import { IUser } from '../../interfaces/user-interface';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { JWT_SECRET } from "../../utilities/secrets";
import mongooseUniqueValidator = require("mongoose-unique-validator");


export default interface IUserModel extends IUser, Document {
  token?: string;

  generateJWT(): string;
  toAuthJSON(): any;
  setPassword(password: string): Promise<void>;
  validPassword(password: string): Promise<boolean>;
  toProfileJSONFor(user: IUserModel): any;
  isFollowing(id: string): boolean;
  follow(id: string): Promise<IUser>;
  unfollow(id: string): Promise<IUser>;
}


// ISSUE: Own every parameter and any missing dependencies
const UserSchema = new Schema({
  username : {
    type     : Schema.Types.String,
    lowercase: true,
    unique   : true,
    required : [true, "can't be blank"],
    match    : [/^[a-zA-Z0-9]+$/, 'is invalid'],
    index    : true
  },
  email    : {
    type     : Schema.Types.String,
    lowercase: true,
    unique   : true,
    required : [true, "can't be blank"],
    match    : [/\S+@\S+\.\S+/, 'is invalid'],
    index    : true
  },
  bio      : {
    type: Schema.Types.String
  },
  image    : {
    type: Schema.Types.String
  },
  avatarUrl: {
    type: Schema.Types.String
  },
  location : {
    type: Schema.Types.String
  },
  website  : {
    type: Schema.Types.String
  },
  dob      : {
    type: Schema.Types.Date
  },
  role     : {
    type: Schema.Types.String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  following: [
    {
      type: Schema.Types.ObjectId,
      ref : 'User'
    }
  ],
  hash     : {
    type: Schema.Types.String
  },
}, {timestamps: true});


UserSchema.plugin(mongooseUniqueValidator, {message: 'is already taken.'});

UserSchema.methods.validPassword = async function (password: string): Promise<boolean> {
  if (!this.hash) {
    return false;
  }
  return await bcrypt.compare(password, this.hash);
};

UserSchema.methods.setPassword = async function (password: string) {
  const saltRounds = 10;
  this.hash = await bcrypt.hash(password, saltRounds);
};

UserSchema.methods.generateJWT = function (): string {
  const today = new Date();
  const exp   = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id      : this._id,
    username: this.username,
    exp     : exp.getTime() / 1000,
  }, JWT_SECRET);
};

UserSchema.methods.toAuthJSON = function (): any {
  return {
    username: this.username,
    email   : this.email,
    token   : this.generateJWT(),
    bio     : this.bio,
    image   : this.image,
    avatarUrl: this.avatarUrl,
    location: this.location,
    website : this.website,
    dob     : this.dob
  };
};

UserSchema.methods.toProfileJSONFor = function (user: IUserModel) {
  return {
    username : this.username,
    bio      : this.bio,
    image    : this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    avatarUrl: this.avatarUrl,
    location : this.location,
    website  : this.website,
    dob      : this.dob,
    following: user ? user.isFollowing(this._id) : false
  };
};

UserSchema.methods.follow = function (id: string) {
  if (this.following.indexOf(id) === -1) {
    this.following.push(id);
  }

  return this.save();
};

UserSchema.methods.unfollow = function (id: string) {
  this.following.remove(id);
  return this.save();
};

UserSchema.methods.isFollowing = function (id: string) {
  return this.following.some(function (followId: string) {
    return followId.toString() === id.toString();
  });
};


export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
