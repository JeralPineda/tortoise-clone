import { Colors } from "@/constants/Colors";
import migrations from "@/drizzle/migrations";
import { addDummyData } from "@/utils/addDummyData";
import { tokenCache } from "@/utils/cache";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import {
  Stack,
  useNavigationContainerRef,
  usePathname,
  useRouter,
  useSegments,
} from "expo-router";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect } from "react";
import { ActivityIndicator, LogBox, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import * as Sentry from "@sentry/react-native";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true, // Only in native builds, not in Expo Go
});

Sentry.init({
  dsn: "https://82cdbce07f69e31b9e2d8d73ef9bfeb0@o4508316179431424.ingest.us.sentry.io/4508736200507392",
  attachScreenshot: true,
  debug: false,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllImages: false,
      maskAllText: false,
      maskAllVectors: false,
    }),
    navigationIntegration,
    Sentry.spotlightIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const CLERK_PUBLISHABLE_KEY = process.env
  .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;
if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
  );
}
LogBox.ignoreLogs(["Clerk: Clerk has been loaded with development keys"]);

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const pathName = usePathname();

  useEffect(() => {
    if (!isLoaded) return;

    const isAuthGroup = segments[0] === "(authenticated)";

    if (isSignedIn && !isAuthGroup) {
      router.replace("/(authenticated)/(tabs)/today");
    } else if (!isSignedIn && pathName !== "/") {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(authenticated)" options={{ headerShown: false }} />
    </Stack>
  );
};

const RootLayout = () => {
  const ref = useNavigationContainerRef();
  const expoDB = openDatabaseSync("todos");
  const db = drizzle(expoDB);
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (!success) return;
    addDummyData(db);
  }, [success]);

  useEffect(() => {
    navigationIntegration.registerNavigationContainer(ref);
  }, [ref]);

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <Suspense fallback={<Loading />}>
          <SQLiteProvider
            databaseName="todos"
            options={{
              enableChangeListener: true,
            }}
            useSuspense
          >
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Toaster />
              <InitialLayout />
            </GestureHandlerRootView>
          </SQLiteProvider>
        </Suspense>
      </ClerkLoaded>
    </ClerkProvider>
  );
};

function Loading() {
  return <ActivityIndicator size="large" color={Colors.primary} />;
}

export default Sentry.wrap(RootLayout);
