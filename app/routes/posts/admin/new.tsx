import { Form, useActionData, useTransition } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { createPost } from "~/models/post.server";
import invariant from "tiny-invariant";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-2`;

export const action: ActionFunction = async ({ request }) => {
  //   return new Response(null, {
  //     status: 302,
  //     headers: {
  //       Location: "posts/admin",
  //     },
  //   });
  {
    /*
1. we are getting the data inside formData() object, 
2. we send a feth request with method as post to the url  (http://localhost:3001/posts/admin/new?_data=routes/posts/admin/new)
    a.refer link for more info (https://remix.run/docs/en/v1/guides/routing#what-is-the-index-query-param) 
3. the action runs on the server, we get the request and then we can get the formdata which we can use to create a post in our DB.
*/
  }
  const formData = await request.formData();

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

  await createPost({ title, slug, markdown });
  return redirect("/posts/admin");
};

const NewPostRoute = () => {
  const errors = useActionData();
  {
    /* useTransition hook */
  }
  const transition = useTransition();
  {
    /*transtion.type based on the method 
    i.e. GET, POST, PATCH  refer(https://remix.run/docs/en/v1/hooks/use-transition)*/
  }
  console.log(transition);

  const isCreating = Boolean(transition.submission);

  return (
    <Form method="post">
      <p>
        <label>
          Post Title:
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input type="text" name="title" className={inputClassName} />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input type="text" name="slug" className={inputClassName} />
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
        ></textarea>
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "create post"}
        </button>
      </p>
    </Form>
  );
};

export default NewPostRoute;
