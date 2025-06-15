import { db } from "../db/db";

export const findUserByEmail = (email: string) => {
  return db.user.findUnique({
    where: { email },
  });
}

export const findUserById = (id: string) => {
  return db.user.findUnique({
    where: { id },
  });
}

export const findFavoriteById = (id: string) => {
  return db.favorite.findUnique({
    where: { id },
  });
}

export const findCommentById = (id: string) => {
  return db.comment.findUnique({
    where: { id },
  });
}