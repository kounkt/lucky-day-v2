export type FortuneCategory = 'love' | 'career' | 'wealth';

export interface Fortune {
  message: string;
  advice: string;
  luckyColor: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

export const fortunes: Record<FortuneCategory, Fortune[]> = {
  love: [
    {
      message: "今日はあなたの周りに愛が溢れています。心を開いて受け入れましょう。",
      advice: "大切な人に気持ちを伝えてみましょう。",
      luckyColor: "ローズゴールド",
      rating: 5
    },
    {
      message: "思いがけない場所で意味のある出会いが待っています。",
      advice: "新しい社交の場に積極的に参加しましょう。",
      luckyColor: "ラベンダー",
      rating: 4
    },
    {
      message: "過去の関係から学んだ教訓が、未来の関係に役立ちます。",
      advice: "パートナーに何を求めているか振り返りましょう。",
      luckyColor: "パールホワイト",
      rating: 3
    },
    {
      message: "あなたの心は与えることと受け取ることのバランスを求めています。",
      advice: "人間関係に健全な境界線を設けましょう。",
      luckyColor: "ソフトピンク",
      rating: 4
    },
    {
      message: "自己発見の時期が、あなたの人間関係を強化します。",
      advice: "自分自身のニーズを大切にする時間を取りましょう。",
      luckyColor: "コーラル",
      rating: 3
    },
    {
      message: "真の愛には忍耐が必要です。神聖なタイミングを信じましょう。",
      advice: "愛を待ちながら、自己成長に集中しましょう。",
      luckyColor: "ブラッシュ",
      rating: 2
    },
    {
      message: "あなたの輝くエネルギーが今日、多くの人を惹きつけます。",
      advice: "すべての交流で自分らしさを大切にしましょう。",
      luckyColor: "シャンパン",
      rating: 5
    },
    {
      message: "ある関係がまもなく重要な転機を迎えるでしょう。",
      advice: "決断をする際は直感を信じましょう。",
      luckyColor: "モーブ",
      rating: 3
    },
    {
      message: "古い傷を癒すことで、新しい愛のための場所が生まれます。",
      advice: "特に自分自身に対して、許しの心を持ちましょう。",
      luckyColor: "ミント",
      rating: 4
    },
    {
      message: "あなたのソウルメイトは思っているより近くにいるかもしれません。",
      advice: "常にあなたをサポートしてくれる人に注目しましょう。",
      luckyColor: "スカイブルー",
      rating: 5
    }
  ],
  career: [
    {
      message: "あなたの創造的な才能が影響力のある人に認められるでしょう。",
      advice: "会議では自信を持ってアイデアを共有しましょう。",
      luckyColor: "ロイヤルブルー",
      rating: 5
    },
    {
      message: "困難なプロジェクトがあなたの独自の能力を引き立てるでしょう。",
      advice: "困難を成長の機会として受け入れましょう。",
      luckyColor: "シルバー",
      rating: 4
    },
    {
      message: "ネットワーキングの努力がまもなく価値ある人脈をもたらします。",
      advice: "新しい連絡先にすぐにフォローアップしましょう。",
      luckyColor: "ネイビー",
      rating: 4
    },
    {
      message: "持続可能な成功のために、野心と健康のバランスを取りましょう。",
      advice: "集中的な作業中は定期的に休憩を取りましょう。",
      luckyColor: "エメラルド",
      rating: 3
    },
    {
      message: "メンターが重要な瞬間にガイダンスを提供するでしょう。",
      advice: "建設的なフィードバックを受け入れる姿勢を持ちましょう。",
      luckyColor: "チャコール",
      rating: 4
    },
    {
      message: "あなたの勤勉さが将来の報酬のための基盤を築いています。",
      advice: "日々の習慣に一貫性を保ちましょう。",
      luckyColor: "バーガンディ",
      rating: 3
    },
    {
      message: "予期せぬ機会があなたの真の目的と一致するでしょう。",
      advice: "考えていなかった道にも心を開きましょう。",
      luckyColor: "ティール",
      rating: 5
    },
    {
      message: "学びの期間が次の成果の前に訪れます。",
      advice: "新しいスキルの開発に時間を投資しましょう。",
      luckyColor: "スレートグレー",
      rating: 3
    },
    {
      message: "あなたのリーダーシップの資質がまもなく求められるでしょう。",
      advice: "必要な時には自信を持って前に進みましょう。",
      luckyColor: "ディープパープル",
      rating: 4
    },
    {
      message: "経済的な報酬が予期せぬ経路からもたらされます。",
      advice: "代替収入の機会を探りましょう。",
      luckyColor: "フォレストグリーン",
      rating: 5
    }
  ],
  wealth: [
    {
      message: "あなたの価値観と一致するとき、豊かさがあなたに流れ込みます。",
      advice: "あなたの原則を尊重する財政的決断をしましょう。",
      luckyColor: "ゴールド",
      rating: 5
    },
    {
      message: "今、慎重な投資が将来の繁栄をもたらすでしょう。",
      advice: "リソースを投入する前に徹底的に調査しましょう。",
      luckyColor: "エメラルドグリーン",
      rating: 4
    },
    {
      message: "予期せぬ経済的利益があなたの地平線に現れています。",
      advice: "他の人が見逃すかもしれない機会に注意を払いましょう。",
      luckyColor: "アンバー",
      rating: 5
    },
    {
      message: "あなたの創意工夫が驚くべき方法で富を生み出します。",
      advice: "財政的課題に創造的な解決策を探しましょう。",
      luckyColor: "カッパー",
      rating: 3
    },
    {
      message: "寛大さがあなたの人生に繁栄をもたらします。",
      advice: "小さな方法でも、あなたの豊かさを分かち合いましょう。",
      luckyColor: "ジェイド",
      rating: 4
    },
    {
      message: "アプローチをシンプルにすることで、財政的な明確さが得られます。",
      advice: "より良い管理のために財政を整理しましょう。",
      luckyColor: "サファイア",
      rating: 3
    },
    {
      message: "長期投資への忍耐は報われるでしょう。",
      advice: "即座の経済的満足を求める衝動に抵抗しましょう。",
      luckyColor: "ブロンズ",
      rating: 3
    },
    {
      message: "経済的な負担がまもなくあなたの肩から取り除かれるでしょう。",
      advice: "必要な時にリソースが届くと信じましょう。",
      luckyColor: "ターコイズ",
      rating: 4
    },
    {
      message: "あなたの実践的な知恵が繁栄を引き寄せます。",
      advice: "金銭問題では直感を信頼しましょう。",
      luckyColor: "プラチナ",
      rating: 5
    },
    {
      message: "複数の収入源があなたの人生に形成されています。",
      advice: "経済的関心を多様化させましょう。",
      luckyColor: "オリーブグリーン",
      rating: 4
    }
  ]
};