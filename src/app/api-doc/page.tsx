import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "@/components/swagger/ReactSwagger";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation | Swagger UI",
  description: "Interactive Swagger UI documentation for Sohan Next.js API",
};

export default async function ApiDocPage() {
  const spec = await getApiDocs();
  return (
    <main className="w-full min-h-screen">
      <ReactSwagger spec={spec} />
    </main>
  );
}
