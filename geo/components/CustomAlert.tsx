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
            <View className="bg-white rounded-2xl p-6">
                <Text className="text-2xl font-quicksand-bold mb-4">O que deseja fazer?</Text>

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
                    <Text className="text-white font-quicksand-bold text-base">Adicionar localização</Text>
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
