// Base interface for User
export interface IUser {
  id: string;
  user_type_id: number;
  email: string | null;
  password: string;
  name: string;
  favorites?: IFavorite[]; // Made optional for flexibility
  refreshTokens?: IRefreshToken[];
  comments?: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Favorite
export interface IFavorite {
  id: string;
  userId: string;
  movieId: number;
  createdAt: Date;
  user?: IUser; // Optional relation
}

// Interface for RefreshToken
export interface IRefreshToken {
  id: string;
  hashedToken: string;
  userId: string;
  revoked: boolean;
  createdAt: Date;
  updatedAt: Date;
  expireAt: Date;
  user?: IUser; // Optional relation
}

// Interface for Comment
export interface IComment {
  id: string;
  text: string;
  userId: string;
  movieId: number;
  createdAt: Date;
  parentId?: string | null;
  user?: IUser;
  parent?: IComment;
  replies?: IComment[];
}