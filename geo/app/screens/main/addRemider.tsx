import BottomNavigation from "@/components/BottomNavigation";
import ButtonEs from "@/components/ButtonEs";
import CustomAlert from "@/components/CustomAlert";
import CustomCalendar from "@/components/CustomCalendar";
import GeofencingModal from "@/components/GeofencingModal";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme
} from "react-native";
import CustomTimePickerDropdown from "@/components/CustomTimePickerDropdown";
import { LocaleConfig } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { GEOFENCING_TASK_NAME } from "@/tasks/GeofencingTask";

// Configurações de localização para português
LocaleConfig.locales["pt-br"] = {
    monthNames: [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ],
    monthNamesShort: [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ],
    dayNames: [
        "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
        "Quinta-feira", "Sexta-feira", "Sábado"
    ],
    dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    today: "Hoje"
};
LocaleConfig.defaultLocale = "pt-br";

type GeofencePoint = {
    latitude: number;
    longitude: number;
    radiusMeters: number;
    name?: string; // Adicionado para visualização
};

const startGeofencing = async (locations: GeofencePoint[]) => {
    if (locations.length === 0) return;

    // 1. Solicita Permissões (Foreground e Background)
    let { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    let { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

    if (foregroundStatus !== 'granted' || backgroundStatus !== 'granted') {
        // Alerta simples para o usuário, mas a permissão real deve ser concedida nas configurações do APK
        alert('As permissões de localização em segundo plano são essenciais para esta funcionalidade.');
        return;
    }

    // 2. Mapeia para o formato de Região do Expo Location
    const regions: Location.LocationRegion[] = locations.map((loc, index) => ({
        // Use o nome do local como identificador. Se não tiver nome, use algo único.
        identifier: loc.name || `Lembrete Local ${loc.latitude.toFixed(4)}`,
        latitude: loc.latitude,
        longitude: loc.longitude,
        radius: loc.radiusMeters,
        notifyOnEnter: true,
        notifyOnExit: false,
    }));

    // 3. Garante que a task está definida e para monitoramentos anteriores (opcional)
    if (!TaskManager.isTaskDefined(GEOFENCING_TASK_NAME)) {
        console.error("Tarefa de Geofencing não definida!");
        return;
    }

    // Você pode querer parar o monitoramento anterior se estiver fazendo vários testes
    // await Location.stopGeofencingAsync(GEOFENCING_TASK_NAME);

    // 4. Inicia o monitoramento
    await Location.startGeofencingAsync(GEOFENCING_TASK_NAME, regions);

    console.log(`✅ ${regions.length} geofences registrados para monitoramento.`);
};

export default function AddReminder() {
    const { user } = useAuth();
    const theme = useColorScheme();
    const isDark = theme === "dark";

    const [selectedDate, setSelectedDate] = useState<string>("");
    const [currentRoute, setCurrentRoute] = useState("calendar");

    // Estado para armazenar MÚLTIPLAS localizações (Array)
    const [locations, setLocations] = useState<GeofencePoint[]>([]);

    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);


    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    const [title, setTitle] = useState("");


    const salvarLembrete = async () => {
        if (!user) {
            console.error("❌ Nenhum usuário autenticado");
            return;
        }

        // 1. Mapeia as localizações do state para o formato do Prisma (apenas dados necessários para o DB)
        const geofencesToCreate = locations.map(loc => ({
            latitude: loc.latitude,
            longitude: loc.longitude,
            radius: loc.radiusMeters,
        }));

        // 2. Constrói o corpo da requisição
        const requestBody = {
            title,
            date: selectedDate,
            startTime,
            endTime,
            userId: user.id,

            // Adiciona o bloco 'create' apenas se houver localizações
            geofencing: geofencesToCreate.length > 0
                ? {
                    create: geofencesToCreate
                }
                : undefined,

        };


        try {
            const response = await fetch(
                "https://geofencing-api.onrender.com/api/reminders",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Erro ao salvar lembrete:", errorData);
                return;
            }

            const data = await response.json();
            await startGeofencing(locations);
            console.log("✅ Lembrete salvo com sucesso:", data);


        } catch (error) {
            console.error("❌ Erro na requisição:", error);
        }
    };

    const handleNavigation = (route: string) => {
        setCurrentRoute(route);
        switch (route) {
            case "home":
                router.push("/screens/main/home");
                break;
            case "map":
                router.push("/screens/main/map");
                break;
            case "notes":
                router.push("/screens/main/notes");
                break;
            case "profile":
                router.push("/screens/main/notes");
                break;
            default:
                break;
        }
    };

    // Função helper para formatar hora
    const formatTime = (date: Date) =>
        `${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

    const locationText = (() => {
        if (locations.length === 0) {
            return "Adicionar localização (Geofencing)";
        }
        if (locations.length === 1) {
            const loc = locations[0];
            // Mostra o nome se existir, senão mostra coordenadas
            return loc.name || `Local: ${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}`;
        }
        // Mais de um local selecionado
        return `${locations.length} localizaç${locations.length > 1 ? 'ões' : 'ão'} selecionada(s)`;
    })();


    return (
        <SafeAreaView
            className={`flex-1 ${isDark ? "bg-fundo-escuro-principal" : "bg-slate-100"}`}
        >
            <View
                className={`flex-1 p-7 ${isDark ? "bg-fundo-escuro-principal" : "bg-slate-100"}`}
            >
                <View className="flex-row justify-between items-center mt-6">
                    <Text
                        className={`text-2xl font-quicksand-bold ${isDark ? "text-white" : "text-black"
                            }`}
                    >
                        Adicione um lembrete
                    </Text>
                </View>

                {/* Campo título */}
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Título"
                    className={`w-full h-12 px-4 mt-6 rounded-xl font-quicksand-semibold text-lg 
    ${isDark ? "bg-fundo-escuro-principal border border-gray-600 text-white" : "bg-white border border-gray-300 text-gray-700"}`}
                    placeholderTextColor={isDark ? "#9ca3af" : "#9ca3af"}
                />


                {/* Botão para abrir o Modal de Localização (Geofencing) */}
                <TouchableOpacity
                    className={`w-full h-12 px-4 mt-6 rounded-xl flex-row items-center justify-between ${isDark
                        ? "bg-fundo-escuro-principal border border-gray-600"
                        : "bg-white border border-gray-300"
                        }`}
                    onPress={() => setIsLocationModalVisible(true)}
                >
                    <Text
                        className={`font-quicksand-semibold text-lg ${locations.length > 0
                            ? isDark ? "text-white" : "text-gray-700"
                            : "text-gray-400"
                            }`}
                    >
                        {locationText}
                    </Text>

                    <Ionicons
                        name="location-outline"
                        size={20}
                        color={isDark ? "white" : "black"}
                    />
                </TouchableOpacity>



                {/* Botão para abrir o Modal do Calendário */}
                <TouchableOpacity
                    className={`w-full h-12 px-4 mt-6 rounded-xl flex-row items-center justify-between ${isDark
                        ? "bg-fundo-escuro-principal border border-gray-600"
                        : "bg-white border border-gray-300"
                        }`}
                    onPress={() => setIsCalendarVisible(true)}
                >
                    <Text
                        className={`font-quicksand-semibold text-lg ${selectedDate
                            ? isDark
                                ? "text-white"
                                : "text-gray-700"
                            : "text-gray-400"
                            }`}
                    >
                        {selectedDate ? selectedDate : "Selecione uma data"}
                    </Text>
                    <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={isDark ? "white" : "black"}
                    />
                </TouchableOpacity>
            </View>

            <View className="flex-row justify-around items-center mb-[11rem]">
                <CustomTimePickerDropdown
                    value={startTime}
                    onChange={setStartTime}
                    isDark={isDark}
                />

                <Ionicons
                    name="arrow-forward-outline"
                    size={20}
                    color={isDark ? "#9ca3af" : "#374151"}
                />

                <CustomTimePickerDropdown
                    value={endTime}
                    onChange={setEndTime}
                    isDark={isDark}
                />
            </View>

            {/* Botão Salvar e Alerta */}
            <View className="flex-row justify-around mb-[18rem]">
                <ButtonEs
                    title="Salvar lembrete"
                    onPress={salvarLembrete}
                    className="w-[90%] bg-azul-celeste py-3 rounded-xl"
                    textClassName="text-white text-lg text-center font-quicksand-bold"
                />
            </View>

            {/* Modal do Calendário (mantido) */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isCalendarVisible}
                onRequestClose={() => {
                    setIsCalendarVisible(!isCalendarVisible);
                }}
            >
                <View
                    className="flex-1 justify-center items-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <View
                        className={`w-11/12 p-4 rounded-lg ${isDark ? "bg-fundo-escuro-principal" : "bg-white"
                            }`}
                    >
                        <CustomCalendar
                            selectedDate={selectedDate}
                            isDark={isDark}
                            onDayPress={(day) => {
                                setSelectedDate(day.dateString);
                                setIsCalendarVisible(false);
                            }}
                        />

                        <ButtonEs
                            title="Fechar"
                            onPress={() => setIsCalendarVisible(false)}
                            className="w-full bg-gray-500 py-3 rounded-xl mt-4"
                            textClassName="text-white text-lg text-center font-quicksand-bold"
                        />
                    </View>
                </View>
            </Modal>

            <GeofencingModal
                visible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
                onLocationSelect={(dataArray) => {
                    setLocations(dataArray.map(data => ({
                        latitude: data.latitude,
                        longitude: data.longitude,
                        radiusMeters: data.radius,

                    })));
                    setIsLocationModalVisible(false);
                }}
            />

            {/* Navegação Inferior */}
            <BottomNavigation
                currentRoute={currentRoute}
                onNavigate={handleNavigation}
            />
        </SafeAreaView>
    );
}