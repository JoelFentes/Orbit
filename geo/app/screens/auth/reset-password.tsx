import { SafeAreaView, View, Text } from "react-native";
import { router } from "expo-router";
import ButtonEs from "../../../components/ButtonEs";

export default function ResetPassword() {
    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-bege">
            <View className="p-8 w-[22rem]">
                <Text className="font-quicksand-bold text-3xl text-center">
                    RESET
                </Text>
                <Text className="font-quicksand-regular text-lg text-center mt-4">
                    Aqui vai o formulário de cadastro
                </Text>

                <ButtonEs
                    title="Voltar"
                    onPress={() => router.back()}
                    className="mt-8 bg-azul-federal"
                />
            </View>
        </SafeAreaView>
    );
}
