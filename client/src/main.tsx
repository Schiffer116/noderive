import './index.css'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-react'

import ErrorPage from '@/components/ErrorPage'
import Drive, { driveLoader } from '@/pages/Drive'
import { queryClient } from '@/utils/trpc'
import Homepage from './pages/Home'
import { CLERK_PUBLISHABLE_KEY } from './constants'

const router = createBrowserRouter([
  {
    path: "/drive/:id?",
    element: <Drive />,
    loader: driveLoader,
    errorElement: <ErrorPage />,
    hydrateFallbackElement: <div>Loading...</div>
  },
  {
    path: "/",
    element: <Homepage />,
    errorElement: <ErrorPage />,
    hydrateFallbackElement: <div>Loading...</div>
  },
])

createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ClerkProvider>
)
