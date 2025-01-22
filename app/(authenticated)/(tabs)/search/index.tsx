import Fab from "@/components/Fab";
import { ScrollView, Text, View } from "react-native";

const Page = () => {
  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Text>Search</Text>
        </View>
      </ScrollView>

      <Fab />
    </>
  );
};

export default Page;
