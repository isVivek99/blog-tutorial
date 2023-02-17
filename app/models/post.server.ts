import { Post } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Post };

export async function getPostsListings() {
  return prisma.post.findMany({
    select: {
      slug: true,
      title: true,
    },
  });
}

export async function getPosts() {
  // const posts = [
  //   {
  //     slug: "my-first-post",
  //     title: "My FIrst Post!",
  //   },
  //   {
  //     slug: "trail-riding-with-onewheel",
  //     title: "Trail Riding with Onewheel",
  //   },
  // ];
  // return posts;

  /*getting the data from the db and returning the same data to the client */
  return prisma.post.findMany();
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(
  post: Pick<Post, "slug" | "title" | "markdown">
) {
  {
    /*Pick refer(https://ultimatecourses.com/blog/using-typescript-pick-mapped-type) */
  }
  return prisma.post.create({ data: post });
}

export async function updatePost(
  slug: string,
  post: Pick<Post, "slug" | "title" | "markdown">
) {
  return prisma.post.update({ data: post, where: { slug } });
}

export async function deletePost(slug: string) {
  return prisma.post.delete({ where: { slug } });
}
