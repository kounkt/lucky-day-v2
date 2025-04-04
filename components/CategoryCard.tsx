import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Briefcase, Coins } from 'lucide-react-native';
import { FortuneCategory } from '@/constants/fortunes';
import { useTheme } from '@/components/ThemeProvider';

interface CategoryCardProps {
  category: FortuneCategory;
  onPress: () => void;
  isAvailable: boolean;
}

const getCategoryInfo = (category: FortuneCategory) => {
  switch (category) {
    case 'love':
      return {
        title: '恋愛運',
        icon: Heart,
        colors: ['#e5a4cb', '#f8d7e7'] as [string, string],
      };
    case 'career':
      return {
        title: '仕事運',
        icon: Briefcase,
        colors: ['#7da9e2', '#d0e1f9'] as [string, string],
      };
    case 'wealth':
      return {
        title: '金運',
        icon: Coins,
        colors: ['#a4e5b9', '#d8f5e1'] as [string, string],
      };
  }
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress, isAvailable }) => {
  const { colors } = useTheme();
  const { title, icon: Icon, colors: gradientColors } = getCategoryInfo(category);
  const disabledColors: [string, string] = ['#e0e0e0', '#f0f0f0'];

  // スタイルをテーマに基づいて更新
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      disabled={!isAvailable}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={isAvailable ? gradientColors : disabledColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Icon 
            size={32} 
            color={isAvailable ? colors.white : colors.gray} 
            style={styles.icon} 
          />
          <Text style={[styles.title, !isAvailable && styles.disabledText]}>
            {title}
          </Text>
          {!isAvailable && (
            <Text style={styles.unavailableText}>
              明日また占えます
            </Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  disabledText: {
    color: colors.gray,
    textShadowColor: 'transparent',
  },
  unavailableText: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
});

export default CategoryCard;