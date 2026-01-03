import LogoTitle from "@/components/icon-sceen-header";
import ScreenHeader from "@/components/screen-header";
import { SplashScreenController } from "@/components/splash-screen-controller";
import { useAuthContext } from '@/hooks/use-auth-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Redirect } from 'expo-router';
import Home from ".";
import Forms from "./forms";

export default function HomeLayout() {
  const { session, isLoading } = useAuthContext()
  const Stack = createNativeStackNavigator();

  const avatar_url = session?.user.user_metadata?.avatar_url
  const username = session?.user.user_metadata?.name

  if (isLoading) {
    <SplashScreenController />
  }

  if (!session) {
    return <Redirect href="/login" />
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={Home} options={{
        headerShown: true,
        headerTitle: () => <LogoTitle image_url={avatar_url} username={username} />,
        headerStyle: {
          backgroundColor: "#070C27"
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {backgroundColor: "#070C27"}
      }} />
      <Stack.Screen name="forms/index" component={Forms} options={{
        headerShown: true,
        headerShadowVisible: false,
        headerTitle: () => <ScreenHeader title="Add Project" subtitle="Add new project" currentPage="Project Library"/>,
        headerStyle: {
          backgroundColor: "#070C27"
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => null,
        headerBackVisible:false,
        contentStyle: {backgroundColor: "#070C27"}
      }} />
    </Stack.Navigator>
  )
}
