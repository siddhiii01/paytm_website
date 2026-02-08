import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Signup } from './components/auth/Signup';
import { Login } from './components/auth/Login';
import { AddMoneyToWallet } from './components/AddMoneyToWallet';
import { P2PTransfer } from './components/P2P/P2PTransfer';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Home } from './components/Home/Home';
import {Toaster} from "react-hot-toast"
import { PaymentStatus } from './components/PaymentStatus';
import { Transactions } from './components/Dashboard/Transactions';
import { ErrorBoundary } from './components/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorBoundary />,
     
  },
  {
    path: '/dashboard',
    element: <Dashboard/>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/signup',
    element: <Signup/>,
    errorElement: <ErrorBoundary />,
  },
  {
  
    path: '/login',
    element: <Login/>,
    errorElement: <ErrorBoundary />,
  },
  {
  
    path: '/addtowallet',
    element: <AddMoneyToWallet/>
  },{
    path: '/p2ptransfer',
    element: <P2PTransfer/>
  }, 
  {
    path: "/payment-status",
    element: <PaymentStatus/>
  }, {
    path: '/transactions',
    element: <Transactions />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster position='top-right' toastOptions={{duration:3000}}/>
  </StrictMode>,
)
