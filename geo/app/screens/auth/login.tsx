import { SafeAreaView, View, Text, Image, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import ButtonEs from "../../../components/ButtonEs";
import InputEs from "../../../components/InputEs";
import { useAuth } from "../../../contexts/AuthContext";
import { useColorScheme } from "nativewind";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    async function handleLogin() {
        setLoading(true);
        try {
            const response = await fetch("https://geofencing-api.onrender.com/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error("Erro ao fazer login");

            const data = await response.json();
            console.log("Login realizado:", data);

            if (rememberMe) {
                await SecureStore.setItemAsync("userToken", data.token);
            } else {
                await SecureStore.deleteItemAsync("userToken");
            }

            if (login) await login(data.token, data.user);
            router.replace("../main/home");
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "E-mail ou senha incorretos.");
        } finally {
            setLoading(false);
        }
    }


    return (
        <SafeAreaView className={`flex-1 items-center justify-center ${isDark ? "bg-fundo-escuro-principal" : "bg-white"}`}>
            <View className={`p-8 h-[48rem] w-[23rem] ${isDark ? "bg-[#2a2a2a]" : "bg-slate-50"} rounded-2xl shadow-lg`}>
                <View className="items-center">
                    <Image
                        source={require("../../../assets/images/orbita.png")}
                        className="w-20 h-20 mb-4"
                        resizeMode="contain"
                        style={{ tintColor: isDark ? "#f3f4f6" : undefined }}
                    />
                </View>

                <Text className={`font-quicksand-bold text-3xl text-center ${isDark ? "text-texto-claro-principal" : "text-azul-escuro"}`}>
                    Bem-vindo de volta!
                </Text>
                <Text className={`font-quicksand-regular text-lg text-center mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Faça login para continuar
                </Text>

                <InputEs label="E-mail" placeholder="Digite seu e-mail" value={email} onChangeText={setEmail} className="mt-8 border-transparent" editable={!loading} />
                <InputEs label="Senha" placeholder="Digite sua senha" secureTextEntry value={password} onChangeText={setPassword} className="mt-2 border-transparent" editable={!loading} />

                <View className="flex-row items-center mb-10 mt-4 justify-between">
                    <TouchableOpacity
                        className="flex-row items-center mt-3"
                        onPress={() => setRememberMe(!rememberMe)}
                    >
                        <View className={`w-5 h-5 mr-2 border-texto-claro-principal border rounded ${rememberMe ? 'bg-azul-celeste border-azul-celeste' : 'border-gray-400'}`} />
                        <Text className={`text-base font-quicksand-regular ${isDark ? "text-texto-claro-principal" : "text-gray-700"}`}>Lembrar-me</Text>
                    </TouchableOpacity>

                    <Text
                        className={`mt-3 font-quicksand-regular text-sm pl-1 ml-2 ${isDark ? "text-texto-claro-principal" : "text-azul-celeste"}`}
                        onPress={() => !loading && router.push("/screens/auth/reset-password")}
                    >
                        Esqueceu a senha?
                    </Text>
                </View>

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
                    <ButtonEs title="Entrar" className=" bg-azul-celeste p-4 items-center rounded-xl" onPress={handleLogin} />
                )}

                <Text
                    className={`mt-6 font-quicksand-regular text-base text-left ${isDark ? "text-texto-claro-principal" : "text-gray-700"}`}
                    onPress={() => !loading && router.push("/screens/auth/signup")}
                >
                    Não tem uma conta?{" "}
                    <Text className="font-quicksand-bold text-azul-celeste">Cadastre-se</Text>
                </Text>
            </View>
        </SafeAreaView>
    );
}
