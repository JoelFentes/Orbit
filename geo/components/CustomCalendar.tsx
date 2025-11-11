// src/components/CustomCalendar.tsx

import React from "react";
import { Calendar } from "react-native-calendars";
import { DayPressCallback } from "react-native-calendars/src/types";

// Definimos as props que o componente vai receber
interface CustomCalendarProps {
    selectedDate: string;
    onDayPress: DayPressCallback;
    isDark: boolean;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
    selectedDate,
    onDayPress,
    isDark,
}) => {
    // Objeto de tema baseado no isDark
    const themeConfig = {
        backgroundColor: isDark ? "#202020" : "#f8f8f8",
        calendarBackground: isDark ? "#202020" : "#ffffff",
        textSectionTitleColor: isDark ? "#9ca3af" : "#374151",
        todayTextColor: isDark ? "#60a5fa" : "#3943b7ff",
        dayTextColor: isDark ? "#f3f4f6" : "#111827",
        monthTextColor: isDark ? "#f3f4f6" : "#111827",
        arrowColor: isDark ? "#e5e7eb" : "#202020",
        textDayFontWeight: "light",
        textMonthFontWeight: "light",
        textDayFontSize: 16,
        textMonthFontSize: 18,
    };

    // Objeto de datas marcadas
    const markedDatesConfig = {
        [selectedDate]: {
            selected: true,
            selectedColor: isDark ? "#78c0e0ff" : "#78c0e0ff",
            selectedTextColor: "white",
        },
    };

    return (
        <Calendar
            onDayPress={onDayPress}
            markedDates={markedDatesConfig}
            theme={themeConfig}
            // Adiciona a data atual como inicial para melhor UX
            current={selectedDate || new Date().toISOString().split("T")[0]}
        />
    );
};

export default CustomCalendar;