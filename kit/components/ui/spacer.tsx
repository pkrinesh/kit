import { cn } from "@/lib/utils";

export function Spacer({ className }: { className?: string }) {
  return <div className={cn("flex-1", className)} />;
}
