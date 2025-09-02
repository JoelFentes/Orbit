import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, Image, ScrollView } from "react-native";
import BottomNavigation from "../../../components/BottomNavigation";
import { useState } from "react";
import { router } from "expo-router";

export default function Home() {
    const [currentRoute, setCurrentRoute] = useState("home");

    const handleNavigation = (route: string) => {
        setCurrentRoute(route);

        // Navegação para outras telas (ajuste conforme suas rotas)
        switch (route) {
            case "calendar":
                router.push("/screens/main/calendar");
                break;
            case "map":
                router.push("/screens/main/map");
                break;
            case "profile":
                router.push("/screens/main/notes");
                break;
            default:
                // Para home, fica na mesma tela
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
                        Orbit
                    </Text>
                </View>
            </View>

            {/* Conteúdo principal */}
            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 80 }}>
                <View className="bg-cinza-claro rounded-2xl p-5 mt-2">
                    <Text className="font-quicksand-medium text-lg text-azul-escuro">
                        Lembretes de hoje
                    </Text>
                    <View className="bg-black w-76 h-40 rounded-2xl mt-4">

                    </View>
                </View>

                <View className="bg-cinza-claro rounded-2xl p-5 mt-2">
                    <Text className="font-quicksand-medium text-lg text-azul-escuro">
                        Próximos eventos
                    </Text>
                    <View className="bg-black w-76 h-40 rounded-2xl mt-4">

                    </View>
                </View>

                <View>
                    <Text className="font-quicksand-medium text-lg text-azul-escuro mt-4">
                        Minhas Pastas
                    </Text>
                    <View className="bg-black w-76 h-40 rounded-2xl mt-4">

                    </View>
                </View>

            </ScrollView>

            {/* Bottom Navigation */}
            <BottomNavigation
                currentRoute={currentRoute}
                onNavigate={handleNavigation}
            />
        </SafeAreaView >
    );
}