import {useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  count: number;
  total: number;
}

export default function LoadingOverlay({
  visible,
  title,
  message,
  count,
  total,
}: Props) {
  const {colors} = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progress = total > 0 ? count / total : 0;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, fadeAnim]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View
        style={[styles.overlay, {backgroundColor: colors.overlay, opacity: fadeAnim}]}>
        <View style={[styles.card, {backgroundColor: colors.surface}]}>
          <ActivityIndicator size="large" color={colors.primary} />

          <Text style={[styles.title, {color: colors.textPrimary}]}>{title}</Text>

          <View style={styles.barContainer}>
            <View style={[styles.barBg, {backgroundColor: colors.primaryBg}]}>
              <View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${Math.min(progress * 100, 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.count, {color: colors.textSecondary}]}>
              {count} de {total} registros
            </Text>
          </View>

          <Text style={[styles.message, {color: colors.textSecondary}]}>
            {message}
          </Text>

          <Text style={[styles.warning, {color: colors.accent}]}>
            ⚠️ No cierres la aplicación durante el proceso.
          </Text>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  barContainer: {
    width: '100%',
    marginTop: 20,
  },
  barBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  warning: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});
