import { SplashScreenController } from "@/components/splash-screen-controller";
import { useAuthContext } from "@/hooks/use-auth-context";
import { Redirect, Stack } from "expo-router";

export default function PresentationLayout() {

    const { session, isLoading } = useAuthContext()

    if (isLoading) {
        <SplashScreenController />
    }

    if (!session) {
        return <Redirect href="/login" />
    }

    return (
        <Stack screenOptions={{ headerShown: false , contentStyle:{backgroundColor:"black"}}}/>
    )
}