import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { format } from 'date-fns';
import { ChevronRight, Star } from 'lucide-react-native';
import { FortuneReading } from '@/types/fortune';
import { useTheme } from '@/components/ThemeProvider';

interface HistoryCardProps {
  fortune: FortuneReading;
  onPress: () => void;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'love':
      return '#e5a4cb';
    case 'career':
      return '#7da9e2';
    case 'wealth':
      return '#a4e5b9';
    default:
      return '#e2c87d';
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

const HistoryCard: React.FC<HistoryCardProps> = ({ fortune, onPress }) => {
  const { colors } = useTheme();
  const categoryColor = getCategoryColor(fortune.category);
  
  // スタイルをテーマに基づいて更新
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.category}>
            {getCategoryName(fortune.category)}
          </Text>
          <Text style={styles.date}>
            {format(new Date(fortune.date), 'yyyy年M月d日')}
          </Text>
        </View>
        
        <Text style={styles.message} numberOfLines={2}>
          {fortune.message}
        </Text>
        
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < fortune.rating ? categoryColor : 'none'}
              color={i < fortune.rating ? categoryColor : colors.lightGray}
              style={styles.star}
            />
          ))}
        </View>
      </View>
      
      <ChevronRight size={20} color={colors.gray} />
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIndicator: {
    width: 4,
    height: '80%',
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
  },
  message: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
});

export default HistoryCard;