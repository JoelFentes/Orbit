import React, { useEffect, useRef, useState } from 'react';
import { View, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import GeofenceMap, { Place } from '@/components/GeofencingMap';
import PlaceAutocomplete from '@/components/PlaceAutocomplete';
import CategoryCarousel from '@/components/CategoryCarousel';
import ButtonEs from '@/components/ButtonEs';

type LatLng = { latitude: number; longitude: number } | null;

export default function GeofencingScreen() {
    const mapRef = useRef(null);
    const [region, setRegion] = useState({
        latitude: -8.056,
        longitude: -34.9,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const [userLocation, setUserLocation] = useState<LatLng>(null);
    const [radiusMeters, setRadiusMeters] = useState(300);
    const [places, setPlaces] = useState<Place[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [customPoint, setCustomPoint] = useState<LatLng>(null);

    const [showTutorial, setShowTutorial] = useState(false);

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
            setCustomPoint({ latitude, longitude });
        })();
    }, []);

    return (
        <View className="flex-1 items-center">

            {/* Mapa */}
            <GeofenceMap
                ref={mapRef}
                region={region}
                radiusMeters={radiusMeters}
                places={selectedCategory ? places : customPoint ? [{ name: "Local", location: customPoint }] : []}
                onLongPress={(coords) => {
                    setCustomPoint(coords);
                    setSelectedCategory(null); // desativa categoria ao selecionar ponto manual
                }}
            />

            {/* Botão de ajuda (tutorial) */}
            <TouchableOpacity
                onPress={() => setShowTutorial(true)}
                className="absolute top-[10rem] left-5 w-14 h-14 rounded-full items-center justify-center shadow-lg bg-white dark:bg-acento-primario"
            >
                <Ionicons name="help-outline" size={26} color={isDark ? "white" : "black"} />
            </TouchableOpacity>



            {/* Autocomplete */}
            <View className="w-[95%] absolute top-8">
                <PlaceAutocomplete
                    apiKey="AIzaSyDyzvSaODwJe39S20kjuA9y-y2lufQ3P6c"
                    userLocation={userLocation}
                    onPlaceSelected={(description, location) => {
                        if (location) {
                            setCustomPoint(location);
                            setSelectedCategory(null);
                            mapRef.current?.animateToRegion({
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }, 1000);
                        }
                    }}
                />
            </View>

            {/* Carousel de categorias */}
            <CategoryCarousel
                categoryType={selectedCategory}
                onCategorySelect={setSelectedCategory}
                userLocation={userLocation}
                setPlaces={setPlaces}
            />

            {/* Botão "ir para minha localização" */}
            <TouchableOpacity
                onPress={() => {
                    if (userLocation && mapRef.current) {
                        mapRef.current.animateToRegion({
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }, 1000);
                    }
                }}
                className="absolute top-[10rem] right-5 w-14 h-14 rounded-full items-center justify-center shadow-lg bg-white dark:bg-acento-primario"
            >
                <Ionicons name="locate-outline" size={26} color={isDark ? "white" : "black"} />
            </TouchableOpacity>

            {/* Botões de aumentar/diminuir raio */}
            <View className="absolute flex-row bottom-40 right-12 p-2 gap-3">
                <TouchableOpacity
                    onPress={() => setRadiusMeters(radiusMeters + 50)}
                    className="w-14 h-14 left-10 rounded-full items-center justify-center shadow-lg bg-white dark:bg-acento-primario"
                >
                    <Ionicons name="add-outline" size={24} color={isDark ? "white" : "black"} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setRadiusMeters(Math.max(radiusMeters - 100, 100))}
                    className="w-14 h-14 left-10 rounded-full items-center justify-center shadow-lg bg-white dark:bg-acento-primario"
                >
                    <Ionicons name="remove-outline" size={24} color={isDark ? "white" : "black"} />
                </TouchableOpacity>
            </View>

            <ButtonEs
                title='Adicionar Localização' className='absolute bottom-16 w-[90%] items-center rounded py-4 bg-acento-primario' onPress={() => {
                    if (customPoint) { // Verifique se há um ponto personalizado/selecionado
                        Alert.alert(
                            "Localização Adicionada",
                            `Localização adicionada em:\nLat: ${customPoint.latitude.toFixed(5)}, Lon: ${customPoint.longitude.toFixed(5)}`
                        );
                    } else {
                        Alert.alert("Erro", "Nenhuma localização selecionada.");
                    }
                }}>
            </ButtonEs>
        </View>
    );
}
