import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useMemo } from 'react'
import { getTheme } from '../../../utils/theme'
import { track } from '../../../utils/analytics'
import NavBar from '../../../components/NavBar'
import { CLASSIC_STAGES } from '../data/classics'
import { getProgress, type Progress } from '../data/progress'
import './index.scss'

export default function ClassicsShelf() {
  const [theme] = useState(getTheme())
  const [stageId, setStageId] = useState<string>(CLASSIC_STAGES[0].id)
  const [volumeId, setVolumeId] = useState<string>(CLASSIC_STAGES[0].volumes[0].id)
  const [progress] = useState<Progress>(getProgress())

  useShareAppMessage(() => ({
    title: '小学到高中的文言文，都能逐句听读了',
    path: '/pages/index/index'
  }))

  const stage = CLASSIC_STAGES.find(s => s.id === stageId) || CLASSIC_STAGES[0]
  const volume = stage.volumes.find(v => v.id === volumeId) || stage.volumes[0]

  const pickStage = (id: string) => {
    setStageId(id)
    const st = CLASSIC_STAGES.find(s => s.id === id)
    if (st) setVolumeId(st.volumes[0].id)
  }

  const total = useMemo(() => CLASSIC_STAGES.reduce((n, s) => n + s.volumes.reduce((m, v) => m + v.articles.length, 0), 0), [])
  const readCount = useMemo(() => Object.values(progress).filter(p => p.read).length, [progress])
  const reciteCount = useMemo(() => Object.values(progress).filter(p => p.recite >= 2).length, [progress])

  const open = (articleId: string) => {
    track('tool_open', { tool_id: 'classics', article: articleId })
    Taro.navigateTo({ url: `/pages/study/classics-reader/index?id=${articleId}` })
  }

  return (
    <View className='page-root classics-root' style={{ background: theme.bg }}>
      <NavBar title='文言文陪读' />

      {/* 进度条（作业本横线样式） */}
      <View className='cl-progress'>
        <Text className='cl-progress-text'>已读 {readCount} · 背熟 {reciteCount}</Text>
        <View className='cl-progress-track'>
          <View
            className='cl-progress-fill'
            style={{ width: `${total ? Math.round((readCount / total) * 100) : 0}%`, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentDeep})` }}
          />
        </View>
        <Text className='cl-progress-total'>/ {total}</Text>
      </View>

      {/* 学段 Tab */}
      <View className='cl-stage-tabs'>
        {CLASSIC_STAGES.map(s => (
          <View
            key={s.id}
            className={`cl-stage-tab ${s.id === stageId ? 'cl-stage-tab--on' : ''}`}
            style={s.id === stageId ? { background: theme.accent } : undefined}
            onClick={() => pickStage(s.id)}
          >
            {s.name}
          </View>
        ))}
      </View>

      <ScrollView scrollY className='cl-scroll'>
        <View className='cl-scroll-pad'>
        {/* 册选择 */}
        <ScrollView scrollX className='cl-volume-row' showScrollbar={false}>
          {stage.volumes.map(v => {
            const read = v.articles.filter(a => progress[a.id]?.read).length
            return (
              <View
                key={v.id}
                className={`cl-volume ${v.id === volumeId ? 'cl-volume--on' : ''}`}
                style={v.id === volumeId ? { borderColor: theme.accent } : undefined}
                onClick={() => setVolumeId(v.id)}
              >
                <Text>{v.name}</Text>
                {read > 0 && <Text className='cl-volume-read'>{read}/{v.articles.length}</Text>}
              </View>
            )
          })}
        </ScrollView>

        {/* 篇目列表 */}
        {volume.articles.map(a => {
          const p = progress[a.id]
          return (
            <View key={a.id} className='cl-article' onClick={() => open(a.id)}>
              <View className='cl-article-bar' style={{ background: theme.accent }} />
              <View className='cl-article-info'>
                <Text className='cl-article-title'>{a.title}</Text>
                <Text className='cl-article-meta'>
                  {[a.dynasty, a.author, a.sentences.length + ' 句'].filter(Boolean).join(' · ')}
                </Text>
              </View>
              {p && p.recite >= 3 ? (
                <Text className='cl-article-badge'>⭐⭐⭐</Text>
              ) : p && p.recite === 2 ? (
                <Text className='cl-article-badge'>⭐⭐</Text>
              ) : p && p.read ? (
                <Text className='cl-article-badge'>✦</Text>
              ) : null}
            </View>
          )
        })}

        <View className='cl-foot-tip'>收录为常见课本篇目，具体以你所学教材为准 · 持续扩充中</View>
      </View>
      </ScrollView>
    </View>
  )
}
