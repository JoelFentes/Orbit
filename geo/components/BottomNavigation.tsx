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
        if (onNavigate) {
            onNavigate(itemId);
            console.log("Navigating to:", itemId);
        }
    };

    return (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 pt-2">
            <View className="flex-row justify-around items-center pb-6">
                {navigationItems.map((item) => (
                    <View key={item.id} className="justify-center items-center">
                        {item.isCenter ? (
                            <TouchableOpacity
                                onPress={() => handlePress(item.id)}
                                className="w-20 h-20 bg-azul-celeste rounded-full items-center justify-center -mt-8 shadow-lg"
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
                                    size={24}
                                    color={currentRoute === item.id ? "#78c0e0ff" : "#6B7280"}
                                />

                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}