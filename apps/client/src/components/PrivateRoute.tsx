import Loading from './Loading'
import { Navigate } from 'react-router'
import { UserAuth } from '../context/AuthContext'

const PrivateRoute = ({ children }: any) => {
  const { session }: any = UserAuth()

  if (session === undefined) {
    return <Loading />
  }

  return <>{session ? <>{children}</> : <Navigate to="/signin" />}</>
}

export default PrivateRoute
