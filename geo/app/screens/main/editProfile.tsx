import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Image, Text, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../../contexts/AuthContext";
import { useColorScheme } from "nativewind";

const CLOUDINARY_CLOUD_NAME = 'dvjxpxqnc';
const CLOUDINARY_UPLOAD_PRESET = 'upload_preset';
// ----------------------------------------------------

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
};

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, loading }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`w-full py-3 rounded-xl mt-4 
      ${loading ? 'bg-gray-400' : 'bg-azul-celeste'}`}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator color="#ffffff" />
    ) : (
      <Text className="text-white text-center font-quicksand-bold text-lg">{title}</Text>
    )}
  </TouchableOpacity>
);


export default function EditProfile() {
  const { user, userToken, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [photo, setPhoto] = useState(user?.photo || null);
  const [loading, setLoading] = useState(false);

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true, // ⬅️ Obtém a imagem como Base64
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.3,
    });

    if (!result.canceled) {
      // Monta a string Data URI (necessária para upload do Base64) e salva no estado
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setPhoto(base64Image);
    }
  }

  async function handleSave() {
    setLoading(true);
    let finalPhotoUrl = user?.photo; // Valor inicial

    try {

      // A. UPLOAD PARA CLOUDINARY (SE O ESTADO 'photo' CONTIVER UMA NOVA IMAGEM BASE64)
      if (photo && photo.startsWith('data:image')) {
        const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

        const uploadData = new FormData();
        uploadData.append('file', photo); // Base64 da imagem
        uploadData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        uploadData.append('folder', 'geofencing-profiles');

        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          body: uploadData,
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResult.secure_url) {
          finalPhotoUrl = uploadResult.secure_url; // URL pública do Cloudinary
        } else {
          const cloudError = uploadResult.error?.message || 'Falha desconhecida no upload para o Cloudinary.';
          throw new Error(`Upload Cloudinary falhou: ${cloudError}`);
        }
      } else if (photo && !photo.startsWith('data:image')) {
        // Se a foto não é base64, é uma URL pública (antiga ou não alterada), mantemos ela.
        finalPhotoUrl = photo;
      }


      // B. ENVIAR DADOS SIMPLES JSON PARA O BACKEND
      const response = await fetch("https://geofencing-api.onrender.com/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // ⬅️ Envio como JSON
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ name, photo: finalPhotoUrl }),
      });

      // C. TRATAMENTO DE ERRO/SUCESSO
      let responseData;

      if (!response.ok) {
        const errorText = await response.text();
        try {
          responseData = JSON.parse(errorText);
        } catch (e) {
          responseData = { error: errorText };
        }

        const errorMessage = responseData.error || responseData.message || "Erro desconhecido ao salvar.";
        Alert.alert("Erro ao Atualizar", String(errorMessage).substring(0, 150));
        return;
      }

      responseData = await response.json();

      // D. Sucesso
      updateUserProfile(responseData.name, responseData.photo);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");


    } catch (error) {
      console.error("Erro na requisição:", error);
      Alert.alert("Erro", `Não foi possível processar a requisição: ${error || 'Verifique o console.'}`);
    } finally {
      setLoading(false);
    }
  }


  return (
    <View
      className={`flex-1 p-6 ${isDark ? "bg-gray-900" : "bg-white"}`}
    >
      <Text
        className={`text-2xl font-quicksand-bold mb-8 text-center 
           ${isDark ? "text-texto-claro-principal" : "text-azul-escuro"}`}
      >
        Editar Perfil
      </Text>

      {/* Área da Foto */}
      <View className="items-center mb-10">
        <TouchableOpacity onPress={loading ? undefined : pickImage}>
          <Image
            source={{ uri: photo || user?.photo || 'https://via.placeholder.com/150/007bff/ffffff?text=Add+Photo' }}
            className="w-32 h-32 rounded-full border-4 border-azul-celeste"
            resizeMode="cover"
          />
          <View className="absolute bottom-0 right-0 p-2 rounded-full bg-azul-celeste border-2 border-white">
            <Text className="text-white text-xs">Editar</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Input Nome */}
      <Text
        className={`font-quicksand-medium mb-1 
           ${isDark ? "text-gray-300" : "text-gray-700"}`}
      >
        Nome Completo
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        className={`border p-3 rounded-lg mb-6 
           ${isDark ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-gray-50 text-gray-900"}`}
        editable={!loading}
        placeholder="Digite seu nome"
        placeholderTextColor={isDark ? "#9ca3af" : "#999"}
      />

      {/* Botões */}
      <CustomButton title="Salvar Alterações" onPress={handleSave} loading={loading} />

      <TouchableOpacity
        onPress={() => {/* Lógica para voltar ou cancelar */ }}
        className="mt-4 p-3 items-center"
        disabled={loading}
      >
        <Text className={`font-quicksand-medium 
           ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          Cancelar
        </Text>
      </TouchableOpacity>
    </View>
  );
}