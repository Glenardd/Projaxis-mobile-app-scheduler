import LogoTitle from "@/components/icon-sceen-header";
import { SplashScreenController } from "@/components/splash-screen-controller";
import { useAuthContext } from '@/hooks/use-auth-context';
import { Redirect, Stack } from 'expo-router';

export default function HomeLayout() {
  const { session, isLoading } = useAuthContext()

  const avatar_url = session?.user.user_metadata?.avatar_url
  const username = session?.user.user_metadata?.name

  if (isLoading) {
    <SplashScreenController />
  }

  if (!session) {
    return <Redirect href="/login" />
  }

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" options={{
        headerShown: true,
        headerTitle: () => <LogoTitle image_url={avatar_url} username={username} />,
        headerStyle: {
          backgroundColor: "#070C27"
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: { backgroundColor: "#070C27" }
      }} />
    </Stack>
  )
}
