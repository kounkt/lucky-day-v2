import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Platform } from 'react-native';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import CategoryCard from '@/components/CategoryCard';
import AnimatedStars from '@/components/AnimatedStars';
import { useFortuneStore } from '@/store/fortune-store';
import { FortuneCategory } from '@/constants/fortunes';
import { useTheme } from '@/components/ThemeProvider';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { hasReadToday, readFortune } = useFortuneStore();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const today = format(new Date(), 'EEEE, MMMM d');

  const handleCategoryPress = (category: FortuneCategory) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    readFortune(category);
    router.push(`/fortune/${category}`);
  };

  // スタイルをテーマに基づいて更新
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedStars />
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(40, insets.bottom + 20) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.date}>{today}</Text>
          <Text style={styles.title}>今日の天体運勢</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.welcomeCard}>
          <Sparkles size={24} color={colors.primary} style={styles.sparkleIcon} />
          <Text style={styles.welcomeText}>
            今日の天体エネルギーがあなたに何をもたらすか発見しましょう。
            カテゴリーを選んで、神秘的なガイダンスを受け取ってください。
          </Text>
        </View>

        <Text style={styles.sectionTitle}>運勢を選択</Text>
        
        <CategoryCard 
          category="love" 
          onPress={() => handleCategoryPress('love')}
          isAvailable={!hasReadToday('love')}
        />
        
        <CategoryCard 
          category="career" 
          onPress={() => handleCategoryPress('career')}
          isAvailable={!hasReadToday('career')}
        />
        
        <CategoryCard 
          category="wealth" 
          onPress={() => handleCategoryPress('wealth')}
          isAvailable={!hasReadToday('wealth')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  date: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  welcomeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  sparkleIcon: {
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
});