import { Session } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

export type AuthData = {
  session?: Session | null
  profile?: any | null
  isLoading: boolean
  isLoggedIn: boolean,
  isAuthenticating: boolean,
  setIsAuthenticating: (value: boolean) => void,
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthData>({
  session: undefined,
  profile: undefined,
  isLoading: true,
  isLoggedIn: false,
  isAuthenticating: false,
  setIsAuthenticating: () => {},
  logout: async () => {},
})

export const useAuthContext = () => useContext(AuthContext)