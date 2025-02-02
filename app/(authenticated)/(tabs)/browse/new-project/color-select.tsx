import { DEFAULT_PROJECT_COLOR, PROJECT_COLORS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function ColorSelect() {
  const [selected, setSelected] = useState<string>(DEFAULT_PROJECT_COLOR);
  const router = useRouter();
  const headerHeight = useHeaderHeight();

  const onColorSelect = (color: string) => {
    setSelected(color);
    router.setParams({ bg: color });
  };

  return (
    <View style={{ marginTop: headerHeight }}>
      <View
        style={{
          flexDirection: "row",
          flexGrow: 1,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {PROJECT_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={{
              backgroundColor: color,
              height: 60,
              width: 60,
              margin: 5,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => onColorSelect(color)}
          >
            {selected === color && (
              <Ionicons name="checkmark" size={24} color={"#fff"} style={{}} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
