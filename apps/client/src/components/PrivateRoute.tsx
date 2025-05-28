import { Navigate } from 'react-router'
import { UserAuth } from '../context/AuthContext'

const PrivateRoute = ({ children }: any) => {
  const { session }: any = UserAuth()

  if (session === undefined) {
    return <p>Loading...</p>
  }

  return <>{session ? <>{children}</> : <Navigate to="/signin" />}</>
}

export default PrivateRoute
