import { StyleSheet, Text, View } from "react-native";

import Fab from "@/components/Fab";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Page = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top - 36 }]}>
      <Text>Upcoming</Text>
      <Fab />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
