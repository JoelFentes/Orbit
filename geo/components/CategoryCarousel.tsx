import React, { useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

type LatLng = { latitude: number; longitude: number };

interface CategoryCarouselProps {
    categoryType: string | null;
    onCategorySelect: (category: string | null) => void;
    userLocation: LatLng | null;
    setPlaces: (places: any[]) => void;
}

const Categorias = [
    { name: "Farmácia", iconLib: MaterialCommunityIcons, iconName: "medical-bag" },
    { name: "Padaria", iconLib: MaterialCommunityIcons, iconName: "bread-slice" },
    { name: "Mercado", iconLib: FontAwesome5, iconName: "shopping-basket" },
    { name: "Restaurante", iconLib: MaterialCommunityIcons, iconName: "silverware-fork-knife" },
    { name: "Café", iconLib: MaterialCommunityIcons, iconName: "coffee" },
    { name: "Escola", iconLib: MaterialCommunityIcons, iconName: "school" },
    { name: "Hospital", iconLib: MaterialCommunityIcons, iconName: "hospital" },
    { name: "Academia", iconLib: MaterialCommunityIcons, iconName: "dumbbell" },
    { name: "Igreja", iconLib: MaterialCommunityIcons, iconName: "church" },
    { name: "Banco", iconLib: MaterialCommunityIcons, iconName: "bank" },
];

const googleCategoryTypes: Record<string, string> = {
    "Farmácia": "pharmacy",
    "Padaria": "bakery",
    "Mercado": "supermarket",
    "Restaurante": "restaurant",
    "Café": "cafe",
    "Escola": "school",
    "Hospital": "hospital",
    "Academia": "gym",
    "Igreja": "church",
    "Banco": "bank",
};

const fetchPlacesByCategory = async (category: string, location: LatLng, apiKey: string) => {
    const type = googleCategoryTypes[category];
    if (!type) return [];

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=5000&type=${type}&key=${apiKey}&language=pt-BR`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK") {
            // ✅ FILTRAGEM: Pega apenas os 10 primeiros resultados (que já vêm ordenados por proximidade)
            const top10Results = data.results.slice(0, 10);

            return top10Results.map((p: any) => ({
                id: p.place_id,
                name: p.name,
                location: { latitude: p.geometry.location.lat, longitude: p.geometry.location.lng },
            }));
        }
    } catch (error) {
        console.error(error);
        return [];
    }
};

export default function CategoryCarousel({
    categoryType,
    onCategorySelect,
    userLocation,
    setPlaces,
}: CategoryCarouselProps) {
    const scrollRef = useRef<ScrollView>(null);
    const [scrollX, setScrollX] = useState(0);
    const scrollAmount = 150;
    const GOOGLE_API_KEY = "AIzaSyDyzvSaODwJe39S20kjuA9y-y2lufQ3P6c";

    const handleSelect = async (catName: string) => {
        if (categoryType === catName) {
            // desmarca categoria
            onCategorySelect(null);
            setPlaces([]);
        } else {
            onCategorySelect(catName);
            if (userLocation) {
                const lugares = await fetchPlacesByCategory(catName, userLocation, GOOGLE_API_KEY);
                setPlaces(lugares);
            }
        }
    };

    return (
        <View className="flex-row top-20 items-center justify-right w-full bg-transparent rounded-lg p-2">
            {scrollX > 0 && (
                <TouchableOpacity
                    className="px-2"
                    onPress={() => {
                        scrollRef.current?.scrollTo({ x: scrollX - scrollAmount, animated: true });
                        setScrollX(Math.max(scrollX - scrollAmount, 0));
                    }}
                >
                    <Fontisto name="angle-left" size={16} color="black" />
                </TouchableOpacity>
            )}

            <ScrollView
                horizontal
                ref={scrollRef}
                showsHorizontalScrollIndicator={false}
                onScroll={e => setScrollX(e.nativeEvent.contentOffset.x)}
                scrollEventThrottle={14}
                className="flex-1"
            >
                {Categorias.map(cat => {
                    const isSelected = categoryType === cat.name;
                    const Icon = cat.iconLib;

                    return (
                        <TouchableOpacity
                            key={cat.name}
                            onPress={() => handleSelect(cat.name)}
                            className={`px-3 py-2 mx-1 rounded-full flex-row items-center border ${isSelected ? "bg-blue-500 border-blue-500" : "bg-white border-white"}`}
                        >
                            <View className="mr-1">
                                <Icon name={cat.iconName} size={16} color={isSelected ? "white" : "black"} />
                            </View>
                            <Text className={`text-sm ${isSelected ? "text-white font-bold" : "text-gray-700"}`}>
                                {cat.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {scrollRef.current && scrollX + 300 < Categorias.length * 100 && (
                <TouchableOpacity
                    className="px-2"
                    onPress={() => {
                        scrollRef.current?.scrollTo({ x: scrollX + scrollAmount, animated: true });
                        setScrollX(scrollX + scrollAmount);
                    }}
                >
                    <Fontisto name="angle-right" size={16} color="black" />
                </TouchableOpacity>
            )}
        </View>
    );
}
