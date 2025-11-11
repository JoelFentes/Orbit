import BottomNavigation from "@/components/BottomNavigation";
import ButtonEs from "@/components/ButtonEs";
import CustomAlert from "@/components/CustomAlert";
import { useAuth } from "@/contexts/AuthContext";
import CustomCalendar from "@/components/CustomCalendar";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
// A importação do 'Calendar' é usada pelo 'LocaleConfig'
import { Calendar, LocaleConfig } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import TimePickerDropdown from "@/components/CustomTimePickerDropdown";
import CustomTimePickerDropdown from "@/components/CustomTimePickerDropdown";

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

    // Campo de título
    const [title, setTitle] = useState("");
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

    const salvarLembrete = async () => {
        if (!user) {
            console.error("❌ Nenhum usuário autenticado");
            return;
        }

        try {
            const response = await fetch(
                "https://geofencing-api.onrender.com/api/reminders",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title,
                        // description, // Você referencia 'description' aqui, mas não há estado para ele.
                        date: selectedDate,
                        startTime,
                        endTime,
                        userId: user.id,
                    }),
                }
            );

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

            <View className="flex-row justify-around items-center mb-[30rem]">
                <CustomTimePickerDropdown
                    value={startTime}
                    onChange={setStartTime}
                    isDark={isDark}
                />

                <Ionicons
                    name="arrow-forward-outline"
                    size={20}
                    color={isDark ? "#9ca3af" : "#374151"} // Uma cor sutil
                />

                <CustomTimePickerDropdown
                    value={endTime}
                    onChange={setEndTime}
                    isDark={isDark}
                />
            </View>

            {/* Botão Salvar e Alerta */}
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

            {/* Modal do Calendário */}
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

            {/* Navegação Inferior */}
            <BottomNavigation
                currentRoute={currentRoute}
                onNavigate={handleNavigation}
            />
        </SafeAreaView>
    );
}