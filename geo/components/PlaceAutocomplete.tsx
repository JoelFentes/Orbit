// PlaceAutocomplete.tsx
import React, { useState } from "react";
import { View, TextInput, ScrollView, TouchableOpacity, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

type LatLng = { latitude: number; longitude: number };

interface PlaceAutocompleteProps {
    apiKey: string;
    userLocation: LatLng | null;
    placeholder?: string;
    onPlaceSelected: (description: string, location?: LatLng) => void;
}

export default function PlaceAutocomplete({
    apiKey,
    userLocation,
    placeholder = "Buscar local ou estabelecimento",
    onPlaceSelected
}: PlaceAutocompleteProps) {
    const [searchText, setSearchText] = useState("");
    const [predictions, setPredictions] = useState<any[]>([]);

    const fetchPredictions = async (text: string) => {
        if (!userLocation) return;

        try {
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
                text
            )}&key=${apiKey}&location=${userLocation.latitude},${userLocation.longitude}&radius=50000&types=geocode|establishment&language=pt-BR`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.status === "OK") {
                setPredictions(data.predictions);
            } else {
                setPredictions([]);
                console.warn("Autocomplete API:", data.status, data.error_message);
            }
        } catch (error) {
            console.error("Places Autocomplete Error:", error);
            setPredictions([]);
        }
    };

    const fetchPlaceDetails = async (placeId: string) => {
        try {
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&fields=geometry,name`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === "OK") {
                const loc = data.result.geometry.location;
                return { latitude: loc.lat, longitude: loc.lng };
            }
        } catch (error) {
            console.error("Place Details Error:", error);
        }
        return null;
    };

    const handleSelect = async (place: any) => {
        const location = await fetchPlaceDetails(place.place_id);
        setSearchText(place.description);
        setPredictions([]);
        onPlaceSelected(place.description, location ?? undefined);
    };

    return (
        <View className="w-full relative">
            {/* Ícone de busca */}
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

            <TextInput
                placeholder={placeholder}
                value={searchText}
                onChangeText={(text) => {
                    setSearchText(text);
                    if (text.length > 2) fetchPredictions(text);
                    else setPredictions([]);
                }}
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-white"
            />

            {/* Lista de sugestões */}
            {predictions.length > 0 && (
                <ScrollView className="absolute top-14 w-full bg-white rounded-lg shadow-lg max-h-60 z-50">
                    {predictions.map(p => (
                        <TouchableOpacity
                            key={p.place_id}
                            className="p-2 border-b border-gray-200"
                            onPress={() => handleSelect(p)}
                        >
                            <Text>{p.description}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}
