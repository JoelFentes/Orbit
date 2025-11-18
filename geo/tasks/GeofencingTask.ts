// src/tasks/GeofencingTask.ts

import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export const GEOFENCING_TASK_NAME = 'GEOFENCING_REMINDER_TASK';

TaskManager.defineTask(GEOFENCING_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error("Erro na tarefa de Geofencing:", error);
        return;
    }
    
    if (data && data.region && data.state) {
        const { region, state } = data as { region: Location.LocationRegion, state: Location.GeofencingRegionState };
        
        if (state === Location.GeofencingRegionState.ENTER) {
            // Dispara a notificação ao entrar na geofence
            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Lembrete de Localização! 📍',
                    // region.identifier é o nome ou ID que passamos ao registrar a geofence
                    body: `Você chegou perto de ${region.identifier}. Seu lembrete está ativo!`,
                    data: { regionId: region.identifier },
                },
                trigger: null, // Dispara imediatamente
            });

            console.log(`Notificação disparada para: ${region.identifier}`);
        }
    }
});