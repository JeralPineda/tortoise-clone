import Fab from "@/components/Fab";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const Page = () => {
  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}
      >
        <Text>Search</Text>
      </ScrollView>

      <Fab />
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
