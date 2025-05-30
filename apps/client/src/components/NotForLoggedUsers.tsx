import Loading from './Loading'
import { Navigate } from 'react-router'
import { UserAuth } from '../context/AuthContext'

/**
 * A HOC to protect routes from authorized users like Auth pages
 */
const NotForLoggedInUsers = ({ children }: any) => {
  const { session }: any = UserAuth()

  if (session === undefined) {
    return <Loading />
  }

  return <>{!session ? <>{children}</> : <Navigate to="/profile" />}</>
}

export default NotForLoggedInUsers
