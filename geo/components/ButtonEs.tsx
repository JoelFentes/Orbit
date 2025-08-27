import { TouchableOpacity, Text } from "react-native";

export default function Button({ title, onPress, className }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={`bg-blue-500 rounded-2xl py-4 px-6 items-center ${className}`}
        >
            <Text className="text-white font-quicksand-bold text-lg">{title}</Text>
        </TouchableOpacity>
    );
}
