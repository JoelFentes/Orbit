// GeofencingScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';
import * as Location from 'expo-location';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import GeofenceMap from '@/components/GeofencingMap';

// Categorias comuns do Google Places
const Categorias = [
    { name: "Farmácia", icon: <MaterialCommunityIcons name="medical-bag" size={16} color="white" /> },
    { name: "Padaria", icon: <MaterialCommunityIcons name="bread-slice" size={16} color="white" /> },
    { name: "Mercado", icon: <FontAwesome5 name="shopping-basket" size={16} color="white" /> },
    { name: "Restaurante", icon: <MaterialCommunityIcons name="silverware-fork-knife" size={16} color="white" /> },
    { name: "Café", icon: <MaterialCommunityIcons name="coffee" size={16} color="white" /> },
    { name: "Escola", icon: <MaterialCommunityIcons name="school" size={16} color="white" /> },
    { name: "Hospital", icon: <MaterialCommunityIcons name="hospital" size={16} color="white" /> },
    { name: "Academia", icon: <MaterialCommunityIcons name="dumbbell" size={16} color="white" /> },
    { name: "Igreja", icon: <MaterialCommunityIcons name="church" size={16} color="white" /> },
    { name: "Banco", icon: <MaterialCommunityIcons name="bank" size={16} color="white" /> },
];

export default function GeofencingScreen() {
    const scrollRef = useRef<ScrollView>(null);
    const [scrollX, setScrollX] = useState(0);
    const scrollAmount = 150;

    const mapRef = useRef(null);
    const [region, setRegion] = useState({
        latitude: -8.056,
        longitude: -34.9,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const [userLocation, setUserLocation] = useState(null);
    const [geofenceCenter, setGeofenceCenter] = useState(null);
    const [radiusMeters, setRadiusMeters] = useState(300);
    const [places, setPlaces] = useState([]);
    const [categoryType, setCategoryType] = useState("pharmacy");

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    // Pega localização do usuário
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permissão negada", "É necessário liberar localização.");
                return;
            }
            let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
            const { latitude, longitude } = loc.coords;
            setUserLocation({ latitude, longitude });
            setRegion(r => ({ ...r, latitude, longitude }));
        })();
    }, []);

    return (
        <View className="flex-1">
            {/* 🗺️ Mapa em background absoluto */}
            <GeofenceMap
                ref={mapRef}
                region={region}
                geofenceCenter={geofenceCenter}
                radiusMeters={radiusMeters}
                places={places}
                onLongPress={(coords) => setGeofenceCenter(coords)}
            />

            {/* UI sobreposta no rodapé */}
            <View className="absolute bottom-0 left-0 right-0 p-3 space-y-3">

                {/* 📏 Botões flutuantes para raio */}
                <View className="absolute bottom-28 right-5 p-2 gap-3">
                    {/* Diminuir raio */}
                    <TouchableOpacity
                        onPress={() => setRadiusMeters(Math.max(radiusMeters - 100, 100))}
                        className="w-14 h-14 rounded-full items-center justify-center shadow-lg bg-white dark:bg-acento-primario/20"
                    >
                        <Ionicons
                            name="remove-outline"
                            size={24}
                            color={isDark ? "white" : "black"}
                        />
                    </TouchableOpacity>

                    {/* Aumentar raio */}
                    <TouchableOpacity
                        onPress={() => setRadiusMeters(radiusMeters + 100)}
                        className="w-14 h-14 rounded-full items-center justify-center shadow-lg bg-white dark:bg-acento-primario/20"
                    >
                        <Ionicons
                            name="add-outline"
                            size={24}
                            color={isDark ? "white" : "black"}
                        />
                    </TouchableOpacity>
                </View>


                {/* 🎯 Carrossel de categorias */}
                <View className="flex-row items-center bg-white/90 rounded-lg p-2">
                    {scrollX > 0 && (
                        <TouchableOpacity
                            className="px-2"
                            onPress={() => {
                                if (scrollRef.current) {
                                    scrollRef.current.scrollTo({ x: scrollX - scrollAmount, animated: true });
                                    setScrollX(Math.max(scrollX - scrollAmount, 0));
                                }
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
                        scrollEventThrottle={16}
                        className="flex-1"
                    >
                        {Categorias.map(cat => (
                            <TouchableOpacity
                                key={cat.name}
                                onPress={() => setCategoryType(cat.name)}
                                className={`px-3 py-2 mx-1 rounded-full flex-row items-center border ${categoryType === cat.name
                                    ? "bg-blue-500 border-blue-500"
                                    : "bg-gray-200 border-gray-300"
                                    }`}
                            >
                                <View className="mr-1">{cat.icon}</View>
                                <Text
                                    className={`text-sm ${categoryType === cat.name ? "text-white font-bold" : "text-gray-700"
                                        }`}
                                >
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {scrollRef.current && scrollX + 300 < Categorias.length * 100 && (
                        <TouchableOpacity
                            className="px-2"
                            onPress={() => {
                                if (scrollRef.current) {
                                    scrollRef.current.scrollTo({ x: scrollX + scrollAmount, animated: true });
                                    setScrollX(scrollX + scrollAmount);
                                }
                            }}
                        >
                            <Fontisto name="angle-right" size={16} color="black" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Input de busca */}
                <View className="flex-row items-center bg-white/90 rounded-lg p-2">
                    <TextInput
                        placeholder="Buscar local"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2 bg-white"
                    />
                    <Button title="Buscar" onPress={() => { }} />
                </View>
            </View>
        </View>
    );
}
