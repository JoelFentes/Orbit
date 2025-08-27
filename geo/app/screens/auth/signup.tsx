import { SafeAreaView, View, Text } from "react-native";
import { useState } from "react";

import { router } from "expo-router";
import ButtonEs from "../../../components/ButtonEs";
import InputEs from "../../../components/InputEs";

export default function Signup() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

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
                    onPress={() => router.back()}
                    className="mt-12 bg-azul-celeste"
                />
            </View>
        </SafeAreaView>
    );
}
