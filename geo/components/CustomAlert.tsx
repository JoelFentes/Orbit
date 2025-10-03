import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

type CustomAlertProps = {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    onLocation: () => void;
};

export default function CustomAlert({ visible, onClose, onSave, onLocation }: CustomAlertProps) {
    return (
        <Modal isVisible={visible} onBackdropPress={onClose}>
            <View className="bg-white dark:bg-fundo-escuro-principal rounded-2xl p-6">
                <Text className="text-2xl dark:text-texto-claro-principal font-quicksand-bold mb-4">Deseja usar GeoFencing?</Text>

                <TouchableOpacity
                    className="bg-azul-celestial rounded-xl py-3 mb-3 items-center"
                    onPress={onSave}
                >
                    <Text className="text-white font-quicksand-bold text-base">Salvar lembrete</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-azul-celeste rounded-xl py-3 mb-3 items-center"
                    onPress={onLocation}
                >
                    <Text className="text-white font-quicksand-bold text-base">Adicionar localização ao lembrete</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-gray-100 rounded-xl py-3 items-center"
                    onPress={onClose}
                >
                    <Text className="text-black font-quicksand-bold text-base">Cancelar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}
