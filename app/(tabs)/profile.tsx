import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Alert, 
  Platform,
  Switch,
  Image,
  ActivityIndicator
} from 'react-native';
import { User, Bell, Trash2 } from 'lucide-react-native';
import { useFortuneStore } from '@/store/fortune-store';
import { useTheme } from '@/components/ThemeProvider';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const { history, clearHistory } = useFortuneStore();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("天体の探求者");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // スタイルをテーマに基づいて更新
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  
  // プロフィール画像の読み込み
  React.useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedImage = await AsyncStorage.getItem('profile_image');
        const savedUsername = await AsyncStorage.getItem('profile_username');
        const savedNotifications = await AsyncStorage.getItem('notifications_enabled');
        
        if (savedImage) setProfileImage(savedImage);
        if (savedUsername) setUsername(savedUsername);
        if (savedNotifications) setNotificationsEnabled(savedNotifications === 'true');
      } catch (error) {
        console.error('プロフィールデータの読み込みエラー:', error);
      }
    };
    
    loadProfileData();
  }, []);
  
  const fortuneCount = React.useMemo(() => {
    let count = 0;
    Object.values(history).forEach(day => {
      count += Object.keys(day).length;
    });
    return count;
  }, [history]);
  
  const handleClearHistory = () => {
    if (Platform.OS !== 'web' as any) {
      Alert.alert(
        '履歴のクリア',
        '運勢履歴をクリアしますか？この操作は元に戻せません。',
        [
          { text: 'キャンセル', style: 'cancel' },
          { 
            text: 'クリア', 
            style: 'destructive',
            onPress: () => {
              if (Platform.OS !== 'web' as any) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
              clearHistory();
              Alert.alert('成功', '履歴が正常にクリアされました');
            }
          }
        ]
      );
    } else {
      // Web環境の場合
      if (confirm('運勢履歴をクリアしますか？この操作は元に戻せません。')) {
        clearHistory();
        alert('履歴が正常にクリアされました');
      }
    }
  };
  
  const handleToggleNotifications = () => {
    if (Platform.OS !== 'web' as any) {
      Haptics.selectionAsync();
    }
    setNotificationsEnabled(!notificationsEnabled);
    AsyncStorage.setItem('notifications_enabled', (!notificationsEnabled).toString());
  };
  
  const handlePickImage = async () => {
    if (Platform.OS === 'web' as any) {
      alert('この機能はモバイルデバイスでのみ利用可能です');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 権限の確認
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('権限が必要です', '画像を選択するには写真へのアクセス権限が必要です。');
        setIsLoading(false);
        return;
      }
      
      // 画像の選択
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0].uri;
        setProfileImage(selectedImage);
        await AsyncStorage.setItem('profile_image', selectedImage);
        
        if (Platform.OS !== 'web' as any) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.error('画像選択エラー:', error);
      Alert.alert('エラー', '画像の選択中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(40, insets.bottom + 20) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={handlePickImage}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <User size={40} color={colors.white} />
            )}
            <View style={styles.cameraIconContainer}>
              <Bell size={16} color={colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.subtitle}>あなたの宇宙の旅が待っています</Text>
        </View>
        
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>運勢統計</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{fortuneCount}</Text>
              <Text style={styles.statLabel}>総占い回数</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Object.keys(history).length}</Text>
              <Text style={styles.statLabel}>アクティブ日数</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>設定</Text>
        
        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={[styles.settingIconContainer, { backgroundColor: colors.career + '20' }]}>
              <Bell size={20} color={colors.career} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>通知</Text>
              <Text style={styles.settingDescription}>毎日の運勢をお知らせ</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.lightGray, true: colors.career }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.lightGray}
            />
          </View>
          
          <View style={styles.settingDivider} />
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleClearHistory}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: '#ffebee' }]}>
              <Trash2 size={20} color={colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>履歴をクリア</Text>
              <Text style={styles.settingDescription}>すべての運勢履歴を削除する</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>天体運勢 v1.0.0</Text>
          <Text style={styles.footerText}>星に導かれて ✨</Text>
        </View>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.secondary,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  username: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: colors.divider,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  settingsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 56,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
});