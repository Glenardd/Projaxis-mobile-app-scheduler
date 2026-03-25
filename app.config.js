module.exports = {
  "expo": {
    "jsEngine": "hermes",
    "name": "Projaxis",
    "slug": "projaxis",
    "version": "1.0.2",
    "orientation": "portrait",
    "icon": "./assets/images/icon_projaxis.png",
    "scheme": "projaxis",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.anonymous.projaxis"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/icon_projaxis.png",
        "backgroundImage": "./assets/images/icon_projaxis.png",
        "backgroundColor": "#070C27"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.anonymous.projaxis",
      "enableProguardInReleaseBuilds": true
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/icon_projaxis.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#070C27",
          "dark": {
            "backgroundColor": "#070C27"
          }
        }
      ],
      "expo-secure-store",
      "@react-native-google-signin/google-signin"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "supabaseUrl": "EXPO_PUBLIC_SUPABASE_URL",
      "supabaseAnonKey": "EXPO_PUBLIC_SUPABASE_ANON_KEY",
      "googleAuthWebClientId": "EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID",
      "cronSecret": "CRON_SECRET",
      "googleClientSecret": "SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET",
      "nodeEnv": "NODE_ENV",
      "eas": {
        "projectId": "e6d186e1-e734-4927-ba57-88836c4177dc"
      }
    }
  }
}