import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, Image, ScrollView, TouchableOpacity, Switch, Button } from "react-native";
import BottomNavigation from "../../../components/BottomNavigation";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../contexts/AuthContext";
import { useColorScheme } from "nativewind";

export default function Profile() {
  const { user, logout } = useAuth();
  const [currentRoute, setCurrentRoute] = useState("profile");
  const { colorScheme, setColorScheme } = useColorScheme();

  const handleNavigation = (route: string) => {
    setCurrentRoute(route);
    switch (route) {
      case "home":
        router.push("/screens/main/home");
        break;
      case "calendar":
      case "add":
        router.push("/screens/main/addRemider");
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
    <SafeAreaView className="flex-1 bg-white dark:bg-fundo-escuro-principal">
      {/* Header */}
      <View className="w-full h-16 justify-center px-5 mt-10">
        <View className="flex-row items-center">
          <Image
            source={require("../../../assets/images/orbita.png")}
            className="w-10 h-10"
            resizeMode="contain"
            style={{
              tintColor: colorScheme === "dark" ? "#f0f3ffff" : "#150578ff" // mesmo do texto
            }}
          />
          <Text className="font-quicksand-semibold text-3xl text-azul-escuro dark:text-texto-claro-principal ml-2">
            Orbit Notes
          </Text>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Text className="font-quicksand-semibold text-center text-3xl text-azul-escuro dark:text-texto-claro-principal mt-10">
          Meu Perfil
        </Text>

        <View className="flex-1 items-center justify-center mt-10">
          {user?.photo ? (
            <Image
              source={{ uri: user.photo }}
              className="w-32 h-32 rounded-full"
              style={{ width: 120, height: 120, borderRadius: 60 }}
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={120}
              color={colorScheme === "dark" ? "#b2daffff" : "#78c0e0ff"}
            />
        )}

          <Text className="text-2xl font-quicksand-bold text-azul-escuro dark:text-texto-claro-principal mt-4">
            {user?.name ?? "Visitante"}
          </Text>
          <Text className="text-base font-quicksand text-gray-600 dark:text-texto-claro-secundario mt-1">
            {user?.email ?? ""}
          </Text>
          <Button
            title="Editar Perfil"
            onPress={() => router.push("../main/editProfile")}
          />


          {/* Switch para alternar tema */}
          <View className="flex-row items-center mt-6">
            <Text className="text-gray-800 dark:text-texto-claro-principal mr-2">
              Tema Escuro
            </Text>
            <Switch
              value={colorScheme === "dark"}
              onValueChange={(val: any) => setColorScheme(val ? "dark" : "light")}
            />
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="mt-10 bg-azul-celeste dark:bg-acento-primario w-40 py-3 rounded-xl items-center justify-center"
          >
            <Text className="text-white font-quicksand-bold text-lg">
              Sair
            </Text>
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
