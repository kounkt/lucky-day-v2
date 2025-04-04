import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';
import { FortuneReading } from '@/types/fortune';
import { useTheme } from '@/components/ThemeProvider';
import { getColorCode } from '@/constants/colors';

interface FortuneCardProps {
  fortune: FortuneReading;
}

const getCategoryColors = (category: string): [string, string] => {
  switch (category) {
    case 'love':
      return ['#e5a4cb', '#f8d7e7'];
    case 'career':
      return ['#7da9e2', '#d0e1f9'];
    case 'wealth':
      return ['#a4e5b9', '#d8f5e1'];
    default:
      return ['#e2c87d', '#f5e7c1'];
  }
};

const getCategoryName = (category: string): string => {
  switch (category) {
    case 'love':
      return '恋愛運';
    case 'career':
      return '仕事運';
    case 'wealth':
      return '金運';
    default:
      return '';
  }
};

const FortuneCard: React.FC<FortuneCardProps> = ({ fortune }) => {
  const { colors } = useTheme();
  const gradientColors = getCategoryColors(fortune.category);
  const colorCode = getColorCode(fortune.luckyColor);
  
  // スタイルをテーマに基づいて更新
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.categoryTitle}>
          {getCategoryName(fortune.category)}
        </Text>
        <View style={styles.starsContainer}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              fill={i < fortune.rating ? colors.white : 'none'}
              color={colors.white}
              style={styles.star}
            />
          ))}
        </View>
      </LinearGradient>
      
      <View style={styles.content}>
        <Text style={styles.message}>{fortune.message}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>アドバイス:</Text>
          <Text style={styles.value}>{fortune.advice}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>ラッキーカラー:</Text>
          <View style={styles.colorContainer}>
            <View 
              style={[
                styles.colorSwatch, 
                { backgroundColor: colorCode }
              ]} 
            />
            <Text style={styles.value}>{fortune.luckyColor}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.card,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginHorizontal: 2,
  },
  content: {
    padding: 20,
    backgroundColor: colors.card,
  },
  message: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
    width: 120,
  },
  value: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.divider,
  },
});

export default FortuneCard;