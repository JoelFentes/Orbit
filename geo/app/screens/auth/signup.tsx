import { SafeAreaView, View, Text } from "react-native";
import { useState } from "react";
import { Alert } from "react-native";
import ButtonEs from "../../../components/ButtonEs";
import InputEs from "../../../components/InputEs";

import { router } from "expo-router";


export default function Signup() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    async function handleSignup() {
        if (senha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas não conferem!");
            return;
        }

        try {
            const response = await fetch("https://geofencing-backend-2kse.onrender.com/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: nome,
                    email,
                    password: senha,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao cadastrar");
            }

            const data = await response.json();
            console.log("Usuário criado:", data);

            Alert.alert("Sucesso", "Conta criada com sucesso!");
            router.push("/screens/auth/login");
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível criar a conta.");
        }
    }

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-white">
            <View className="p-8 h-[55rem] w-[23rem] bg-slate-50 rounded-2xl">
                <Text className="font-quicksand-bold mt-5 text-3xl text-center">
                    Crie sua conta Orbit!
                </Text>
                <Text className="font-quicksand-regular text-lg text-center mt-2">
                    Leva só alguns segundos
                </Text>

                <InputEs
                    label="Nome"
                    placeholder="Digite seu nome completo"
                    value={nome}
                    onChangeText={setNome}
                    className="mt-8 border-transparent"
                />
                <InputEs
                    label="E-mail"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    className="mt-2 border-transparent"
                />
                <InputEs
                    label="Senha"
                    placeholder="Digite sua senha"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                    className="mt-2 border-transparent"
                />
                <InputEs
                    label="Confirmar Senha"
                    placeholder="Repita sua senha"
                    secureTextEntry
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    className="mt-2 border-transparent"
                />

                <Text
                    className="mt-2 font-quicksand-regular text-base color-azul-celestial pl-1"
                    onPress={() => router.push("/screens/auth/login")}
                >
                    Já tem uma conta? Faça login.
                </Text>

                <ButtonEs
                    title="Cadastrar"
                    onPress={handleSignup}
                    className="mt-12 bg-azul-celeste"
                />
            </View>
        </SafeAreaView>
    );
}
