import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactElement,
} from 'react'
import { supabase } from '../supabaseClient'

interface AuthContextType {
  session: undefined
  signupNewUser: () => any
  signinUser: () => any
  signOut: () => any
}

const AuthContext = createContext<AuthContextType | {}>({})

export const AuthContextProvider = ({
  children,
}: {
  children: ReactElement
}) => {
  const [session, setSession] = useState<any>()

  const signupNewUser = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      console.log('there was an error: ' + error)
      return {
        success: false,
        error,
      }
    }

    return {
      success: true,
      data,
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.log('error: ' + error)
    }
  }

  const signinUser = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        console.log('error: ' + error)
        return { success: false, error: error.message }
      }

      console.log('sign in success: ' + data)
      return { success: true, data }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider
      value={{ session, signupNewUser, signOut, signinUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const UserAuth = () => {
  return useContext(AuthContext)
}
