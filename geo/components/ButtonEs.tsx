import { TouchableOpacity, Text } from "react-native";

export default function Button({
    title = "Button",
    onPress = () => { },
    className = "",
    textClassName = "",
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={
                className
                    ? className
                    : "bg-blue-500 rounded-2xl py-4 px-6 items-center"
            }
        >
            <Text
                className={
                    textClassName
                        ? textClassName
                        : "text-white font-quicksand-bold text-lg"
                }
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}
