import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import { Login } from './pages/Login'
import { History } from './pages/History'
import './index.css'
import { HandleRoute } from './features/HandlerRoute'
import { ScoreTable } from './pages/ScoreTable'
import { Articles } from './pages/Articles'

const router = createBrowserRouter([
  {
    element: <HandleRoute authCheck={ true } />, 
    children: [
      {
        path: "/",
        element: <App />,
      },
    ],
  },
  {
    element: <HandleRoute authCheck={ true } />, 
    children: [
      {
        path: "/history",
        element: <History />,
      },
    ],
  },
  {
    element: <HandleRoute authCheck={ true } />, 
    children: [
      {
        path: "/scores",
        element: <ScoreTable />,
      },
    ],
  },
  {
    element: <HandleRoute authCheck={ true } />, 
    children: [
      {
        path: "/articles",
        element: <Articles />,
      },
    ],
  },
  {
    element: <HandleRoute authCheck={ false } />, 
    children: [
      { 
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);