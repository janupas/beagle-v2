import App from './pages/App.tsx'
import { StrictMode } from 'react'
import Lobby from './pages/Lobby.tsx'
import SignIn from './pages/SignIn.tsx'
import SignUp from './pages/Signup.tsx'
import { createRoot } from 'react-dom/client'
import PrivateRoute from './components/PrivateRoute.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import ProfilePage from './pages/Profile.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/lobby',
    element: (
      <PrivateRoute>
        <Lobby />
      </PrivateRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <PrivateRoute>
        <ProfilePage />
      </PrivateRoute>
    ),
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>
)
