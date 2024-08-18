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
  comments?: Comment[];
  likes?: number;
  comment?: number;
  images?: (string | File)[];
  isLiked?: boolean;
  isOwner?: boolean;
  isSaved?: boolean;
  saves?: Types.ObjectId[];
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

export type Likes = {
  likes: number;
};

export type Comment = {
  _id?: string;
  recipeId?: string;
  ownerId?: string;
  messageId?: string;
  username?: string;
  url?: string; // username url
  message?: string;
  isOwner?: boolean;
  avatarUrl?: string;
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

export type RecipeDetailResponse = {
  data: Recipe[] | null;
  error: any;
};

export type CommentResponse = {
  data: Comment | null;
  error: any;
};

export type CommentsResponse = {
  data: Comment[] | null;
  error: any;
};

export type RecipeSearchResponse = {
  _id?: string;
  name?: string;
  url?: string;
  createdAt?: Date;
  owner?: User[] | undefined;
  likes?: number;
};

export type FavoriteRecipe = {
  _id?: string;
  name?: string;
  images?: string[];
  url?: string;
};
