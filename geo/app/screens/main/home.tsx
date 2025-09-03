import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import BottomNavigation from "../../../components/BottomNavigation";
import { useState } from "react";
import { router } from "expo-router";
import { useAuth } from '../../../contexts/AuthContext';


export default function Home() {

    const { user } = useAuth();
    const [currentRoute, setCurrentRoute] = useState("home");

    const handleText = () => {
    }

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
            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 80 }}>
                    <Text className="font-quicksand-semibold text-3xl text-azul-escuro mt-6">
                        Olá {user?.name ?? 'visitante'}, com o que podemos te ajudar hoje?
                    </Text>

                <View className="bg-cinza-claro rounded-2xl p-5 mt-2">
                    <View className="flex-row justify-between items-center">
                        <Text className="font-quicksand-medium text-lg text-azul-escuro">
                            Lembretes de hoje
                        </Text>
                         <TouchableOpacity onPress={handleText}>
                            <Text className="font-quicksand-regular text-base text-azul-celestial">
                                Ver todos
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handleText} className="bg-azul-celeste/10 w-76 h-40 rounded-2xl mt-4">

                    </TouchableOpacity>
                </View>

                <View className="bg-cinza-claro rounded-2xl p-5 mt-2">
                    <View className="flex-row justify-between items-center">
                        <Text className="font-quicksand-medium text-lg text-azul-escuro">
                            Próximos eventos
                        </Text>
                        <TouchableOpacity onPress={handleText}>
                            <Text className="font-quicksand-regular text-base text-azul-celestial">
                                Ver todos
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handleText} className="bg-azul-celeste/10 w-76 h-40 rounded-2xl mt-4">

                    </TouchableOpacity>
                </View>

                <View>
                    <View className="flex-row justify-between items-center">
                        <Text className="font-quicksand-medium text-lg text-azul-escuro mt-4">
                            Minhas Pastas
                        </Text> 
                        <TouchableOpacity onPress={handleText}>
                            <Text  className="font-quicksand-regular text-base text-azul-celestial">
                                Ver todos
                            </Text>
                        </TouchableOpacity>
                    </View> 
                    <TouchableOpacity onPress={handleText} className="bg-azul-celeste/10 w-76 h-40 rounded-2xl mt-4">

                    </TouchableOpacity>
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