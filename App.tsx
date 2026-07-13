import {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import notifee from '@notifee/react-native';
import {AuthProvider, useAuth} from './src/context/AuthContext';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import {
  setupNotifications,
  scheduleDailyReminder,
} from './src/services/notifications';

notifee.onBackgroundEvent(async () => {
  // La app se abre al tocar la notificación (comportamiento por defecto)
});

function AppContent() {
  const {user} = useAuth();
  const {colors} = useTheme();

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: colors.primary,
          background: colors.primaryBg,
          card: colors.surface,
          text: colors.textPrimary,
          border: colors.border,
          notification: colors.accent,
        },
        fonts: {
          regular: {fontFamily: 'System', fontWeight: '400'},
          medium: {fontFamily: 'System', fontWeight: '500'},
          bold: {fontFamily: 'System', fontWeight: '700'},
          heavy: {fontFamily: 'System', fontWeight: '900'},
        },
      }}>
      <AppNavigator />
    </NavigationContainer>
  );
}

function App() {
  useEffect(() => {
    setupNotifications();
    scheduleDailyReminder();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
