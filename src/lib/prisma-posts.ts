import { BlogPost } from "@prisma/client";
import prisma from "./prisma";

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    return await prisma.blogPost.findMany({
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Error fetching all posts:", error);
    throw error;
  }
}

export async function createPost(data: Omit<BlogPost, "id" | "created_at" | "updated_at">): Promise<BlogPost> {
  try {
    return await prisma.blogPost.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function getPostById(id: number): Promise<BlogPost | null> {
  try {
    return await prisma.blogPost.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
}

export async function updatePost(id: number, data: Partial<Omit<BlogPost, "id" | "created_at">>): Promise<BlogPost> {
  try {
    return await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

export async function deletePost(id: number): Promise<void> {
  try {
    await prisma.blogPost.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    return await prisma.blogPost.findFirst({
      where: { 
        slug,
        status: "published"
      },
    });
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    throw error;
  }
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    return await prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Error fetching published posts:", error);
    throw error;
  }
}
