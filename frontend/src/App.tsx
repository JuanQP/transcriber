import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { AuthProvider } from 'react-auth-kit';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { refreshApi } from './services/auth';
import axios from 'axios';

const queryClient = new QueryClient()

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("auth")
  config.headers.Authorization = `Bearer ${token}`
  return config
})

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
