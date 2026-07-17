import {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text} from 'react-native';
import {useNetwork} from '../context/NetworkContext';
import {useTheme} from '../context/ThemeContext';

export default function NetworkBanner() {
  const {isConnected} = useNetwork();
  const {colors} = useTheme();
  const slideAnim = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isConnected ? -60 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isConnected, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.banner,
        {backgroundColor: colors.danger, transform: [{translateY: slideAnim}]},
      ]}>
      <Text style={styles.text}>Sin conexión a Internet</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingVertical: 8,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
