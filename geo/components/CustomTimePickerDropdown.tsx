// Importa as funções básicas do React (useState, useRef, useEffect)
import React, { useState, useRef, useEffect } from "react";
// Importa os componentes visuais do React Native
import {
    View,
    Text,
    TouchableOpacity,
    Animated, // Usado para a animação de "crescer"
    FlatList, // Usado para as listas roláveis
    NativeSyntheticEvent,
    NativeScrollEvent,
    Pressable, // Usado para o "clique fora"
} from "react-native";
// Importa o ícone de relógio
import { Ionicons } from "@expo/vector-icons";

// Define quais "props" (propriedades) o componente pode receber do "mundo exterior"
interface CustomTimePickerDropdownProps {
    value: Date; // A data/hora atual (controlada pelo componente pai)
    onChange: (date: Date) => void; // A função para "salvar" a nova data
    isDark?: boolean; // Para o modo escuro
}

// --- Constantes de Layout ---
// Define a altura de CADA NÚMERO (ex: "08") na lista
const ITEM_HEIGHT = 40;
// Define a altura total da ÁREA DE ROLAGEM (mostra 3 itens: 40 * 3)
const LIST_HEIGHT = 120;
// Calcula o preenchimento (padding) para o item do meio ficar centralizado
const PADDING_VERTICAL = (LIST_HEIGHT - ITEM_HEIGHT) / 2; // (120 - 40) / 2 = 40

// --- Início do Componente ---
const CustomTimePickerDropdown: React.FC<CustomTimePickerDropdownProps> = ({
    value,
    onChange,
    isDark = false,
}) => {
    // --- Estados ---
    // Estado que controla se o dropdown está aberto (true) ou fechado (false)
    const [open, setOpen] = useState(false);
    // Estado que guarda a HORA selecionada (começa com o valor que veio de 'value')
    const [selectedHour, setSelectedHour] = useState(value.getHours());
    // Estado que guarda o MINUTO selecionado (começa com o valor que veio de 'value')
    const [selectedMinute, setSelectedMinute] = useState(value.getMinutes());

    // --- Referências ---
    // Referência para o valor da animação (de 0 a 1)
    const slideAnim = useRef(new Animated.Value(0)).current;
    // Referência para a lista de HORAS (para podermos "rolar" ela via código)
    const hourListRef = useRef<FlatList>(null);
    // Referência para a lista de MINUTOS
    const minuteListRef = useRef<FlatList>(null);

    // --- Dados ---
    // Cria um array [0, 1, 2, ... 23] para as horas
    const hours = Array.from({ length: 24 }, (_, i) => i);
    // Cria um array [0, 1, 2, ... 59] para os minutos
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    // --- Animação ---
    // Efeito que roda TODA VEZ que o estado 'open' muda
    useEffect(() => {
        // Dispara a animação
        Animated.timing(slideAnim, {
            toValue: open ? 1 : 0, // Vai para 1 se 'open' for true, ou 0 se 'false'
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [open]);

    // Mapeia o valor da animação (0-1) para a altura (0-150px)
    const dropdownHeight = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 150], // A altura final do seu dropdown
    });

    // --- Funções Helper ---
    // Função que transforma (8, 5) em "08:05"
    const formatTime = (h: number, m: number) =>
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

    // --- Efeitos (useEffect) ---

    // Efeito que roda QUANDO FECHA o dropdown para "salvar" a hora
    useEffect(() => {
        // Sincroniza o 'onChange' principal apenas quando o dropdown fecha
        if (!open) {
            const updated = new Date(value);
            updated.setHours(selectedHour);
            updated.setMinutes(selectedMinute);
            // Chama a função 'onChange' para avisar o componente pai da mudança
            onChange(updated);
        }
    }, [open, selectedHour, selectedMinute]); // Roda se 'open', 'selectedHour' ou 'selectedMinute' mudarem

    // Efeito que roda QUANDO ABRE o dropdown
    useEffect(() => {
        if (open) {
            // Garante que o dropdown abra com os valores corretos (os de 'value')
            setSelectedHour(value.getHours());
            setSelectedMinute(value.getMinutes());

            // Rola as listas para a posição correta
            setTimeout(() => {
                // Rola a lista de horas para o índice (hora) correto
                hourListRef.current?.scrollToIndex({
                    index: value.getHours(),
                    animated: false,
                    viewPosition: 0.5, // Centraliza o item
                });
                // Rola a lista de minutos para o índice (minuto) correto
                minuteListRef.current?.scrollToIndex({
                    index: value.getMinutes(),
                    animated: false,
                    viewPosition: 0.5,
                });
            }, 50); // Um pequeno delay para dar tempo da lista renderizar
        }
    }, [open, value]); // Roda se 'open' ou 'value' mudarem

    // --- Handlers (Funções de Evento) ---

    // Função que é chamada QUANDO o usuário PARA de rolar a lista
    const onScrollEnd = (
        e: NativeSyntheticEvent<NativeScrollEvent>,
        type: "hour" | "minute"
    ) => {
        // Pega a posição Y da rolagem
        const offsetY = e.nativeEvent.contentOffset.y;
        // Calcula qual item ("08", "09", etc.) está no meio
        let index = Math.round(offsetY / ITEM_HEIGHT);

        // Atualiza o estado (selectedHour ou selectedMinute)
        if (type === "hour") {
            if (index < 0) index = 0;
            if (index >= hours.length) index = hours.length - 1;
            setSelectedHour(hours[index]); // Salva a HORA selecionada
        } else {
            if (index < 0) index = 0;
            if (index >= minutes.length) index = minutes.length - 1;
            setSelectedMinute(minutes[index]); // Salva o MINUTO selecionado
        }
    };

    // Otimização para a FlatList (ajuda o scrollToIndex a ser rápido)
    const getItemLayout = (data: any[] | null | undefined, index: number) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
    });

    // --- Renderização (O que aparece na tela) ---
    return (
        <View className="w-[40%] px-4 relative">
            <TouchableOpacity
                className={`h-14 justify-center items-center rounded-xl border flex-row ${isDark
                    ? "bg-fundo-escuro-principal border-transparent"
                    : "bg-white border-gray-300"
                    }`}
                onPress={() => setOpen(!open)}
            >
                <Text
                    className={`text-xl ml-2 font-quicksand-semibold ${isDark ? "text-white" : "text-gray-700"
                        }`}
                >
                    {formatTime(
                        open ? selectedHour : value.getHours(),
                        open ? selectedMinute : value.getMinutes()
                    )}
                </Text>
            </TouchableOpacity>

            {/* --- O DROPDOWN Animado --- */}
            <Animated.View
                style={{
                    overflow: "hidden", // Esconde o conteúdo que "vazar"
                    height: dropdownHeight, // A altura animada (de 0 a 150)
                    position: "absolute", // FAZ O DROPDOWN FLUTUAR
                    top: 0, // Alinha o dropdown com o TOPO do botão
                    left: 0,
                    right: 0,
                    zIndex: 10, // Garante que ele fique NA FRENTE de tudo
                }}
            >
                {open && (
                    <View
                        className={`flex-row justify-center items-center rounded-xl border p-2 ${isDark
                            ? "bg-fundo-escuro-principal border-transparent"
                            : "bg-gray-50 border-gray-300"
                            }`}
                    >
                        {/* --- Lista de HORAS --- */}
                        <FlatList
                            ref={hourListRef} // Conecta a referência
                            data={hours} // Usa o array [0..23]
                            keyExtractor={(item) => item.toString()}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={ITEM_HEIGHT} // "Trava" a rolagem na altura do item
                            decelerationRate="fast"
                            onMomentumScrollEnd={(e) => onScrollEnd(e, "hour")} // Chama a função ao parar
                            getItemLayout={getItemLayout} // Otimização
                            contentContainerStyle={{
                                alignItems: "center",
                                paddingVertical: PADDING_VERTICAL, // Adiciona o padding
                            }}
                            style={{ height: LIST_HEIGHT }} // Altura da caixa de rolagem
                            renderItem={({ item }) => (
                                // Onde cada NÚMERO da hora é desenhado
                                <View style={{ height: ITEM_HEIGHT, justifyContent: "center" }}>
                                    <Text
                                        className={`text-xl ${
                                            // Muda a cor se o item for o 'selectedHour'
                                            item === selectedHour
                                                ? isDark
                                                    ? "text-azul-celeste font-quicksand-bold"
                                                    : "text-blue-600 font-quicksand-bold"
                                                : isDark
                                                    ? "text-gray-400"
                                                    : "text-gray-600"
                                            }`}
                                    >
                                        {item.toString().padStart(2, "0")}
                                    </Text>
                                </View>
                            )}
                        />

                        {/* --- O Separador ":" --- */}
                        <Text
                            className={`mx-3 text-2xl font-quicksand-bold ${isDark ? "text-white" : "text-gray-700"
                                }`}
                        >
                            :
                        </Text>

                        {/* --- Lista de MINUTOS --- */}
                        <FlatList
                            ref={minuteListRef} // Conecta a referência
                            data={minutes} // Usa o array [0..59]
                            keyExtractor={(item) => item.toString()}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={ITEM_HEIGHT}
                            decelerationRate="fast"
                            onMomentumScrollEnd={(e) => onScrollEnd(e, "minute")} // Chama a função ao parar
                            getItemLayout={getItemLayout}
                            contentContainerStyle={{
                                alignItems: "center",
                                paddingVertical: PADDING_VERTICAL,
                            }}
                            style={{ height: LIST_HEIGHT }}
                            renderItem={({ item }) => (
                                // Onde cada NÚMERO do minuto é desenhado
                                <View style={{ height: ITEM_HEIGHT, justifyContent: "center" }}>
                                    <Text
                                        className={`text-lg ${
                                            // Muda a cor se o item for o 'selectedMinute'
                                            item === selectedMinute
                                                ? isDark
                                                    ? "text-azul-celeste font-quicksand-bold"
                                                    : "text-blue-600 font-quicksand-bold"
                                                : isDark
                                                    ? "text-gray-400"
                                                    : "text-gray-600"
                                            }`}
                                    >
                                        {item.toString().padStart(2, "0")}
                                    </Text>
                                </View>
                            )}
                        />
                    </View>
                )}
            </Animated.View>

            {/* --- O OVERLAY de "Clicar Fora" --- */}
            {/* Só é renderizado se 'open' for true */}
            {open && (
                <Pressable
                    // Ao clicar nele, fecha o dropdown
                    onPress={() => setOpen(false)}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: -400, // Do seu código original
                        backgroundColor: "transparent",
                        zIndex: 5, // Fica ATRÁS do dropdown (que é 10), mas na frente do botão
                    }}
                />
            )}
        </View>
    );
};

// Exporta o componente para ser usado em outros arquivos
export default CustomTimePickerDropdown;