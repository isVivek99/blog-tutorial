import {
  Form,
  useActionData,
  useCatch,
  useLoaderData,
  useParams,
  useTransition,
} from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import {
  createPost,
  deletePost,
  getPost,
  updatePost,
} from "~/models/post.server";
import { Post } from "~/models/post.server";
import invariant from "tiny-invariant";
import { requireAdminUser } from "~/session.server";

type LoaderData = { post?: Post };

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAdminUser(request);
  invariant(params.slug, "slug is required!");
  if (params.slug === "new") {
    return json<LoaderData>({});
  }
  //find the post based on slug and return
  const post = await getPost(params.slug);
  post.html();
  if (!post) {
    throw new Response("Not found", { status: 404 });
  }
  return json<LoaderData>({ post });
};

export const action: ActionFunction = async ({ request, params }) => {
  //   return new Response(null, {
  //     status: 302,
  //     headers: {
  //       Location: "posts/admin",
  //     },
  //   });

  /*
1. we are getting the data inside formData() object, 
2. we send a feth request with method as post to the url  (http://localhost:3001/posts/admin/new?_data=routes/posts/admin/new)
    a.refer link for more info (https://remix.run/docs/en/v1/guides/routing#what-is-the-index-query-param) 
3. the action runs on the server, we get the request and then we can get the formdata which we can use to create a post in our DB.
*/

  const formData = await request.formData();
  const intent = formData.get("intent");
  invariant(params.slug, "slug is required!");
  if (intent === "delete") {
    await deletePost(params.slug);
    return redirect("posts/admin");
  }

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }
  invariant(typeof title === "string", "title must be string");
  invariant(typeof slug === "string", "slug must be string");
  invariant(typeof markdown === "string", "markdown must be string");

  if (params.slug === "new") {
    await createPost({ title, slug, markdown });
  } else {
    //update post
    await updatePost(params.slug, { title, slug, markdown });
  }

  return redirect("/posts/admin");
};

const inputClassName = `w-full rounded border border-gray-500 px-2 py-2`;

const NewPostRoute = () => {
  const data = useLoaderData() as LoaderData;
  const errors = useActionData();
  {
    /* useTransition hook */
  }
  const transition = useTransition();
  {
    /*transtion.type based on the method 
    i.e. GET, POST, PATCH  refer(https://remix.run/docs/en/v1/hooks/use-transition)*/
  }
  console.log(data);

  const isCreating = transition.submission?.formData.get("intent") === "create";
  const isUpdating = transition.submission?.formData.get("intent") === "update";
  const isDeleting = transition.submission?.formData.get("intent") === "delete";
  const isNewPost = !data.post;
  return (
    <Form method="post" key={data.post?.slug ?? "new"}>
      <p>
        <label>
          Post Title:
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
            defaultValue={data.post?.title}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input
            type="text"
            name="slug"
            className={inputClassName}
            defaultValue={data.post?.slug}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:{" "}
          {errors?.markdown ? (
            <em className="text-red-600">{errors.markdown}</em>
          ) : null}
        </label>
        <textarea
          name="markdown"
          id="markdown"
          rows={20}
          className={`${inputClassName} font-mono`}
          defaultValue={data.post?.markdown}
        ></textarea>
      </p>
      <div className="text-right">
        <button
          type="submit"
          name="intent"
          value={isNewPost ? "create" : "update"}
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={isCreating || isUpdating}
        >
          {isNewPost ? (isCreating ? "Creating..." : "create post") : null}
          {isNewPost ? null : isUpdating ? "Updating..." : "update post"}
        </button>
        {isNewPost ? null : (
          <button
            type="submit"
            name="intent"
            value="delete"
            className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "delete post"}
          </button>
        )}
      </div>
    </Form>
  );
};

export default NewPostRoute;

/* refer this for catch boundaries (https://remix.run/docs/en/v1/route/catch-boundary) */
export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 404) {
    return (
      <div>Oh ohh! This post with the slug "{params.slug}" does not exist</div>
    );
  }
  throw new Error(`Unsupported thrown response status code:${caught.status}`);
}

export function ErrorBoundary({ error }: { error: unknown }) {
  if (error instanceof Error) {
    return (
      <div className="text-red-500">
        Oh no, something went wrong!
        <pre>{error.message}</pre>
      </div>
    );
  }
  return <div className="text-red-500">wrong happened!</div>;
}
