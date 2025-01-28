import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const Page = () => {
  const { id } = useLocalSearchParams();
  console.log("🚀 [id].tsx -> #6 ~ id:", id);

  return (
    <View style={styles.container}>
      <Text>Page: {id}</Text>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
