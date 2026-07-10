import {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../theme/colors';
import {useDrawer} from '../context/DrawerContext';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.75;

const MENU_ITEMS = [
  {label: 'Cumpleaños', icon: '🎂', screen: 'Home'},
  {label: 'Funcionarios', icon: '👥', screen: 'Funcionarios'},
  {label: 'Configuración', icon: '⚙️', screen: 'Settings'},
  {label: 'Perfil de Usuario', icon: '👤', screen: 'Profile'},
  {label: 'Acerca de', icon: 'ℹ️', screen: 'Credits'},
];

export default function DrawerMenu() {
  const {isDrawerOpen, closeDrawer, navigationRef} = useDrawer();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: isDrawerOpen ? 0 : -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: isDrawerOpen ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDrawerOpen, slideAnim, overlayAnim]);

  const handleNavigate = (screen: string) => {
    navigationRef?.current?.navigate(screen as never);
    closeDrawer();
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isDrawerOpen ? 'auto' : 'none'}>
      <Animated.View style={[styles.overlay, {opacity: overlayAnim}]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={closeDrawer}
        />
      </Animated.View>

      <Animated.View
        style={[styles.drawer, {transform: [{translateX: slideAnim}]}]}>
        <View style={styles.header}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>STMSC</Text>
          <Text style={styles.subtitle}>Cumpleañeros</Text>
        </View>

        <View style={styles.menu}>
          {MENU_ITEMS.map(item => (
            <TouchableOpacity
              key={item.screen}
              style={styles.menuItem}
              onPress={() => handleNavigate(item.screen)}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: colors.primaryBg,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 0},
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 24,
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    marginBottom: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  menu: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});
