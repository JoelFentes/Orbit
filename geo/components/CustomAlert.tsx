import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

export default function CustomAlert({ visible, onClose, onSave, onLocation }) {
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
                    className="bg-gray-300 rounded-xl py-3 items-center"
                    onPress={onClose}
                >
                    <Text className="text-gray-700 font-quicksand-bold text-base">Cancelar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}
