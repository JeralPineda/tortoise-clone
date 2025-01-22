import { useAuth } from "@clerk/clerk-expo";
import { Button, Text, View } from "react-native";

const Page = () => {
  const { signOut } = useAuth();
  return (
    <View>
      <Text>Browse</Text>
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
};

export default Page;
