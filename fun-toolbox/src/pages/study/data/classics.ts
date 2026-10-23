/* ===================== 文言文语料（分包内数据，仅 study 分包引用） =====================
 * 结构：学段 → 册 → 篇（逐句：原文 + 拼音 + 可选注释 + 篇尾局长批注）。
 * 收录为常见课本篇目（部编版方向），具体以用户所学教材为准。
 * 拼音为人工校对版；扩充实语料直接按此结构加文件即可。
 */

export interface Sentence {
  text: string
  pinyin: string
  notes?: { word: string; meaning: string }[]
}

export interface ClassicArticle {
  id: string
  title: string
  author: string
  dynasty: string
  grade: string
  sentences: Sentence[]
  comment: string
}

export interface ClassicVolume {
  id: string
  name: string
  articles: ClassicArticle[]
}

export interface ClassicStage {
  id: 'primary' | 'junior' | 'senior'
  name: string
  volumes: ClassicVolume[]
}

/* ---------- 小学 ---------- */
const primary: ClassicStage = {
  id: 'primary',
  name: '小学',
  volumes: [
    {
      id: 'p1',
      name: '低年级',
      articles: [
        {
          id: 'sima-guang',
          title: '司马光',
          author: '（选自《宋史》）',
          dynasty: '宋',
          grade: '低年级',
          sentences: [
            {
              text: '群儿戏于庭，一儿登瓮，足跌没水中。',
              pinyin: 'qún ér xì yú tíng ， yī ér dēng wèng ， zú dié mò shuǐ zhōng 。'
            },
            {
              text: '众皆弃去，光持石击瓮破之，水迸，儿得活。',
              pinyin: 'zhòng jiē qì qù ， guāng chí shí jī wèng pò zhī ， shuǐ bèng ， ér dé huó 。',
              notes: [{ word: '迸', meaning: '涌出、溅出' }, { word: '皆', meaning: '全、都' }]
            }
          ],
          comment: '别人慌着跑，他搬石头——冷静是稀缺天赋。'
        },
        {
          id: 'shou-zhu-dai-tu',
          title: '守株待兔',
          author: '韩非子',
          dynasty: '先秦',
          grade: '低年级',
          sentences: [
            {
              text: '宋人有耕者。',
              pinyin: 'sòng rén yǒu gēng zhě 。',
              notes: [{ word: '株', meaning: '树桩' }]
            },
            {
              text: '田中有株，兔走触株，折颈而死。',
              pinyin: 'tián zhōng yǒu zhū ， tù zǒu chù zhū ， shé jǐng ér sǐ 。',
              notes: [{ word: '走', meaning: '跑（古今异义）' }]
            },
            {
              text: '因释其耒而守株，冀复得兔。',
              pinyin: 'yīn shì qí lěi ér shǒu zhū ， jì fù dé tù 。',
              notes: [
                { word: '释', meaning: '放下' },
                { word: '冀', meaning: '希望' }
              ]
            },
            {
              text: '兔不可复得，而身为宋国笑。',
              pinyin: 'tù bù kě fù dé ， ér shēn wéi sòng guó xiào 。'
            }
          ],
          comment: '运气给过你一次，不代表它会一直打卡上班。'
        },
        {
          id: 'jing-ye-si',
          title: '静夜思',
          author: '李白',
          dynasty: '唐',
          grade: '低年级',
          sentences: [
            { text: '床前明月光，疑是地上霜。', pinyin: 'chuáng qián míng yuè guāng ， yí shì dì shàng shuāng 。' },
            { text: '举头望明月，低头思故乡。', pinyin: 'jǔ tóu wàng míng yuè ， dī tóu sī gù xiāng 。' }
          ],
          comment: '全宇宙传播量第一的思乡短信，二十个字发了一千三百年。'
        },
        {
          id: 'min-nong',
          title: '悯农（其二）',
          author: '李绅',
          dynasty: '唐',
          grade: '低年级',
          sentences: [
            { text: '锄禾日当午，汗滴禾下土。', pinyin: 'chú hé rì dāng wǔ ， hàn dī hé xià tǔ 。' },
            {
              text: '谁知盘中餐，粒粒皆辛苦。',
              pinyin: 'shuí zhī pán zhōng cān ， lì lì jiē xīn kǔ 。',
              notes: [{ word: '悯', meaning: '怜悯、同情' }]
            }
          ],
          comment: '食堂阿姨背得最熟的一首诗。'
        },
        {
          id: 'deng-guan-que-lou',
          title: '登鹳雀楼',
          author: '王之涣',
          dynasty: '唐',
          grade: '低年级',
          sentences: [
            { text: '白日依山尽，黄河入海流。', pinyin: 'bái rì yī shān jìn ， huáng hé rù hǎi liú 。' },
            {
              text: '欲穷千里目，更上一层楼。',
              pinyin: 'yù qióng qiān lǐ mù ， gèng shàng yī céng lóu 。',
              notes: [{ word: '穷', meaning: '穷尽、看尽' }]
            }
          ],
          comment: '古人早说了：想看得更远，先爬得更高。'
        },
        {
          id: 'yong-e',
          title: '咏鹅',
          author: '骆宾王',
          dynasty: '唐',
          grade: '低年级',
          sentences: [
            { text: '鹅，鹅，鹅，曲项向天歌。', pinyin: 'é ， é ， é ， qū xiàng xiàng tiān gē 。' },
            { text: '白毛浮绿水，红掌拨清波。', pinyin: 'bái máo fú lǜ shuǐ ， hóng zhǎng bō qīng bō 。' }
          ],
          comment: '七岁写的，七岁的你现在在干嘛？'
        }
      ]
    },
    {
      id: 'p2',
      name: '中高年级',
      articles: [
        {
          id: 'jing-zhou-ci',
          title: '己亥杂诗',
          author: '龚自珍',
          dynasty: '清',
          grade: '中高年级',
          sentences: [
            { text: '九州生气恃风雷，万马齐喑究可哀。', pinyin: 'jiǔ zhōu shēng qì shì fēng léi ， wàn mǎ qí yīn jiū kě āi 。', notes: [{ word: '恃', meaning: '依靠' }] },
            { text: '我劝天公重抖擞，不拘一格降人才。', pinyin: 'wǒ quàn tiān gōng chóng dǒu sǒu ， bù jū yī gé jiàng rén cái 。' }
          ],
          comment: '清代最强「求变」喊话，放在今天就是创新宣言。'
        },
        {
          id: 'zao-fa-bai-di-cheng',
          title: '早发白帝城',
          author: '李白',
          dynasty: '唐',
          grade: '中高年级',
          sentences: [
            { text: '朝辞白帝彩云间，千里江陵一日还。', pinyin: 'zhāo cí bái dì cǎi yún jiān ， qiān lǐ jiāng líng yī rì huán 。' },
            { text: '两岸猿声啼不住，轻舟已过万重山。', pinyin: 'liǎng àn yuán shēng tí bù zhù ， qīng zhōu yǐ guò wàn chóng shān 。' }
          ],
          comment: '遇到大赦连夜跑路也能写出全网最快乐的诗，心态大师。'
        }
      ]
    }
  ]
}

/* ---------- 初中 ---------- */
const junior: ClassicStage = {
  id: 'junior',
  name: '初中',
  volumes: [
    {
      id: 'j1',
      name: '七年级',
      articles: [
        {
          id: 'lou-shi-ming',
          title: '陋室铭',
          author: '刘禹锡',
          dynasty: '唐',
          grade: '七年级',
          sentences: [
            { text: '山不在高，有仙则名。', pinyin: 'shān bù zài gāo ， yǒu xiān zé míng 。', notes: [{ word: '名', meaning: '出名、有名（名词作动词）' }] },
            { text: '水不在深，有龙则灵。', pinyin: 'shuǐ bù zài shēn ， yǒu lóng zé líng 。', notes: [{ word: '灵', meaning: '灵验' }] },
            { text: '斯是陋室，惟吾德馨。', pinyin: 'sī shì lòu shì ， wéi wú dé xīn 。', notes: [{ word: '馨', meaning: '香气，指品德高尚' }] },
            { text: '苔痕上阶绿，草色入帘青。', pinyin: 'tái hén shàng jiē lǜ ， cǎo sè rù lián qīng 。' },
            { text: '谈笑有鸿儒，往来无白丁。', pinyin: 'tán xiào yǒu hóng rú ， wǎng lái wú bái dīng 。', notes: [{ word: '白丁', meaning: '平民，这里指没什么学问的人' }] },
            { text: '可以调素琴，阅金经。', pinyin: 'kě yǐ tiáo sù qín ， yuè jīn jīng 。' },
            { text: '无丝竹之乱耳，无案牍之劳形。', pinyin: 'wú sī zhú zhī luàn ěr ， wú àn dú zhī láo xíng 。', notes: [{ word: '案牍', meaning: '官府文书' }] },
            { text: '南阳诸葛庐，西蜀子云亭。', pinyin: 'nán yáng zhū gě lú ， xī shǔ zǐ yún tíng 。' },
            { text: '孔子云：何陋之有？', pinyin: 'kǒng zǐ yún ： hé lòu zhī yǒu ？' }
          ],
          comment: '房子小不要紧，朋友多才是真的——一千二百年前的极简主义宣言。'
        },
        {
          id: 'ai-lian-shuo',
          title: '爱莲说',
          author: '周敦颐',
          dynasty: '宋',
          grade: '七年级',
          sentences: [
            { text: '水陆草木之花，可爱者甚蕃。', pinyin: 'shuǐ lù cǎo mù zhī huā ， kě ài zhě shèn fán 。', notes: [{ word: '蕃', meaning: '多' }] },
            { text: '晋陶渊明独爱菊。', pinyin: 'jìn táo yuān míng dú ài jú 。' },
            { text: '自李唐来，世人甚爱牡丹。', pinyin: 'zì lǐ táng lái ， shì rén shèn ài mǔ dān 。' },
            { text: '予独爱莲之出淤泥而不染，濯清涟而不妖，', pinyin: 'yú dú ài lián zhī chū yū ní ér bù rǎn ， zhuó qīng lián ér bù yāo ，', notes: [{ word: '濯', meaning: '洗涤' }] },
            { text: '中通外直，不蔓不枝，香远益清，亭亭净植，', pinyin: 'zhōng tōng wài zhí ， bù màn bù zhī ， xiāng yuǎn yì qīng ， tíng tíng jìng zhí ，' },
            { text: '可远观而不可亵玩焉。', pinyin: 'kě yuǎn guān ér bù kě xiè wán yān 。', notes: [{ word: '亵玩', meaning: '轻慢地把玩' }] },
            { text: '予谓菊，花之隐逸者也；牡丹，花之富贵者也；莲，花之君子者也。', pinyin: 'yú wèi jú ， huā zhī yǐn yì zhě yě ； mǔ dān ， huā zhī fù guì zhě yě ； lián ， huā zhī jūn zǐ zhě yě 。' },
            { text: '噫！菊之爱，陶后鲜有闻。', pinyin: 'yī ！ jú zhī ài ， táo hòu xiǎn yǒu wén 。', notes: [{ word: '鲜', meaning: '少（xiǎn）' }] },
            { text: '莲之爱，同予者何人？牡丹之爱，宜乎众矣。', pinyin: 'lián zhī ài ， tóng yú zhě hé rén ？ mǔ dān zhī ài ， yí hū zhòng yǐ 。' }
          ],
          comment: '不追热门（牡丹）、不装清高（菊），做好自己（莲）——社交平台时代的处世指南。'
        }
      ]
    },
    {
      id: 'j2',
      name: '八年级',
      articles: [
        {
          id: 'san-xia',
          title: '三峡（节选）',
          author: '郦道元',
          dynasty: '北魏',
          grade: '八年级',
          sentences: [
            { text: '自三峡七百里中，两岸连山，略无阙处。', pinyin: 'zì sān xiá qī bǎi lǐ zhōng ， liǎng àn lián shān ， lüè wú quē chù 。', notes: [{ word: '阙', meaning: '同「缺」，缺口' }] },
            { text: '重岩叠嶂，隐天蔽日，自非亭午夜分，不见曦月。', pinyin: 'chóng yán dié zhàng ， yǐn tiān bì rì ， zì fēi tíng wǔ yè fēn ， bù jiàn xī yuè 。', notes: [{ word: '曦', meaning: '日光，这里指太阳' }] },
            { text: '至于夏水襄陵，沿溯阻绝。', pinyin: 'zhì yú xià shuǐ xiāng líng ， yán sù zǔ jué 。', notes: [{ word: '襄', meaning: '升到高处' }] },
            { text: '虽乘奔御风，不以疾也。', pinyin: 'suī chéng bēn yù fēng ， bù yǐ jí yě 。' }
          ],
          comment: '一千五百年前的顶级旅行随笔，郦道元是硬核地理博主。'
        },
        {
          id: 'da-wang',
          title: '答谢中书书',
          author: '陶弘景',
          dynasty: '南朝',
          grade: '八年级',
          sentences: [
            { text: '山川之美，古来共谈。', pinyin: 'shān chuān zhī měi ， gǔ lái gòng tán 。' },
            { text: '高峰入云，清流见底。', pinyin: 'gāo fēng rù yún ， qīng liú jiàn dǐ 。' },
            { text: '两岸石壁，五色交辉。', pinyin: 'liǎng àn shí bì ， wǔ sè jiāo huī 。' },
            { text: '青林翠竹，四时俱备。', pinyin: 'qīng lín cuì zhú ， sì shí jù bèi 。' },
            { text: '晓雾将歇，猿鸟乱鸣；夕日欲颓，沉鳞竞跃。', pinyin: 'xiǎo wù jiāng xiē ， yuán niǎo luàn míng ； xī rì yù tuí ， chén lín jìng yuè 。', notes: [{ word: '颓', meaning: '坠落' }] },
            { text: '实是欲界之仙都。', pinyin: 'shí shì yù jiè zhī xiān dōu 。' },
            { text: '自康乐以来，未复有能与其奇者。', pinyin: 'zì kāng lè yǐ lái ， wèi fù yǒu néng yù qí qí zhě 。' }
          ],
          comment: '六朝文人的「朋友圈晒风景」，配文讲究到每个字都在发光。'
        },
        {
          id: 'yue-yang-lou',
          title: '岳阳楼记（节选）',
          author: '范仲淹',
          dynasty: '宋',
          grade: '八年级',
          sentences: [
            { text: '予观夫巴陵胜状，在洞庭一湖。', pinyin: 'yú guān fū bā líng shèng zhuàng ， zài dòng tíng yī hú 。' },
            { text: '衔远山，吞长江，浩浩汤汤，横无际涯。', pinyin: 'xián yuǎn shān ， tūn cháng jiāng ， hào hào shāng shāng ， héng wú jì yá 。' },
            { text: '朝晖夕阴，气象万千。', pinyin: 'zhāo huī xī yīn ， qì xiàng wàn qiān 。' },
            { text: '不以物喜，不以己悲。', pinyin: 'bù yǐ wù xǐ ， bù yǐ jǐ bēi 。' },
            { text: '居庙堂之高则忧其民，处江湖之远则忧其君。', pinyin: 'jū miào táng zhī gāo zé yōu qí mín ， chǔ jiāng hú zhī yuǎn zé yōu qí jūn 。' },
            { text: '先天下之忧而忧，后天下之乐而乐。', pinyin: 'xiān tiān xià zhī yōu ér yōu ， hòu tiān xià zhī lè ér lè 。' }
          ],
          comment: '没去过岳阳楼，照样写出千古第一楼记——这就是甲方需求与乙方文案的巅峰。'
        }
      ]
    },
    {
      id: 'j3',
      name: '九年级',
      articles: [
        {
          id: 'zui-weng-ting',
          title: '醉翁亭记（节选）',
          author: '欧阳修',
          dynasty: '宋',
          grade: '九年级',
          sentences: [
            { text: '环滁皆山也。', pinyin: 'huán chú jiē shān yě 。' },
            { text: '其西南诸峰，林壑尤美，望之蔚然而深秀者，琅琊也。', pinyin: 'qí xī nán zhū fēng ， lín hè yóu měi ， wàng zhī wèi rán ér shēn xiù zhě ， láng yá yě 。' },
            { text: '峰回路转，有亭翼然临于泉上者，醉翁亭也。', pinyin: 'fēng huí lù zhuǎn ， yǒu tíng yì rán lín yú quán shàng zhě ， zuì wēng tíng yě 。' },
            { text: '醉翁之意不在酒，在乎山水之间也。', pinyin: 'zuì wēng zhī yì bù zài jiǔ ， zài hū shān shuǐ zhī jiān yě 。' },
            { text: '山水之乐，得之心而寓之酒也。', pinyin: 'shān shuǐ zhī lè ， dé zhī xīn ér yù zhī jiǔ yě 。' }
          ],
          comment: '「醉翁之意不在酒」——被引用了一千年的人生Stage。'
        },
        {
          id: 'yu-gong',
          title: '愚公移山（节选）',
          author: '列子',
          dynasty: '先秦',
          grade: '九年级',
          sentences: [
            { text: '太行、王屋二山，方七百里，高万仞。', pinyin: 'tài háng 、 wáng wū èr shān ， fāng qī bǎi lǐ ， gāo wàn rèn 。' },
            { text: '北山愚公者，年且九十，面山而居。', pinyin: 'běi shān yú gōng zhě ， nián qiě jiǔ shí ， miàn shān ér jū 。', notes: [{ word: '且', meaning: '将近' }] },
            { text: '惩山北之塞，出入之迂也，聚室而谋曰：吾与汝毕力平险，指通豫南，达于汉阴，可乎？', pinyin: 'chéng shān běi zhī sāi ， chū rù zhī yū yě ， jù shì ér móu yuē ： wú yǔ rǔ bì lì píng xiǎn ， zhǐ tōng yù nán ， dá yú hàn yīn ， kě hū ？' },
            { text: '子子孙孙无穷匮也，而山不加增，何苦而不平？', pinyin: 'zǐ zǐ sūn sūn wú qióng kuì yě ， ér shān bù jiā zēng ， hé kǔ ér bù píng ？' }
          ],
          comment: '元宇宙挖山第一人：不卷当下，卷世世代代的复利。'
        }
      ]
    }
  ]
}

/* ---------- 高中 ---------- */
const senior: ClassicStage = {
  id: 'senior',
  name: '高中',
  volumes: [
    {
      id: 's1',
      name: '必修上',
      articles: [
        {
          id: 'quan-xue',
          title: '劝学（节选）',
          author: '荀子',
          dynasty: '先秦',
          grade: '必修上',
          sentences: [
            { text: '君子曰：学不可以已。', pinyin: 'jūn zǐ yuē ： xué bù kě yǐ yǐ 。' },
            { text: '青，取之于蓝，而青于蓝；冰，水为之，而寒于水。', pinyin: 'qīng ， qǔ zhī yú lán ， ér qīng yú lán ； bīng ， shuǐ wéi zhī ， ér hán yú shuǐ 。' },
            { text: '木直中绳，𫐓以为轮，其曲中规。', pinyin: 'mù zhí zhòng shéng ， róu yǐ wéi lún ， qí qū zhòng guī 。', notes: [{ word: '𫐓', meaning: '同「煣」，使弯曲' }] },
            { text: '故木受绳则直，金就砺则利，君子博学而日参省乎己，则知明而行无过矣。', pinyin: 'gù mù shòu shéng zé zhí ， jīn jiù lì zé lì ， jūn zǐ bó xué ér rì cān xǐng hū jǐ ， zé zhì míng ér xíng wú guò yǐ 。' },
            { text: '吾尝终日而思矣，不如须臾之所学也。', pinyin: 'wú cháng zhōng rì ér sī yǐ ， bù rú xū yú zhī suǒ xué yě 。' },
            { text: '不积跬步，无以至千里；不积小流，无以成江海。', pinyin: 'bù jī kuǐ bù ， wú yǐ zhì qiān lǐ ； bù jī xiǎo liú ， wú yǐ chéng jiāng hǎi 。', notes: [{ word: '跬', meaning: '半步' }] },
            { text: '锲而舍之，朽木不折；锲而不舍，金石可镂。', pinyin: 'qiè ér shě zhī ， xiǔ mù bù zhé ； qiè ér bù shě ， jīn shí kě lòu 。', notes: [{ word: '锲', meaning: '雕刻' }] }
          ],
          comment: '两千年前的学习博主，把「坚持」讲得比任何成功学都清楚。'
        },
        {
          id: 'shi-shuo',
          title: '师说（节选）',
          author: '韩愈',
          dynasty: '唐',
          grade: '必修上',
          sentences: [
            { text: '古之学者必有师。', pinyin: 'gǔ zhī xué zhě bì yǒu shī 。' },
            { text: '师者，所以传道受业解惑也。', pinyin: 'shī zhě ， suǒ yǐ chuán dào shòu yè jiě huò yě 。' },
            { text: '人非生而知之者，孰能无惑？', pinyin: 'rén fēi shēng ér zhī zhī zhě ， shú néng wú huò ？' },
            { text: '惑而不从师，其为惑也，终不解矣。', pinyin: 'huò ér bù cóng shī ， qí wéi huò yě ， zhōng bù jiě yǐ 。' },
            { text: '是故无贵无贱，无长无少，道之所存，师之所存也。', pinyin: 'shì gù wú guì wú jiàn ， wú cháng wú shǎo ， dào zhī suǒ cún ， shī zhī suǒ cún yě 。' },
            { text: '闻道有先后，术业有专攻，如是而已。', pinyin: 'wén dào yǒu xiān hòu ， shù yè yǒu zhuān gōng ， rú shì ér yǐ 。' }
          ],
          comment: '「术业有专攻」——遇到别人擅长的领域，先请教再发言。'
        }
      ]
    },
    {
      id: 's2',
      name: '必修下',
      articles: [
        {
          id: 'zi-xu-dai-mu',
          title: '子路、曾皙、冉有、公西华侍坐（节选）',
          author: '论语',
          dynasty: '先秦',
          grade: '必修下',
          sentences: [
            { text: '以吾一日长乎尔，毋吾以也。', pinyin: 'yǐ wú yī rì cháng hū ěr ， wú wú yǐ yě 。' },
            { text: '居则曰：不吾知也！如或知尔，则何以哉？', pinyin: 'jū zé yuē ： bù wú zhī yě ！ rú huò zhī ěr ， zé hé yǐ zāi ？' },
            { text: '莫春者，春服既成，冠者五六人，童子六七人，浴乎沂，风乎舞雩，咏而归。', pinyin: 'mò chūn zhě ， chūn fù jì chéng ， guàn zhě wǔ liù rén ， tóng zǐ liù qī rén ， yù hū yí ， fēng hū wǔ yú ， yǒng ér guī 。' },
            { text: '夫子喟然叹曰：吾与点也！', pinyin: 'fū zǐ kuì rán tàn yuē ： wú yǔ diǎn yě ！' }
          ],
          comment: '孔子最想去的生活也就是春天出去玩水吹风——理想主义者的天花板画面。'
        },
        {
          id: 'chi-bi-fu',
          title: '赤壁赋（节选）',
          author: '苏轼',
          dynasty: '宋',
          grade: '必修下',
          sentences: [
            { text: '壬戌之秋，七月既望，苏子与客泛舟游于赤壁之下。', pinyin: 'rén xū zhī qiū ， qī yuè jì wàng ， sū zǐ yǔ kè fàn zhōu yóu yú chì bì zhī xià 。', notes: [{ word: '既望', meaning: '农历十六日' }] },
            { text: '清风徐来，水波不兴。', pinyin: 'qīng fēng xú lái ， shuǐ bō bù xīng 。' },
            { text: '举酒属客，诵明月之诗，歌窈窕之章。', pinyin: 'jǔ jiǔ zhǔ kè ， sòng míng yuè zhī shī ， gē yǎo tiǎo zhī zhāng 。' },
            { text: '少焉，月出于东山之上，徘徊于斗牛之间。', pinyin: 'shǎo yān ， yuè chū yú dōng shān zhī shàng ， pái huái yú dòu niú zhī jiān 。' },
            { text: '白露横江，水光接天。', pinyin: 'bái lù héng jiāng ， shuǐ guāng jiē tiān 。' },
            { text: '纵一苇之所如，凌万顷之茫然。', pinyin: 'zòng yī wěi zhī suǒ rú ， líng wàn qǐng zhī máng rán 。' },
            { text: '哀吾生之须臾，羡长江之无穷。', pinyin: 'āi wú shēng zhī xū yú ， xiàn cháng jiāng zhī wú qióng 。' },
            { text: '惟江上之清风，与山间之明月，耳得之而为声，目遇之而成色，取之无禁，用之不竭。', pinyin: 'wéi jiāng shàng zhī qīng fēng ， yǔ shān jiān zhī míng yuè ， ěr dé zhī ér wéi shēng ， mù yù zhī ér chéng sè ， qǔ zhī wú jìn ， yòng zhī bù jié 。' }
          ],
          comment: '被贬黄州还能写出「清风明月不用钱买」——苏东坡的免费会员哲学。'
        }
      ]
    },
    {
      id: 's3',
      name: '选择性必修',
      articles: [
        {
          id: 'li-sao',
          title: '离骚（节选）',
          author: '屈原',
          dynasty: '先秦',
          grade: '选择性必修',
          sentences: [
            { text: '长太息以掩涕兮，哀民生之多艰。', pinyin: 'cháng tài xī yǐ yǎn tì xī ， āi mín shēng zhī duō jiān 。' },
            { text: '亦余心之所善兮，虽九死其犹未悔。', pinyin: 'yì yú xīn zhī suǒ shàn xī ， suī jiǔ sǐ qí yóu wèi huǐ 。' },
            { text: '路漫漫其修远兮，吾将上下而求索。', pinyin: 'lù màn màn qí xiū yuǎn xī ， wú jiāng shàng xià ér qiú suǒ 。' }
          ],
          comment: '把「虽九死其犹未悔」发给那个正在硬扛的人。'
        },
        {
          id: 'lan-ting-xu',
          title: '兰亭集序（节选）',
          author: '王羲之',
          dynasty: '东晋',
          grade: '选择性必修',
          sentences: [
            { text: '此地有崇山峻岭，茂林修竹，又有清流激湍，映带左右。', pinyin: 'cǐ dì yǒu chóng shān jùn lǐng ， mào lín xiū zhú ， yòu yǒu qīng liú jī tuān ， yìng dài zuǒ yòu 。' },
            { text: '引以为流觞曲水，列坐其次。', pinyin: 'yǐn yǐ wéi liú shāng qū shuǐ ， liè zuò qí cì 。', notes: [{ word: '觞', meaning: '酒杯' }] },
            { text: '是日也，天朗气清，惠风和畅。', pinyin: 'shì rì yě ， tiān lǎng qì qīng ， huì fēng hé chàng 。' },
            { text: '仰观宇宙之大，俯察品类之盛，所以游目骋怀，足以极视听之娱，信可乐也。', pinyin: 'yǎng guān yǔ zhòu zhī dà ， fǔ chá pǐn lèi zhī shèng ， suǒ yǐ yóu mù chěng huái ， zú yǐ jí shì tīng zhī yú ， xìn kě lè yě 。' },
            { text: '后之视今，亦犹今之视昔，悲夫！', pinyin: 'hòu zhī shì jīn ， yì yóu jīn zhī shì xī ， bēi fū ！' }
          ],
          comment: '史上最强团建记录：一边喝酒一边想通了时间这件事。'
        },
        {
          id: 'teng-wang-ge',
          title: '滕王阁序（节选）',
          author: '王勃',
          dynasty: '唐',
          grade: '选择性必修',
          sentences: [
            { text: '落霞与孤鹜齐飞，秋水共长天一色。', pinyin: 'luò xiá yǔ gū wù qí fēi ， qiū shuǐ gòng cháng tiān yī sè 。', notes: [{ word: '鹜', meaning: '野鸭' }] },
            { text: '渔舟唱晚，响穷彭蠡之滨；雁阵惊寒，声断衡阳之浦。', pinyin: 'yú zhōu chàng wǎn ， xiǎng qióng péng lǐ zhī bīn ； yàn zhèn jīng hán ， shēng duàn héng yáng zhī pǔ 。' },
            { text: '老当益壮，宁移白首之心？穷且益坚，不坠青云之志。', pinyin: 'lǎo dāng yì zhuàng ， nìng yí bái shǒu zhī xīn ？ qióng qiě yì jiān ， bù zhuì qīng yún zhī zhì 。' }
          ],
          comment: '二十多岁写的骈文天花板，「穷且益坚」四个字养活了多少座右铭。'
        }
      ]
    }
  ]
}

export const CLASSIC_STAGES: ClassicStage[] = [primary, junior, senior]

export function findArticle(id: string): { article: ClassicArticle; stage: ClassicStage; volume: ClassicVolume } | null {
  for (const stage of CLASSIC_STAGES) {
    for (const volume of stage.volumes) {
      const article = volume.articles.find(a => a.id === id)
      if (article) return { article, stage, volume }
    }
  }
  return null
}

export function allArticles(): ClassicArticle[] {
  const list: ClassicArticle[] = []
  CLASSIC_STAGES.forEach(s => s.volumes.forEach(v => list.push(...v.articles)))
  return list
}
