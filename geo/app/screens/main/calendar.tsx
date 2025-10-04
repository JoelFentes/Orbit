
import BottomNavigation from "@/components/BottomNavigation";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Platform } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import ButtonEs from "@/components/ButtonEs";
import CustomAlert from "@/components/CustomAlert";


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

export default function CalendarScreen() {
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


  const salvarLembrete = () => {
    // Lógica para salvar o lembrete
    console.log("Lembrete salvo:", { title, description, selectedDate, startTime, endTime });
  }



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
    <SafeAreaView className="flex-1 bg-slate-100">

    </SafeAreaView>
  );
}
