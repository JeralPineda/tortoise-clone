import { Colors, DATE_COLORS } from "@/constants/Colors";
import { projects, todos } from "@/db/schema";
import { Project, Todo } from "@/types/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { format, isSameDay, isTomorrow } from "date-fns";
import { eq } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useMMKVString } from "react-native-mmkv";

type TodoFormProps = {
  todo?: Todo & {
    project_name: string;
    project_color: string;
    project_id: number;
  };
};

type TodoFormData = {
  name: string;
  description: string;
};

export default function TodoFormi({ todo }: TodoFormProps) {
  const [showProjects, setShowProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project>(
    todo?.project_id
      ? {
          id: todo?.project_id,
          name: todo?.project_name,
          color: todo?.project_color,
        }
      : {
          id: 1,
          name: "Inbox",
          color: "#000",
        },
  );
  const [selectedDate, setSelectedDate] = useState<Date>(
    todo?.due_date ? new Date(todo.due_date) : new Date(),
  );
  const [previouslySelectedDate, setPreviouslySelectedDate] =
    useMMKVString("selectedDate");

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<TodoFormData>({
    defaultValues: {
      name: todo?.name || "",
      description: todo?.description || "",
    },
    mode: "onChange",
  });

  const { data } = useLiveQuery(drizzleDb.select().from(projects));

  useEffect(() => {
    if (previouslySelectedDate) {
      setSelectedDate(new Date(previouslySelectedDate));
      setPreviouslySelectedDate(undefined);
    }
  }, [previouslySelectedDate]);

  useEffect(() => {
    trigger();
  }, [trigger]);

  const onSubmit: SubmitHandler<TodoFormData> = async (data) => {
    if (todo) {
      // Update todo
      await drizzleDb
        .update(todos)
        .set({
          name: data.name,
          description: data.description,
          project_id: selectedProject.id,
          due_date: selectedDate.getTime(),
        })
        .where(eq(todos.id, todo.id));
    } else {
      // Create todo
      await drizzleDb.insert(todos).values({
        name: data.name,
        description: data.description,
        priority: 0,
        date_added: Date.now(),
        completed: 0,
        project_id: selectedProject.id,
        due_date: selectedDate.getTime(),
      });
    }
    router.dismiss();
  };

  const onProjectPress = (project: Project) => {
    setSelectedProject(project);
    setShowProjects(false);
  };

  const getDateObject = (date: Date) => {
    if (isSameDay(date, new Date())) {
      return { name: "Today", color: DATE_COLORS.today };
    } else if (isTomorrow(new Date(date))) {
      return { name: "Tomorrow", color: DATE_COLORS.tomorrow };
    } else {
      return {
        name: format(new Date(date), "d MMM"),
        color: DATE_COLORS.other,
      };
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={showProjects}
        animationType="fade"
        transparent
        onRequestClose={() => setShowProjects(!showProjects)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
              data={data}
              style={{ borderRadius: 16 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.projectButton}
                  onPress={() => onProjectPress(item)}
                >
                  <Text style={{ color: item.color }}>#</Text>
                  <Text style={styles.projectButtonText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: Colors.lightBorder,
                  }}
                />
              )}
            />
          </View>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.containerScroll}
        keyboardShouldPersistTaps="always" // evitar que el teclado se cierre al presionar cualquier boton o input
      >
        <Controller
          control={control}
          name="name"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="First name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoFocus
              autoCorrect={false}
              style={styles.titleInput}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Description"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              style={styles.descriptionInput}
            />
          )}
        />

        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          style={styles.actionButtonsContainer}
          keyboardShouldPersistTaps="always"
        >
          <Pressable
            onPress={() => {
              const dateString = selectedDate.toISOString();
              setPreviouslySelectedDate(dateString);
              router.push("/task/date-select");
            }}
            style={({ pressed }) => {
              return [
                styles.outlinedButton,
                {
                  backgroundColor: pressed ? Colors.lightBorder : "transparent",
                },
                { borderColor: getDateObject(selectedDate).color },
              ];
            }}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={getDateObject(selectedDate).color}
            />
            <Text
              style={[
                styles.outlinedButtonText,
                { color: getDateObject(selectedDate).color },
              ]}
            >
              {getDateObject(selectedDate).name}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => {
              return [
                styles.outlinedButton,
                {
                  backgroundColor: pressed ? Colors.lightBorder : "transparent",
                },
              ];
            }}
          >
            <Ionicons name="flag-outline" size={24} color={Colors.dark} />
            <Text style={styles.outlinedButtonText}>Priority</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => {
              return [
                styles.outlinedButton,
                {
                  backgroundColor: pressed ? Colors.lightBorder : "transparent",
                },
              ];
            }}
          >
            <Ionicons name="location-outline" size={24} color={Colors.dark} />
            <Text style={styles.outlinedButtonText}>Location</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => {
              return [
                styles.outlinedButton,
                {
                  backgroundColor: pressed ? Colors.lightBorder : "transparent",
                },
              ];
            }}
          >
            <Ionicons name="pricetags-outline" size={24} color={Colors.dark} />
            <Text style={styles.outlinedButtonText}>Labels</Text>
          </Pressable>
        </ScrollView>

        <View style={styles.bottomRow}>
          <Pressable
            onPress={() => setShowProjects(true)}
            style={({ pressed }) => {
              return [
                styles.outlinedButton,
                {
                  backgroundColor: pressed ? Colors.lightBorder : "transparent",
                },
              ];
            }}
          >
            {selectedProject.id === 1 && (
              <Ionicons
                name="file-tray-outline"
                size={20}
                color={Colors.dark}
              />
            )}

            {selectedProject.id !== 1 && (
              <Text
                style={{
                  color: selectedProject.color,
                }}
              >
                #{selectedProject.id}
              </Text>
            )}

            <Text style={styles.outlinedButtonText}>
              {selectedProject.name}
            </Text>
            <Ionicons name="chevron-down" size={14} color={Colors.dark} />
          </Pressable>

          <Pressable
            onPress={handleSubmit(onSubmit)}
            style={[
              styles.submitButton,
              {
                opacity: errors.name ? 0.5 : 1,
              },
            ]}
          >
            <Ionicons name="arrow-up" size={24} color="#fff" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerScroll: {
    backgroundColor: "#fff",
    gap: 12,
    paddingTop: 16,
  },
  titleInput: {
    fontSize: 20,
    paddingHorizontal: 16,
  },
  descriptionInput: {
    fontSize: 18,
    paddingHorizontal: 16,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  outlinedButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightBorder,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  outlinedButtonText: {
    fontSize: 14,
    color: Colors.dark,
    fontWeight: "500",
  },
  bottomRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.lightBorder,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 6,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    width: Dimensions.get("window").width - 60,
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
    elevation: 5,
  },
  projectButton: {
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
  },
  projectButtonText: {
    fontSize: 16,
  },
});
