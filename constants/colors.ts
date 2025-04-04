// テーマカラーの定義
export type ThemeColors = {
  primary: string;
  primaryLight: string;
  secondary: string;
  secondaryLight: string;
  background: string;
  backgroundDark: string;
  card: string;
  text: string;
  textLight: string;
  textSecondary: string;
  love: string;
  career: string;
  wealth: string;
  white: string;
  black: string;
  gray: string;
  lightGray: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  divider: string;
  overlay: string;
  shadow: string;
};

// ライトモードの色定義
export const lightColors: ThemeColors = {
  primary: '#e2c87d', // Gold
  primaryLight: '#f5e7c1',
  secondary: '#8a7eb5', // Lavender
  secondaryLight: '#c4bce0',
  background: '#faf7f2', // Ivory
  backgroundDark: '#f0ece0',
  card: '#ffffff',
  text: '#3a3238',
  textLight: '#6d6a75',
  textSecondary: '#8e8a95',
  love: '#e5a4cb', // Soft pink
  career: '#7da9e2', // Soft blue
  wealth: '#a4e5b9', // Soft green
  white: '#ffffff',
  black: '#000000',
  gray: '#9e9e9e',
  lightGray: '#e0e0e0',
  error: '#d32f2f',
  success: '#2e7d32',
  warning: '#ed6c02',
  info: '#0288d1',
  divider: '#e0e0e0',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// ダークモードの色定義
export const darkColors: ThemeColors = {
  primary: '#d4b45e', // Darker Gold
  primaryLight: '#8c7a3f',
  secondary: '#6a5e9a', // Darker Lavender
  secondaryLight: '#4a4169',
  background: '#121212', // Dark background
  backgroundDark: '#1e1e1e',
  card: '#1e1e1e',
  text: '#e0e0e0',
  textLight: '#b0b0b0',
  textSecondary: '#909090',
  love: '#c27ba0', // Darker pink
  career: '#5a7cb2', // Darker blue
  wealth: '#6fb17e', // Darker green
  white: '#ffffff',
  black: '#000000',
  gray: '#757575',
  lightGray: '#424242',
  error: '#ef5350',
  success: '#66bb6a',
  warning: '#ffa726',
  info: '#42a5f5',
  divider: '#424242',
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

// 色名から色コードへの変換マップ
export const colorNameToCode: Record<string, { light: string; dark: string }> = {
  // 基本色
  "ローズゴールド": { light: "#b76e79", dark: "#c27b86" },
  "ラベンダー": { light: "#e6e6fa", dark: "#9d9bc6" },
  "パールホワイト": { light: "#f5f5f5", dark: "#d0d0d0" },
  "ソフトピンク": { light: "#ffc0cb", dark: "#c48f97" },
  "コーラル": { light: "#ff7f50", dark: "#c66642" },
  "ブラッシュ": { light: "#de5d83", dark: "#b54a69" },
  "シャンパン": { light: "#f7e7ce", dark: "#c4b8a3" },
  "モーブ": { light: "#e0b0ff", dark: "#b38cc8" },
  "ミント": { light: "#98fb98", dark: "#7ac97a" },
  "スカイブルー": { light: "#87ceeb", dark: "#6ca5bc" },
  "ロイヤルブルー": { light: "#4169e1", dark: "#3457b3" },
  "シルバー": { light: "#c0c0c0", dark: "#9a9a9a" },
  "ネイビー": { light: "#000080", dark: "#000066" },
  "エメラルド": { light: "#50c878", dark: "#40a060" },
  "チャコール": { light: "#36454f", dark: "#2a3640" },
  "バーガンディ": { light: "#800020", dark: "#66001a" },
  "ティール": { light: "#008080", dark: "#006666" },
  "スレートグレー": { light: "#708090", dark: "#5a6673" },
  "ディープパープル": { light: "#483d8b", dark: "#3a316f" },
  "フォレストグリーン": { light: "#228b22", dark: "#1b6f1b" },
  "ゴールド": { light: "#ffd700", dark: "#ccac00" },
  "エメラルドグリーン": { light: "#50c878", dark: "#40a060" },
  "アンバー": { light: "#ffbf00", dark: "#cc9900" },
  "カッパー": { light: "#b87333", dark: "#935c29" },
  "ジェイド": { light: "#00a86b", dark: "#008656" },
  "サファイア": { light: "#0f52ba", dark: "#0c4295" },
  "ブロンズ": { light: "#cd7f32", dark: "#a46628" },
  "ターコイズ": { light: "#40e0d0", dark: "#33b3a6" },
  "プラチナ": { light: "#e5e4e2", dark: "#b7b6b5" },
  "オリーブグリーン": { light: "#bab86c", dark: "#959356" },
  // デフォルト色（マッチしない場合）
  "デフォルト": { light: "#a9a9a9", dark: "#878787" }
};

// 色名から色コードを取得する関数
export const getColorCode = (colorName: string, isDark: boolean = false): string => {
  // 完全一致を試みる
  if (colorNameToCode[colorName]) {
    return isDark ? colorNameToCode[colorName].dark : colorNameToCode[colorName].light;
  }
  
  // 部分一致を試みる
  for (const [name, codes] of Object.entries(colorNameToCode)) {
    if (colorName.includes(name)) {
      return isDark ? codes.dark : codes.light;
    }
  }
  
  // マッチしない場合はデフォルト色を返す
  return isDark ? colorNameToCode["デフォルト"].dark : colorNameToCode["デフォルト"].light;
};

export default lightColors;