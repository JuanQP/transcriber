import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { AuthProvider } from 'react-auth-kit';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { refreshApi } from './services/auth';

const queryClient = new QueryClient()

function App() {
  return (
    <MantineProvider>
      <AuthProvider
        authType='localstorage'
        authName='auth'
        refresh={refreshApi}
      >
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </MantineProvider>
  )
}

export default App
