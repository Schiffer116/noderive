import { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import type { AppRouter } from '../../../src'

export const queryClient = new QueryClient();

// This code is only for TypeScript
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__:
    import("@tanstack/query-core").QueryClient;
  }
}

// @ts-ignore
// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

export const trpcClient = createTRPCClient<AppRouter>({
  links: [httpLink({
    url: '/api/trpc',
  })],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
