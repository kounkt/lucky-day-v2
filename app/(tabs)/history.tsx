import React, { useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { Search } from 'lucide-react-native';
import HistoryCard from '@/components/HistoryCard';
import { useFortuneStore } from '@/store/fortune-store';
import { FortuneReading } from '@/types/fortune';
import { useTheme } from '@/components/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const router = useRouter();
  const { history } = useFortuneStore();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);
  
  // スタイルをテーマに基づいて更新
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  
  const allFortunes = useMemo(() => {
    const fortunes: FortuneReading[] = [];
    
    Object.entries(history).forEach(([date, categories]) => {
      Object.values(categories).forEach((fortune) => {
        if (fortune) {
          fortunes.push(fortune);
        }
      });
    });
    
    return fortunes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [history]);
  
  const groupedFortunes = useMemo(() => {
    const grouped: { [key: string]: FortuneReading[] } = {
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
      older: [],
    };
    
    allFortunes.forEach((fortune) => {
      const fortuneDate = new Date(fortune.date);
      
      if (isToday(fortuneDate)) {
        grouped.today.push(fortune);
      } else if (isYesterday(fortuneDate)) {
        grouped.yesterday.push(fortune);
      } else if (isThisWeek(fortuneDate)) {
        grouped.thisWeek.push(fortune);
      } else if (isThisMonth(fortuneDate)) {
        grouped.thisMonth.push(fortune);
      } else {
        grouped.older.push(fortune);
      }
    });
    
    return grouped;
  }, [allFortunes]);
  
  const sections = useMemo(() => {
    return [
      { title: '今日', data: groupedFortunes.today },
      { title: '昨日', data: groupedFortunes.yesterday },
      { title: '今週', data: groupedFortunes.thisWeek },
      { title: '今月', data: groupedFortunes.thisMonth },
      { title: '過去', data: groupedFortunes.older },
    ].filter(section => section.data.length > 0);
  }, [groupedFortunes]);
  
  const handleFortunePress = (fortune: FortuneReading) => {
    router.push(`/fortune-details/${fortune.id}`);
  };
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // 実際のデータ更新はないが、リフレッシュ感を出すために少し待つ
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  if (allFortunes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Search size={48} color={colors.textLight} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>運勢履歴がありません</Text>
          <Text style={styles.emptyText}>
            最初の運勢を占った後、ここに履歴が表示されます。
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.title}
        renderItem={({ item: section }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.data.map((fortune) => (
              <HistoryCard
                key={fortune.id}
                fortune={fortune}
                onPress={() => handleFortunePress(fortune)}
              />
            ))}
          </View>
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(40, insets.bottom + 20) }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.card}
          />
        }
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
});