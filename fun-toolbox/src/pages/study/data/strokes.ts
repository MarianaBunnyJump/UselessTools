/* ===================== 常用字速查表（练字卡） =====================
 * 条目：字 → 拼音 / 笔画数 / 部首 / 结构
 * 首批收录 96 个高频字（覆盖练字启蒙主力），未收录的字自动回退
 * 到拼音库（pinyin-pro），笔画部首显示「待补充」。扩表直接加行。
 */

export interface StrokeInfo {
  py: string
  strokes: number
  radical: string
  structure: string
}

export const STROKE_TABLE: Record<string, StrokeInfo> = {
  永: { py: 'yǒng', strokes: 5, radical: '水', structure: '独体字' },
  我: { py: 'wǒ', strokes: 7, radical: '戈', structure: '左右' },
  你: { py: 'nǐ', strokes: 7, radical: '亻', structure: '左右' },
  他: { py: 'tā', strokes: 5, radical: '亻', structure: '左右' },
  她: { py: 'tā', strokes: 6, radical: '女', structure: '左右' },
  的: { py: 'de', strokes: 8, radical: '白', structure: '左右' },
  了: { py: 'le', strokes: 2, radical: '乙', structure: '独体字' },
  在: { py: 'zài', strokes: 6, radical: '土', structure: '半包围' },
  是: { py: 'shì', strokes: 9, radical: '日', structure: '上下' },
  有: { py: 'yǒu', strokes: 6, radical: '月', structure: '半包围' },
  人: { py: 'rén', strokes: 2, radical: '人', structure: '独体字' },
  大: { py: 'dà', strokes: 3, radical: '大', structure: '独体字' },
  小: { py: 'xiǎo', strokes: 3, radical: '小', structure: '独体字' },
  上: { py: 'shàng', strokes: 3, radical: '一', structure: '独体字' },
  下: { py: 'xià', strokes: 3, radical: '一', structure: '独体字' },
  中: { py: 'zhōng', strokes: 4, radical: '丨', structure: '独体字' },
  天: { py: 'tiān', strokes: 4, radical: '大', structure: '独体字' },
  地: { py: 'dì', strokes: 6, radical: '土', structure: '左右' },
  日: { py: 'rì', strokes: 4, radical: '日', structure: '独体字' },
  月: { py: 'yuè', strokes: 4, radical: '月', structure: '独体字' },
  水: { py: 'shuǐ', strokes: 4, radical: '水', structure: '独体字' },
  火: { py: 'huǒ', strokes: 4, radical: '火', structure: '独体字' },
  山: { py: 'shān', strokes: 3, radical: '山', structure: '独体字' },
  木: { py: 'mù', strokes: 4, radical: '木', structure: '独体字' },
  金: { py: 'jīn', strokes: 8, radical: '金', structure: '上下' },
  土: { py: 'tǔ', strokes: 3, radical: '土', structure: '独体字' },
  心: { py: 'xīn', strokes: 4, radical: '心', structure: '独体字' },
  手: { py: 'shǒu', strokes: 4, radical: '手', structure: '独体字' },
  口: { py: 'kǒu', strokes: 3, radical: '口', structure: '独体字' },
  目: { py: 'mù', strokes: 5, radical: '目', structure: '独体字' },
  耳: { py: 'ěr', strokes: 6, radical: '耳', structure: '独体字' },
  足: { py: 'zú', strokes: 7, radical: '足', structure: '上下' },
  车: { py: 'chē', strokes: 4, radical: '车', structure: '独体字' },
 马: { py: 'mǎ', strokes: 3, radical: '马', structure: '独体字' },
  鸟: { py: 'niǎo', strokes: 5, radical: '鸟', structure: '独体字' },
  鱼: { py: 'yú', strokes: 8, radical: '鱼', structure: '上下' },
  虫: { py: 'chóng', strokes: 6, radical: '虫', structure: '独体字' },
  花: { py: 'huā', strokes: 7, radical: '艹', structure: '上下' },
  草: { py: 'cǎo', strokes: 9, radical: '艹', structure: '上下' },
  树: { py: 'shù', strokes: 9, radical: '木', structure: '左中右' },
  叶: { py: 'yè', strokes: 5, radical: '口', structure: '左右' },
  风: { py: 'fēng', strokes: 4, radical: '风', structure: '半包围' },
  雨: { py: 'yǔ', strokes: 8, radical: '雨', structure: '独体字' },
  云: { py: 'yún', strokes: 4, radical: '二', structure: '独体字' },
  雪: { py: 'xuě', strokes: 11, radical: '雨', structure: '上下' },
  春: { py: 'chūn', strokes: 9, radical: '日', structure: '上下' },
  夏: { py: 'xià', strokes: 10, radical: '夂', structure: '上下' },
  秋: { py: 'qiū', strokes: 9, radical: '禾', structure: '左右' },
  冬: { py: 'dōng', strokes: 5, radical: '夂', structure: '上下' },
  学: { py: 'xué', strokes: 8, radical: '子', structure: '上下' },
  习: { py: 'xí', strokes: 3, radical: '乙', structure: '独体字' },
  书: { py: 'shū', strokes: 4, radical: '乙', structure: '独体字' },
  写: { py: 'xiě', strokes: 5, radical: '冖', structure: '上下' },
  字: { py: 'zì', strokes: 6, radical: '宀', structure: '上下' },
  读: { py: 'dú', strokes: 10, radical: '讠', structure: '左右' },
  好: { py: 'hǎo', strokes: 6, radical: '女', structure: '左右' },
  明: { py: 'míng', strokes: 8, radical: '日', structure: '左右' },
  白: { py: 'bái', strokes: 5, radical: '白', structure: '独体字' },
  红: { py: 'hóng', strokes: 6, radical: '纟', structure: '左右' },
  黑: { py: 'hēi', strokes: 12, radical: '黑', structure: '独体字' },
  高: { py: 'gāo', strokes: 10, radical: '高', structure: '上中下' },
  长: { py: 'cháng', strokes: 4, radical: '长', structure: '独体字' },
  短: { py: 'duǎn', strokes: 12, radical: '矢', structure: '左右' },
  多: { py: 'duō', strokes: 6, radical: '夕', structure: '上下' },
  少: { py: 'shǎo', strokes: 4, radical: '小', structure: '上下' },
  前: { py: 'qián', strokes: 9, radical: '刂', structure: '上下' },
  后: { py: 'hòu', strokes: 6, radical: '口', structure: '半包围' },
  左: { py: 'zuǒ', strokes: 5, radical: '工', structure: '半包围' },
  右: { py: 'yòu', strokes: 5, radical: '口', structure: '半包围' },
  东: { py: 'dōng', strokes: 5, radical: '一', structure: '独体字' },
  西: { py: 'xī', strokes: 6, radical: '覀', structure: '独体字' },
  南: { py: 'nán', strokes: 9, radical: '十', structure: '上下' },
  北: { py: 'běi', strokes: 5, radical: '匕', structure: '左右' },
  年: { py: 'nián', strokes: 6, radical: '干', structure: '独体字' },
  时: { py: 'shí', strokes: 7, radical: '日', structure: '左右' },
  分: { py: 'fēn', strokes: 4, radical: '刀', structure: '上下' },
  秒: { py: 'miǎo', strokes: 9, radical: '禾', structure: '左右' },
  家: { py: 'jiā', strokes: 10, radical: '宀', structure: '上下' },
  门: { py: 'mén', strokes: 3, radical: '门', structure: '独体字' },
  窗: { py: 'chuāng', strokes: 12, radical: '穴', structure: '上下' },
  饭: { py: 'fàn', strokes: 7, radical: '饣', structure: '左右' },
  菜: { py: 'cài', strokes: 11, radical: '艹', structure: '上下' },
  茶: { py: 'chá', strokes: 9, radical: '艹', structure: '上下' },
  果: { py: 'guǒ', strokes: 8, radical: '木', structure: '独体字' },
  米: { py: 'mǐ', strokes: 6, radical: '米', structure: '独体字' },
  衣: { py: 'yī', strokes: 6, radical: '衣', structure: '独体字' },
  飞: { py: 'fēi', strokes: 3, radical: '飞', structure: '独体字' },
  走: { py: 'zǒu', strokes: 7, radical: '走', structure: '上下' },
  石: { py: 'shí', strokes: 5, radical: '石', structure: '独体字' },
  田: { py: 'tián', strokes: 5, radical: '田', structure: '独体字' },
  力: { py: 'lì', strokes: 2, radical: '力', structure: '独体字' },
  气: { py: 'qì', strokes: 4, radical: '气', structure: '半包围' },
  光: { py: 'guāng', strokes: 6, radical: '儿', structure: '上下' },
  声: { py: 'shēng', strokes: 7, radical: '士', structure: '上下' }
}

/* 「每日一字」：按当日日期轮换 */
export function todayChar(): string {
  const keys = Object.keys(STROKE_TABLE)
  const doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return keys[doy % keys.length]
}
