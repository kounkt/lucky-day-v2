import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Platform, Share, Alert, View } from 'react-native';
import { Share2, Download, Check } from 'lucide-react-native';
import { FortuneReading } from '@/types/fortune';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import { captureRef } from 'react-native-view-shot';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/components/ThemeProvider';

interface ShareButtonProps {
  fortune: FortuneReading;
  fortuneRef?: React.RefObject<View>;
}

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

const ShareButton: React.FC<ShareButtonProps> = ({ fortune, fortuneRef }) => {
  const { colors } = useTheme();
  const [copied, setCopied] = useState(false);
  
  // スタイルをテーマに基づいて更新
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  
  // メッセージを作成する関数
  const createShareMessage = () => {
    return `
🌟 今日の${getCategoryName(fortune.category)}占い 🌟

${fortune.message}

✨ アドバイス: ${fortune.advice}
🎨 ラッキーカラー: ${fortune.luckyColor}
⭐ 運勢: ${'★'.repeat(fortune.rating)}${'☆'.repeat(5 - fortune.rating)}

#天体運勢 #今日の運勢
    `;
  };

  const handleShare = async () => {
    const shareMessage = createShareMessage();

    try {
      if (Platform.OS !== 'web' as any) {
        // ハプティックフィードバック
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        // ネイティブプラットフォーム用
        try {
          await Share.share({
            message: shareMessage,
            title: '今日の天体運勢',
          });
        } catch (error) {
          // シェアが失敗した場合はクリップボードにコピー
          await Clipboard.setStringAsync(shareMessage);
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
          
          if (Platform.OS !== 'web' as any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      } else {
        try {
          // クリップボードにコピーする（Webでの共有APIの代替）
          await Clipboard.setStringAsync(shareMessage);
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
          
          // Web版でのフィードバック強化
          if (Platform.OS === 'web' as any) {
            // Web版では通知を表示（オプション）
            try {
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('運勢をコピーしました', {
                  body: 'クリップボードに運勢がコピーされました。SNSで共有してみましょう！',
                  icon: '/favicon.png'
                });
              }
            } catch (e) {
              console.log('通知機能は利用できません');
            }
          }
        } catch (error) {
          console.error('Web共有エラー:', error);
          // エラーが発生した場合もクリップボードにコピー
          await Clipboard.setStringAsync(shareMessage);
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        }
      }
    } catch (error) {
      console.error('シェアエラー:', error);
      Alert.alert(
        'シェアに失敗しました',
        'クリップボードにコピーします。',
        [
          {
            text: 'OK',
            onPress: async () => {
              await Clipboard.setStringAsync(shareMessage);
              setCopied(true);
              setTimeout(() => setCopied(false), 3000);
            }
          }
        ]
      );
    }
  };

  const handleSaveImage = async () => {
    if (!fortuneRef?.current) {
      Alert.alert('エラー', '画像を保存できませんでした。');
      return;
    }

    try {
      if (Platform.OS !== 'web' as any) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      // ViewをキャプチャしてURI形式で保存
      const uri = await captureRef(fortuneRef, {
        format: 'png',
        quality: 0.8,
      });

      if (Platform.OS !== 'web' as any) {
        // ネイティブの場合はファイルシステムに保存
        const fileName = `fortune-${fortune.category}-${fortune.date}.png`;
        const newUri = FileSystem.documentDirectory + fileName;
        
        await FileSystem.copyAsync({
          from: uri,
          to: newUri
        });
        
        Alert.alert(
          '画像を保存しました',
          'デバイスのフォトライブラリに保存されました。'
        );
      } else {
        // Webの場合はダウンロードリンクを作成
        const link = document.createElement('a');
        link.href = uri;
        link.download = `fortune-${fortune.category}-${fortune.date}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Alert.alert('成功', '画像が保存されました');
      }
    } catch (error) {
      console.error('画像保存エラー:', error);
      Alert.alert('エラー', '画像の保存に失敗しました。');
    }
  };

  return (
    <View style={styles.buttonsContainer}>
      <TouchableOpacity 
        style={[styles.button, copied && styles.copiedButton]} 
        onPress={handleShare} 
        activeOpacity={0.8}
      >
        {copied ? (
          <>
            <Check size={20} color={colors.white} style={styles.icon} />
            <Text style={styles.text}>運勢をコピーしました！</Text>
          </>
        ) : (
          <>
            <Share2 size={20} color={colors.white} style={styles.icon} />
            <Text style={styles.text}>運勢をシェアする</Text>
          </>
        )}
      </TouchableOpacity>
      
      {/* Webでは画像保存ボタンを非表示にする - findDOMNode警告を回避 */}
      {Platform.OS !== 'web' as any && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveImage} activeOpacity={0.8}>
          <Download size={20} color={colors.white} style={styles.icon} />
          <Text style={styles.text}>画像を保存</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.shareHintContainer}>
        <Text style={styles.shareHintText}>
          ✨ {Platform.OS === 'web' as any 
            ? "運勢をコピーしてSNSでシェアしてみよう！" 
            : "運勢をスクショしてSNSでシェアしてね"} ✨
        </Text>
      </View>
      
      {copied && Platform.OS === 'web' as any && (
        <View style={styles.webCopiedFeedback}>
          <Check size={16} color={colors.success} style={styles.smallIcon} />
          <Text style={styles.webCopiedText}>
            クリップボードにコピーしました！SNSに貼り付けてシェアしましょう
          </Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  buttonsContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    maxWidth: 250,
  },
  copiedButton: {
    backgroundColor: colors.success,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.career,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    maxWidth: 250,
  },
  icon: {
    marginRight: 8,
  },
  smallIcon: {
    marginRight: 4,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  shareHintContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.primaryLight + '40',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + '30',
    width: '100%',
    maxWidth: 300,
  },
  shareHintText: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  webCopiedFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success + '20',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    maxWidth: 300,
  },
  webCopiedText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ShareButton;