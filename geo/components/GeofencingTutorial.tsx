import React, { useRef, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const slides = [
    {
        id: "1",
        title: "Como funciona o Geofencing?",
        description: "Com o Orbit Reminder, você pode ser lembrado automaticamente quando entrar ou sair de um local.",
        icon: "map-outline",
    },
    {
        id: "2",
        title: "Busque um local",
        description: "Use a barra de busca para encontrar um endereço e posicionar o lembrete no mapa.",
        icon: "search-outline",
    },
    {
        id: "3",
        title: "Adicione manualmente",
        description: "Toque e segure no mapa para marcar um ponto personalizado.",
        icon: "location-outline",
    },
    {
        id: "4",
        title: "Ajuste o raio",
        description: "Use os botões + e - para definir o raio de alcance do lembrete.",
        icon: "radio-outline",
    },
    {
        id: "5",
        title: "Veja sua localização",
        description: "Toque no ícone de mira para voltar ao seu local atual.",
        icon: "locate-outline",
    },
];

type Props = {
    visible: boolean;
    onClose: () => void;
};

export default function GeofencingTutorial({ visible, onClose }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            onClose();
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent>
            {/* Fundo escurecido */}
            <View className="flex-1 bg-black/50 items-center justify-center">
                {/* Conteúdo do popup */}
                <View className="w-[85%] max-w-[26rem] bg-white dark:bg-fundo-escuro-principal rounded-3xl p-6 items-center shadow-2xl">

                    {/* Botão Fechar */}
                    <TouchableOpacity
                        onPress={onClose}
                        className="absolute top-4 right-4 bg-gray-200 dark:bg-acento-primario p-2 rounded-full"
                    >
                        <Ionicons name="close" size={22} color="#ffff" />
                    </TouchableOpacity>

                    {/* Conteúdo do slide */}
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
                            <View
                                style={{ width: width * 0.8 }}
                                className="items-center justify-center px-2 py-6"
                            >
                                <Ionicons
                                    name={item.icon as any}
                                    size={60}
                                    color="#66b8f5ff"
                                    style={{ marginBottom: 20 }}
                                />
                                <Text className="font-quicksand-bold dark:text-texto-claro-principal text-xl text-center mb-2">
                                    {item.title}
                                </Text>
                                <Text className="font-quicksand-regular text-base text-center text-gray-600 dark:text-gray-300">
                                    {item.description}
                                </Text>
                            </View>
                        )}
                    />

                    {/* Indicadores */}
                    <View className="flex-row justify-center mt-4 mb-4">
                        {slides.map((_, index) => (
                            <View
                                key={index}
                                className={`h-2 w-2 mx-1 rounded-full ${index === currentIndex ? "bg-azul-celeste w-4" : "bg-gray-300"
                                    }`}
                            />
                        ))}
                    </View>

                    {/* Botão próximo */}
                    <TouchableOpacity
                        onPress={handleNext}
                        className="bg-azul-celeste p-3 rounded-2xl w-full items-center"
                    >
                        <Text className="text-white font-quicksand-bold text-lg">
                            {currentIndex === slides.length - 1 ? "Entendi!" : "Próximo"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
