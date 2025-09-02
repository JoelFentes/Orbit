import { router } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from 'react-native';

export const ProfileScreen = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.replace('/screens/auth/login');
    };

    return (
        <Button title="Sair" onPress={handleLogout} />
    );
};