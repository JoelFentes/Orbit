import { SafeAreaView, View, Text, Image } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

import ButtonEs from "../../../components/ButtonEs";
import InputEs from "../../../components/InputEs";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-white">
            <View className="p-8 h-[48rem] w-[23rem] bg-slate-50 rounded-2xl shadow-lg">
                {/* Logo no topo */}
                <View className="items-center">
                    <Image
                        source={require("../../../assets/images/orbita.png")}
                        className="w-20 h-20 mb-4"
                        resizeMode="contain"
                    />
                </View>

                {/* Títulos */}
                <Text className="font-quicksand-bold text-3xl text-center text-azul-escuro">
                    Bem-vindo de volta!
                </Text>
                <Text className="font-quicksand-regular text-lg text-center mt-2 text-gray-600">
                    Faça login para continuar
                </Text>

                {/* Inputs */}
                <InputEs
                    label="E-mail"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    className="mt-8 border-transparent"
                />
                <InputEs
                    label="Senha"
                    placeholder="Digite sua senha"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                    className="mt-2 border-transparent"
                />

                {/* Esqueceu a senha */}
                <Text
                    className="mt-3 font-quicksand-regular text-sm text-azul-celestial pl-1"
                    onPress={() => router.push("/screens/auth/reset-password")}
                >
                    Esqueceu a senha?
                </Text>

                {/* Botão login */}
                <ButtonEs
                    title="Entrar"
                    onPress={() => router.back()}
                    className="mt-12 bg-azul-celeste"
                />

                {/* Cadastro */}
                <Text
                    className="mt-6 font-quicksand-regular text-base text-center"
                    onPress={() => router.push("/screens/auth/signup")}
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
