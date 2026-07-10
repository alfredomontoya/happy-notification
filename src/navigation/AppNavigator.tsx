import {StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors} from '../theme/colors';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import FormScreen from '../screens/FormScreen';
import ImportScreen from '../screens/ImportScreen';
import FuncionariosScreen from '../screens/FuncionariosScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreditsScreen from '../screens/CreditsScreen';
import {DrawerProvider, useDrawer} from '../context/DrawerContext';
import DrawerMenu from '../components/DrawerMenu';

const Stack = createNativeStackNavigator();

function AppContent() {
  const {navigationRef} = useDrawer();

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: colors.primary},
          headerTintColor: colors.white,
          headerTitleStyle: {fontWeight: '600'},
          contentStyle: {backgroundColor: colors.primaryBg},
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{title: 'Detalle'}}
        />
        <Stack.Screen
          name="Form"
          component={FormScreen}
          options={({route}: any) => ({
            title: route.params?.persona ? 'Editar persona' : 'Nueva persona',
          })}
        />
        <Stack.Screen
          name="Import"
          component={ImportScreen}
          options={{title: 'Importar Excel'}}
        />
        <Stack.Screen
          name="Funcionarios"
          component={FuncionariosScreen}
          options={{title: 'Funcionarios'}}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{title: 'Configuración'}}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{title: 'Perfil de Usuario'}}
        />
        <Stack.Screen
          name="Credits"
          component={CreditsScreen}
          options={{title: 'Acerca de'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return (
    <DrawerProvider>
      <View style={styles.root}>
        <AppContent />
        <DrawerMenu />
      </View>
    </DrawerProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
