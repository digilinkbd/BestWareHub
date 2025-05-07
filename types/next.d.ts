import type { Metadata } from "next"

// Override the problematic PageProps type
declare module "next" {
  export interface PageProps {
    params?: Record<string, string>
    searchParams?: Record<string, string | string[] | undefined>
  }

  // Ensure generateMetadata has the correct parameter type
  export type GenerateMetadata = (props: {
    params: Record<string, string>
    searchParams?: Record<string, string | string[] | undefined>
  }) => Promise<Metadata> | Metadata
}
