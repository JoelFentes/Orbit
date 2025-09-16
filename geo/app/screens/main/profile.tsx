import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import BottomNavigation from "../../../components/BottomNavigation";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../contexts/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const [currentRoute, setCurrentRoute] = useState("profile");

  const handleNavigation = (route: string) => {
    setCurrentRoute(route);
    switch (route) {
      case "home":
        router.push("/screens/main/home");
        break;
      case "calendar":
      case "add":
        router.push("/screens/main/calendar");
        break;
      case "notes":
        router.push("/screens/main/notes");
        break;
      case "profile":
        router.push("/screens/main/profile");
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/screens/auth/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="w-full h-16 justify-center px-5 mt-10">
        <View className="flex-row items-center">
          <Image
            source={require("../../../assets/images/orbita.png")}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <Text className="font-quicksand-semibold text-3xl text-azul-escuro ml-2">
            Orbit Notes
          </Text>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Text className="font-quicksand-semibold text-center text-3xl text-azul-escuro mt-10">
           Meu Perfil
        </Text>

        <View className="flex-1 items-center justify-center mt-10">
          <Ionicons name="person-circle-outline" size={120} color="#78c0e0ff" />
          <Text className="text-2xl font-quicksand-bold text-azul-escuro mt-4">
            {user?.name ?? "Visitante"}
          </Text>
          <Text className="text-base font-quicksand text-gray-600 mt-1">
            {user?.email ?? ""}
          </Text>

          <TouchableOpacity
            onPress={handleLogout}
            className="mt-10 bg-azul-celeste w-40 py-3 rounded-xl items-center justify-center"
          >
            <Text className="text-white font-quicksand-bold text-lg">Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation
        currentRoute={currentRoute}
        onNavigate={handleNavigation}
      />
    </SafeAreaView>
  );
}
