import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const circle1 = useRef(new Animated.Value(0)).current;
  const circle2 = useRef(new Animated.Value(0)).current;
  const circle3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(circle1, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(circle1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle2, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(circle2, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle3, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(circle3, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      }),
    ).start();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circleBackground,
          {
            top: -100,
            left: -100,
            opacity: circle1.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            }),
            transform: [
              {
                scale: circle1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circleBackground,
          {
            bottom: -150,
            right: -100,
            opacity: circle2.interpolate({
              inputRange: [0, 1],
              outputRange: [0.15, 0.25],
            }),
            transform: [
              {
                scale: circle2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.3],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circleBackground,
          {
            top: height / 2 - 150,
            left: width / 2 - 150,
            opacity: circle3.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.2],
            }),
            transform: [
              {
                scale: circle3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.5],
                }),
              },
            ],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.logoGlow,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          />
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>🏠</Text>
          </View>
          <View style={styles.keyBadge}>
            <Text style={styles.keyIcon}>🔑</Text>
          </View>
        </View>

        <Text style={styles.title}>Selamat Datang</Text>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>di</Text>
          <View style={styles.divider} />
        </View>

        <Text style={styles.brandName}>TANKAYO</Text>

        <View style={styles.descriptionContainer}>
          <Text style={styles.homeIcon}>🏡</Text>
          <Text style={styles.description}>Homestay & Penginapan Nyaman</Text>
        </View>

        <Text style={styles.tagline}>"Rumah Kedua untuk Perjalanan Anda"</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <View style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Masuk</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </Animated.View>

      <View style={styles.waveContainer}>
        <View style={styles.wave1} />
        <View style={styles.wave2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBackground: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#3b82f6',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: 32,
    position: 'relative',
  },
  logoGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#60a5fa',
    opacity: 0.3,
    top: -20,
    left: -20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  logoIcon: {
    fontSize: 60,
  },
  keyBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fbbf24',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  keyIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 1,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginHorizontal: 12,
  },
  brandName: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 4,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  homeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  description: {
    fontSize: 18,
    color: '#e0f2fe',
    fontWeight: '600',
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    fontStyle: 'italic',
    marginBottom: 48,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
  },
  buttonText: {
    color: '#1e3a8a',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  buttonArrow: {
    color: '#1e3a8a',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dot1: {
    opacity: 1,
  },
  dot2: {
    opacity: 0.6,
  },
  dot3: {
    opacity: 0.3,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  wave1: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  wave2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
});
