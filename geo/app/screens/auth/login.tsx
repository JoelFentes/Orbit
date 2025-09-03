import { SafeAreaView, View, Text, Image, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';

import ButtonEs from "../../../components/ButtonEs";
import InputEs from "../../../components/InputEs";
import { useAuth } from "../../../contexts/AuthContext"; // Ajuste o caminho

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    async function handleLogin() {
        setLoading(true);

        try {
            const response = await fetch("https://geofencing-backend-2kse.onrender.com/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password: password,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao fazer login");
            }

            const data = await response.json();
            console.log("Login realizado:", data);

            // Salvar o token no SecureStore
            await SecureStore.setItemAsync('userToken', data.token);

            // Atualizar o contexto de autenticação
            if (login) {
                await login(data.token, data.user);
            }

            // Redireciona para a tela principal
            router.replace("../main/home");
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "E-mail ou senha incorretos.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-white">
            <View className="p-8 h-[48rem] w-[23rem] bg-slate-50 rounded-2xl shadow-lg">
                <View className="items-center">
                    <Image
                        source={require("../../../assets/images/orbita.png")}
                        className="w-20 h-20 mb-4"
                        resizeMode="contain"
                    />
                </View>

                <Text className="font-quicksand-bold text-3xl text-center text-azul-escuro">
                    Bem-vindo de volta!
                </Text>
                <Text className="font-quicksand-regular text-lg text-center mt-2 text-gray-600">
                    Faça login para continuar
                </Text>

                <InputEs
                    label="E-mail"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    className="mt-8 border-transparent"
                    editable={!loading}
                />
                <InputEs
                    label="Senha"
                    placeholder="Digite sua senha"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    className="mt-2 border-transparent"
                    editable={!loading}
                />

                <Text
                    className="mt-3 font-quicksand-regular text-sm text-azul-celestial pl-1"
                    onPress={() => !loading && router.push("/screens/auth/reset-password")}
                >
                    Esqueceu a senha?
                </Text>

                {loading ? (
                    <View className="mt-12 bg-azul-celeste rounded-lg h-12 items-center justify-center">
                        <ActivityIndicator color="white" size="small" />
                    </View>
                ) : (
                    <ButtonEs
                        title="Entrar"
                        onPress={handleLogin}
                    />
                )}

                <Text
                    className="mt-6 font-quicksand-regular text-base text-center"
                    onPress={() => !loading && router.push("/screens/auth/signup")}
                >
                    Não tem uma conta?{" "}
                    <Text className="font-quicksand-bold text-azul-celestial">
                        Cadastre-se
                    </Text>
                </Text>
            </View>
        </SafeAreaView>
    );
}