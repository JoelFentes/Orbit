import { View, Text } from "react-native";
import { ProfileScreen } from "./profile";

export default function Notes() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="font-quicksand-bold text-3xl text-azul-escuro">Notes</Text>
            <ProfileScreen />
        </View>
    );
}