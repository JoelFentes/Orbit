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

        // 🔴 Aqui seta o centro da geofence na posição inicial
        setGeofenceCenter({ latitude, longitude });
    })();
    }, []);


    return (
        <View className="flex-1 items-center ">
            {/* 🗺️ Mapa em background absoluto */}
            <GeofenceMap
                ref={mapRef}
                region={region}
                geofenceCenter={geofenceCenter}
                radiusMeters={radiusMeters}
                places={places}
                onLongPress={(coords) => setGeofenceCenter(coords)}
            />

            <View className="w-[95%] relative top-8">
                {/* Ícone de busca posicionado à esquerda dentro do input */}
                <FontAwesome5
                    name="search"
                    size={14}
                    color="gray"
                    style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: [{ translateY: -8 }], 
                    zIndex: 1,
                    }}
                />

                {/* Input */}
                <TextInput
                    placeholder="Buscar local"
                    className="w-full pl-10 pr-3 py-3 rounded-lg bg-white "
                    onChangeText={(text) => {
                    console.log("Buscando por:", text);
                    }}
                    returnKeyType="search"
                    onSubmitEditing={(e) => {
                    console.log("Buscar:", e.nativeEvent.text);
                    }}
                />
            </View>


             {/* 🎯 Carrossel de categorias */}
                <View className="flex-row items-center justify-right top-10 w-[95%] bg-transparent rounded-lg p-2">
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
                        scrollEventThrottle={14}
                        className="flex-1"
                    >
                       {Categorias.map(cat => {
                            const isSelected = categoryType === cat.name;

                            // Clona o ícone e aplica cor dinamicamente
                            const Icon = React.cloneElement(cat.icon, {
                                color: isSelected ? "white" : "black",
                            });

                            return (
                                <TouchableOpacity
                                    key={cat.name}
                                    onPress={() => setCategoryType(cat.name)}
                                    className={`px-3 py-2 mx-1 rounded-full flex-row items-center border ${
                                        isSelected ? "bg-blue-500 border-blue-500" : "bg-white border-white"
                                    }`}
                                >
                                    <View className="mr-1">{Icon}</View>
                                    <Text
                                        className={`text-sm ${isSelected ? "text-white font-bold" : "text-gray-700"}`}
                                    >
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

                {/* 📍 Botão custom de "ir para minha localização" */}
                <TouchableOpacity
                onPress={() => {
                    if (userLocation && mapRef.current) {
                    mapRef.current.animateToRegion(
                        {
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                        },
                        1000 
                    );
                    }
                }}
                className="absolute top-[10rem] right-5 w-14 h-14 rounded-full items-center justify-center shadow-lg bg-white dark:bg-acento-primario"
                >
                    <Ionicons name="locate-outline" size={26} color={isDark ? "white" : "black"} />
                </TouchableOpacity>


            {/* UI sobreposta no rodapé */}
            <View className="absolute bottom-0 left-0 right-0 p-3 space-y-3">
                {/* 📏 Botões flutuantes para raio */}
                <View className="absolute flex-row bottom-40 right-12 p-2 gap-3">
                    {/* Aumentar raio */}
                    <TouchableOpacity
                        onPress={() => setRadiusMeters(radiusMeters + 100)}
                        className="w-14 h-14 left-10 rounded-full items-center justify-center shadow-lg bg-white dark:bg-acento-primario"
                    >
                        <Ionicons
                            name="add-outline"
                            size={24}
                            color={isDark ? "white" : "black"}
                        />
                    </TouchableOpacity>


                    {/* Diminuir raio */}
                    <TouchableOpacity
                        onPress={() => setRadiusMeters(Math.max(radiusMeters - 100, 100))}
                        className="w-14 h-14 left-10 rounded-full items-center justify-center shadow-lg bg-white dark:bg-acento-primario"
                    >
                        <Ionicons
                            name="remove-outline"
                            size={24}
                            color={isDark ? "white" : "black"}
                        />
                    </TouchableOpacity>           
                </View>

          
            
            </View>
        </View>
    );
}
