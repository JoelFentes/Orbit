// GeofenceMap.tsx
import React, { forwardRef } from 'react';
import { View } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE, Region } from 'react-native-maps';

interface Place {
    id: string;
    name: string;
    location: { latitude: number; longitude: number };
}

interface GeofenceMapProps {
    region: Region;
    geofenceCenter: { latitude: number; longitude: number } | null;
    radiusMeters: number;
    places: Place[];
    onLongPress?: (coords: { latitude: number; longitude: number }) => void;
}

const GeofenceMap = forwardRef<MapView, GeofenceMapProps>(
    ({ region, geofenceCenter, radiusMeters, places, onLongPress }, ref) => {
        return (
            // Mapa em posição absoluta ocupando toda a tela
            <MapView
                ref={ref}
                provider={PROVIDER_GOOGLE}
                initialRegion={region}
                showsUserLocation
                showsMyLocationButton={false} 
                onRegionChangeComplete={() => {}}
                onLongPress={e => onLongPress && onLongPress(e.nativeEvent.coordinate)}
                style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
            >


                {/* 🔵 Círculo da geofence */}
                {geofenceCenter && (
                    <Circle
                        center={geofenceCenter}
                        radius={radiusMeters}
                        strokeWidth={2}
                        strokeColor="blue"
                        fillColor="rgba(0,0,255,0.1)"
                    />
                )}

                {/* 📍 Marcadores */}
                {places.map(p => (
                    <Marker
                        key={p.id}
                        coordinate={p.location}
                        title={p.name}
                    />
                ))}
            </MapView>
        );
    }
);

export default GeofenceMap;
