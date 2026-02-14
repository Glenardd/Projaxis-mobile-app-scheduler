import { AuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import * as SplashScreen from 'expo-splash-screen';
import { PropsWithChildren, useEffect, useState } from 'react';

//prevent auto close splashscreen
SplashScreen.preventAutoHideAsync()

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)

      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) console.error("Error fetching session:", error)

      setSession(session)
      setIsLoading(false)

      //always hide splash after init, even if session=null
      await SplashScreen.hideAsync()
    };

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", { event: _event, session })
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)

      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setProfile(data)
      } else {
        setProfile(null)
      }

      setIsLoading(false)
    }

    fetchProfile()
  }, [session])

  // logout function to clear session and profile
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error)
    setSession(null)
    setProfile(null)
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        profile,
        isLoggedIn: !!session, // correct check (null = not logged in)
        logout,                // added logout to context value
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
