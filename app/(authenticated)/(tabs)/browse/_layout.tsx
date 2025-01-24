import MoreButton from "@/components/MoreButton";
import { Colors } from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Image, StyleSheet } from "react-native";

const Layout = () => {
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
        name="settings"
        options={{
          title: "Settings",
          headerLargeTitle: true,
          headerRight: () => <MoreButton pageName="Settings" />,
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
  {
    /* <Link href="/browse/settings"> */
    // </Link>
  }
  return <Ionicons name="settings-outline" size={24} color={Colors.primary} />;
};

const styles = StyleSheet.create({
  image: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default Layout;
