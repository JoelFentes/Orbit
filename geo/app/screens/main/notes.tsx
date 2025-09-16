import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import BottomNavigation from "../../../components/BottomNavigation";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Notes() {
  const [currentRoute, setCurrentRoute] = useState("notes");

  const handleText = () => {
    // Aqui você pode implementar a navegação para listagem ou edição de notas
  };

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
      case "map":
        router.push("/screens/main/map");
        break;
      case "profile":
        router.push("/screens/main/profile");
        break;
      default:
        break;
    }
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

      {/* Conteúdo principal */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <Text className="font-quicksand-semibold text-3xl text-azul-escuro mt-6">
          Minhas Notas
        </Text>

        {/* Últimas notas */}
        <View className="bg-cinza-claro rounded-2xl p-5 mt-4">
          <View className="flex-row justify-between items-center">
            <Text className="font-quicksand-medium text-lg text-azul-escuro">
              Últimas anotações
            </Text>
            <TouchableOpacity onPress={handleText}>
              <Text className="font-quicksand-regular text-base text-azul-celestial">
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleText}
            className="bg-azul-celeste/10 w-76 h-40 rounded-2xl mt-4"
          />
        </View>

        {/* Pastas */}
        <View className="bg-cinza-claro rounded-2xl p-5 mt-4">
          <View className="flex-row justify-between items-center">
            <Text className="font-quicksand-medium text-lg text-azul-escuro">
              Minhas Pastas
            </Text>
            <TouchableOpacity onPress={handleText}>
              <Text className="font-quicksand-regular text-base text-azul-celestial">
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleText}
            className="bg-azul-celeste/10 w-76 h-40 rounded-2xl mt-4"
          />
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View className="absolute bottom-24 right-5 p-2 gap-3">
        {/* Criar Pasta */}
        <TouchableOpacity

          className="w-14 h-14 bg-azul-celeste rounded-full items-center justify-center shadow-lg"
        >
          <Ionicons name="folder-open-outline" size={24} color="white" />
        </TouchableOpacity>

        {/* Criar Nota */}
        <TouchableOpacity

          className="w-14 h-14 bg-azul-celeste rounded-full items-center justify-center shadow-lg"
        >
          <Ionicons name="pencil-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation
        currentRoute={currentRoute}
        onNavigate={handleNavigation}
      />
    </SafeAreaView>
  );
}
