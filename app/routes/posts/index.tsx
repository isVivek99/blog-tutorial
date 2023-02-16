import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getPostsListings } from "~/models/post.server";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostsListings>>;
};

export const loader: LoaderFunction = async () => {
  const posts = await getPostsListings();
  //-----------
  //1. convert to string and send it as JSON
  // const postsString = JSON.stringify({ posts });
  // return new Response(postsString, {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  //-----------
  //2. short hand for doing what is written above

  /* this function runs on the server and returns data which we get from the server to the client */
  return json<LoaderData>({ posts });
};

export default function Posts() {
  const { posts } = useLoaderData() as LoaderData;
  return (
    <main>
      <h1>Posts</h1>
      <Link to={"admin"} className="text-red-600 underline">
        Admin
      </Link>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={post.slug}
              prefetch="intent"
              className="text-blue-600 underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
