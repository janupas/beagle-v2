import App from './pages/App.tsx'
import { StrictMode } from 'react'
import SignIn from './pages/SignIn.tsx'
import SignUp from './pages/Signup.tsx'
import { createRoot } from 'react-dom/client'
import PrivateRoute from './components/PrivateRoute.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import ProfilePage from './pages/Profile.tsx'
import NotForLoggedInUsers from './components/NotForLoggedUsers.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
  },
  {
    path: '/signin',
    element: (
      <NotForLoggedInUsers>
        <SignIn />
      </NotForLoggedInUsers>
    ),
  },
  {
    path: '/signup',
    element: (
      <NotForLoggedInUsers>
        <SignUp />
      </NotForLoggedInUsers>
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
