import { Colors } from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import { Button } from "react-native";

export default function Layout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.backgroundAlt },
        headerTintColor: Colors.primary,
        headerTitleStyle: { color: "#000" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "New Project",
          headerTransparent: true,
          headerLeft: () => (
            <Button
              title="Cancel"
              color={Colors.primary}
              onPress={() => router.dismiss()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="color-select"
        options={{
          title: "Color",
          headerTransparent: true,
        }}
      />
    </Stack>
  );
}
