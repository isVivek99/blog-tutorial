import { Post } from "@prisma/client";
import { prisma } from "~/db.server";

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
