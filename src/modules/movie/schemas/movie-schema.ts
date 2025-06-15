import { Type } from '@sinclair/typebox';
import swaggerJSDoc from 'swagger-jsdoc';
import {
  ErrorSchema,
  GoodCategorySchema,
  GoodSchema,
  ResponseWithPagination,
  ResponseWithStatus,
} from '../../../libs/schemas/default-schema';

export const GetGoodSchema: swaggerJSDoc.Options = {
  tags: ['Good'],
  response: {
    200: ResponseWithStatus(GoodSchema),
    404: ErrorSchema,
  },
  params: Type.Object({
    id: GoodSchema.properties.id,
  }),
};

export const GetGoodPrivateSchema: swaggerJSDoc.Options = {
  tags: ['Movie'],
  security: [{ BearerAuth: [] }],
  response: {
    200: ResponseWithStatus(GoodSchema),
    404: ErrorSchema,
  },
  params: Type.Object({
    id: GoodSchema.properties.id,
  }),
};

export const GetGoodGroup: swaggerJSDoc.Options = {
  tags: ['Movie'],
  response: {
    200: ResponseWithStatus(Type.Array(GoodSchema)),
    404: ErrorSchema,
  },
  params: Type.Object({
    id: GoodSchema.properties.id,
  }),
};

export const GetGoodPrivateGroup: swaggerJSDoc.Options = {
  tags: ['Movie'],
  security: [{ BearerAuth: [] }],
  response: {
    200: ResponseWithStatus(Type.Array(GoodSchema)),
    404: ErrorSchema,
  },
  params: Type.Object({
    id: GoodSchema.properties.id,
  }),
};

export const GetGoodsListSchema: swaggerJSDoc.Options = {
  tags: ['Movie'],
  querystring: Type.Object({
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Integer({ minimum: 0 })),
    categoryId: Type.Optional(GoodCategorySchema.properties.id),
    search: Type.Optional(Type.String()),
    sort: Type.Optional(Type.String({ enum: ['date', 'date_ask', 'count', 'count_ask', 'price', 'price_ask'] })),
  }),
  response: {
    200: ResponseWithPagination(Type.Array(GoodSchema)),
    404: ErrorSchema,
  },
};

export const GetGoodsListPrivateSchema: swaggerJSDoc.Options = {
  tags: ['Movie'],
  security: [{ BearerAuth: [] }],
  querystring: Type.Object({
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Integer({ minimum: 0 })),
    search: Type.Optional(Type.String()),
    sort: Type.Optional(
      Type.String({ enum: ['date', 'date_ask', 'count', 'count_ask', 'price', 'price_ask', 'published', 'draft'] })
    ),
  }),
  response: {
    200: ResponseWithPagination(
      Type.Array(
        Type.Intersect([
          GoodSchema,
          Type.Object({
            _count: Type.Object({
              BasketItem: Type.Number(),
              FavoriteItem: Type.Number(),
            }),
            bought: Type.Integer({ minimum: 0, default: 0 }),
            delivering: Type.Integer({ minimum: 0, default: 0 }),
          }),
        ])
      )
    ),
    404: ErrorSchema,
  },
};

export const CreateGoodSchema: swaggerJSDoc.Options = {
  tags: ['Movie'],
  security: [{ BearerAuth: [] }],
  body: Type.Omit(GoodSchema, ['id']),
  response: {
    200: ResponseWithStatus(GoodSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};

export const UpdateGoodSchema: swaggerJSDoc.Options = {
  tags: ['Movie'],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    id: GoodSchema.properties.id,
  }),
  body: Type.Partial(Type.Omit(GoodSchema, ['id'])),
  response: {
    200: ResponseWithStatus(GoodSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};

export const DeleteGoodSchema: swaggerJSDoc.Options = {
  tags: ['Movie'],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    id: GoodSchema.properties.id,
  }),
  response: {
    200: ResponseWithStatus(GoodSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};