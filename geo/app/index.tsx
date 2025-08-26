import { View, Text } from "react-native";

export default function Home() {
    return (
        <View className="flex-1 justify-center items-center bg-gray-100">
            <Text className="text-lg font-quicksand-light text-gray-700">
                Quicksand Light 300
            </Text>
            <Text className="text-lg font-quicksand-regular text-gray-900">
                Quicksand Regular 400
            </Text>
            <Text className="text-lg font-quicksand-medium text-blue-600">
                Quicksand Medium 500
            </Text>
            <Text className="text-lg font-quicksand-semibold text-green-600">
                Quicksand SemiBold 600
            </Text>
            <Text className="text-lg font-quicksand-bold text-red-600">
                Quicksand Bold 700
            </Text>
            <View className="bg-verde-claro-2 p-4 rounded-xl">
                <Text className="text-bege font-quicksand-bold text-lg">
                    Exemplo com cor em português 🌿
                </Text>
            </View>

        </View>

    );
}
