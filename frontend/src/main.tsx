import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Signup } from './components/auth/Signup';
import { Login } from './components/auth/Login';
import { AddMoneyToWallet } from './components/AddMoneyToWallet';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      }
    ]
  },
  {
    path: '/signup',
    element: <Signup/>
  },
  {
  
    path: '/login',
    element: <Login/>
  },
  {
  
    path: '/addtowallet',
    element: <AddMoneyToWallet/>
  }

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
