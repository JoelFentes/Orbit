import { View, Text, TextInput } from "react-native";

interface InputEsProps {
    label?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    value?: string;
    onChangeText?: (text: string) => void;
    className?: string;
    editable?: boolean;
}

export default function InputEs({
    label,
    placeholder,
    secureTextEntry = false,
    value,
    onChangeText,
    className,
}: InputEsProps) {
    return (
        <View className={`w-full mb-4 ${className}`}>
            {label && (
                <Text className="font-quicksand-regular text-base mb-2 text-start">
                    {label}
                </Text>
            )
            }
            <TextInput
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                className="bg-white rounded-lg px-4 py-5 text-base font-quicksand-white"
                placeholderTextColor="gray"
            />
        </View >
    );
}
