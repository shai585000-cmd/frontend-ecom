/// <reference types="vite/client" />
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { queryClient } from './lib/queryClient'
import './index.css'
import App from './App'
import { startKeepAlive } from './services/keepAliveService'
import './i18n/index'

startKeepAlive()

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        success: {
          style: {
            background: '#DC2626',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#DC2626',
          },
        },
        error: {
          style: {
            background: '#EF4444',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#EF4444',
          },
        },
      }}
    />
    <App />
    </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
