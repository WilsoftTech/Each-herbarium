import type { ReactNode } from "react";
import { PageTransition } from "@/components/motion/page-transition";

// Templates remount on every navigation, which lets each new page play its entrance.
export default function PublicTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
