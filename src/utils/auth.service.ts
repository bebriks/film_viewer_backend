import { hashToken } from "../crypto/hashtoken";
import { db } from "../db/db";

export const addRefreshTokenToWhitelist = ({ refreshToken, userId }: {refreshToken: string, userId: string}) => {
    return db.refreshToken.create({
      data: {
        hashedToken: hashToken(refreshToken),
        userId,
        expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      },
    });
}

export const findRefreshToken = (token: string) => {
  return db.refreshToken.findUnique({
    where: {
      hashedToken: hashToken(token),
    },
  });
}

export const deleteRefreshTokenById = (id: string) => {
  return db.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
}

export const deleteRefreshToken = async (id: string) => {
    return db.refreshToken.delete({
        where: { id },
    });
}

export const revokeTokens = (userId: string) => {
  return db.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
}