import './index.css'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import ErrorPage from '@/components/ErrorPage'
import Drive, { driveLoader } from '@/pages/Drive'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "drive/:id",
    element: <Drive />,
    loader: driveLoader,
    errorElement: <ErrorPage />,
    hydrateFallbackElement: <div>Loading...</div>
  },
])

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)
