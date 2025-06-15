// For creating users
export interface CreateUserDto {
  email?: string;
  password: string;
  name: string;
  user_type_id?: number; // Default to 0 as in your schema
}

// For updating users
export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  user_type_id?: number;
}

// For adding favorites
export interface AddFavoriteDto {
  userId: string
  movieId: string
}

// For refresh tokens
export interface CreateRefreshTokenDto {
  hashedToken: string;
  userId: string;
  expireAt: Date;
}

// For comments
export interface CreateCommentDto {
  text: string;
  movieId: string;
  parentId?: string;
}