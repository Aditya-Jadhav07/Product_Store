import { db } from './index';
import { desc, eq } from 'drizzle-orm';
import {
  users,
  comments,
  products,
  type NewUser,
  type NewProduct,
  type NewComment,
} from './schema';

export const createUser = async (data: NewUser) => {
  const [user] = await db.insert(users).values(data).returning();
  return user;
};

export const getUSerById = async (id: number) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
};

export const updateUSer = async (id: string, data: Partial<NewUser>) => {
  await db
    .update(users)
    .set(data)
    .where(eq(users.id, Number(id)))
    .returning();
  return users;
};

export const upsertUser = async (data: NewUser) => {
  const existingUser = await getUSerById(data.id);
  if (existingUser) {
    return updateUSer(String(data.id), data);
  }
  return createUser(data);
};


// Product Queries
export const createProduct = async (data: NewProduct) => {
    const [product] = await db.insert(products).values(data).returning();
    return product;
};

export const getAllProducts = async () => {
    return db.query.products.findMany({
        with: {
            user: true
        },
        orderBy: (products, {desc}) => [desc(products.createdAt)],
    }); 
};

export const getProductById = async (id: string) => {
    return db.query.products.findFirst({
        where: eq(products.id,id),
        with:{user:true}
        with: {
            user: true,
            comments: {
                with: {
                    user: true
                },
                orderBy: (comments, { desc }) => [desc(comments.createdAt)],
            }
        }
    });
};

export const getProductByUSerId = async (userId: number) => {
    return db.query.products.findMany({
        where: eq(products.userId,userId),
        with: {user: true},
        orderBy: (products, {desc}) => [desc(products.createdAt)],
    });
};

export const updateProduct = async (id: string, data: Partial<NewProduct>) => {
    const [product] = await db.update(products).where(eq(products.id,id)).set(data).returning();
    return product;
};

export const deleteProduct = async (id: string) => {
    const [product] = await db.delete(products).where(eq(products.id,id)).returning();
    return product; 
};

// Comment Queries
export const createComment = async (data: NewComment) => {
    const [comment] = await db.insert(comments).values(data).returning();
    return comment;
};

export const deleteComment = async (id: string) => {
    const [comment] = await db.delete(comments).where(eq(comments.id,id)).returning();
    return comment; 
};

export const getCommentById = async (id: string) => {
    return db.query.comments.findFirst({
        where: eq(comments.id,id),
        with: {user: true}
    });
};
