import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaProvider } from 'react-native-safe-area-context';

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],
  dayNames: [
    'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
};
LocaleConfig.defaultLocale = 'pt-br';

export default function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <SafeAreaProvider>
        <View className='flex-1 bg-white'>
        <Text className="font-quicksand-semibold text-3xl text-azul-escuro mt-20 ml-6 mb-4">
            Calendário
        </Text>

        <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            minDate={'2025-01-01'}
            maxDate={'2025-12-31'}
            markingType={'multi-dot'}
            markedDates={{
            '2025-09-05': { selected: true, marked: true, selectedColor: '#78c0e0ff' },
            '2025-09-07': { marked: true, dotColor: 'red' },
            }}
        />
        </View>
    </SafeAreaProvider>

  );
}
