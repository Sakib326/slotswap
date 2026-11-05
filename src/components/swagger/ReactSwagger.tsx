"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

// Dynamic import to prevent SSR issues with swagger-ui-react
const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <p className="p-4 text-sm text-gray-500">Loading Swagger UI...</p>,
});

type Props = {
  spec: Record<string, any>;
};

export default function ReactSwagger({ spec }: Props) {
  return (
    <div className="bg-white min-h-screen">
      <SwaggerUI spec={spec} />
    </div>
  );
}
