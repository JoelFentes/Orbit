import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import BottomNavigation from "../../../components/BottomNavigation";
import { useState } from "react";
import { router } from "expo-router";
import { useAuth } from '../../../contexts/AuthContext';
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
    const { user } = useAuth();
    const [currentRoute, setCurrentRoute] = useState("home");
    const { colorScheme } = useColorScheme();

    const handleText = () => { };

    const handleNavigation = (route: string) => {
        setCurrentRoute(route);
        switch (route) {
            case "add":
                router.push("/screens/main/addRemider");
                break;
            case "calendar":
                router.push("/screens/main/calendar");
                break;
            case "map":
                router.push("/screens/main/map");
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
                            tintColor: colorScheme === "dark" ? "#f0f3ffff" : "#150578ff"
                        }}
                    />
                    <Text className="font-quicksand-semibold text-3xl text-azul-escuro dark:text-texto-claro-principal ml-2">
                        Orbit Notes
                    </Text>
                </View>
            </View>

            {/* Conteúdo principal */}
            <ScrollView
                className="flex-1 px-5"
                contentContainerStyle={{ paddingBottom: 80 }}
            >
                <Text className="font-quicksand-semibold text-3xl text-azul-escuro dark:text-texto-claro-principal mt-6">
                    Olá {user?.name ?? 'visitante'}, com o que podemos te ajudar hoje?
                </Text>

                {/* Lembretes */}
                <View className="rounded-2xl p-5 mt-2 dark:bg-transparent">
                    <View className="flex-row justify-between items-center">
                        <Text className="font-quicksand-medium text-lg text-azul-escuro dark:text-texto-claro-principal">
                            Lembretes
                        </Text>
                        <TouchableOpacity onPress={handleText}>
                            <Text className="font-quicksand-regular text-base text-azul-celestial dark:text-texto-claro-principal">
                                Ver todos
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={handleText}
                        className="bg-azul-celeste/10 dark:bg-acento-primario/20 w-76 h-40 rounded-2xl mt-4 flex items-center justify-center"
                    >
                        {colorScheme === "dark" ? (
                            <Ionicons name="add-circle" size={36} color="white" />
                        ) : (
                            <Ionicons name="add" size={36} color="black" />
                        )}
                    </TouchableOpacity>

                </View>

                {/* Próximos eventos */}
                <View className="rounded-2xl p-5 mt-2 dark:bg-transparent">
                    <View className="flex-row justify-between items-center">
                        <Text className="font-quicksand-medium text-lg text-azul-escuro dark:text-texto-claro-principal">
                            Próximos eventos
                        </Text>
                        <TouchableOpacity onPress={handleText}>
                            <Text className="font-quicksand-regular text-base text-azul-celestial dark:text-texto-claro-principal">
                                Ver todos
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={handleText}
                        className="bg-azul-celeste/10 dark:bg-acento-primario/20 w-76 h-40 rounded-2xl mt-4 flex items-center justify-center"
                    >
                        {colorScheme === "dark" ? (
                            <Ionicons name="add-circle" size={36} color="white" />
                        ) : (
                            <Ionicons name="add" size={36} color="black" />
                        )}
                    </TouchableOpacity>

                </View>

                {/* Minhas Pastas */}
                <View className="rounded-2xl p-5 mt-2 dark:bg-transparent mb-10">
                    <View className="flex-row justify-between items-center">
                        <Text className="font-quicksand-medium text-lg text-azul-escuro dark:text-texto-claro-principal mt-4">
                            Minhas Pastas
                        </Text>
                        <TouchableOpacity onPress={handleText}>
                            <Text className="font-quicksand-regular text-base text-azul-celestial dark:text-texto-claro-principal">
                                Ver todos
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={handleText}
                        className="bg-azul-celeste/10 dark:bg-acento-primario/20 w-76 h-40 rounded-2xl mt-4 flex items-center justify-center"
                    >
                        {colorScheme === "dark" ? (
                            <Ionicons name="add-circle" size={36} color="white" />
                        ) : (
                            <Ionicons name="add" size={36} color="black" />
                        )}
                    </TouchableOpacity>

                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <BottomNavigation currentRoute={currentRoute} onNavigate={handleNavigation} />
        </SafeAreaView>
    );
}
