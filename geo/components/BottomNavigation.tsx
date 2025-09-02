// components/BottomNavigation.tsx
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomNavigationProps {
    currentRoute?: string;
    onNavigate?: (route: string) => void;
}

export default function BottomNavigation({ currentRoute = "home", onNavigate }: BottomNavigationProps) {
    const navigationItems = [
        { id: "home", icon: "home-outline", label: "Home" },
        { id: "calendar", icon: "calendar-outline", label: "Calendar" },
        { id: "add", icon: "add", label: "Add", isCenter: true },
        { id: "notes", icon: "create-outline", label: "Notes" },
        { id: "profile", icon: "person-outline", label: "Profile" },
    ];

    const handlePress = (itemId: string) => {
        if (onNavigate && itemId !== "add") {
            onNavigate(itemId);
        }
    };

    return (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 pt-2">
            <View className="flex-row justify-around items-center pb-8">
                {navigationItems.map((item) => (
                    <View key={item.id} className="justify-center items-center">
                        {item.isCenter ? (
                            <TouchableOpacity
                                onPress={() => handlePress(item.id)}
                                className="w-14 h-14 bg-azul-celeste rounded-full items-center justify-center -mt-8 shadow-lg"
                            >
                                <Ionicons name={item.icon as any} size={28} color="white" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => handlePress(item.id)}
                                className="items-center p-2"
                            >
                                <Ionicons
                                    name={item.icon as any}
                                    size={28}
                                    color={currentRoute === item.id ? "#3B82F6" : "#6B7280"}
                                />
                                <Text
                                    className={`text-xs mt-1 ${currentRoute === item.id ? "text-azul-celeste font-quicksand-medium" : "text-gray-500 font-quicksand-regular"
                                        }`}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}