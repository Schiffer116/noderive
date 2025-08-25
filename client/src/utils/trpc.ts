import { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import type { AppRouter } from '../../../src'

export const queryClient = new QueryClient();

export const trpcClient = createTRPCClient<AppRouter>({
  links: [httpLink({
    url: '/api/trpc',
  })],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
