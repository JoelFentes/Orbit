import React, { forwardRef } from 'react';
import MapView, { Marker, Circle, PROVIDER_GOOGLE, Region } from 'react-native-maps';

export interface Place {
    id?: string;
    name: string;
    location: { latitude: number; longitude: number };
}

interface GeofenceMapProps {
    region: Region;
    radiusMeters: number;
    places: Place[];
    userLocation?: { latitude: number; longitude: number } | null; // nova prop
    onLongPress?: (coords: { latitude: number; longitude: number }) => void;
}

const GeofenceMap = forwardRef<MapView, GeofenceMapProps>(
    ({ region, radiusMeters, places, userLocation, onLongPress }, ref) => {
        return (
            <MapView
                ref={ref}
                provider={PROVIDER_GOOGLE}
                initialRegion={region}
                showsUserLocation={false}
                showsMyLocationButton={false}
                onLongPress={e => onLongPress && onLongPress(e.nativeEvent.coordinate)}
                style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
            >
                {places.map((p, index) => {
                    if (
                        userLocation &&
                        p.location.latitude === userLocation.latitude &&
                        p.location.longitude === userLocation.longitude
                    ) {
                        return null;
                    }

                    return (
                        <React.Fragment key={p.id ?? `${p.name}-${index}`}>
                            <Marker
                                coordinate={p.location}
                                title={p.name}
                                pinColor="rgba(102, 184, 245, 0.8)"
                            />
                            <Circle
                                center={p.location}
                                radius={radiusMeters}
                                strokeWidth={2}
                                strokeColor="rgba(102, 184, 245, 0.8)"
                                fillColor="rgba(102, 184, 245, 0.2)"
                            />
                        </React.Fragment>
                    );
                })}
            </MapView>
        );
    }
);

export default GeofenceMap;
