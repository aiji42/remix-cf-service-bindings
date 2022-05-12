# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

This is a sample project for using cloudflare worlers [service bindings](https://developers.cloudflare.com/workers/learning/using-services/) in Remix.

**Script size must be kept under 1 megabyte to deploy to Cloudflare Workers. By splitting services and connecting them with service bindings, they are freed from that limitation.**

Automatically split scripts during production deployment and deploy to two workers.  

One side receives access at the edge. But it does not have loader and action logic, it just SSRs the React component.  
The other holds the loader and action logic on behalf of the edge and is called from the edge by the service binding.  
In other words, the bundle size per worker can be reduced because it is automatically divided into two groups: workers with design-related libraries, such as UI libraries, and workers with logic and libraries for processing server-side data.

This worker isolation process is handled by esbuild plug-ins, so the developer does not need to be aware of any control over it.

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
npm run deploy:both
```
