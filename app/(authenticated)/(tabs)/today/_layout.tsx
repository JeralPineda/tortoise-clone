import MoreButton from "@/components/MoreButton";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Today",
          headerLargeTitle: true,
          headerRight: () => <MoreButton pageName="Today" />,
        }}
      />
    </Stack>
  );
};

export default Layout;
