import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

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
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedDate ? `Dia selecionado: ${selectedDate}` : 'Selecione um dia'}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});
