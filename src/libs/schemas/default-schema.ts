import { TSchema, Type } from '@sinclair/typebox';

export const ResponseWithStatus = (dataType: TSchema) => {
  return Type.Object(
    {
      status: Type.String({ enum: ['ok', 'error'] }),
      data: dataType,
    },
    { title: 'ResponseWithStatus' }
  );
};

export const ResponseWithPagination = (dataType: TSchema) => {
  return Type.Object(
    {
      status: Type.String({ enum: ['ok', 'error'] }),
      data: dataType,
      total: Type.Integer(),
    },
    { title: 'ResponseWithPagination' }
  );
};

export const UserRoleSchema = Type.Array(Type.String({ enum: ['user', 'admin', 'seller'] }));

export const ErrorSchema = ResponseWithStatus(
  Type.Object({
    message: Type.String(),
  })
);

export const UserSchema = Type.Object(
  {
    id: Type.String(),
    email: Type.String(),
    roles: UserRoleSchema,
  },
  { title: 'User' }
);

export const GoodCategorySchema = Type.Object(
  {
    id: Type.Integer(),
    title: Type.String(),
    description: Type.String(),
    image: Type.Optional(Type.Union([Type.Null(), Type.String()], { default: null })),
    icon: Type.Optional(Type.Union([Type.Null(), Type.String()], { default: null })),
    parentId: Type.Optional(Type.Union([Type.Null(), Type.Number()], { default: null })),
  },
  { title: 'GoodCategory' }
);

export const BrandSchema = Type.Object(
  {
    id: Type.String(),
    name: Type.String(),
    image: Type.String(),
    description: Type.String(),
  },
  { title: 'Brand' }
);

export const GoodSchema = Type.Object(
  {
    id: Type.String(),
    status: Type.Enum({ draft: 'draft', published: 'published' }),
    title: Type.String(),
    description: Type.String({ default: '' }),
    price: Type.Number({ minimum: 0 }),
    priceWithDisc: Type.Optional(Type.Union([Type.Null(), Type.Number({ minimum: 0 })], { default: null })),
    count: Type.Integer({ minimum: 0, default: 0 }),
    images: Type.Array(Type.String(), { default: [] }),
    categoryId: Type.Optional(Type.Union([Type.Null(), GoodCategorySchema.properties.id], { default: null })),
    brandId: Type.Optional(Type.Union([Type.Null(), BrandSchema.properties.id], { default: null })),
    modifiedName: Type.Optional(Type.String()),
    articleNumber: Type.Optional(Type.String()),
  },
  { title: 'Good' }
);

export const FavoriteSchema = Type.Object(
  {
    goodId: GoodSchema.properties.id,
  },
  { title: 'Favorite' }
);

export const BasketSchema = Type.Object(
  {
    goodId: GoodSchema.properties.id,
    count: Type.Integer(),
  },
  { title: 'Basket' }
);

export const ImageSchema = Type.Object(
  {
    name: Type.String(),
  },
  { title: 'Image' }
);

export const DeliveryMethodSchema = Type.Object(
  {
    id: Type.String(),
    title: Type.String(),
    description: Type.String(),
    image: Type.String(),
  },
  { title: 'DeliveryMethod' }
);

export const PaymentMethodSchema = Type.Object(
  {
    id: Type.String(),
    title: Type.String(),
    description: Type.String(),
    image: Type.String(),
  },
  { title: 'DeliveryMethod' }
);

export const TransactionSchema = Type.Object(
  {
    id: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
    status: Type.Enum({ pending: 'pending', success: 'success', error: 'error' }),
    price: Type.Number({ minimum: 0 }),
    checkoutId: Type.String(),
    providerData: Type.String(),
  },
  { title: 'Transaction' }
);

export const RecipientSchema = Type.Object(
  {
    name: Type.String(),
    address: Type.String(),
    phone: Type.String(),
  },
  { title: 'Recipient' }
);

export const CheckoutSchema = Type.Object(
  {
    id: Type.String(),
    userId: Type.Number(),

    paymentMethodId: Type.String(),
    paymentMethodName: Type.String(),

    deliveryMethodId: Type.String(),
    deliveryMethodName: Type.String(),
    track: Type.String(),

    recipientName: Type.String(),
    recipientAddress: Type.String(),
    recipientPhone: Type.String(),

    goodsIdList: Type.Array(Type.String()),
    goodsPrice: Type.Array(Type.Number({ minimum: 0 })),

    goodsCount: Type.Array(Type.Number({ minimum: 1 })),
    goodsName: Type.Array(Type.String()),

    paymentTotal: Type.Number({ minimum: 0 }),

    status: Type.String({
      enum: ['created', 'payed', 'delivery', 'delivered', 'success', 'canceled'],
    }),
    createdAt: Type.String(),
    updatedAt: Type.String(),
  },
  { title: 'Checkout' }
);

export const NewsSchema = Type.Object(
  {
    id: Type.String(),
    title: Type.String(),
    htmlDocumentName: Type.String(),
    htmlContent: Type.String(),
    images: Type.Array(Type.String()),
    status: Type.Enum({ draft: 'draft', published: 'published' }),
    isPrimary: Type.Boolean(),
    publishedAt: Type.Union([Type.String(), Type.Null()]),
    createdAt: Type.String(),
    updatedAt: Type.String(),
  },
  { title: 'News' }
);

export const SettingsSchema = Type.Object(
  {
    title: Type.String(),
    logo: Type.String(),
  },
  { title: 'Settings' }
);