import { Todo } from "@/types/interfaces";
import { StyleSheet, Text, View } from "react-native";

interface TaskRowProps {
  task: Todo;
}

export default function TaskRow({ task }: TaskRowProps) {
  return (
    <View style={styles.container}>
      <Text>{task.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
