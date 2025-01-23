import Fab from "@/components/Fab";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const Page = () => {
  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}
      >
        <View>
          <Text>Search</Text>
        </View>
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
