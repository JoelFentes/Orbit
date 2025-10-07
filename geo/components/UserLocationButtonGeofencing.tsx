import { TouchableOpacity } from "react-native";

{/* 📍 Botão custom de "ir para minha localização" */}
<TouchableOpacity
  onPress={() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000 // duração da animação em ms
      );
    }
  }}
  className="absolute bottom-24 right-5 w-14 h-14 rounded-full items-center justify-center shadow-lg bg-white dark:bg-acento-primario"
/>
