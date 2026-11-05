import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/public/Container";
import { swaggerSpec } from "@/lib/swagger-spec";

export const metadata: Metadata = {
  title: "API Documentation",
  description: "Complete REST API reference for SlotSwap authentication, profiles, and administration.",
};

const methodColors: Record<string, { bg: string; text: string; border: string }> = {
  get: { bg: "bg-[#BCD7F2]", text: "text-[#16231F]", border: "border-[#16231F]/20" },
  post: { bg: "bg-[#C2E4CE]", text: "text-[#16231F]", border: "border-[#1D5B4A]/30" },
  patch: { bg: "bg-[#F5E39B]", text: "text-[#16231F]", border: "border-[#16231F]/20" },
  delete: { bg: "bg-[#F2C4C4]", text: "text-[#D9381E]", border: "border-[#D9381E]/30" },
};

export default function ApiDocPage() {
  const paths = Object.entries(swaggerSpec.paths);

  // Group endpoints by tag
  const grouped: Record<string, { path: string; method: string; details: any }[]> = {};

  paths.forEach(([pathStr, methods]) => {
    Object.entries(methods).forEach(([method, details]: [string, any]) => {
      const tag = details.tags?.[0] || "General";
      if (!grouped[tag]) grouped[tag] = [];
      grouped[tag].push({ path: pathStr, method, details });
    });
  });

  return (
    <div className="py-12 md:py-20 text-left bg-[#F4F6F3] min-h-screen">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-12 border-b border-[#16231F]/15 pb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#C2E4CE] border border-[#1D5B4A]/30 text-xs font-semibold text-[#16231F] mb-4">
            <span>OpenAPI 3.0 · REST API</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#16231F] leading-tight mb-4">
            API Documentation
          </h1>
          <p className="text-base text-[#16231F]/80 leading-relaxed mb-4">
            Complete API specification for SlotSwap. All requests use JSON payloads and return structured responses with standardized error codes.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-[#16231F]/60">Raw OpenAPI JSON:</span>
            <Link
              href="/api/doc"
              target="_blank"
              className="text-[#1D5B4A] underline hover:text-[#164639]"
            >
              /api/doc ↗
            </Link>
          </div>
        </div>

        {/* Grouped Endpoints */}
        <div className="space-y-12 max-w-4xl">
          {Object.entries(grouped).map(([tag, endpoints]) => (
            <section key={tag} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#16231F] pb-2 border-b border-[#16231F]/15">
                {tag}
              </h2>

              <div className="space-y-4">
                {endpoints.map(({ path, method, details }, idx) => {
                  const colors = methodColors[method.toLowerCase()] || {
                    bg: "bg-white",
                    text: "text-black",
                    border: "border-gray-200",
                  };

                  return (
                    <div
                      key={idx}
                      className="border border-[#16231F]/15 rounded-[10px] bg-white p-5 space-y-3"
                    >
                      {/* Endpoint signature */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`uppercase text-xs font-extrabold px-2.5 py-1 rounded-[4px] border ${colors.bg} ${colors.text} ${colors.border}`}
                        >
                          {method}
                        </span>
                        <code className="text-sm font-semibold text-[#16231F]">
                          {path}
                        </code>
                        <span className="text-xs text-[#16231F]/60 ml-auto hidden sm:inline">
                          {details.summary}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#16231F]/80 leading-relaxed">
                        {details.description}
                      </p>

                      {/* Query or Path Parameters */}
                      {details.parameters && details.parameters.length > 0 && (
                        <div className="pt-2 border-t border-[#16231F]/10">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#16231F]/60 mb-2">
                            Parameters
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {details.parameters.map((param: any, pIdx: number) => (
                              <span
                                key={pIdx}
                                className="px-2 py-1 rounded-[4px] bg-[#F4F6F3] border border-[#16231F]/15 font-mono text-[11px]"
                              >
                                {param.name} ({param.in})
                                {param.required ? " *" : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Responses */}
                      <div className="pt-2 border-t border-[#16231F]/10 flex flex-wrap gap-2 items-center text-xs">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#16231F]/60">
                          Responses:
                        </span>
                        {Object.entries(details.responses).map(([code, resp]: [string, any]) => (
                          <span
                            key={code}
                            className={`px-2 py-0.5 rounded-[4px] font-mono text-[11px] font-semibold ${
                              code.startsWith("2")
                                ? "bg-[#C2E4CE] text-[#16231F]"
                                : code.startsWith("4")
                                ? "bg-[#F2C4C4] text-[#D9381E]"
                                : "bg-gray-100 text-gray-700"
                            }`}
                            title={resp.description}
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
