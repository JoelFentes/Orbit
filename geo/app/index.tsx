import { useState, useRef } from "react";
import { View, Text, SafeAreaView, Image, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const slides = [
    {
        id: "1",
        title: "Bem-vindo ao Orbit Reminder!",
        description: "Seja lembrado no lugar certo, na hora certa — e mantenha sua rotina leve e organizada.",
        image: require("../assets/images/orbita.png"), // Logo
        type: "logo",
    },
    {
        id: "2",
        title: "Calendário Inteligente",
        description: "Organize seus lembretes em um calendário visual e prático.",
        image: require("../assets/images/calendar.png"),
        type: "calendar",
    },
    {
        id: "3",
        title: "Localização Precisa",
        description: "Receba lembretes no lugar certo, usando geolocalização.",
        image: require("../assets/images/map.png"),
        type: "map",
    },
    {
        id: "4",
        title: "Pronto para começar?",
        description: "Vamos juntos tornar sua rotina mais leve.",
        image: require("../assets/images/start.png"),
        type: "final",
    },
];

export default function Onboarding() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.push("/screens/auth/login");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <FlatList
                data={slides}
                ref={flatListRef}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
                renderItem={({ item }) => (
                    <View style={{ width, alignItems: "center", justifyContent: "center", padding: 20 }}>
                        {item.type === "logo" && (
                            <View className="flex-row items-center mb-10">
                                <Image source={item.image} style={{ width: 60, height: 60, marginRight: 12 }} resizeMode="contain" />
                                <Text className="font-quicksand-bold text-4xl">Orbit Reminder</Text>
                            </View>
                        )}

                        {item.type !== "logo" && item.image && (
                            <Image source={item.image} style={{ width: 200, height: 200, marginBottom: 20 }} resizeMode="contain" />
                        )}

                        <Text className="font-quicksand-bold text-2xl text-center mt-5 mb-4">{item.title}</Text>
                        <Text className="font-quicksand-regular text-lg text-center px-6">{item.description}</Text>
                    </View>
                )}
            />

            {/* Indicadores */}
            <View className="flex-row justify-center mb-6">
                {slides.map((_, index) => (
                    <View
                        key={index}
                        className={`h-2 w-2 mx-1 rounded-full ${index === currentIndex ? "bg-azul-celeste w-4" : "bg-gray-300"}`}
                    />
                ))}
            </View>

            {/* Botão */}
            <View className="px-8 mb-16">
                <TouchableOpacity
                    onPress={handleNext}
                    className="bg-azul-celeste p-4 rounded-2xl items-center"
                >
                    <Text className="text-white font-quicksand-bold text-lg">
                        {currentIndex === slides.length - 1 ? "Começar" : "Próximo"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
