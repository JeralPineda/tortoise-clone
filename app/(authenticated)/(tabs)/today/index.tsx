import { StyleSheet, Text, View } from "react-native";

import Fab from "@/components/Fab";
import { todos } from "@/db/schema";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useSQLiteContext } from "expo-sqlite";

const Page = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  useDrizzleStudio(db);

  const { data } = useLiveQuery(drizzleDb.select().from(todos));
  console.log("🚀 index.tsx -> #17 ~ data:", JSON.stringify(data, null, 2));

  return (
    <View style={styles.container}>
      <Text>Today</Text>
      <Fab />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 82,
  },
});
