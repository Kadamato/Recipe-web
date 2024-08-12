import { Types } from "mongoose";

export type GoogleUser = {
  id: string;
  name: string;
  email: string;
  picture: string;
};

export type User = {
  id?: string;
  _id?: string;
  username?: string;
  userId?: string;
  email?: string;
  password?: string; // extend after
  url?: string;
  type?: string;
  bio?: string;
  gender: string;
  badges?: Types.ObjectId[];
  favorites?: Types.ObjectId[];
  avatarUrl?: string;
  followers?: Types.ObjectId[];
  recipes?: Types.ObjectId[];
  isOwner?: boolean;
  isFollowing?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  follower: number;
  following: number;
};
export type Recipe = {
  _id?: string | Types.ObjectId;
  name?: string;
  recipeId?: string;
  ownerId?: Types.ObjectId;
  owner?: User[];
  url?: string;
  tags?: string[];
  ingredients?: string[];
  instructions?: string[];
  meal?: string[];
  comments?: string[];
  likes?: number;
  images?: (string | File)[];
  isLiked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Like = {
  _id?: string;
  recipeId?: string;
  ownerId?: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};

export type RecipeFormResponse = {
  data: string | null;
  error: any;
};

export type LikeResponse = {
  data: string | null;
  error: any;
  isLiked?: boolean;
  likes?: number;
};

export type RecipeResponse = {
  data: Recipe[] | null;
  error: any;
};

export type UserResponse = {
  data: User | null;
  error: any;
};

export type UsersResponse = {
  data: User[] | null;
  error: any;
};
