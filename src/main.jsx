import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from './routes.jsx'
import { SitioProvider } from './context/SitioContext.jsx'

import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SitioProvider>
      <RouterProvider router={router} />
    </SitioProvider>
  </StrictMode>,
)
