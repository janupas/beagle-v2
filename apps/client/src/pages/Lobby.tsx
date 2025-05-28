import { useNavigate } from 'react-router'
import { UserAuth } from '../context/AuthContext'

function Lobby() {
  const { session, signOut }: any = UserAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <div>
        <h2>Welcome, {session?.user?.email}</h2>
      </div>

      <div>
        <button onClick={handleSignOut}>Signout</button>
      </div>
    </div>
  )
}

export default Lobby
