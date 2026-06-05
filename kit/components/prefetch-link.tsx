import { useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import * as React from "react";
import { Link } from "react-router";

export function PrefetchLink({
  prefetchQueryFns,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "prefetch" | "onMouseEnter"> & {
  prefetchQueryFns?: Array<UseQueryOptions>;
}) {
  const qc = useQueryClient();

  const prefetchHandler = async () => {
    if (!prefetchQueryFns) return;
    await Promise.all(prefetchQueryFns.map((fn) => qc.prefetchQuery(fn)));
  };

  return <Link prefetch="intent" onMouseEnter={prefetchHandler} {...props} />;
}
