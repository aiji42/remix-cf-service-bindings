import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/cloudflare";

export const loader: LoaderFunction = async () => {
  return { message: `action function of ${SAMPLE_VAR} - /` };
};

export const action = async () => {
  return { message: `action function of ${SAMPLE_VAR} - /` };
};

export default function Index() {
  const data = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>This page is /index</h1>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
}
