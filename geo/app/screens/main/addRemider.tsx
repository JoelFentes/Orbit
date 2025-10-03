import BottomNavigation from "@/components/BottomNavigation";
import ButtonEs from "@/components/ButtonEs";
import CustomAlert from "@/components/CustomAlert";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function AddReminder() {
    const { user } = useAuth();
    const theme = useColorScheme(); // light | dark
    const isDark = theme === "dark";

    const [selectedDate, setSelectedDate] = useState<string>("");
    const [currentRoute, setCurrentRoute] = useState("calendar");
    const [alertVisible, setAlertVisible] = useState(false);

    // Estados para horário de início e fim
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    // Campos de título e descrição
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const salvarLembrete = async () => {
        if (!user) {
            console.error("❌ Nenhum usuário autenticado");
            return;
        }

        try {
            const response = await fetch("https://geofencing-api.onrender.com/api/reminders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    date: selectedDate,
                    startTime,
                    endTime,
                    userId: user.id
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erro ao salvar lembrete:", errorData);
                return;
            }

            const data = await response.json();
            console.log("✅ Lembrete salvo com sucesso:", data);
        } catch (error) {
            console.error("Erro na requisição:", error);
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

    return (
        <SafeAreaView className={`flex-1 ${isDark ? "bg-fundo-escuro-principal" : "bg-slate-100"}`}>
            <View className={`flex-1 p-7 ${isDark ? "bg-fundo-escuro-principal" : "bg-slate-100"}`}>
                <View className="flex-row justify-between items-center mt-6">
                    <Text className={`text-2xl font-quicksand-bold ${isDark ? "text-white" : "text-black"}`}>
                        Adicione um lembrete
                    </Text>
                </View>

                {/* Campo título */}
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Título do lembrete"
                    className={`w-full h-12 px-4 mt-6 rounded-xl font-quicksand-semibold text-base 
        ${isDark ? "bg-fundo-escuro-principal border border-gray-600 text-white" : "bg-white border border-gray-300 text-gray-700"}`}
                    placeholderTextColor={isDark ? "#9ca3af" : "#9ca3af"}
                />

                {/* Campo descrição */}
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Descrição do lembrete"
                    className={`w-full h-16 px-4 mt-4 rounded-xl font-quicksand text-base 
        ${isDark ? "bg-fundo-escuro-principal border border-gray-600 text-white" : "bg-white border border-gray-300 text-gray-700"}`}
                    placeholderTextColor={isDark ? "#9ca3af" : "#9ca3af"}
                    multiline
                />

                <Text className={`text-base font-quicksand-semibold mt-6 mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Selecione o Dia & Hora
                </Text>
                <Calendar
                    onDayPress={(dia) => setSelectedDate(dia.dateString)}
                    markedDates={{
                        [selectedDate]: {
                            selected: true,
                            selectedColor: isDark ? "#78c0e0ff" : "#78c0e0ff",
                            selectedTextColor: "white",
                        },
                    }}
                    theme={{
                        backgroundColor: isDark ? "#202020" : "#f8f8f8", // fundo geral
                        calendarBackground: isDark ? "#202020" : "#ffffff", // fundo do calendário
                        textSectionTitleColor: isDark ? "#9ca3af" : "#374151",
                        todayTextColor: isDark ? "#60a5fa" : "#3943b7ff",
                        dayTextColor: isDark ? "#f3f4f6" : "#111827",
                        monthTextColor: isDark ? "#f3f4f6" : "#111827",
                        arrowColor: isDark ? "#e5e7eb" : "#202020",
                        textDayFontWeight: "light",
                        textMonthFontWeight: "light",
                        textDayFontSize: 16,
                        textMonthFontSize: 18,
                    }}
                />

            </View>

            <View className="flex-row justify-around items-center mb-10">
                {/* Hora de Início */}
                <TouchableOpacity
                    className={`w-[40%] h-14 ml-3 justify-center items-center rounded-xl border flex-row
    ${isDark ? "bg-fundo-escuro-principal border-gray-600" : "bg-white border-gray-300"}`}
                    onPress={() => setShowStartPicker(true)}
                >
                    <Ionicons name="time-outline" size={20} color={isDark ? "white" : "black"} />
                    <Text className={`text-lg ml-2 font-quicksand-semibold ${isDark ? "text-white" : "text-gray-700"}`}>
                        {formatTime(startTime)}
                    </Text>
                </TouchableOpacity>

                {/* Hora de Fim */}
                <TouchableOpacity
                    className={`w-[40%] h-14 mr-3 justify-center items-center rounded-xl border flex-row
    ${isDark ? "bg-fundo-escuro-principal border-gray-600" : "bg-white border-gray-300"}`}
                    onPress={() => setShowEndPicker(true)}
                >
                    <Ionicons name="time-outline" size={20} color={isDark ? "white" : "black"} />
                    <Text className={`text-lg ml-2 font-quicksand-semibold ${isDark ? "text-white" : "text-gray-700"}`}>
                        {formatTime(endTime)}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Picker de Início */}
            {showStartPicker && (
                <DateTimePicker
                    value={startTime}
                    mode="time"
                    is24Hour={true}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, date) => {
                        setShowStartPicker(false);
                        if (date) setStartTime(date);
                    }}
                />
            )}

            {/* Picker de Fim */}
            {showEndPicker && (
                <DateTimePicker
                    value={endTime}
                    mode="time"
                    is24Hour={true}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, date) => {
                        setShowEndPicker(false);
                        if (date) setEndTime(date);
                    }}
                />
            )}

            <View className="flex-row justify-around mb-14">
                <ButtonEs
                    title="Salvar lembrete"
                    onPress={() => setAlertVisible(true)}
                    className="w-[90%] bg-azul-celeste py-3 rounded-xl"
                    textClassName="text-white text-lg text-center font-quicksand-bold"
                />

                <CustomAlert
                    visible={alertVisible}
                    onClose={() => setAlertVisible(false)}
                    onSave={() => {
                        salvarLembrete();
                        setAlertVisible(false);
                    }}
                    onLocation={() => {
                        router.push("/screens/main/geofencing");
                        setAlertVisible(false);
                    }}
                />
            </View>
            <BottomNavigation
                currentRoute={currentRoute}
                onNavigate={handleNavigation}
            />
        </SafeAreaView>
    );
}
