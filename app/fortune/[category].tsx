import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  Platform,
  Animated
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FortuneCard from '@/components/FortuneCard';
import ShareButton from '@/components/ShareButton';
import AnimatedStars from '@/components/AnimatedStars';
import { useFortuneStore } from '@/store/fortune-store';
import { FortuneCategory } from '@/constants/fortunes';
import { useTheme } from '@/components/ThemeProvider';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FortuneScreen() {
  const { category } = useLocalSearchParams<{ category: FortuneCategory }>();
  const router = useRouter();
  const { currentFortune, readFortune } = useFortuneStore();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const fortuneCardRef = useRef<View>(null);
  
  // アニメーション用の値
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // スタイルをテーマに基づいて更新
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    if (!category || !['love', 'career', 'wealth'].includes(category)) {
      router.replace('/');
      return;
    }

    if (!currentFortune || currentFortune.category !== category) {
      readFortune(category);
    }
    
    // Simulate loading for effect
    const timer = setTimeout(() => {
      setLoading(false);
      
      // ローディング完了後にアニメーションを開始
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        })
      ]).start();
      
      // ハプティックフィードバック
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [category]);

  const getCategoryColors = (): [string, string] => {
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

  const handleBackToHome = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.replace('/');
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
        colors={getCategoryColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
        style={[styles.gradientHeader, { paddingTop: insets.top }]}
      >
        <TouchableOpacity 
          style={[styles.backButton, { top: insets.top + 10 }]}
          onPress={handleBackToHome}
        >
          <ArrowLeft size={24} color={colors.white} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          あなたの{category ? getCategoryName(category) : ''}運勢
        </Text>
      </LinearGradient>
      
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>天体の配置を読み取っています...</Text>
          </View>
        ) : (
          <>
            {currentFortune && (
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
                  <FortuneCard fortune={currentFortune} />
                </View>
                
                <View style={styles.actionsContainer}>
                  <ShareButton 
                    fortune={currentFortune} 
                    fortuneRef={fortuneCardRef}
                  />
                  
                  <TouchableOpacity 
                    style={styles.homeButton}
                    onPress={handleBackToHome}
                  >
                    <Text style={styles.homeButtonText}>ホームに戻る</Text>
                    <ArrowRight size={18} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// カテゴリー名を日本語に変換する関数
function getCategoryName(category: FortuneCategory): string {
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
  content: {
    flex: 1,
    marginTop: -30,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textLight,
  },
  fortuneContainer: {
    flex: 1,
    paddingBottom: 24,
  },
  actionsContainer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 16,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  homeButtonText: {
    fontSize: 16,
    color: colors.text,
    marginRight: 4,
  },
});