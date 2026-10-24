import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { getTheme } from '../../../utils/theme'
import NavBar from '../../../components/NavBar'
import { findArticle } from '../data/classics'
import { getProgress, saveProgress } from '../data/progress'
import './index.scss'

type Mode = 'read' | 'recite'

/* 背诵挖空：确定性伪随机（句序+字序），当天固定 */
function shouldMask(articleId: string, si: number, ci: number, text: string): boolean {
  const seed = articleId.length * 31 + si * 7 + ci * 13
  return seed % 10 < 3 && text.length > 3
}

export default function ClassicsReader() {
  const [theme] = useState(getTheme())
  const params = Taro.getCurrentInstance().router?.params || {}
  const found = useMemo(() => findArticle(params.id || ''), [])
  const article = found?.article

  const [mode, setMode] = useState<Mode>('read')
  /* 跟读节拍：每字毫秒（慢420/中320/快220） */
  const BEATS = [420, 320, 220]
  const [beatIdx, setBeatIdx] = useState(1)
  const beatRef = useRef(BEATS[1])
  const [playing, setPlaying] = useState(-1)   /* 正在朗读的句序 */
  const [playingAll, setPlayingAll] = useState(false)
  const [noteFor, setNoteFor] = useState<{ si: number; word: string; meaning: string } | null>(null)
  /* 挖空显示记录：`${si}-${ci}` */
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [progress, setProgress] = useState(getProgress())
  const playTimer = useRef<any>(null)

  useShareAppMessage(() => ({
    title: article ? `一起读《${article.title}》` : '文言文陪读',
    path: '/pages/index/index'
  }))

  useEffect(() => {
    if (article) {
      const p = getProgress()
      const cur = p[article.id] || { read: false, recite: 0 }
      if (!cur.read) {
        p[article.id] = { ...cur, read: true }
        saveProgress(p)
        setProgress(p)
      }
    }
    return () => {
      if (playTimer.current) clearTimeout(playTimer.current)
    }
  }, [article])

  const playSentence = useCallback((si: number, thenNext: boolean) => {
    if (!article) return
    const s = article.sentences[si]
    if (!s) {
      setPlaying(-1)
      setPlayingAll(false)
      return
    }
    setPlaying(si)
    /* 跟读节拍：同声传译插件不支持个人主体，改为按字数估算的阅读节奏高亮
       （自己读出声，工具打节拍）；未来升级主体开通插件后自动切换真朗读 */
    const chars = s.text.replace(/[，。；：？！、\s]/g, '').length
    const beat = Math.max(900, chars * beatRef.current)
    playTimer.current = setTimeout(() => {
      if (thenNext && si + 1 < article.sentences.length) {
        playSentence(si + 1, true)
      } else if (thenNext) {
        setPlaying(-1)
        setPlayingAll(false)
      } else {
        setPlaying(-1)
      }
    }, beat)
  }, [article])

  const toggleSentence = (si: number) => {
    if (playing === si) {
      /* 插件无停止接口，短暂静默处理：标记结束 */
      setPlaying(-1)
      setPlayingAll(false)
      return
    }
    playSentence(si, false)
  }

  const togglePlayAll = () => {
    if (playingAll) {
      setPlayingAll(false)
      setPlaying(-1)
      if (playTimer.current) clearTimeout(playTimer.current)
      return
    }
    setPlayingAll(true)
    playSentence(0, true)
  }

  const cycleBeat = () => {
    const next = (beatIdx + 1) % BEATS.length
    beatRef.current = BEATS[next]
    setBeatIdx(next)
    Taro.showToast({ title: `跟读节奏：${['慢', '中', '快'][next]}`, icon: 'none', duration: 800 })
  }

  const selfGrade = (good: boolean) => {
    if (!article) return
    const p = getProgress()
    const cur = p[article.id] || { read: true, recite: 0 }
    const next = good ? Math.min(3, cur.recite + 1) : Math.max(0, cur.recite - 1)
    p[article.id] = { read: true, recite: next }
    saveProgress(p)
    setProgress(p)
    Taro.showToast({ title: good ? (next >= 3 ? '背熟！⭐⭐⭐' : `进度 ⭐${'⭐'.repeat(Math.max(0, next - 1))}`) : '再来一遍', icon: 'none', duration: 1200 })
  }

  if (!article) {
    return (
      <View className='page-root' style={{ background: theme.bg }}>
        <NavBar title='文言文陪读' />
        <View className='cr-empty'>没有找到这篇课文</View>
      </View>
    )
  }

  const cur = progress[article.id] || { read: true, recite: 0 }

  return (
    <View className='page-root classics-reader' style={{ background: theme.bg }}>
      <NavBar title={article.title} />

      <ScrollView scrollY className='cr-scroll'>
        <View className='cr-scroll-pad'>
        <View className='cr-head'>
          <Text className='cr-title'>{article.title}</Text>
          <Text className='cr-meta'>{article.dynasty} · {article.author} · {article.grade}</Text>
        </View>

        {/* 工具行 */}
        <View className='cr-tools'>
          <View
            className={`cr-tool ${mode === 'recite' ? 'cr-tool--on' : ''}`}
            style={mode === 'recite' ? { background: theme.accent } : undefined}
            onClick={() => setMode(m => (m === 'read' ? 'recite' : 'read'))}
          >
            {mode === 'recite' ? '背诵中' : '背诵模式'}
          </View>
          <View className={`cr-tool ${playingAll ? 'cr-tool--on' : ''}`} onClick={togglePlayAll}>
            {playingAll ? '停止连播' : '本篇连播'}
          </View>
          <View className='cr-tool' onClick={cycleBeat}>{['慢', '中', '快'][beatIdx]}速</View>
        </View>

        {/* 正文 */}
        <View className='cr-body'>
          {article.sentences.map((s, si) => (
            <View
              key={si}
              className={`cr-sentence ${playing === si ? 'cr-sentence--playing' : ''}`}
              style={playing === si ? { borderColor: theme.accent } : undefined}
              onClick={() => mode === 'read' && toggleSentence(si)}
            >
              <Text className='cr-pinyin'>{s.pinyin}</Text>
              <Text className='cr-text'>
                {Array.from(s.text).map((ch, ci) => {
                  const masked = mode === 'recite' && shouldMask(article.id, si, ci, s.text)
                  const key = `${si}-${ci}`
                  const show = !masked || revealed[key]
                  return (
                    <Text
                      key={ci}
                      className={show ? '' : 'cr-char--masked'}
                      onClick={e => {
                        if (masked && !revealed[key]) {
                          e.stopPropagation()
                          setRevealed(r => ({ ...r, [key]: true }))
                        }
                      }}
                    >
                      {show ? ch : '◯'}
                    </Text>
                  )
                })}
              </Text>
              {/* 注释小圆点 */}
              {s.notes && s.notes.length > 0 && (
                <View className='cr-notes'>
                  {s.notes.map(n => (
                    <Text
                      key={n.word}
                      className='cr-note-dot'
                      style={{ color: theme.accentDeep, borderColor: `${theme.accent}88` }}
                      onClick={e => {
                        e.stopPropagation()
                        setNoteFor({ si, ...n })
                      }}
                    >
                      {n.word}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* 背诵自评 */}
        {mode === 'recite' && (
          <View className='cr-grade'>
            <Text className='cr-grade-label'>都背下来了？</Text>
            <View className='cr-grade-btn cr-grade-btn--ok' onClick={() => selfGrade(true)}>背下来了</View>
            <View className='cr-grade-btn cr-grade-btn--no' onClick={() => selfGrade(false)}>再练练</View>
          </View>
        )}

        {/* 局长批注 */}
        <View className='cr-comment' style={{ background: `${theme.accent}14` }}>
          <Text className='cr-comment-title' style={{ color: theme.accentDeep }}>📌 局长批注</Text>
          <Text className='cr-comment-text'>{article.comment}</Text>
        </View>

        <View className='cr-tip'>
          {mode === 'read'
            ? '点句子高亮跟读（读出声效果最佳） · 点词看释义'
            : `当前背诵进度 ${'⭐'.repeat(cur.recite) || '尚无'} · 点◯偷看一个字`}
        </View>
      </View>
      </ScrollView>

      {/* 释义浮层 */}
      {noteFor && (
        <View className='cr-note-mask' onClick={() => setNoteFor(null)}>
          <View className='cr-note-pop' style={{ borderColor: theme.accent }} onClick={e => e.stopPropagation()}>
            <Text className='cr-note-word' style={{ color: theme.accentDeep }}>{noteFor.word}</Text>
            <Text className='cr-note-meaning'>{noteFor.meaning}</Text>
            <View className='cr-note-close' onClick={() => setNoteFor(null)}>知道了</View>
          </View>
        </View>
      )}
    </View>
  )
}
