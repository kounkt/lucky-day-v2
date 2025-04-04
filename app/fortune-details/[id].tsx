import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform,
  Animated
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FortuneCard from '@/components/FortuneCard';
import ShareButton from '@/components/ShareButton';
import AnimatedStars from '@/components/AnimatedStars';
import { useFortuneStore } from '@/store/fortune-store';
import { FortuneReading } from '@/types/fortune';
import { useTheme } from '@/components/ThemeProvider';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FortuneDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { history } = useFortuneStore();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [fortune, setFortune] = useState<FortuneReading | null>(null);
  const fortuneCardRef = useRef<View>(null);
  
  // アニメーション用の値
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // スタイルをテーマに基づいて更新
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    if (!id) {
      router.back();
      return;
    }

    // Find the fortune with the given ID
    let foundFortune: FortuneReading | null = null;
    
    Object.values(history).forEach(day => {
      Object.values(day).forEach(f => {
        if (f && f.id === id) {
          foundFortune = f;
        }
      });
    });
    
    if (foundFortune) {
      setFortune(foundFortune);
      
      // アニメーションを開始
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      router.back();
    }
  }, [id, history]);

  const getCategoryColors = (category?: string): [string, string] => {
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

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      
      <AnimatedStars />
      
      <LinearGradient
        colors={getCategoryColors(fortune?.category)}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
        style={[styles.gradientHeader, { paddingTop: insets.top }]}
      >
        <TouchableOpacity 
          style={[styles.backButton, { top: insets.top + 10 }]}
          onPress={handleBack}
        >
          <ArrowLeft size={24} color={colors.white} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {fortune?.category ? getCategoryName(fortune.category) : ''} 運勢
        </Text>
        
        <Text style={styles.headerDate}>
          {fortune?.date ? formatDate(fortune.date) : ''}
        </Text>
      </LinearGradient>
      
      <View style={styles.content}>
        {fortune && (
          <Animated.View 
            style={[
              styles.fortuneContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View ref={fortuneCardRef} collapsable={false}>
              <FortuneCard fortune={fortune} />
            </View>
            
            <View style={styles.actionsContainer}>
              <ShareButton 
                fortune={fortune}
                fortuneRef={fortuneCardRef}
              />
            </View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

// 日付をフォーマットする関数
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

// カテゴリー名を日本語に変換する関数
function getCategoryName(category: string): string {
  switch (category) {
    case 'love':
      return '恋愛';
    case 'career':
      return '仕事';
    case 'wealth':
      return '金運';
    default:
      return '';
  }
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradientHeader: {
    height: 180,
    justifyContent: 'flex-end',
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerDate: {
    fontSize: 16,
    color: colors.white,
    marginTop: 4,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    marginTop: -30,
    paddingHorizontal: 20,
  },
  fortuneContainer: {
    flex: 1,
    paddingBottom: 24,
  },
  actionsContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
});