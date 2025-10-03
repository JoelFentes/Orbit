import { SafeAreaView, View, Text, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";

import ButtonEs from "../../../components/ButtonEs";
import InputEs from "../../../components/InputEs";

export default function Signup() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    async function handleSignup() {
        if (senha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas não conferem!");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("https://geofencing-api.onrender.com/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nome, email, password: senha }),
            });

            if (!response.ok) throw new Error("Erro ao cadastrar");

            const data = await response.json();
            console.log("Usuário criado:", data);

            Alert.alert("Sucesso", "Conta criada com sucesso!");
            router.push("/screens/auth/login");
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível criar a conta.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView className={`flex-1 items-center justify-center ${isDark ? "bg-fundo-escuro-principal" : "bg-white"}`}>
            <View className={`p-8 h-[52rem] w-[23rem] ${isDark ? "bg-[#2a2a2a]" : "bg-slate-50"} rounded-2xl shadow-lg`}>
                <Text className={`font-quicksand-bold mt-5 text-3xl text-center ${isDark ? "text-texto-claro-principal" : "text-azul-escuro"}`}>
                    Crie sua conta Orbit!
                </Text>
                <Text className={`font-quicksand-regular text-lg text-center mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Leva só alguns segundos
                </Text>

                <InputEs
                    label="Nome"
                    placeholder="Digite seu nome completo"
                    value={nome}
                    onChangeText={setNome}
                    className="mt-8 border-transparent"
                    editable={!loading}
                />
                <InputEs
                    label="E-mail"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    className="mt-2 border-transparent"
                    editable={!loading}
                />
                <InputEs
                    label="Senha"
                    placeholder="Digite sua senha"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                    className="mt-2 border-transparent"
                    editable={!loading}
                />
                <InputEs
                    label="Confirmar Senha"
                    placeholder="Repita sua senha"
                    secureTextEntry
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    className="mt-2 border-transparent"
                    editable={!loading}
                />

                <Text
                    className={`mt-6 font-quicksand-regular text-base text-left ${isDark ? "text-texto-claro-principal" : "text-gray-700"}`}
                    onPress={() => !loading && router.push("/screens/auth/login")}
                >
                    Já tem uma conta?{" "}
                    <Text className="font-quicksand-bold text-azul-celeste">Faça Login</Text>
                </Text>

                {loading ? (
                    <View className="mt-12 bg-azul-celeste rounded-xl h-12 items-center justify-center">
                        <ActivityIndicator color="white" size="small" />
                    </View>
                ) : (

                    <ButtonEs
                        title="Cadastrar"
                        onPress={handleSignup}
                        className="mt-12 bg-azul-celeste p-4 items-center rounded-xl"
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
