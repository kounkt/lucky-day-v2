import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withDelay,
  Easing,
  cancelAnimation
} from 'react-native-reanimated';
import { Platform } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';

interface Star {
  id: number;
  size: number;
  top: number;
  left: number;
  delay: number;
  opacity: number;
}

const generateStars = (count: number): Star[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 2000,
    opacity: Math.random() * 0.5 + 0.3,
  }));
};

const AnimatedStars: React.FC = () => {
  const { colors } = useTheme();
  const stars = React.useMemo(() => generateStars(20), []);
  const starAnimations = stars.map(() => useSharedValue(0));

  useEffect(() => {
    stars.forEach((_, index) => {
      starAnimations[index].value = withDelay(
        stars[index].delay,
        withRepeat(
          withTiming(1, { duration: 1500 + Math.random() * 1000, easing: Easing.inOut(Easing.ease) }),
          -1,
          true
        )
      );
    });

    return () => {
      starAnimations.forEach(anim => {
        cancelAnimation(anim);
      });
    };
  }, []);

  if (Platform.OS === 'web') {
    // Simplified version for web to avoid layout animation issues
    return (
      <View style={styles.container}>
        {stars.map((star) => (
          <View
            key={star.id}
            style={[
              styles.star,
              {
                width: star.size,
                height: star.size,
                top: `${star.top}%`,
                left: `${star.left}%`,
                backgroundColor: colors.primary,
                opacity: star.opacity,
              },
            ]}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {stars.map((star, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          return {
            opacity: (star.opacity) + starAnimations[index].value * 0.5,
            transform: [{ scale: 0.8 + starAnimations[index].value * 0.4 }],
          };
        });

        return (
          <Animated.View
            key={star.id}
            style={[
              styles.star,
              {
                width: star.size,
                height: star.size,
                top: `${star.top}%`,
                left: `${star.left}%`,
                backgroundColor: colors.primary,
              },
              animatedStyle,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    borderRadius: 10,
  },
});

export default AnimatedStars;