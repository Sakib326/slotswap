"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { increment, decrement } from "@/lib/redux/slices/counterSlice";
import { useGetPostsQuery } from "@/lib/redux/services/apiSlice";
import { Button } from "@/components/ui/button";

export default function Home() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  const { data: posts, isLoading, error } = useGetPostsQuery(3);

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto flex flex-col gap-8">
      <header className="border-b pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Next.js Full Stack Starter
          </h1>
          <p className="text-muted-foreground mt-1">
            Redux Toolkit, RTK Query, Tailwind CSS, shadcn/ui, Prisma, PostgreSQL & Swagger
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/api-doc" target="_blank">
              View Swagger Docs ↗
            </Link>
          </Button>
        </div>
      </header>

      {/* API & Swagger Info Card */}
      <section className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col gap-3">
        <h2 className="text-xl font-semibold">API & Documentation Endpoints</h2>
        <div className="grid gap-2 text-sm">
          <div>
            <span className="font-semibold">Swagger UI Documentation:</span>{" "}
            <Link href="/api-doc" className="text-primary underline">
              /api-doc
            </Link>
          </div>
          <div>
            <span className="font-semibold">OpenAPI JSON Spec:</span>{" "}
            <Link href="/api/doc" className="text-primary underline">
              /api/doc
            </Link>
          </div>
          <div>
            <span className="font-semibold">Sample User API (Prisma + PostgreSQL):</span>{" "}
            <code className="text-xs bg-muted px-2 py-1 rounded">GET /api/users</code>,{" "}
            <code className="text-xs bg-muted px-2 py-1 rounded">POST /api/users</code>
          </div>
        </div>
      </section>

      {/* Redux Slice Demo with shadcn Button */}
      <section className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col gap-4">
        <h2 className="text-xl font-semibold">1. Redux State Management Demo</h2>
        <p className="text-sm text-muted-foreground">
          Count value managed via Redux Toolkit slice:
        </p>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => dispatch(decrement())}>
            - Decrement
          </Button>
          <span className="text-2xl font-bold min-w-8 text-center">{count}</span>
          <Button onClick={() => dispatch(increment())}>
            + Increment
          </Button>
        </div>
      </section>

      {/* RTK Query Demo */}
      <section className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col gap-4">
        <h2 className="text-xl font-semibold">2. RTK Query Data Fetching Demo</h2>
        <p className="text-sm text-muted-foreground">
          Fetched via <code>useGetPostsQuery()</code>:
        </p>
        {isLoading && <p className="text-sm">Loading posts...</p>}
        {error && <p className="text-sm text-destructive">Failed to load posts.</p>}
        {posts && (
          <div className="grid gap-3">
            {posts.map((post) => (
              <div key={post.id} className="p-3 border rounded-lg bg-muted/40">
                <h3 className="font-semibold capitalize text-base">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{post.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
