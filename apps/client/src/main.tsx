import App from './pages/App.tsx'
import SignIn from './pages/SignIn.tsx'
import SignUp from './pages/Signup.tsx'
import { createRoot } from 'react-dom/client'
import PrivateRoute from './components/PrivateRoute.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import ProfilePage from './pages/Profile.tsx'
import NotForLoggedInUsers from './components/NotForLoggedUsers.tsx'
import CreateLobbyPage from './pages/CreateLobby.tsx'
import ChatPage from './pages/ChatPage.tsx'
import OnlineUsersPage from './pages/OnlineUsers.tsx'
import { SocketProvider } from './context/SockeContext.tsx'

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
    path: '/create',
    element: (
      <PrivateRoute>
        <CreateLobbyPage />
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
  {
    path: '/chat/:id',
    element: (
      <PrivateRoute>
        <ChatPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/users/online',
    element: (
      <PrivateRoute>
        <OnlineUsersPage />
      </PrivateRoute>
    ),
  },
])

createRoot(document.getElementById('root')!).render(
  <>
    <AuthContextProvider>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </AuthContextProvider>
  </>
)
