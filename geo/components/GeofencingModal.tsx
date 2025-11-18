import ButtonEs from "@/components/ButtonEs";
import CategoryCarousel from "@/components/CategoryCarousel";
import GeofenceMap, { Place } from "@/components/GeofencingMap";
import PlaceAutocomplete from "@/components/PlaceAutocomplete";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useColorScheme } from "nativewind";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Modal, TouchableOpacity, View, Linking } from "react-native";
import MapView from "react-native-maps";

type LatLng = { latitude: number; longitude: number } | null;

interface GeofencingModalProps {
    visible: boolean;
    onClose: () => void;
    // Permite enviar um array de localizações
    onLocationSelect: (locations: { latitude: number; longitude: number; radius: number }[]) => void;
}

const GeofencingModal = ({
    visible,
    onClose,
    onLocationSelect,
}: GeofencingModalProps) => {
    const mapRef = useRef<MapView>(null);
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
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    // Pega localização do usuário e permissão
    useEffect(() => {
        if (!visible) return;

        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                Alert.alert(
                    "Permissão Necessária",
                    "Para usar o mapa, precisamos da sua localização. Por favor, libere a permissão nas configurações do seu dispositivo.",
                    [
                        {
                            text: "Cancelar",
                            style: "cancel"
                        },
                        {
                            text: "Abrir Configurações",
                            onPress: () => {
                                Linking.openSettings();
                            },
                        },
                    ],
                    { cancelable: false }
                );
                return;
            }

            let loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });
            const { latitude, longitude } = loc.coords;
            setUserLocation({ latitude, longitude });

            if (!customPoint) {
                setRegion((r) => ({ ...r, latitude, longitude }));
                setCustomPoint({ latitude, longitude });
            }
        })();
    }, [visible]);

    // Função para confirmar e fechar o modal
    const handleAddLocation = () => {
        let pointsToSend: { latitude: number; longitude: number; radius: number }[] = [];

        if (selectedCategory && places.length > 0) {
            // Se uma categoria foi selecionada, envia TODOS os lugares pesquisados (ex: 10 farmácias)
            pointsToSend = places.map(p => ({
                latitude: p.location.latitude,
                longitude: p.location.longitude,
                radius: radiusMeters,
            }));
        } else if (customPoint) {
            // Se foi um ponto customizado (clique longo ou autocomplete), envia APENAS esse ponto
            pointsToSend = [{ ...customPoint, radius: radiusMeters }];
        } else {
            Alert.alert("Erro", "Selecione uma categoria ou marque um ponto no mapa.");
            return;
        }

        if (pointsToSend.length > 0) {
            onLocationSelect(pointsToSend);
            onClose();
        } else {
            Alert.alert("Erro", "Nenhuma localização válida para adicionar.");
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            {/* View para o fundo escuro (Overlay) */}
            <View
                className="flex-1 justify-center items-center"
                style={{ backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)" }}
            >
                <View
                    className="flex-1 w-[95%] h-[95%] my-16 rounded-xl overflow-hidden bg-white dark:bg-zinc-900"
                >

                    {/* Mapa */}
                    <GeofenceMap
                        ref={mapRef}
                        region={region}
                        radiusMeters={radiusMeters}
                        places={
                            selectedCategory
                                ? places // Exibe todos os 10 places
                                : customPoint
                                    ? [{ name: "Local", location: customPoint }]
                                    : []
                        }
                        onLongPress={(coords) => {
                            setCustomPoint(coords);
                            setSelectedCategory(null);
                            setPlaces([]); // Limpa os pinos de categoria ao selecionar manualmente
                        }}
                    />

                    {/* Autocomplete - Replicando o posicionamento da tela principal */}
                    <View className="w-[95%] absolute top-8 items-center self-center">
                        <PlaceAutocomplete
                            apiKey="AIzaSyDyzvSaODwJe39S20kjuA9y-y2lufQ3P6c"
                            userLocation={userLocation}
                            onPlaceSelected={(description, location) => {
                                if (location) {
                                    setCustomPoint(location);
                                    setSelectedCategory(null);
                                    setPlaces([]); // Limpa os pinos de categoria ao selecionar via autocomplete
                                    mapRef.current?.animateToRegion(
                                        {
                                            latitude: location.latitude,
                                            longitude: location.longitude,
                                            latitudeDelta: 0.01,
                                            longitudeDelta: 0.01,
                                        },
                                        1000
                                    );
                                }
                            }}
                        />
                    </View>

                    {/* Botão "ir para minha localização" - Replicando o posicionamento da tela principal (canto superior direito) */}
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
                                setCustomPoint(userLocation);
                                setSelectedCategory(null);
                                setPlaces([]);
                            }
                        }}
                        className="absolute top-[14rem] right-5 w-14 h-14 rounded-full items-center justify-center shadow-lg bg-white dark:bg-acento-primario z-10"
                    >
                        <Ionicons name="locate-outline" size={26} color={"white"} />
                    </TouchableOpacity>

                    {/* Botão de Fechar - Novo Botão para fechar o Modal (Posicionado no canto superior esquerdo, fora do caminho dos outros) */}
                    <TouchableOpacity
                        onPress={onClose}
                        className="absolute top-[18rem] right-5 w-14 h-14 rounded-full items-center justify-center shadow-lg bg-red-500 z-10"
                    >
                        <Ionicons name="arrow-back" size={26} color={"white"} />
                    </TouchableOpacity>

                    {/* Botões de raio - Replicando o posicionamento e layout da tela principal */}
                    <View className="absolute flex-row bottom-40 right-5 p-2 gap-3 z-10">

                        {/* Botão Aumentar Raio (Mova a View um pouco para a direita para compensar o 'left-10' da tela original) */}
                        <TouchableOpacity
                            onPress={() => setRadiusMeters(radiusMeters + 50)}
                            className="w-14 h-14 rounded-full items-center justify-center shadow-lg bg-white dark:bg-acento-primario"
                            style={{ marginRight: 10 }}
                        >
                            <Ionicons name="add-outline" size={24} color={"white"} />
                        </TouchableOpacity>

                        {/* Botão Diminuir Raio */}
                        <TouchableOpacity
                            onPress={() => setRadiusMeters(Math.max(radiusMeters - 100, 100))}
                            className="w-14 h-14 rounded-full items-center justify-center shadow-lg bg-white dark:bg-acento-primario"
                        >
                            <Ionicons name="remove-outline" size={26} color={"white"} />
                        </TouchableOpacity>
                    </View>

                    <View className="absolute top-2 w-full z-10">
                        <CategoryCarousel
                            categoryType={selectedCategory}
                            onCategorySelect={setSelectedCategory}
                            userLocation={userLocation}
                            setPlaces={setPlaces}
                        />
                    </View>


                    {/* Botão de Salvar/Adicionar Localização - Replicando o posicionamento da tela principal */}
                    <ButtonEs
                        title={`Adicionar Localização (${radiusMeters}m)`}
                        className="absolute bottom-10 w-[95%] items-center self-center rounded py-4 bg-acento-primario z-10"
                        textClassName="text-white text-lg font-quicksand-bold"
                        onPress={handleAddLocation}
                    />
                </View>

            </View>
        </Modal>
    );
};

export default GeofencingModal;