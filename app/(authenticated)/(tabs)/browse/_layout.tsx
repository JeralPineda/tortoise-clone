import { Colors } from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useRouter } from "expo-router";
import { Button, Image, StyleSheet } from "react-native";

const Layout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: Colors.backgroundAlt,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Browse",
          headerLeft: () => <HeaderLeft />,
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="new-project"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          presentation: "modal",
          headerTransparent: true,
          title: "Settings",
          headerRight: () => (
            <Button
              title="Done"
              color={Colors.primary}
              onPress={() => router.dismiss()}
            />
          ),
        }}
      />
    </Stack>
  );
};

const HeaderLeft = () => {
  const { user } = useUser();

  return <Image source={{ uri: user?.imageUrl }} style={styles.image} />;
};

const HeaderRight = () => {
  return (
    <Link href="/browse/settings">
      <Ionicons name="settings-outline" size={24} color={Colors.primary} />
    </Link>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default Layout;
