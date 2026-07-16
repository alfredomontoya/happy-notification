import {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../context/ThemeContext';

interface Props {
  message: string;
  names: string[];
  onDismiss: () => void;
}

export default function NotificationBanner({message, names, onDismiss}: Props) {
  const {colors} = useTheme();
  const slideAnim = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 9,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onDismiss());
    }, 5000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {backgroundColor: colors.notificationBg},
        {transform: [{translateY: slideAnim}]},
      ]}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎂</Text>
        <View style={styles.textContainer}>
          <Text style={[styles.message, {color: colors.notificationText}]}>{message}</Text>
          <Text style={[styles.names, {color: colors.notificationText}]}>{names.slice(0, 3).join(', ')}</Text>
          {names.length > 3 && (
            <Text style={[styles.more, {color: colors.notificationText}]}>y {names.length - 3} más...</Text>
          )}
        </View>
        <TouchableOpacity onPress={onDismiss} style={styles.closeBtn}>
          <Text style={[styles.closeText, {color: colors.notificationText}]}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 15,
    fontWeight: '600',
  },
  names: {
    fontSize: 13,
    marginTop: 2,
    opacity: 0.8,
  },
  more: {
    fontSize: 12,
    marginTop: 1,
    opacity: 0.6,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
