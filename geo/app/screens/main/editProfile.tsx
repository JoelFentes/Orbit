import React, { useState } from "react";
import { View, TextInput, Button, Image, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../../contexts/AuthContext";

export default function EditProfile() {
  const { user, userToken, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [photo, setPhoto] = useState(user?.photo || null);

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  }

  async function handleSave() {
  const response = await fetch("http://192.168.18.12:4000/users/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify({ name, photo }),
  });

  if (!response.ok) {
  const errorText = await response.text();
  console.log("ERRO DO BACKEND:", errorText);
  return alert("Erro ao atualizar!");
}


  const updatedUser = await response.json();

  // Atualiza o contexto
  updateUserProfile(updatedUser.name, updatedUser.photo);

  alert("Perfil atualizado!");
}



  return (
    <View style={{ padding: 20 }}>
      <Text>Nome</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      {photo && (
        <Image
          source={{ uri: photo }}
          style={{ width: 150, height: 150, borderRadius: 75, marginBottom: 10 }}
        />
      )}

      <Button title="Escolher foto" onPress={pickImage} />
      <Button title="Salvar" onPress={handleSave} />
    </View>
  );
}
