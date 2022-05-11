# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

This is a sample project for using cloudflare worlers [service bindings](https://developers.cloudflare.com/workers/learning/using-services/) in Remix.

**Script size must be kept under 1 megabyte to deploy to Cloudflare Workers. By splitting services and connecting them with service bindings, they are freed from that limitation.**

```
services
 └ parent 
 └ child
```

- `parent`: This is the project to receive access at the edge. However, there is no logic in the `loader` and `action` functions.
- `child`: It has the logic of the loader and action functions instead of the parent. It does not have a react components.

```tsx
// services/parent/app/routes/index.tsx
import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ context }) => {
  return CHILD.fetch(context.event.request.clone());
};

export default function Index() {
  const data = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      responded from CHILD; <p>{JSON.stringify(data)}</p>
    </div>
  );
}

```

```ts
// services/child/app/routes/index.tsx
export const loader = () => {
  return { message: "this is child service" };
};
```

![スクリーンショット 2022-05-11 午後7 38 41](https://user-images.githubusercontent.com/6711766/167831032-845673ec-fd6b-405c-8401-1083befc7df1.png)

## Development

You will be running two processes during development:

- The Miniflare server (miniflare is a local environment for Cloudflare Workers)
- The Remix development server

Both are started with one command:

```sh
npm run dev
```

Open up [http://127.0.0.1:8787](http://127.0.0.1:8787) and you should be ready to go!

## Deployment

Use [wrangler](https://developers.cloudflare.com/workers/cli-wrangler) to build and deploy your application to Cloudflare Workers. If you don't have it yet, follow [the installation guide](https://developers.cloudflare.com/workers/cli-wrangler/install-update) to get it setup. Be sure to [authenticate the CLI](https://developers.cloudflare.com/workers/cli-wrangler/authentication) as well.

If you don't already have an account, then [create a cloudflare account here](https://dash.cloudflare.com/sign-up) and after verifying your email address with Cloudflare, go to your dashboard and set up your free custom Cloudflare Workers subdomain.

Once that's done, you should be able to deploy your app:

```sh
npm run deploy
```
