import MoreButton from "@/components/MoreButton";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Upcoming",
          headerShadowVisible: false,
          headerRight: () => <MoreButton pageName="Upcoming" />,
        }}
      />
    </Stack>
  );
};

export default Layout;
