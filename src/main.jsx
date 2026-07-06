import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import './theme.css'

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={qc}>
    <App />
  </QueryClientProvider>
)
