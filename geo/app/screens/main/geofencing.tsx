import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import Fontisto from '@expo/vector-icons/Fontisto';
import * as Location from 'expo-location';
import { useColorScheme } from 'nativewind';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import GeofenceMap from '@/components/GeofencingMap';

// 👉 Substituir pela sua chave do Google Maps
const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY";

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
    const mapRef = useRef<MapView>(null);
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
            if (mapRef.current) {
                mapRef.current.animateToRegion(
                    { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 },
                    500
                );
            }
        })();
    }, []);

    return (
        <View className="flex-1">
            {/* 🗺️ Mapa absoluto */}
            <GeofenceMap
                ref={mapRef}
                region={region}
                geofenceCenter={geofenceCenter}
                radiusMeters={radiusMeters}
                places={places}
                onLongPress={(coords) => setGeofenceCenter(coords)}
            />

            {/* Conteúdo sobreposto */}
            <View className="absolute inset-0 p-2">
                {/* Input de busca */}
                <View className="flex-row items-center mb-2 bg-white/80 rounded-lg p-1">
                    <TextInput
                        placeholder="Buscar local"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2 bg-white"
                    />
                    <Button title="Buscar" onPress={() => { }} />
                </View>

                {/* 🎯 Carrossel de categorias */}
                <View className="flex-row items-center mb-2">
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
                                onPress={() => handleSearchCategory(cat.name)}
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

                {/* 📏 Input do raio */}
                <View className="flex-row items-center mt-3 bg-white/80 rounded-lg p-1">
                    <TextInput
                        placeholder="Raio em metros"
                        keyboardType="numeric"
                        value={String(radiusMeters)}
                        onChangeText={t => setRadiusMeters(Number(t) || 0)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2 bg-white"
                    />
                    <Button title="Aplicar" onPress={() => Alert.alert("Raio atualizado", `${radiusMeters}m`)} />
                </View>
            </View>
        </View>
    );
}
