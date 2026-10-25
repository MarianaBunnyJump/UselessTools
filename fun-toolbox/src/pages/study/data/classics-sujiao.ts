/* ===================== 苏教版文言文语料（构建时生成，勿手改） =====================
 * 生成：node scripts/gen-sujiao-classics.mjs
 * 来源：scripts/sujiao-data.md（苏教版初高中文言文全集，按教材顺序）
 * 统计：2 学段 / 11 册 / 61 篇 / 1617 句
 * 拼音由 pinyin-pro 自动标注（多音字以词典常用音为准，未逐篇人工校对；
 * 「小学/初中/高中」精读 tab 仍为人工校对版语料）。
 */

import type { ClassicStage } from './classics'

export const SUJIAO_STAGES: ClassicStage[] = [
 {
  "id": "sujiao-junior",
  "name": "苏教·初中",
  "volumes": [
   {
    "id": "sj-vol-1",
    "name": "七年级上册",
    "articles": [
     {
      "id": "sj-zhengrenmail",
      "title": "郑人买履",
      "author": "《韩非子·外储说左上》",
      "dynasty": "苏教版",
      "grade": "七年级上册",
      "sentences": [
       {
        "text": "郑人有欲买履者，先自度其足而置之其坐。",
        "pinyin": "zhèng rén yǒu yù mǎi lǚ zhě ， xiān zì dù qí zú ér zhì zhī qí zuò 。"
       },
       {
        "text": "至之市，而忘操之。",
        "pinyin": "zhì zhī shì ， ér wàng cāo zhī 。"
       },
       {
        "text": "已得履，乃曰：“吾忘持度。",
        "pinyin": "yǐ dé lǚ ， nǎi yuē ：“ wú wàng chí dù 。"
       },
       {
        "text": "”反归取之。",
        "pinyin": "” fǎn guī qǔ zhī 。"
       },
       {
        "text": "及反，市罢，遂不得履。",
        "pinyin": "jí fǎn ， shì bà ， suì bù dé lǚ 。"
       },
       {
        "text": "人曰：“何不试之以足？",
        "pinyin": "rén yuē ：“ hé bú shì zhī yǐ zú ？"
       },
       {
        "text": "”曰：“宁信度，无自信也。",
        "pinyin": "” yuē ：“ níng xìn dù ， wú zì xìn yě 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-kezhouqiujian",
      "title": "刻舟求剑",
      "author": "《吕氏春秋·察今》",
      "dynasty": "苏教版",
      "grade": "七年级上册",
      "sentences": [
       {
        "text": "楚人有涉江者，其剑自舟中坠于水，遽契其舟，曰：“是吾剑之所从坠。",
        "pinyin": "chǔ rén yǒu shè jiāng zhě ， qí jiàn zì zhōu zhōng zhuì yú shuǐ ， jù qì qí zhōu ， yuē ：“ shì wú jiàn zhī suǒ cóng zhuì 。"
       },
       {
        "text": "”舟止，从其所契者入水求之。",
        "pinyin": "” zhōu zhǐ ， cóng qí suǒ qì zhě rù shuǐ qiú zhī 。"
       },
       {
        "text": "舟已行矣，而剑不行，求剑若此，不亦惑乎！",
        "pinyin": "zhōu yǐ xíng yǐ ， ér jiàn bù xíng ， qiú jiàn ruò cǐ ， bú yì huò hū ！"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-youshijiqu",
      "title": "幼时记趣",
      "author": "沈复《浮生六记·闲情记趣》节选",
      "dynasty": "苏教版",
      "grade": "七年级上册",
      "sentences": [
       {
        "text": "余忆童稚时，能张目对日，明察秋毫。",
        "pinyin": "yú yì tóng zhì shí ， néng zhāng mù duì rì ， míng chá qiū háo 。"
       },
       {
        "text": "见藐小微物，必细察其纹理，故时有物外之趣。",
        "pinyin": "jiàn miǎo xiǎo wēi wù ， bì xì chá qí wén lǐ ， gù shí yǒu wù wài zhī qù 。"
       },
       {
        "text": "夏蚊成雷，私拟作群鹤舞空。",
        "pinyin": "xià wén chéng léi ， sī nǐ zuò qún hè wǔ kōng 。"
       },
       {
        "text": "心之所向，则或千或百，果然鹤也。",
        "pinyin": "xīn zhī suǒ xiàng ， zé huò qiān huò bǎi ， guǒ rán hè yě 。"
       },
       {
        "text": "昂首观之，项为之强。",
        "pinyin": "áng shǒu guān zhī ， xiàng wèi zhī qiáng 。"
       },
       {
        "text": "又留蚊于素帐中，徐喷以烟，使之冲烟飞鸣，作青云白鹤观，果如鹤唳云端，怡然称快。",
        "pinyin": "yòu liú wén yú sù zhàng zhōng ， xú pēn yǐ yān ， shǐ zhī chōng yān fēi míng ， zuò qīng yún bái hè guān ， guǒ rú hè lì yún duān ， yí rán chēng kuài 。"
       },
       {
        "text": "余常于土墙凹凸处，花台小草丛杂处，蹲其身，使与台齐，定神细视，以丛草为林，以虫蚁为兽，以土砾凸者为丘，凹者为壑，神游其中，怡然自得。",
        "pinyin": "yú cháng yú tǔ qiáng āo tū chù ， huā tái xiǎo cǎo cóng zá chù ， dūn qí shēn ， shǐ yǔ tái qí ， dìng shén xì shì ， yǐ cóng cǎo wèi lín ， yǐ chóng yǐ wèi shòu ， yǐ tǔ lì tū zhě wèi qiū ， āo zhě wèi hè ， shén yóu qí zhōng ， yí rán zì dé 。"
       },
       {
        "text": "一日，见二虫斗草间，观之正浓，忽有庞然大物，拔山倒树而来，盖一癞蛤蟆也。",
        "pinyin": "yí rì ， jiàn èr chóng dòu cǎo jiān ， guān zhī zhèng nóng ， hū yǒu páng rán dà wù ， bá shān dǎo shù ér lái ， gài yí lài há ma yě 。"
       },
       {
        "text": "舌一吐而二虫尽为所吞。",
        "pinyin": "shé yì tǔ ér èr chóng jìn wèi suǒ tūn 。"
       },
       {
        "text": "余年幼，方出神，不觉呀然惊恐。",
        "pinyin": "yú nián yòu ， fāng chū shén ， bù jué ya rán jīng kǒng 。"
       },
       {
        "text": "神定，捉蛤蟆，鞭数十，驱之别院。",
        "pinyin": "shén dìng ， zhuō há ma ， biān shù shí ， qū zhī bié yuàn 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-sanxia",
      "title": "三峡",
      "author": "郦道元《水经注·江水》",
      "dynasty": "苏教版",
      "grade": "七年级上册",
      "sentences": [
       {
        "text": "自三峡七百里中，两岸连山，略无阙处。",
        "pinyin": "zì sān xiá qī bǎi lǐ zhōng ， liǎng àn lián shān ， lüè wú quē chù 。"
       },
       {
        "text": "重岩叠嶂，隐天蔽日，自非亭午夜分，不见曦月。",
        "pinyin": "zhòng yán dié zhàng ， yǐn tiān bì rì ， zì fēi tíng wǔ yè fēn ， bú jiàn xī yuè 。"
       },
       {
        "text": "至于夏水襄陵，沿溯阻绝。",
        "pinyin": "zhì yú xià shuǐ xiāng líng ， yán sù zǔ jué 。"
       },
       {
        "text": "或王命急宣，有时朝发白帝，暮到江陵，其间千二百里，虽乘奔御风，不以疾也。",
        "pinyin": "huò wáng mìng jí xuān ， yǒu shí cháo fā bái dì ， mù dào jiāng líng ， qí jiān qiān èr bǎi lǐ ， suī chéng bēn yù fēng ， bù yǐ jí yě 。"
       },
       {
        "text": "春冬之时，则素湍绿潭，回清倒影。",
        "pinyin": "chūn dōng zhī shí ， zé sù tuān lǜ tán ， huí qīng dǎo yǐng 。"
       },
       {
        "text": "绝巘多生怪柏，悬泉瀑布，飞漱其间。",
        "pinyin": "jué yǎn duō shēng guài bǎi ， xuán quán pù bù ， fēi shù qí jiān 。"
       },
       {
        "text": "清荣峻茂，良多趣味。",
        "pinyin": "qīng róng jùn mào ， liáng duō qù wèi 。"
       },
       {
        "text": "每至晴初霜旦，林寒涧肃，常有高猿长啸，属引凄异，空谷传响，哀转久绝。",
        "pinyin": "měi zhì qíng chū shuāng dàn ， lín hán jiàn sù ， cháng yǒu gāo yuán cháng xiào ， shǔ yǐn qī yì ， kōng gǔ chuán xiǎng ， āi zhuǎn jiǔ jué 。"
       },
       {
        "text": "故渔者歌曰：“巴东三峡巫峡长，猿鸣三声泪沾裳。",
        "pinyin": "gù yú zhě gē yuē ：“ bā dōng sān xiá wū xiá cháng ， yuán míng sān shēng lèi zhān shang 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-yichongzhichong",
      "title": "以虫治虫",
      "author": "沈括",
      "dynasty": "苏教版",
      "grade": "七年级上册",
      "sentences": [
       {
        "text": "元丰中，庆州界生子方虫，方为秋田之害。",
        "pinyin": "yuán fēng zhōng ， qìng zhōu jiè shēng zǐ fāng chóng ， fāng wèi qiū tián zhī hài 。"
       },
       {
        "text": "忽有一虫生，如土中狗蝎，其喙有钳，千万蔽地；",
        "pinyin": "hū yǒu yì chóng shēng ， rú tǔ zhōng gǒu xiē ， qí huì yǒu qián ， qiān wàn bì dì ；"
       },
       {
        "text": "遇子方虫，则以钳搏之，悉为两段。",
        "pinyin": "yù zǐ fāng chóng ， zé yǐ qián bó zhī ， xī wèi liǎng duàn 。"
       },
       {
        "text": "旬日子方皆尽，岁以大穰。",
        "pinyin": "xún rì zi fāng jiē jìn ， suì yǐ dà ráng 。"
       },
       {
        "text": "其虫旧曾有之，土人谓之“傍不肯”。",
        "pinyin": "qí chóng jiù céng yǒu zhī ， tǔ rén wèi zhī “ bàng bù kěn ”。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-fantiansimuta",
      "title": "梵天寺木塔",
      "author": "沈括",
      "dynasty": "苏教版",
      "grade": "七年级上册",
      "sentences": [
       {
        "text": "钱氏据两浙时，于杭州梵天寺建一木塔，方两三级，钱帅登之，患其塔动。",
        "pinyin": "qián shì jù liǎng zhè shí ， yú háng zhōu fàn tiān sì jiàn yí mù tǎ ， fāng liǎng sān jí ， qián shuài dēng zhī ， huàn qí tǎ dòng 。"
       },
       {
        "text": "匠师云：“未布瓦，上轻，故如此。",
        "pinyin": "jiàng shī yún ：“ wèi bù wǎ ， shàng qīng ， gù rú cǐ 。"
       },
       {
        "text": "”乃以瓦布之，而动如初。",
        "pinyin": "” nǎi yǐ wǎ bù zhī ， ér dòng rú chū 。"
       },
       {
        "text": "无可奈何，密使其妻见喻皓之妻，贻以金钗，问塔动之因。",
        "pinyin": "wú kě nài hé ， mì shǐ qí qī jiàn yù hào zhī qī ， yí yǐ jīn chāi ， wèn tǎ dòng zhī yīn 。"
       },
       {
        "text": "皓笑曰：“此易耳，但逐层布板讫，便实钉之，则不动矣。",
        "pinyin": "hào xiào yuē ：“ cǐ yì ěr ， dàn zhú céng bù bǎn qì ， biàn shí dīng zhī ， zé bú dòng yǐ 。"
       },
       {
        "text": "”匠师如其言，塔遂定。",
        "pinyin": "” jiàng shī rú qí yán ， tǎ suì dìng 。"
       },
       {
        "text": "盖钉板上下弥束，六幕相联如胠箧，人履其板，六幕相持，自不能动。",
        "pinyin": "gài dīng bǎn shàng xià mí shù ， liù mù xiāng lián rú qū qiè ， rén lǚ qí bǎn ， liù mù xiāng chí ， zì bù néng dòng 。"
       },
       {
        "text": "人皆伏其精练。",
        "pinyin": "rén jiē fú qí jīng liàn 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-lunyubaze",
      "title": "〈论语〉八则",
      "author": "诵读欣赏",
      "dynasty": "苏教版",
      "grade": "七年级上册",
      "sentences": [
       {
        "text": "子曰：“学而时习之，不亦说乎？",
        "pinyin": "zǐ yuē ：“ xué ér shí xí zhī ， bú yì shuō hū ？"
       },
       {
        "text": "有朋自远方来，不亦乐乎？",
        "pinyin": "yǒu péng zì yuǎn fāng lái ， bú yì lè hū ？"
       },
       {
        "text": "人不知而不愠，不亦君子乎？",
        "pinyin": "rén bù zhī ér bú yùn ， bú yì jūn zǐ hū ？"
       },
       {
        "text": "子曰：“温故而知新，可以为师矣。",
        "pinyin": "zǐ yuē ：“ wēn gù ér zhī xīn ， kě yǐ wéi shī yǐ 。"
       },
       {
        "text": "子曰：“学而不思则罔，思而不学则殆。",
        "pinyin": "zǐ yuē ：“ xué ér bù sī zé wǎng ， sī ér bù xué zé dài 。"
       },
       {
        "text": "子曰：“由，诲女知之乎！",
        "pinyin": "zǐ yuē ：“ yóu ， huì nǚ zhī zhī hū ！"
       },
       {
        "text": "知之为知之，不知为不知，是知也。",
        "pinyin": "zhī zhī wèi zhī zhī ， bù zhī wèi bù zhī ， shì zhī yě 。"
       },
       {
        "text": "子贡问曰：“孔文子何以谓之‘文’也？",
        "pinyin": "zǐ gòng wèn yuē ：“ kǒng wén zǐ hé yǐ wèi zhī ‘ wén ’ yě ？"
       },
       {
        "text": "”子曰：“敏而好学，不耻下问，是以谓之‘文’也。",
        "pinyin": "” zǐ yuē ：“ mǐn ér hào xué ， bù chǐ xià wèn ， shì yǐ wèi zhī ‘ wén ’ yě 。"
       },
       {
        "text": "子曰：“默而识之，学而不厌，诲人不倦，何有于我哉？",
        "pinyin": "zǐ yuē ：“ mò ér shí zhī ， xué ér bú yàn ， huì rén bú juàn ， hé yǒu yú wǒ zāi ？"
       },
       {
        "text": "子曰：“三人行，必有我师焉；",
        "pinyin": "zǐ yuē ：“ sān rén xíng ， bì yǒu wǒ shī yān ；"
       },
       {
        "text": "择其善者而从之，其不善者而改之。",
        "pinyin": "zé qí shàn zhě ér cóng zhī ， qí bú shàn zhě ér gǎi zhī 。"
       },
       {
        "text": "子曰：“不愤不启，不悱不发。",
        "pinyin": "zǐ yuē ：“ bú fèn bù qǐ ， bù fěi bù fā 。"
       },
       {
        "text": "举一隅不以三隅反，则不复也。",
        "pinyin": "jǔ yì yú bù yǐ sān yú fǎn ， zé bú fù yě 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-lang",
      "title": "狼",
      "author": "蒲松龄《聊斋志异·狼三则》",
      "dynasty": "苏教版",
      "grade": "七年级上册",
      "sentences": [
       {
        "text": "一屠晚归，担中肉尽，止有剩骨。",
        "pinyin": "yì tú wǎn guī ， dān zhōng ròu jìn ， zhǐ yǒu shèng gǔ 。"
       },
       {
        "text": "途中两狼，缀行甚远。",
        "pinyin": "tú zhōng liǎng láng ， zhuì xíng shèn yuǎn 。"
       },
       {
        "text": "屠惧，投以骨。",
        "pinyin": "tú jù ， tóu yǐ gǔ 。"
       },
       {
        "text": "一狼得骨止，一狼仍从。",
        "pinyin": "yì láng dé gǔ zhǐ ， yì láng réng cóng 。"
       },
       {
        "text": "复投之，后狼止而前狼又至。",
        "pinyin": "fù tóu zhī ， hòu láng zhǐ ér qián láng yòu zhì 。"
       },
       {
        "text": "骨已尽矣，而两狼之并驱如故。",
        "pinyin": "gǔ yǐ jìn yǐ ， ér liǎng láng zhī bìng qū rú gù 。"
       },
       {
        "text": "屠大窘，恐前后受其敌。",
        "pinyin": "tú dà jiǒng ， kǒng qián hòu shòu qí dí 。"
       },
       {
        "text": "顾野有麦场，场主积薪其中，苫蔽成丘。",
        "pinyin": "gù yě yǒu mài chǎng ， chǎng zhǔ jī xīn qí zhōng ， shān bì chéng qiū 。"
       },
       {
        "text": "屠乃奔倚其下，弛担持刀。",
        "pinyin": "tú nǎi bēn yǐ qí xià ， chí dān chí dāo 。"
       },
       {
        "text": "狼不敢前，眈眈相向。",
        "pinyin": "láng bù gǎn qián ， dān dān xiāng xiàng 。"
       },
       {
        "text": "少时，一狼径去，其一犬坐于前。",
        "pinyin": "shǎo shí ， yì láng jìng qù ， qí yī quǎn zuò yú qián 。"
       },
       {
        "text": "久之，目似瞑，意暇甚。",
        "pinyin": "jiǔ zhī ， mù sì míng ， yì xiá shèn 。"
       },
       {
        "text": "屠暴起，以刀劈狼首，又数刀毙之。",
        "pinyin": "tú bào qǐ ， yǐ dāo pī láng shǒu ， yòu shù dāo bì zhī 。"
       },
       {
        "text": "方欲行，转视积薪后，一狼洞其中，意将隧入以攻其后也。",
        "pinyin": "fāng yù xíng ， zhuǎn shì jī xīn hòu ， yì láng dòng qí zhōng ， yì jiāng suì rù yǐ gōng qí hòu yě 。"
       },
       {
        "text": "身已半入，止露尻尾。",
        "pinyin": "shēn yǐ bàn rù ， zhǐ lù kāo wěi 。"
       },
       {
        "text": "屠自后断其股，亦毙之。",
        "pinyin": "tú zì hòu duàn qí gǔ ， yì bì zhī 。"
       },
       {
        "text": "乃悟前狼假寐，盖以诱敌。",
        "pinyin": "nǎi wù qián láng jiǎ mèi ， gài yǐ yòu dí 。"
       },
       {
        "text": "狼亦黠矣，而顷刻两毙，禽兽之变诈几何哉？",
        "pinyin": "láng yì xiá yǐ ， ér qǐng kè liǎng bì ， qín shòu zhī biàn zhà jǐ hé zāi ？"
       },
       {
        "text": "止增笑耳。",
        "pinyin": "zhǐ zēng xiào ěr 。"
       }
      ],
      "comment": ""
     }
    ]
   },
   {
    "id": "sj-vol-2",
    "name": "七年级下册",
    "articles": [
     {
      "id": "sj-zhaopu",
      "title": "赵普",
      "author": "《宋史·赵普传》节选",
      "dynasty": "苏教版",
      "grade": "七年级下册",
      "sentences": [
       {
        "text": "普少习吏事，寡学术，及为相，太祖常劝以读书。",
        "pinyin": "pǔ shǎo xí lì shì ， guǎ xué shù ， jí wèi xiāng ， tài zǔ cháng quàn yǐ dú shū 。"
       },
       {
        "text": "晚年手不释卷，每归私第，阖户启箧取书，读之竟日。",
        "pinyin": "wǎn nián shǒu bú shì juàn ， měi guī sī dì ， hé hù qǐ qiè qǔ shū ， dú zhī jìng rì 。"
       },
       {
        "text": "及次日临政，处决如流。",
        "pinyin": "jí cì rì lín zhèng ， chǔ jué rú liú 。"
       },
       {
        "text": "既薨，家人发箧视之，则《论语》二十篇也。",
        "pinyin": "jì hōng ， jiā rén fā qiè shì zhī ， zé 《 lún yǔ 》 èr shí piān yě 。"
       },
       {
        "text": "普性深沉有岸谷，虽多忌克，而能以天下事为己任。",
        "pinyin": "pǔ xìng shēn chén yǒu àn gǔ ， suī duō jì kè ， ér néng yǐ tiān xià shì wèi jǐ rèn 。"
       },
       {
        "text": "宋初，在相位者多龌龊循默，普刚毅果断，未有其比。",
        "pinyin": "sòng chū ， zài xiàng wèi zhě duō wò chuò xún mò ， pǔ gāng yì guǒ duàn ， wèi yǒu qí bǐ 。"
       },
       {
        "text": "尝奏荐某人为某官，太祖不用。",
        "pinyin": "cháng zòu jiàn mǒu rén wéi mǒu guān ， tài zǔ bú yòng 。"
       },
       {
        "text": "普明日复奏其人，亦不用。",
        "pinyin": "pǔ míng rì fù zòu qí rén ， yì bú yòng 。"
       },
       {
        "text": "明日，普又以其人奏，太祖怒，碎裂奏牍掷地，普颜色不变，跪而拾之以归。",
        "pinyin": "míng rì ， pǔ yòu yǐ qí rén zòu ， tài zǔ nù ， suì liè zòu dú zhì dì ， pǔ yán sè bú biàn ， guì ér shí zhī yǐ guī 。"
       },
       {
        "text": "他日补缀旧纸，复奏如初。",
        "pinyin": "tā rì bǔ zhuì jiù zhǐ ， fù zòu rú chū 。"
       },
       {
        "text": "太祖乃悟，卒用其人。",
        "pinyin": "tài zǔ nǎi wù ， zú yòng qí rén 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-liangxiaoerbianri",
      "title": "两小儿辩日",
      "author": "《列子·汤问》",
      "dynasty": "苏教版",
      "grade": "七年级下册",
      "sentences": [
       {
        "text": "孔子东游，见两小儿辩斗。",
        "pinyin": "kǒng zǐ dōng yóu ， jiàn liǎng xiǎo ér biàn dòu 。"
       },
       {
        "text": "问其故。",
        "pinyin": "wèn qí gù 。"
       },
       {
        "text": "一儿曰：“我以日始出时去人近，而日中时远也。",
        "pinyin": "yì ér yuē ：“ wǒ yǐ rì shǐ chū shí qù rén jìn ， ér rì zhōng shí yuǎn yě 。"
       },
       {
        "text": "一儿曰：“我以日初出远，而日中时近也。",
        "pinyin": "yì ér yuē ：“ wǒ yǐ rì chū chū yuǎn ， ér rì zhōng shí jìn yě 。"
       },
       {
        "text": "一儿曰：“日初出大如车盖，及日中则如盘盂，此不为远者小而近者大乎？",
        "pinyin": "yì ér yuē ：“ rì chū chū dà rú chē gài ， jí rì zhōng zé rú pán yú ， cǐ bú wèi yuǎn zhě xiǎo ér jìn zhě dà hū ？"
       },
       {
        "text": "一儿曰：“日初出沧沧凉凉，及其日中如探汤，此不为近者热而远者凉乎？",
        "pinyin": "yì ér yuē ：“ rì chū chū cāng cāng liáng liáng ， jí qí rì zhōng rú tàn tāng ， cǐ bú wèi jìn zhě rè ér yuǎn zhě liáng hū ？"
       },
       {
        "text": "孔子不能决也。",
        "pinyin": "kǒng zǐ bù néng jué yě 。"
       },
       {
        "text": "两小儿笑曰：“孰为汝多知乎？",
        "pinyin": "liǎng xiǎo ér xiào yuē ：“ shú wèi rǔ duō zhī hū ？"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-huanghelou",
      "title": "黄鹤楼",
      "author": "阎伯理",
      "dynasty": "苏教版",
      "grade": "七年级下册",
      "sentences": [
       {
        "text": "州城西南隅，有黄鹤楼者。",
        "pinyin": "zhōu chéng xī nán yú ， yǒu huáng hè lóu zhě 。"
       },
       {
        "text": "《图经》云：“费祎登仙，尝驾黄鹤返憩于此，遂以名楼。",
        "pinyin": "《 tú jīng 》 yún ：“ fèi yī dēng xiān ， cháng jià huáng hè fǎn qì yú cǐ ， suì yǐ míng lóu 。"
       },
       {
        "text": "”事列《神仙》之传，迹存《述异》之志。",
        "pinyin": "” shì liè 《 shén xiān 》 zhī chuán ， jì cún 《 shù yì 》 zhī zhì 。"
       },
       {
        "text": "观其耸构巍峨，高标巃嵸，上倚河汉，下临江流；",
        "pinyin": "guān qí sǒng gòu wēi é ， gāo biāo lóng zǒng ， shàng yǐ hé hàn ， xià lín jiāng liú ；"
       },
       {
        "text": "重檐翼馆，四闼霞敞；",
        "pinyin": "zhòng yán yì guǎn ， sì tà xiá chǎng ；"
       },
       {
        "text": "坐窥井邑，俯拍云烟：亦荆吴形胜之最也。",
        "pinyin": "zuò kuī jǐng yì ， fǔ pāi yún yān ： yì jīng wú xíng shèng zhī zuì yě 。"
       },
       {
        "text": "何必濑乡九柱、东阳八咏，乃可赏观时物、会集灵仙者哉！",
        "pinyin": "hé bì lài xiāng jiǔ zhù 、 dōng yáng bā yǒng ， nǎi kě shǎng guān shí wù 、 huì jí líng xiān zhě zāi ！"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-yuyuan",
      "title": "于园",
      "author": "张岱《陶庵梦忆》",
      "dynasty": "苏教版",
      "grade": "七年级下册",
      "sentences": [
       {
        "text": "于园在瓜洲步五里铺，富人于五所园也。",
        "pinyin": "yú yuán zài guā zhōu bù wǔ lǐ pù ， fù rén yú wǔ suǒ yuán yě 。"
       },
       {
        "text": "非显者刺，则门钥不得出。",
        "pinyin": "fēi xiǎn zhě cì ， zé mén yào bù dé chū 。"
       },
       {
        "text": "葆生叔同知瓜洲，携余往，主人处处款之。",
        "pinyin": "bǎo shēng shū tóng zhī guā zhōu ， xié yú wǎng ， zhǔ rén chù chù kuǎn zhī 。"
       },
       {
        "text": "园中无他奇，奇在磊石。",
        "pinyin": "yuán zhōng wú tā qí ， qí zài lěi shí 。"
       },
       {
        "text": "前堂石坡高二丈，上植果子松数棵，缘坡植牡丹、芍药，人不得上，以实奇。",
        "pinyin": "qián táng shí pō gāo èr zhàng ， shàng zhí guǒ zǐ sōng shù kē ， yuán pō zhí mǔ dān 、 sháo yào ， rén bù dé shàng ， yǐ shí qí 。"
       },
       {
        "text": "后厅临大池，池中奇峰绝壑，陡上陡下，人走池底，仰视莲花反在天上，以空奇。",
        "pinyin": "hòu tīng lín dà chí ， chí zhōng qí fēng jué hè ， dǒu shàng dǒu xià ， rén zǒu chí dǐ ， yǎng shì lián huā fǎn zài tiān shàng ， yǐ kōng qí 。"
       },
       {
        "text": "卧房槛外，一壑旋下如螺蛳缠，以幽阴深邃奇。",
        "pinyin": "wò fáng kǎn wài ， yí hè xuán xià rú luó sī chán ， yǐ yōu yīn shēn suì qí 。"
       },
       {
        "text": "再后一水阁，长如艇子，跨小河，四围灌木蒙丛，禽鸟啾唧，如深山茂林，坐其中，颓然碧窈。",
        "pinyin": "zài hòu yì shuǐ gé ， cháng rú tǐng zǐ ， kuà xiǎo hé ， sì wéi guàn mù méng cóng ， qín niǎo jiū jī ， rú shēn shān mào lín ， zuò qí zhōng ， tuí rán bì yǎo 。"
       },
       {
        "text": "瓜洲诸园亭，俱以假山显，胎于石，娠于磊石之手，男女于琢磨搜剔之主人，至于园可无憾矣。",
        "pinyin": "guā zhōu zhū yuán tíng ， jù yǐ jiǎ shān xiǎn ， tāi yú shí ， shēn yú lěi shí zhī shǒu ， nán nǚ yú zhuó mó sōu tī zhī zhǔ rén ， zhì yú yuán kě wú hàn yǐ 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-qianzhil",
      "title": "黔之驴",
      "author": "柳宗元《三戒》",
      "dynasty": "苏教版",
      "grade": "七年级下册",
      "sentences": [
       {
        "text": "黔无驴，有好事者船载以入。",
        "pinyin": "qián wú lǘ ， yǒu hǎo shì zhě chuán zǎi yǐ rù 。"
       },
       {
        "text": "至则无可用，放之山下。",
        "pinyin": "zhì zé wú kě yòng ， fàng zhī shān xià 。"
       },
       {
        "text": "虎见之，庞然大物也，以为神。",
        "pinyin": "hǔ jiàn zhī ， páng rán dà wù yě ， yǐ wéi shén 。"
       },
       {
        "text": "蔽林间窥之，稍出近之，慭慭然，莫相知。",
        "pinyin": "bì lín jiān kuī zhī ， shāo chū jìn zhī ， yìn yìn rán ， mò xiāng zhī 。"
       },
       {
        "text": "他日，驴一鸣，虎大骇，远遁，以为且噬己也，甚恐。",
        "pinyin": "tā rì ， lǘ yì míng ， hǔ dà hài ， yuǎn dùn ， yǐ wéi qiě shì jǐ yě ， shèn kǒng 。"
       },
       {
        "text": "然往来视之，觉无异能者。",
        "pinyin": "rán wǎng lái shì zhī ， jué wú yì néng zhě 。"
       },
       {
        "text": "益习其声，又近出前后，终不敢搏。",
        "pinyin": "yì xí qí shēng ， yòu jìn chū qián hòu ， zhōng bù gǎn bó 。"
       },
       {
        "text": "稍近，益狎，荡倚冲冒，驴不胜怒，蹄之。",
        "pinyin": "shāo jìn ， yì xiá ， dàng yǐ chōng mào ， lǘ bú shèng nù ， tí zhī 。"
       },
       {
        "text": "虎因喜，计之曰：“技止此耳！",
        "pinyin": "hǔ yīn xǐ ， jì zhī yuē ：“ jì zhǐ cǐ ěr ！"
       },
       {
        "text": "”因跳踉大㘎，断其喉，尽其肉，乃去。",
        "pinyin": "” yīn tiào liàng dà hǎn ， duàn qí hóu ， jìn qí ròu ， nǎi qù 。"
       },
       {
        "text": "噫！",
        "pinyin": "yī ！"
       },
       {
        "text": "形之庞也类有德，声之宏也类有能。",
        "pinyin": "xíng zhī páng yě lèi yǒu dé ， shēng zhī hóng yě lèi yǒu néng 。"
       },
       {
        "text": "向不出其技，虎虽猛，疑畏，卒不敢取；",
        "pinyin": "xiàng bù chū qí jì ， hǔ suī měng ， yí wèi ， zú bù gǎn qǔ ；"
       },
       {
        "text": "今若是焉，悲夫！",
        "pinyin": "jīn ruò shì yān ， bēi fū ！"
       }
      ],
      "comment": ""
     }
    ]
   },
   {
    "id": "sj-vol-3",
    "name": "八年级上册",
    "articles": [
     {
      "id": "sj-yanzishichu",
      "title": "晏子使楚",
      "author": "《晏子春秋》",
      "dynasty": "苏教版",
      "grade": "八年级上册",
      "sentences": [
       {
        "text": "晏子将使楚。",
        "pinyin": "yàn zǐ jiāng shǐ chǔ 。"
       },
       {
        "text": "楚王闻之，谓左右曰：“晏婴，齐之习辞者也，今方来，吾欲辱之，何以也？",
        "pinyin": "chǔ wáng wén zhī ， wèi zuǒ yòu yuē ：“ yàn yīng ， qí zhī xí cí zhě yě ， jīn fāng lái ， wú yù rǔ zhī ， hé yǐ yě ？"
       },
       {
        "text": "”左右对曰：“为其来也，臣请缚一人，过王而行。",
        "pinyin": "” zuǒ yòu duì yuē ：“ wèi qí lái yě ， chén qǐng fù yì rén ， guò wáng ér xíng 。"
       },
       {
        "text": "王曰，何为者也？",
        "pinyin": "wáng yuē ， hé wèi zhě yě ？"
       },
       {
        "text": "对曰，齐人也。",
        "pinyin": "duì yuē ， qí rén yě 。"
       },
       {
        "text": "王曰，何坐？",
        "pinyin": "wáng yuē ， hé zuò ？"
       },
       {
        "text": "曰，坐盗。",
        "pinyin": "yuē ， zuò dào 。"
       },
       {
        "text": "晏子至，楚王赐晏子酒，酒酣，吏二缚一人诣王。",
        "pinyin": "yàn zǐ zhì ， chǔ wáng cì yàn zǐ jiǔ ， jiǔ hān ， lì èr fù yì rén yì wáng 。"
       },
       {
        "text": "王曰：“缚者曷为者也？",
        "pinyin": "wáng yuē ：“ fù zhě hé wèi zhě yě ？"
       },
       {
        "text": "”对曰：“齐人也，坐盗。",
        "pinyin": "” duì yuē ：“ qí rén yě ， zuò dào 。"
       },
       {
        "text": "”王视晏子曰：“齐人固善盗乎？",
        "pinyin": "” wáng shì yàn zǐ yuē ：“ qí rén gù shàn dào hū ？"
       },
       {
        "text": "”晏子避席对曰：“婴闻之，橘生淮南则为橘，生于淮北则为枳，叶徒相似，其实味不同。",
        "pinyin": "” yàn zǐ bì xí duì yuē ：“ yīng wén zhī ， jú shēng huái nán zé wèi jú ， shēng yú huái běi zé wèi zhǐ ， yè tú xiāng sì ， qí shí wèi bù tóng 。"
       },
       {
        "text": "所以然者何？",
        "pinyin": "suǒ yǐ rán zhě hé ？"
       },
       {
        "text": "水土异也。",
        "pinyin": "shuǐ tǔ yì yě 。"
       },
       {
        "text": "今民生长于齐不盗，入楚则盗，得无楚之水土使民善盗耶？",
        "pinyin": "jīn mín shēng zhǎng yú qí bú dào ， rù chǔ zé dào ， dé wú chǔ zhī shuǐ tǔ shǐ mín shàn dào yē ？"
       },
       {
        "text": "”王笑曰：“圣人非所与熙也，寡人反取病焉。",
        "pinyin": "” wáng xiào yuē ：“ shèng rén fēi suǒ yǔ xī yě ， guǎ rén fǎn qǔ bìng yān 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-renqinjuwang",
      "title": "人琴俱亡",
      "author": "刘义庆《世说新语·伤逝》",
      "dynasty": "苏教版",
      "grade": "八年级上册",
      "sentences": [
       {
        "text": "王子猷、子敬俱病笃，而子敬先亡。",
        "pinyin": "wáng zǐ yóu 、 zǐ jìng jù bìng dǔ ， ér zǐ jìng xiān wáng 。"
       },
       {
        "text": "子猷问左右：“何以都不闻消息？",
        "pinyin": "zǐ yóu wèn zuǒ yòu ：“ hé yǐ dōu bù wén xiāo xī ？"
       },
       {
        "text": "此已丧矣！",
        "pinyin": "cǐ yǐ sàng yǐ ！"
       },
       {
        "text": "”语时了不悲。",
        "pinyin": "” yǔ shí le bù bēi 。"
       },
       {
        "text": "便索舆来奔丧，都不哭。",
        "pinyin": "biàn suǒ yú lái bēn sāng ， dōu bù kū 。"
       },
       {
        "text": "子敬素好琴，便径入坐灵床上，取子敬琴弹，弦既不调，掷地云：“子敬！",
        "pinyin": "zǐ jìng sù hǎo qín ， biàn jìng rù zuò líng chuáng shàng ， qǔ zǐ jìng qín tán ， xián jì bù tiáo ， zhì dì yún ：“ zǐ jìng ！"
       },
       {
        "text": "子敬！",
        "pinyin": "zǐ jìng ！"
       },
       {
        "text": "人琴俱亡！",
        "pinyin": "rén qín jù wáng ！"
       },
       {
        "text": "”因恸绝良久。",
        "pinyin": "” yīn tòng jué liáng jiǔ 。"
       },
       {
        "text": "月余亦卒。",
        "pinyin": "yuè yú yì zú 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-xiaoshitanji",
      "title": "小石潭记",
      "author": "柳宗元",
      "dynasty": "苏教版",
      "grade": "八年级上册",
      "sentences": [
       {
        "text": "从小丘西行百二十步，隔篁竹，闻水声，如鸣珮环，心乐之。",
        "pinyin": "cóng xiǎo qiū xī xíng bǎi èr shí bù ， gé huáng zhú ， wén shuǐ shēng ， rú míng pèi huán ， xīn lè zhī 。"
       },
       {
        "text": "伐竹取道，下见小潭，水尤清冽。",
        "pinyin": "fá zhú qǔ dào ， xià jiàn xiǎo tán ， shuǐ yóu qīng liè 。"
       },
       {
        "text": "全石以为底，近岸，卷石底以出，为坻，为屿，为嵁，为岩。",
        "pinyin": "quán shí yǐ wèi dǐ ， jìn àn ， juàn shí dǐ yǐ chū ， wèi dǐ ， wèi yǔ ， wèi kān ， wèi yán 。"
       },
       {
        "text": "青树翠蔓，蒙络摇缀，参差披拂。",
        "pinyin": "qīng shù cuì màn ， méng luò yáo zhuì ， cēn cī pī fú 。"
       },
       {
        "text": "潭中鱼可百许头，皆若空游无所依，日光下澈，影布石上。",
        "pinyin": "tán zhōng yú kě bǎi xǔ tóu ， jiē ruò kōng yóu wú suǒ yī ， rì guāng xià chè ， yǐng bù shí shàng 。"
       },
       {
        "text": "佁然不动，俶尔远逝，往来翕忽。",
        "pinyin": "yǐ rán bú dòng ， chù ěr yuǎn shì ， wǎng lái xī hū 。"
       },
       {
        "text": "似与游者相乐。",
        "pinyin": "sì yǔ yóu zhě xiāng lè 。"
       },
       {
        "text": "潭西南而望，斗折蛇行，明灭可见。",
        "pinyin": "tán xī nán ér wàng ， dòu zhé shé xíng ， míng miè kě jiàn 。"
       },
       {
        "text": "其岸势犬牙差互，不可知其源。",
        "pinyin": "qí àn shì quǎn yá chà hù ， bù kě zhī qí yuán 。"
       },
       {
        "text": "坐潭上，四面竹树环合，寂寥无人，凄神寒骨，悄怆幽邃。",
        "pinyin": "zuò tán shàng ， sì miàn zhú shù huán hé ， jì liáo wú rén ， qī shén hán gǔ ， qiāo chuàng yōu suì 。"
       },
       {
        "text": "以其境过清，不可久居，乃记之而去。",
        "pinyin": "yǐ qí jìng guò qīng ， bù kě jiǔ jū ， nǎi jì zhī ér qù 。"
       },
       {
        "text": "同游者：吴武陵，龚古，余弟宗玄。",
        "pinyin": "tóng yóu zhě ： wú wǔ líng ， gōng gǔ ， yú dì zōng xuán 。"
       },
       {
        "text": "隶而从者，崔氏二小生：曰恕己，曰奉壹。",
        "pinyin": "lì ér cóng zhě ， cuī shì èr xiǎo shēng ： yuē shù jǐ ， yuē fèng yī 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-jichengtiansiyeyou",
      "title": "记承天寺夜游",
      "author": "苏轼",
      "dynasty": "苏教版",
      "grade": "八年级上册",
      "sentences": [
       {
        "text": "元丰六年十月十二日夜，解衣欲睡，月色入户，欣然起行。",
        "pinyin": "yuán fēng liù nián shí yuè shí èr rì yè ， jiě yī yù shuì ， yuè sè rù hù ， xīn rán qǐ xíng 。"
       },
       {
        "text": "念无与为乐者，遂至承天寺寻张怀民。",
        "pinyin": "niàn wú yǔ wèi lè zhě ， suì zhì chéng tiān sì xún zhāng huái mín 。"
       },
       {
        "text": "怀民亦未寝，相与步于中庭。",
        "pinyin": "huái mín yì wèi qǐn ， xiāng yǔ bù yú zhōng tíng 。"
       },
       {
        "text": "庭下如积水空明，水中藻、荇交横，盖竹柏影也。",
        "pinyin": "tíng xià rú jī shuǐ kōng míng ， shuǐ zhōng zǎo 、 xìng jiāo héng ， gài zhú bǎi yǐng yě 。"
       },
       {
        "text": "何夜无月？",
        "pinyin": "hé yè wú yuè ？"
       },
       {
        "text": "何处无竹柏？",
        "pinyin": "hé chù wú zhú bǎi ？"
       },
       {
        "text": "但少闲人如吾两人者耳。",
        "pinyin": "dàn shǎo xián rén rú wú liǎng rén zhě ěr 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-zhishuibigongqin",
      "title": "治水必躬亲",
      "author": "钱泳《履园丛话》",
      "dynasty": "苏教版",
      "grade": "八年级上册",
      "sentences": [
       {
        "text": "治水之法，既不可执一，泥于掌故，亦不可妄意轻信人言。",
        "pinyin": "zhì shuǐ zhī fǎ ， jì bù kě zhí yī ， ní yú zhǎng gù ， yì bù kě wàng yì qīng xìn rén yán 。"
       },
       {
        "text": "盖地有高低，流有缓急，潴有浅深，势有曲直，非相度不得其情，非咨询不穷其致，是以必得躬历山川，亲劳胼胝。",
        "pinyin": "gài dì yǒu gāo dī ， liú yǒu huǎn jí ， zhū yǒu qiǎn shēn ， shì yǒu qū zhí ， fēi xiāng dù bù dé qí qíng ， fēi zī xún bù qióng qí zhì ， shì yǐ bì dé gōng lì shān chuān ， qīn láo pián zhī 。"
       },
       {
        "text": "昔海忠介治河，布袍缓带，冒雨冲风，往来于荒村野水之间，亲给钱粮，不扣一厘，而随官人役亦未尝横索一钱。",
        "pinyin": "xī hǎi zhōng jiè zhì hé ， bù páo huǎn dài ， mào yǔ chōng fēng ， wǎng lái yú huāng cūn yě shuǐ zhī jiān ， qīn gěi qián liáng ， bú kòu yì lí ， ér suí guān rén yì yì wèi cháng héng suǒ yì qián 。"
       },
       {
        "text": "必如是，而后事可举也。",
        "pinyin": "bì rú shì ， ér hòu shì kě jǔ yě 。"
       },
       {
        "text": "如好逸而恶劳，计利而忘义，远嫌而避怨，则事不举而水利不兴矣。",
        "pinyin": "rú hǎo yì ér è láo ， jì lì ér wàng yì ， yuǎn xián ér bì yuàn ， zé shì bù jǔ ér shuǐ lì bù xīng yǐ 。"
       }
      ],
      "comment": ""
     }
    ]
   },
   {
    "id": "sj-vol-4",
    "name": "八年级下册",
    "articles": [
     {
      "id": "sj-mashuo",
      "title": "马说",
      "author": "韩愈",
      "dynasty": "苏教版",
      "grade": "八年级下册",
      "sentences": [
       {
        "text": "世有伯乐，然后有千里马。",
        "pinyin": "shì yǒu bó lè ， rán hòu yǒu qiān lǐ mǎ 。"
       },
       {
        "text": "千里马常有，而伯乐不常有。",
        "pinyin": "qiān lǐ mǎ cháng yǒu ， ér bó lè bù cháng yǒu 。"
       },
       {
        "text": "故虽有名马，只辱于奴隶人之手，骈死于槽枥之间，不以千里称也。",
        "pinyin": "gù suī yǒu míng mǎ ， zhī rǔ yú nú lì rén zhī shǒu ， pián sǐ yú cáo lì zhī jiān ， bù yǐ qiān lǐ chēng yě 。"
       },
       {
        "text": "马之千里者，一食或尽粟一石。",
        "pinyin": "mǎ zhī qiān lǐ zhě ， yì shí huò jìn sù yì shí 。"
       },
       {
        "text": "食马者不知其能千里而食也。",
        "pinyin": "shí mǎ zhě bù zhī qí néng qiān lǐ ér shí yě 。"
       },
       {
        "text": "是马也，虽有千里之能，食不饱，力不足，才美不外见，且欲与常马等不可得，安求其能千里也？",
        "pinyin": "shì mǎ yě ， suī yǒu qiān lǐ zhī néng ， shí bù bǎo ， lì bù zú ， cái měi bú wài jiàn ， qiě yù yǔ cháng mǎ děng bù kě dé ， ān qiú qí néng qiān lǐ yě ？"
       },
       {
        "text": "策之不以其道，食之不能尽其材，鸣之而不能通其意，执策而临之，曰：“天下无马！",
        "pinyin": "cè zhī bù yǐ qí dào ， shí zhī bù néng jìn qí cái ， míng zhī ér bù néng tōng qí yì ， zhí cè ér lín zhī ， yuē ：“ tiān xià wú mǎ ！"
       },
       {
        "text": "”呜呼！",
        "pinyin": "” wū hū ！"
       },
       {
        "text": "其真无马邪？",
        "pinyin": "qí zhēn wú mǎ xié ？"
       },
       {
        "text": "其真不知马也。",
        "pinyin": "qí zhēn bù zhī mǎ yě 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-loushiming",
      "title": "陋室铭",
      "author": "刘禹锡",
      "dynasty": "苏教版",
      "grade": "八年级下册",
      "sentences": [
       {
        "text": "山不在高，有仙则名。",
        "pinyin": "shān bú zài gāo ， yǒu xiān zé míng 。"
       },
       {
        "text": "水不在深，有龙则灵。",
        "pinyin": "shuǐ bú zài shēn ， yǒu lóng zé líng 。"
       },
       {
        "text": "斯是陋室，惟吾德馨。",
        "pinyin": "sī shì lòu shì ， wéi wú dé xīn 。"
       },
       {
        "text": "苔痕上阶绿，草色入帘青。",
        "pinyin": "tái hén shàng jiē lǜ ， cǎo sè rù lián qīng 。"
       },
       {
        "text": "谈笑有鸿儒，往来无白丁。",
        "pinyin": "tán xiào yǒu hóng rú ， wǎng lái wú bái dīng 。"
       },
       {
        "text": "可以调素琴，阅金经。",
        "pinyin": "kě yǐ tiáo sù qín ， yuè jīn jīng 。"
       },
       {
        "text": "无丝竹之乱耳，无案牍之劳形。",
        "pinyin": "wú sī zhú zhī luàn ěr ， wú àn dú zhī láo xíng 。"
       },
       {
        "text": "南阳诸葛庐，西蜀子云亭。",
        "pinyin": "nán yáng zhū gě lú ， xī shǔ zǐ yún tíng 。"
       },
       {
        "text": "孔子云：何陋之有？",
        "pinyin": "kǒng zǐ yún ： hé lòu zhī yǒu ？"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-huoban",
      "title": "活板",
      "author": "沈括《梦溪笔谈》",
      "dynasty": "苏教版",
      "grade": "八年级下册",
      "sentences": [
       {
        "text": "板印书籍，唐人尚未盛为之。",
        "pinyin": "bǎn yìn shū jí ， táng rén shàng wèi shèng wèi zhī 。"
       },
       {
        "text": "五代时始印五经，已后典籍皆为板本。",
        "pinyin": "wǔ dài shí shǐ yìn wǔ jīng ， yǐ hòu diǎn jí jiē wèi bǎn běn 。"
       },
       {
        "text": "庆历中，有布衣毕昇，又为活板。",
        "pinyin": "qìng lì zhōng ， yǒu bù yī bì shēng ， yòu wèi huó bǎn 。"
       },
       {
        "text": "其法：用胶泥刻字，薄如钱唇，每字为一印，火烧令坚。",
        "pinyin": "qí fǎ ： yòng jiāo ní kè zì ， báo rú qián chún ， měi zì wèi yí yìn ， huǒ shāo lìng jiān 。"
       },
       {
        "text": "先设一铁板，其上以松脂、蜡和纸灰之类冒之。",
        "pinyin": "xiān shè yì tiě bǎn ， qí shàng yǐ sōng zhī 、 là hé zhǐ huī zhī lèi mào zhī 。"
       },
       {
        "text": "欲印，则以一铁范置铁板上，乃密布字印，满铁范为一板，持就火炀之，药稍熔，则以一平板按其面，则字平如砥。",
        "pinyin": "yù yìn ， zé yǐ yì tiě fàn zhì tiě bǎn shàng ， nǎi mì bù zì yìn ， mǎn tiě fàn wèi yì bǎn ， chí jiù huǒ yáng zhī ， yào shāo róng ， zé yǐ yì píng bǎn àn qí miàn ， zé zì píng rú dǐ 。"
       },
       {
        "text": "若止印三二本，未为简易；",
        "pinyin": "ruò zhǐ yìn sān èr běn ， wèi wèi jiǎn yì ；"
       },
       {
        "text": "若印数十百千本，则极为神速。",
        "pinyin": "ruò yìn shù shí bǎi qiān běn ， zé jí wéi shén sù 。"
       },
       {
        "text": "常作二铁板，一板印刷，一板已自布字，此印者才毕，则第二板已具，更互用之，瞬息可就。",
        "pinyin": "cháng zuò èr tiě bǎn ， yì bǎn yìn shuā ， yì bǎn yǐ zì bù zì ， cǐ yìn zhě cái bì ， zé dì èr bǎn yǐ jù ， gèng hù yòng zhī ， shùn xī kě jiù 。"
       },
       {
        "text": "每一字皆有数印，如“之”“也”等字，每字有二十余印，以备一板内有重复者。",
        "pinyin": "měi yí zì jiē yǒu shù yìn ， rú “ zhī ”“ yě ” děng zì ， měi zì yǒu èr shí yú yìn ， yǐ bèi yì bǎn nèi yǒu chóng fù zhě 。"
       },
       {
        "text": "不用，则以纸帖之，每韵为一帖，木格贮之。",
        "pinyin": "bú yòng ， zé yǐ zhǐ tiē zhī ， měi yùn wèi yì tiē ， mù gé zhù zhī 。"
       },
       {
        "text": "有奇字素无备者，旋刻之，以草火烧，瞬息可成。",
        "pinyin": "yǒu qí zì sù wú bèi zhě ， xuán kè zhī ， yǐ cǎo huǒ shāo ， shùn xī kě chéng 。"
       },
       {
        "text": "不以木为之者，文理有疏密，沾水则高下不平，兼与药相粘，不可取；",
        "pinyin": "bù yǐ mù wèi zhī zhě ， wén lǐ yǒu shū mì ， zhān shuǐ zé gāo xià bù píng ， jiān yǔ yào xiāng nián ， bù kě qǔ ；"
       },
       {
        "text": "不若燔土，用讫再火令药熔，以手拂之，其印自落，殊不沾污。",
        "pinyin": "bú ruò fán tǔ ， yòng qì zài huǒ lìng yào róng ， yǐ shǒu fú zhī ， qí yìn zì luò ， shū bù zhān wū 。"
       },
       {
        "text": "昇死，其印为余群从所得，至今保藏。",
        "pinyin": "shēng sǐ ， qí yìn wèi yú qún cóng suǒ dé ， zhì jīn bǎo cáng 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-hezhouji",
      "title": "核舟记",
      "author": "魏学洢《虞初新志》",
      "dynasty": "苏教版",
      "grade": "八年级下册",
      "sentences": [
       {
        "text": "明有奇巧人曰王叔远，能以径寸之木，为宫室、器皿、人物，以至鸟兽、木石，罔不因势象形，各具情态。",
        "pinyin": "míng yǒu qí qiǎo rén yuē wáng shū yuǎn ， néng yǐ jìng cùn zhī mù ， wèi gōng shì 、 qì mǐn 、 rén wù ， yǐ zhì niǎo shòu 、 mù shí ， wǎng bù yīn shì xiàng xíng ， gè jù qíng tài 。"
       },
       {
        "text": "尝贻余核舟一，盖大苏泛赤壁云。",
        "pinyin": "cháng yí yú hé zhōu yī ， gài dà sū fàn chì bì yún 。"
       },
       {
        "text": "舟首尾长约八分有奇，高可二黍许。",
        "pinyin": "zhōu shǒu wěi cháng yuē bā fēn yǒu qí ， gāo kě èr shǔ xǔ 。"
       },
       {
        "text": "中轩敞者为舱，箬篷覆之。",
        "pinyin": "zhōng xuān chǎng zhě wèi cāng ， ruò péng fù zhī 。"
       },
       {
        "text": "旁开小窗，左右各四，共八扇。",
        "pinyin": "páng kāi xiǎo chuāng ， zuǒ yòu gè sì ， gòng bā shàn 。"
       },
       {
        "text": "启窗而观，雕栏相望焉。",
        "pinyin": "qǐ chuāng ér guān ， diāo lán xiāng wàng yān 。"
       },
       {
        "text": "闭之，则右刻“山高月小，水落石出”，左刻“清风徐来，水波不兴”，石青糁之。",
        "pinyin": "bì zhī ， zé yòu kè “ shān gāo yuè xiǎo ， shuǐ luò shí chū ”， zuǒ kè “ qīng fēng xú lái ， shuǐ bō bù xīng ”， shí qīng shēn zhī 。"
       },
       {
        "text": "船头坐三人，中峨冠而多髯者为东坡，佛印居右，鲁直居左。",
        "pinyin": "chuán tóu zuò sān rén ， zhōng é guān ér duō rán zhě wèi dōng pō ， fó yìn jū yòu ， lǔ zhí jū zuǒ 。"
       },
       {
        "text": "苏、黄共阅一手卷。",
        "pinyin": "sū 、 huáng gòng yuè yì shǒu juàn 。"
       },
       {
        "text": "东坡右手执卷端，左手抚鲁直背。",
        "pinyin": "dōng pō yòu shǒu zhí juàn duān ， zuǒ shǒu fǔ lǔ zhí bèi 。"
       },
       {
        "text": "鲁直左手执卷末，右手指卷，如有所语。",
        "pinyin": "lǔ zhí zuǒ shǒu zhí juàn mò ， yòu shǒu zhǐ juàn ， rú yǒu suǒ yǔ 。"
       },
       {
        "text": "东坡现右足，鲁直现左足，各微侧，其两膝相比者，各隐卷底衣褶中。",
        "pinyin": "dōng pō xiàn yòu zú ， lǔ zhí xiàn zuǒ zú ， gè wēi cè ， qí liǎng xī xiāng bǐ zhě ， gè yǐn juàn dǐ yī zhě zhōng 。"
       },
       {
        "text": "佛印绝类弥勒，袒胸露乳，矫首昂视，神情与苏、黄不属。",
        "pinyin": "fó yìn jué lèi mí lè ， tǎn xiōng lù rǔ ， jiǎo shǒu áng shì ， shén qíng yǔ sū 、 huáng bù shǔ 。"
       },
       {
        "text": "卧右膝，诎右臂支船，而竖其左膝，左臂挂念珠倚之，珠可历历数也。",
        "pinyin": "wò yòu xī ， qū yòu bì zhī chuán ， ér shù qí zuǒ xī ， zuǒ bì guà niàn zhū yǐ zhī ， zhū kě lì lì shǔ yě 。"
       },
       {
        "text": "舟尾横卧一楫。",
        "pinyin": "zhōu wěi héng wò yì jí 。"
       },
       {
        "text": "楫左右舟子各一人。",
        "pinyin": "jí zuǒ yòu zhōu zǐ gè yì rén 。"
       },
       {
        "text": "居右者椎髻仰面，左手倚一衡木，右手攀右趾，若啸呼状。",
        "pinyin": "jū yòu zhě zhuī jì yǎng miàn ， zuǒ shǒu yǐ yì héng mù ， yòu shǒu pān yòu zhǐ ， ruò xiào hū zhuàng 。"
       },
       {
        "text": "居左者右手执蒲葵扇，左手抚炉，炉上有壶，其人视端容寂，若听茶声然。",
        "pinyin": "jū zuǒ zhě yòu shǒu zhí pú kuí shàn ， zuǒ shǒu fǔ lú ， lú shàng yǒu hú ， qí rén shì duān róng jì ， ruò tīng chá shēng rán 。"
       },
       {
        "text": "其船背稍夷，则题名其上，文曰“天启壬戌秋日，虞山王毅叔远甫刻”，细若蚊足，钩画了了，其色墨。",
        "pinyin": "qí chuán bèi shāo yí ， zé tí míng qí shàng ， wén yuē “ tiān qǐ rén xū qiū rì ， yú shān wáng yì shū yuǎn fǔ kè ”， xì ruò wén zú ， gōu huà liǎo liǎo ， qí sè mò 。"
       },
       {
        "text": "又用篆章一，文曰“初平山人”，其色丹。",
        "pinyin": "yòu yòng zhuàn zhāng yī ， wén yuē “ chū píng shān rén ”， qí sè dān 。"
       },
       {
        "text": "通计一舟，为人五；",
        "pinyin": "tōng jì yì zhōu ， wèi rén wǔ ；"
       },
       {
        "text": "为窗八；",
        "pinyin": "wèi chuāng bā ；"
       },
       {
        "text": "为箬篷，为楫，为炉，为壶，为手卷，为念珠各一；",
        "pinyin": "wèi ruò péng ， wèi jí ， wèi lú ， wèi hú ， wèi shǒu juàn ， wèi niàn zhū gè yī ；"
       },
       {
        "text": "对联、题名并篆文，为字共三十有四。",
        "pinyin": "duì lián 、 tí míng bìng zhuàn wén ， wèi zì gòng sān shí yǒu sì 。"
       },
       {
        "text": "而计其长曾不盈寸。",
        "pinyin": "ér jì qí cháng céng bù yíng cùn 。"
       },
       {
        "text": "盖简桃核修狭者为之。",
        "pinyin": "gài jiǎn táo hé xiū xiá zhě wèi zhī 。"
       },
       {
        "text": "嘻，技亦灵怪矣哉！",
        "pinyin": "xī ， jì yì líng guài yǐ zāi ！"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-shanshi",
      "title": "山市",
      "author": "蒲松龄《聊斋志异》",
      "dynasty": "苏教版",
      "grade": "八年级下册",
      "sentences": [
       {
        "text": "奂山山市，邑八景之一也，然数年恒不一见。",
        "pinyin": "huàn shān shān shì ， yì bā jǐng zhī yī yě ， rán shù nián héng bù yí jiàn 。"
       },
       {
        "text": "孙公子禹年与同人饮楼上，忽见山头有孤塔耸起，高插青冥，相顾惊疑，念近中无此禅院。",
        "pinyin": "sūn gōng zǐ yǔ nián yǔ tóng rén yǐn lóu shàng ， hū jiàn shān tóu yǒu gū tǎ sǒng qǐ ， gāo chā qīng míng ， xiāng gù jīng yí ， niàn jìn zhōng wú cǐ chán yuàn 。"
       },
       {
        "text": "无何，见宫殿数十所，碧瓦飞甍，始悟为山市。",
        "pinyin": "wú hé ， jiàn gōng diàn shù shí suǒ ， bì wǎ fēi méng ， shǐ wù wèi shān shì 。"
       },
       {
        "text": "未几，高垣睥睨，连亘六七里，居然城郭矣。",
        "pinyin": "wèi jǐ ， gāo yuán pì nì ， lián gèn liù qī lǐ ， jū rán chéng guō yǐ 。"
       },
       {
        "text": "中有楼若者，堂若者，坊若者，历历在目，以亿万计。",
        "pinyin": "zhōng yǒu lóu ruò zhě ， táng ruò zhě ， fāng ruò zhě ， lì lì zài mù ， yǐ yì wàn jì 。"
       },
       {
        "text": "忽大风起，尘气莽莽然，城市依稀而已。",
        "pinyin": "hū dà fēng qǐ ， chén qì mǎng mǎng rán ， chéng shì yī xī ér yǐ 。"
       },
       {
        "text": "既而风定天清，一切乌有，惟危楼一座，直接霄汉。",
        "pinyin": "jì ér fēng dìng tiān qīng ， yí qiè wū yǒu ， wéi wēi lóu yí zuò ， zhí jiē xiāo hàn 。"
       },
       {
        "text": "楼五架，窗扉皆洞开；",
        "pinyin": "lóu wǔ jià ， chuāng fēi jiē dòng kāi ；"
       },
       {
        "text": "一行有五点明处，楼与天相接也。",
        "pinyin": "yì háng yǒu wǔ diǎn míng chù ， lóu yǔ tiān xiāng jiē yě 。"
       },
       {
        "text": "层层指数，楼愈高，则明渐少。",
        "pinyin": "céng céng zhǐ shù ， lóu yù gāo ， zé míng jiàn shǎo 。"
       },
       {
        "text": "数至八层，裁如星点。",
        "pinyin": "shù zhì bā céng ， cái rú xīng diǎn 。"
       },
       {
        "text": "又其上，则黯然缥缈，不可计其层次矣。",
        "pinyin": "yòu qí shàng ， zé àn rán piāo miǎo ， bù kě jì qí céng cì yǐ 。"
       },
       {
        "text": "而楼上人往来屑屑，或凭或立，不一状。",
        "pinyin": "ér lóu shàng rén wǎng lái xiè xiè ， huò píng huò lì ， bù yí zhuàng 。"
       },
       {
        "text": "逾时，楼渐低，可见其顶；",
        "pinyin": "yú shí ， lóu jiàn dī ， kě jiàn qí dǐng ；"
       },
       {
        "text": "又渐如常楼；",
        "pinyin": "yòu jiàn rú cháng lóu ；"
       },
       {
        "text": "又渐如高舍；",
        "pinyin": "yòu jiàn rú gāo shè ；"
       },
       {
        "text": "倏忽如拳如豆，遂不可见。",
        "pinyin": "shū hū rú quán rú dòu ， suì bù kě jiàn 。"
       },
       {
        "text": "又闻有早行者，见山上人烟市肆，与世无别，故又名“鬼市”云。",
        "pinyin": "yòu wén yǒu zǎo xíng zhě ， jiàn shān shàng rén yān shì sì ， yǔ shì wú bié ， gù yòu míng “ guǐ shì ” yún 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-kouji",
      "title": "口技",
      "author": "林嗣环《秋声诗自序》节选",
      "dynasty": "苏教版",
      "grade": "八年级下册",
      "sentences": [
       {
        "text": "京中有善口技者。",
        "pinyin": "jīng zhōng yǒu shàn kǒu jì zhě 。"
       },
       {
        "text": "会宾客大宴，于厅事之东北角，施八尺屏障，口技人坐屏障中，一桌、一椅、一扇、一抚尺而已。",
        "pinyin": "huì bīn kè dà yàn ， yú tīng shì zhī dōng běi jiǎo ， shī bā chǐ píng zhàng ， kǒu jì rén zuò píng zhàng zhōng ， yì zhuō 、 yì yǐ 、 yí shàn 、 yì fǔ chǐ ér yǐ 。"
       },
       {
        "text": "众宾团坐。",
        "pinyin": "zhòng bīn tuán zuò 。"
       },
       {
        "text": "少顷，但闻屏障中抚尺一下，满坐寂然，无敢哗者。",
        "pinyin": "shǎo qǐng ， dàn wén píng zhàng zhōng fǔ chǐ yí xià ， mǎn zuò jì rán ， wú gǎn huá zhě 。"
       },
       {
        "text": "遥闻深巷中犬吠，便有妇人惊觉欠伸，其夫呓语。",
        "pinyin": "yáo wén shēn xiàng zhōng quǎn fèi ， biàn yǒu fù rén jīng jué qiàn shēn ， qí fū yì yǔ 。"
       },
       {
        "text": "既而儿醒，大啼。",
        "pinyin": "jì ér ér xǐng ， dà tí 。"
       },
       {
        "text": "夫亦醒。",
        "pinyin": "fū yì xǐng 。"
       },
       {
        "text": "妇抚儿乳，儿含乳啼，妇拍而呜之。",
        "pinyin": "fù fǔ ér rǔ ， ér hán rǔ tí ， fù pāi ér wū zhī 。"
       },
       {
        "text": "又一大儿醒，絮絮不止。",
        "pinyin": "yòu yí dà ér xǐng ， xù xù bù zhǐ 。"
       },
       {
        "text": "当是时，妇手拍儿声，口中呜声，儿含乳啼声，大儿初醒声，夫叱大儿声，一时齐发，众妙毕备。",
        "pinyin": "dāng shì shí ， fù shǒu pāi ér shēng ， kǒu zhōng wū shēng ， ér hán rǔ tí shēng ， dà ér chū xǐng shēng ， fū chì dà ér shēng ， yì shí qí fā ， zhòng miào bì bèi 。"
       },
       {
        "text": "满坐宾客无不伸颈，侧目，微笑，默叹，以为妙绝。",
        "pinyin": "mǎn zuò bīn kè wú bù shēn jǐng ， cè mù ， wēi xiào ， mò tàn ， yǐ wéi miào jué 。"
       },
       {
        "text": "未几，夫齁声起，妇拍儿亦渐拍渐止。",
        "pinyin": "wèi jǐ ， fū hōu shēng qǐ ， fù pāi ér yì jiàn pāi jiàn zhǐ 。"
       },
       {
        "text": "微闻有鼠作作索索，盆器倾侧，妇梦中咳嗽。",
        "pinyin": "wēi wén yǒu shǔ zuò zuò suǒ suǒ ， pén qì qīng cè ， fù mèng zhōng ké sou 。"
       },
       {
        "text": "宾客意少舒，稍稍正坐。",
        "pinyin": "bīn kè yì shǎo shū ， shāo shāo zhèng zuò 。"
       },
       {
        "text": "忽一人“大呼火起”，夫起大呼，妇亦起大呼。",
        "pinyin": "hū yì rén “ dà hū huǒ qǐ ”， fū qǐ dà hū ， fù yì qǐ dà hū 。"
       },
       {
        "text": "两儿齐哭。",
        "pinyin": "liǎng ér qí kū 。"
       },
       {
        "text": "俄而百千人大呼，百千儿哭，百千犬吠。",
        "pinyin": "é ér bǎi qiān rén dà hū ， bǎi qiān ér kū ， bǎi qiān quǎn fèi 。"
       },
       {
        "text": "中间力拉崩倒之声，火爆声，呼呼风声，百千齐作；",
        "pinyin": "zhōng jiān lì lā bēng dǎo zhī shēng ， huǒ bào shēng ， hū hū fēng shēng ， bǎi qiān qí zuò ；"
       },
       {
        "text": "又夹百千求救声，曳屋许许声，抢夺声，泼水声。",
        "pinyin": "yòu jiá bǎi qiān qiú jiù shēng ， yè wū xǔ xǔ shēng ， qiǎng duó shēng ， pō shuǐ shēng 。"
       },
       {
        "text": "凡所应有，无所不有。",
        "pinyin": "fán suǒ yīng yǒu ， wú suǒ bù yǒu 。"
       },
       {
        "text": "虽人有百手，手有百指，不能指其一端；",
        "pinyin": "suī rén yǒu bǎi shǒu ， shǒu yǒu bǎi zhǐ ， bù néng zhǐ qí yī duān ；"
       },
       {
        "text": "人有百口，口有百舌，不能名其一处也。",
        "pinyin": "rén yǒu bǎi kǒu ， kǒu yǒu bǎi shé ， bù néng míng qí yī chù yě 。"
       },
       {
        "text": "于是宾客无不变色离席，奋袖出臂，两股战战，几欲先走。",
        "pinyin": "yú shì bīn kè wú bú biàn sè lí xí ， fèn xiù chū bì ， liǎng gǔ zhàn zhàn ， jǐ yù xiān zǒu 。"
       },
       {
        "text": "忽然抚尺一下，群响毕绝。",
        "pinyin": "hū rán fǔ chǐ yí xià ， qún xiǎng bì jué 。"
       },
       {
        "text": "撤屏视之，一人、一桌、一椅、一扇、一抚尺而已。",
        "pinyin": "chè píng shì zhī ， yì rén 、 yì zhuō 、 yì yǐ 、 yí shàn 、 yì fǔ chǐ ér yǐ 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-songdongyangmashengxu",
      "title": "送东阳马生序",
      "author": "宋濂",
      "dynasty": "苏教版",
      "grade": "八年级下册",
      "sentences": [
       {
        "text": "余幼时即嗜学。",
        "pinyin": "yú yòu shí jí shì xué 。"
       },
       {
        "text": "家贫，无从致书以观，每假借于藏书之家，手自笔录，计日以还。",
        "pinyin": "jiā pín ， wú cóng zhì shū yǐ guān ， měi jiǎ jiè yú cáng shū zhī jiā ， shǒu zì bǐ lù ， jì rì yǐ hái 。"
       },
       {
        "text": "天大寒，砚冰坚，手指不可屈伸，弗之怠。",
        "pinyin": "tiān dà hán ， yàn bīng jiān ， shǒu zhǐ bù kě qū shēn ， fú zhī dài 。"
       },
       {
        "text": "录毕，走送之，不敢稍逾约。",
        "pinyin": "lù bì ， zǒu sòng zhī ， bù gǎn shāo yú yuē 。"
       },
       {
        "text": "以是人多以书假余，余因得遍观群书。",
        "pinyin": "yǐ shì rén duō yǐ shū jiǎ yú ， yú yīn dé biàn guān qún shū 。"
       },
       {
        "text": "既加冠，益慕圣贤之道。",
        "pinyin": "jì jiā guān ， yì mù shèng xián zhī dào 。"
       },
       {
        "text": "又患无硕师名人与游，尝趋百里外，从乡之先达执经叩问。",
        "pinyin": "yòu huàn wú shuò shī míng rén yǔ yóu ， cháng qū bǎi lǐ wài ， cóng xiāng zhī xiān dá zhí jīng kòu wèn 。"
       },
       {
        "text": "先达德隆望尊，门人弟子填其室，未尝稍降辞色。",
        "pinyin": "xiān dá dé lóng wàng zūn ， mén rén dì zǐ tián qí shì ， wèi cháng shāo jiàng cí sè 。"
       },
       {
        "text": "余立侍左右，援疑质理，俯身倾耳以请；",
        "pinyin": "yú lì shì zuǒ yòu ， yuán yí zhì lǐ ， fǔ shēn qīng ěr yǐ qǐng ；"
       },
       {
        "text": "或遇其叱咄，色愈恭，礼愈至，不敢出一言以复；",
        "pinyin": "huò yù qí chì duō ， sè yù gōng ， lǐ yù zhì ， bù gǎn chū yì yán yǐ fù ；"
       },
       {
        "text": "俟其欣悦，则又请焉。",
        "pinyin": "sì qí xīn yuè ， zé yòu qǐng yān 。"
       },
       {
        "text": "故余虽愚，卒获有所闻。",
        "pinyin": "gù yú suī yú ， zú huò yǒu suǒ wén 。"
       },
       {
        "text": "当余之从师也，负箧曳屣行深山巨谷中。",
        "pinyin": "dāng yú zhī cóng shī yě ， fù qiè yè xǐ xíng shēn shān jù gǔ zhōng 。"
       },
       {
        "text": "穷冬烈风，大雪深数尺，足肤皲裂而不知。",
        "pinyin": "qióng dōng liè fēng ， dà xuě shēn shù chǐ ， zú fū jūn liè ér bù zhī 。"
       },
       {
        "text": "至舍，四支僵劲不能动，媵人持汤沃灌，以衾拥覆，久而乃和。",
        "pinyin": "zhì shè ， sì zhī jiāng jìn bù néng dòng ， yìng rén chí tāng wò guàn ， yǐ qīn yōng fù ， jiǔ ér nǎi hé 。"
       },
       {
        "text": "寓逆旅，主人日再食，无鲜肥滋味之享。",
        "pinyin": "yù nì lǚ ， zhǔ rén rì zài shí ， wú xiān féi zī wèi zhī xiǎng 。"
       },
       {
        "text": "同舍生皆被绮绣，戴朱缨宝饰之帽，腰白玉之环，左佩刀，右备容臭，烨然若神人；",
        "pinyin": "tóng shè shēng jiē bèi qǐ xiù ， dài zhū yīng bǎo shì zhī mào ， yāo bái yù zhī huán ， zuǒ pèi dāo ， yòu bèi róng chòu ， yè rán ruò shén rén ；"
       },
       {
        "text": "余则缊袍敝衣处其间，略无慕艳意，以中有足乐者，不知口体之奉不若人也。",
        "pinyin": "yú zé wēn páo bì yī chù qí jiān ， lüè wú mù yàn yì ， yǐ zhōng yǒu zú lè zhě ， bù zhī kǒu tǐ zhī fèng bú ruò rén yě 。"
       },
       {
        "text": "盖余之勤且艰若此。",
        "pinyin": "gài yú zhī qín qiě jiān ruò cǐ 。"
       },
       {
        "text": "今虽耄老，未有所成，犹幸预君子之列，而承天子之宠光，缀公卿之后，日侍坐备顾问，四海亦谬称其氏名，况才之过于余者乎？",
        "pinyin": "jīn suī mào lǎo ， wèi yǒu suǒ chéng ， yóu xìng yù jūn zǐ zhī liè ， ér chéng tiān zǐ zhī chǒng guāng ， zhuì gōng qīng zhī hòu ， rì shì zuò bèi gù wèn ， sì hǎi yì miù chēng qí shì míng ， kuàng cái zhī guò yú yú zhě hū ？"
       },
       {
        "text": "今诸生学于太学，县官日有廪稍之供，父母岁有裘葛之遗，无冻馁之患矣；",
        "pinyin": "jīn zhū shēng xué yú tài xué ， xiàn guān rì yǒu lǐn shāo zhī gòng ， fù mǔ suì yǒu qiú gě zhī yí ， wú dòng něi zhī huàn yǐ ；"
       },
       {
        "text": "坐大厦之下而诵诗书，无奔走之劳矣；",
        "pinyin": "zuò dà shà zhī xià ér sòng shī shū ， wú bēn zǒu zhī láo yǐ ；"
       },
       {
        "text": "有司业、博士为之师，未有问而不告、求而不得者也；",
        "pinyin": "yǒu sī yè 、 bó shì wèi zhī shī ， wèi yǒu wèn ér bú gào 、 qiú ér bù dé zhě yě ；"
       },
       {
        "text": "凡所宜有之书，皆集于此，不必若余之手录，假诸人而后见也。",
        "pinyin": "fán suǒ yí yǒu zhī shū ， jiē jí yú cǐ ， bú bì ruò yú zhī shǒu lù ， jiǎ zhū rén ér hòu jiàn yě 。"
       },
       {
        "text": "其业有不精、德有不成者，非天质之卑，则心不若余之专耳，岂他人之过哉！",
        "pinyin": "qí yè yǒu bù jīng 、 dé yǒu bù chéng zhě ， fēi tiān zhì zhī bēi ， zé xīn bú ruò yú zhī zhuān ěr ， qǐ tā rén zhī guò zāi ！"
       },
       {
        "text": "东阳马生君则，在太学已二年，流辈甚称其贤。",
        "pinyin": "dōng yáng mǎ shēng jūn zé ， zài tài xué yǐ èr nián ， liú bèi shèn chēng qí xián 。"
       },
       {
        "text": "余朝京师，生以乡人子谒余，撰长书以为贽，辞甚畅达，与之论辨，言和而色夷。",
        "pinyin": "yú cháo jīng shī ， shēng yǐ xiāng rén zǐ yè yú ， zhuàn cháng shū yǐ wéi zhì ， cí shèn chàng dá ， yǔ zhī lùn biàn ， yán hé ér sè yí 。"
       },
       {
        "text": "自谓少时用心于学甚劳，是可谓善学者矣！",
        "pinyin": "zì wèi shǎo shí yòng xīn yú xué shèn láo ， shì kě wèi shàn xué zhě yǐ ！"
       },
       {
        "text": "其将归见其亲也，余故道为学之难以告之。",
        "pinyin": "qí jiāng guī jiàn qí qīn yě ， yú gù dào wèi xué zhī nán yǐ gào zhī 。"
       },
       {
        "text": "谓余勉乡人以学者，余之志也；",
        "pinyin": "wèi yú miǎn xiāng rén yǐ xué zhě ， yú zhī zhì yě ；"
       },
       {
        "text": "诋我夸际遇之盛而骄乡人者，岂知余者哉！",
        "pinyin": "dǐ wǒ kuā jì yù zhī shèng ér jiāo xiāng rén zhě ， qǐ zhī yú zhě zāi ！"
       }
      ],
      "comment": ""
     }
    ]
   },
   {
    "id": "sj-vol-5",
    "name": "九年级上册",
    "articles": [
     {
      "id": "sj-dedaoduozhushidaoguazhu",
      "title": "得道多助，失道寡助",
      "author": "《孟子·公孙丑下》",
      "dynasty": "苏教版",
      "grade": "九年级上册",
      "sentences": [
       {
        "text": "天时不如地利，地利不如人和。",
        "pinyin": "tiān shí bù rú dì lì ， dì lì bù rú rén hé 。"
       },
       {
        "text": "三里之城，七里之郭，环而攻之而不胜。",
        "pinyin": "sān lǐ zhī chéng ， qī lǐ zhī guō ， huán ér gōng zhī ér bú shèng 。"
       },
       {
        "text": "夫环而攻之，必有得天时者矣，然而不胜者，是天时不如地利也。",
        "pinyin": "fū huán ér gōng zhī ， bì yǒu dé tiān shí zhě yǐ ， rán ér bú shèng zhě ， shì tiān shí bù rú dì lì yě 。"
       },
       {
        "text": "城非不高也，池非不深也，兵革非不坚利也，米粟非不多也，委而去之，是地利不如人和也。",
        "pinyin": "chéng fēi bù gāo yě ， chí fēi bù shēn yě ， bīng gé fēi bù jiān lì yě ， mǐ sù fēi bù duō yě ， wěi ér qù zhī ， shì dì lì bù rú rén hé yě 。"
       },
       {
        "text": "故曰：域民不以封疆之界，固国不以山溪之险，威天下不以兵革之利。",
        "pinyin": "gù yuē ： yù mín bù yǐ fēng jiāng zhī jiè ， gù guó bù yǐ shān xī zhī xiǎn ， wēi tiān xià bù yǐ bīng gé zhī lì 。"
       },
       {
        "text": "得道者多助，失道者寡助。",
        "pinyin": "dé dào zhě duō zhù ， shī dào zhě guǎ zhù 。"
       },
       {
        "text": "寡助之至，亲戚畔之；",
        "pinyin": "guǎ zhù zhī zhì ， qīn qi pàn zhī ；"
       },
       {
        "text": "多助之至，天下顺之。",
        "pinyin": "duō zhù zhī zhì ， tiān xià shùn zhī 。"
       },
       {
        "text": "以天下之所顺，攻亲戚之所畔，故君子有不战，战必胜矣。",
        "pinyin": "yǐ tiān xià zhī suǒ shùn ， gōng qīn qi zhī suǒ pàn ， gù jūn zǐ yǒu bú zhàn ， zhàn bì shèng yǐ 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-chensheshijia",
      "title": "陈涉世家",
      "author": "司马迁《史记》",
      "dynasty": "苏教版",
      "grade": "九年级上册",
      "sentences": [
       {
        "text": "二世元年七月，发闾左適戍渔阳，九百人屯大泽乡。",
        "pinyin": "èr shì yuán nián qī yuè ， fā lǘ zuǒ shì shù yú yáng ， jiǔ bǎi rén tún dà zé xiāng 。"
       },
       {
        "text": "陈胜、吴广皆次当行，为屯长。",
        "pinyin": "chén shèng 、 wú guǎng jiē cì dāng xíng ， wèi tún cháng 。"
       },
       {
        "text": "会天大雨，道不通，度已失期。",
        "pinyin": "huì tiān dà yǔ ， dào bù tōng ， dù yǐ shī qī 。"
       },
       {
        "text": "失期，法皆斩。",
        "pinyin": "shī qī ， fǎ jiē zhǎn 。"
       },
       {
        "text": "陈胜、吴广乃谋曰：“今亡亦死，举大计亦死；",
        "pinyin": "chén shèng 、 wú guǎng nǎi móu yuē ：“ jīn wáng yì sǐ ， jǔ dà jì yì sǐ ；"
       },
       {
        "text": "等死，死国可乎？",
        "pinyin": "děng sǐ ， sǐ guó kě hū ？"
       },
       {
        "text": "”陈胜曰：“天下苦秦久矣。",
        "pinyin": "” chén shèng yuē ：“ tiān xià kǔ qín jiǔ yǐ 。"
       },
       {
        "text": "吾闻二世少子也，不当立，当立者乃公子扶苏。",
        "pinyin": "wú wén èr shì shǎo zǐ yě ， bù dāng lì ， dāng lì zhě nǎi gōng zǐ fú sū 。"
       },
       {
        "text": "扶苏以数谏故，上使外将兵。",
        "pinyin": "fú sū yǐ shù jiàn gù ， shàng shǐ wài jiāng bīng 。"
       },
       {
        "text": "今或闻无罪，二世杀之。",
        "pinyin": "jīn huò wén wú zuì ， èr shì shā zhī 。"
       },
       {
        "text": "百姓多闻其贤，未知其死也。",
        "pinyin": "bǎi xìng duō wén qí xián ， wèi zhī qí sǐ yě 。"
       },
       {
        "text": "项燕为楚将，数有功，爱士卒，楚人怜之。",
        "pinyin": "xiàng yàn wèi chǔ jiāng ， shù yǒu gōng ， ài shì zú ， chǔ rén lián zhī 。"
       },
       {
        "text": "或以为死，或以为亡。",
        "pinyin": "huò yǐ wéi sǐ ， huò yǐ wéi wáng 。"
       },
       {
        "text": "今诚以吾众诈自称公子扶苏、项燕，为天下唱，宜多应者。",
        "pinyin": "jīn chéng yǐ wú zhòng zhà zì chēng gōng zǐ fú sū 、 xiàng yàn ， wèi tiān xià chàng ， yí duō yìng zhě 。"
       },
       {
        "text": "”吴广以为然。",
        "pinyin": "” wú guǎng yǐ wéi rán 。"
       },
       {
        "text": "乃行卜。",
        "pinyin": "nǎi xíng bǔ 。"
       },
       {
        "text": "卜者知其指意，曰：“足下事皆成，有功。",
        "pinyin": "bǔ zhě zhī qí zhǐ yì ， yuē ：“ zú xià shì jiē chéng ， yǒu gōng 。"
       },
       {
        "text": "然足下卜之鬼乎！",
        "pinyin": "rán zú xià bǔ zhī guǐ hū ！"
       },
       {
        "text": "”陈胜、吴广喜，念鬼，曰：“此教我先威众耳。",
        "pinyin": "” chén shèng 、 wú guǎng xǐ ， niàn guǐ ， yuē ：“ cǐ jiào wǒ xiān wēi zhòng ěr 。"
       },
       {
        "text": "”乃丹书帛曰“陈胜王”，置人所罾鱼腹中。",
        "pinyin": "” nǎi dān shū bó yuē “ chén shèng wáng ”， zhì rén suǒ zēng yú fù zhōng 。"
       },
       {
        "text": "卒买鱼烹食，得鱼腹中书，固以怪之矣。",
        "pinyin": "zú mǎi yú pēng shí ， dé yú fù zhōng shū ， gù yǐ guài zhī yǐ 。"
       },
       {
        "text": "又间令吴广之次所旁丛祠中，夜篝火，狐鸣呼曰“大楚兴，陈胜王”。",
        "pinyin": "yòu jiān lìng wú guǎng zhī cì suǒ páng cóng cí zhōng ， yè gōu huǒ ， hú míng hū yuē “ dà chǔ xīng ， chén shèng wáng ”。"
       },
       {
        "text": "卒皆夜惊恐。",
        "pinyin": "zú jiē yè jīng kǒng 。"
       },
       {
        "text": "旦日，卒中往往语，皆指目陈胜。",
        "pinyin": "dàn rì ， zú zhōng wǎng wǎng yǔ ， jiē zhǐ mù chén shèng 。"
       },
       {
        "text": "吴广素爱人，士卒多为用者。",
        "pinyin": "wú guǎng sù ài rén ， shì zú duō wèi yòng zhě 。"
       },
       {
        "text": "将尉醉，广故数言欲亡，忿恚尉，令辱之，以激怒其众。",
        "pinyin": "jiāng wèi zuì ， guǎng gù shù yán yù wáng ， fèn huì wèi ， lìng rǔ zhī ， yǐ jī nù qí zhòng 。"
       },
       {
        "text": "尉果笞广。",
        "pinyin": "wèi guǒ chī guǎng 。"
       },
       {
        "text": "尉剑挺，广起，夺而杀尉。",
        "pinyin": "wèi jiàn tǐng ， guǎng qǐ ， duó ér shā wèi 。"
       },
       {
        "text": "陈胜佐之，并杀两尉。",
        "pinyin": "chén shèng zuǒ zhī ， bìng shā liǎng wèi 。"
       },
       {
        "text": "召令徒属曰：“公等遇雨，皆已失期，失期当斩。",
        "pinyin": "zhào lìng tú shǔ yuē ：“ gōng děng yù yǔ ， jiē yǐ shī qī ， shī qī dāng zhǎn 。"
       },
       {
        "text": "藉第令毋斩，而戍死者固十六七。",
        "pinyin": "jiè dì lìng wú zhǎn ， ér shù sǐ zhě gù shí liù qī 。"
       },
       {
        "text": "且壮士不死即已，死即举大名耳，王侯将相宁有种乎！",
        "pinyin": "qiě zhuàng shì bù sǐ jí yǐ ， sǐ jí jǔ dà míng ěr ， wáng hóu jiàng xiàng níng yǒu zhǒng hū ！"
       },
       {
        "text": "”徒属皆曰：“敬受命。",
        "pinyin": "” tú shǔ jiē yuē ：“ jìng shòu mìng 。"
       },
       {
        "text": "”乃诈称公子扶苏、项燕。",
        "pinyin": "” nǎi zhà chēng gōng zǐ fú sū 、 xiàng yàn 。"
       },
       {
        "text": "从民欲也。",
        "pinyin": "cóng mín yù yě 。"
       },
       {
        "text": "袒右，称大楚。",
        "pinyin": "tǎn yòu ， chēng dà chǔ 。"
       },
       {
        "text": "为坛而盟，祭以尉首。",
        "pinyin": "wèi tán ér méng ， jì yǐ wèi shǒu 。"
       },
       {
        "text": "陈胜自立为将军，吴广为都尉。",
        "pinyin": "chén shèng zì lì wèi jiāng jūn ， wú guǎng wèi dōu wèi 。"
       },
       {
        "text": "攻大泽乡，收而攻蕲。",
        "pinyin": "gōng dà zé xiāng ， shōu ér gōng qí 。"
       },
       {
        "text": "蕲下，乃令符离人葛婴将兵徇蕲以东。",
        "pinyin": "qí xià ， nǎi lìng fú lí rén gě yīng jiāng bīng xùn qí yǐ dōng 。"
       },
       {
        "text": "攻铚、酂、苦、柘、谯皆下之。",
        "pinyin": "gōng zhì 、 zàn 、 kǔ 、 zhè 、 qiáo jiē xià zhī 。"
       },
       {
        "text": "行收兵。",
        "pinyin": "xíng shōu bīng 。"
       },
       {
        "text": "比至陈，车六七百乘，骑千余，卒数万人。",
        "pinyin": "bǐ zhì chén ， chē liù qī bǎi chéng ， qí qiān yú ， zú shù wàn rén 。"
       },
       {
        "text": "攻陈，陈守令皆不在，独守丞与战谯门中。",
        "pinyin": "gōng chén ， chén shǒu lìng jiē bú zài ， dú shǒu chéng yǔ zhàn qiáo mén zhōng 。"
       },
       {
        "text": "弗胜，守丞死，乃入据陈。",
        "pinyin": "fú shèng ， shǒu chéng sǐ ， nǎi rù jù chén 。"
       },
       {
        "text": "数日，号令召三老、豪杰与皆来会计事。",
        "pinyin": "shù rì ， hào lìng zhào sān lǎo 、 háo jié yǔ jiē lái kuài jì shì 。"
       },
       {
        "text": "三老、豪杰皆曰：“将军身被坚执锐，伐无道，诛暴秦，复立楚国之社稷，功宜为王。",
        "pinyin": "sān lǎo 、 háo jié jiē yuē ：“ jiāng jūn shēn bèi jiān zhí ruì ， fá wú dào ， zhū bào qín ， fù lì chǔ guó zhī shè jì ， gōng yí wèi wáng 。"
       },
       {
        "text": "”陈胜乃立为王，号为张楚。",
        "pinyin": "” chén shèng nǎi lì wèi wáng ， hào wèi zhāng chǔ 。"
       },
       {
        "text": "当此时，诸郡县苦秦吏者，皆刑其长吏，杀之以应陈涉。",
        "pinyin": "dāng cǐ shí ， zhū jùn xiàn kǔ qín lì zhě ， jiē xíng qí cháng lì ， shā zhī yǐ yìng chén shè 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-taohuayuanji",
      "title": "桃花源记",
      "author": "陶渊明",
      "dynasty": "苏教版",
      "grade": "九年级上册",
      "sentences": [
       {
        "text": "晋太元中，武陵人捕鱼为业。",
        "pinyin": "jìn tài yuán zhōng ， wǔ líng rén bǔ yú wèi yè 。"
       },
       {
        "text": "缘溪行，忘路之远近。",
        "pinyin": "yuán xī xíng ， wàng lù zhī yuǎn jìn 。"
       },
       {
        "text": "忽逢桃花林，夹岸数百步，中无杂树，芳草鲜美，落英缤纷。",
        "pinyin": "hū féng táo huā lín ， jiá àn shù bǎi bù ， zhōng wú zá shù ， fāng cǎo xiān měi ， luò yīng bīn fēn 。"
       },
       {
        "text": "渔人甚异之。",
        "pinyin": "yú rén shèn yì zhī 。"
       },
       {
        "text": "复前行，欲穷其林。",
        "pinyin": "fù qián xíng ， yù qióng qí lín 。"
       },
       {
        "text": "林尽水源，便得一山，山有小口，仿佛若有光。",
        "pinyin": "lín jìn shuǐ yuán ， biàn dé yì shān ， shān yǒu xiǎo kǒu ， fǎng fú ruò yǒu guāng 。"
       },
       {
        "text": "便舍船，从口入。",
        "pinyin": "biàn shè chuán ， cóng kǒu rù 。"
       },
       {
        "text": "初极狭，才通人。",
        "pinyin": "chū jí xiá ， cái tōng rén 。"
       },
       {
        "text": "复行数十步，豁然开朗。",
        "pinyin": "fù xíng shù shí bù ， huō rán kāi lǎng 。"
       },
       {
        "text": "土地平旷，屋舍俨然，有良田美池桑竹之属。",
        "pinyin": "tǔ dì píng kuàng ， wū shè yǎn rán ， yǒu liáng tián měi chí sāng zhú zhī shǔ 。"
       },
       {
        "text": "阡陌交通，鸡犬相闻。",
        "pinyin": "qiān mò jiāo tōng ， jī quǎn xiāng wén 。"
       },
       {
        "text": "其中往来种作，男女衣着，悉如外人。",
        "pinyin": "qí zhōng wǎng lái zhǒng zuò ， nán nǚ yī zhuó ， xī rú wài rén 。"
       },
       {
        "text": "黄发垂髫，并怡然自乐。",
        "pinyin": "huáng fà chuí tiáo ， bìng yí rán zì lè 。"
       },
       {
        "text": "见渔人，乃大惊，问所从来。",
        "pinyin": "jiàn yú rén ， nǎi dà jīng ， wèn suǒ cóng lái 。"
       },
       {
        "text": "具答之。",
        "pinyin": "jù dá zhī 。"
       },
       {
        "text": "便要还家，设酒杀鸡作食。",
        "pinyin": "biàn yào hái jiā ， shè jiǔ shā jī zuò shí 。"
       },
       {
        "text": "村中闻有此人，咸来问讯。",
        "pinyin": "cūn zhōng wén yǒu cǐ rén ， xián lái wèn xùn 。"
       },
       {
        "text": "自云先世避秦时乱，率妻子邑人来此绝境，不复出焉，遂与外人间隔。",
        "pinyin": "zì yún xiān shì bì qín shí luàn ， lǜ qī zǐ yì rén lái cǐ jué jìng ， bú fù chū yān ， suì yǔ wài rén jiàn gé 。"
       },
       {
        "text": "问今是何世，乃不知有汉，无论魏晋。",
        "pinyin": "wèn jīn shì hé shì ， nǎi bù zhī yǒu hàn ， wú lùn wèi jìn 。"
       },
       {
        "text": "此人一一为具言所闻，皆叹惋。",
        "pinyin": "cǐ rén yī yī wèi jù yán suǒ wén ， jiē tàn wǎn 。"
       },
       {
        "text": "余人各复延至其家，皆出酒食。",
        "pinyin": "yú rén gè fù yán zhì qí jiā ， jiē chū jiǔ shí 。"
       },
       {
        "text": "停数日，辞去。",
        "pinyin": "tíng shù rì ， cí qù 。"
       },
       {
        "text": "此中人语云：“不足为外人道也。",
        "pinyin": "cǐ zhōng rén yǔ yún ：“ bù zú wèi wài rén dào yě 。"
       },
       {
        "text": "既出，得其船，便扶向路，处处志之。",
        "pinyin": "jì chū ， dé qí chuán ， biàn fú xiàng lù ， chù chù zhì zhī 。"
       },
       {
        "text": "及郡下，诣太守，说如此。",
        "pinyin": "jí jùn xià ， yì tài shǒu ， shuō rú cǐ 。"
       },
       {
        "text": "太守即遣人随其往，寻向所志，遂迷，不复得路。",
        "pinyin": "tài shǒu jí qiǎn rén suí qí wǎng ， xún xiàng suǒ zhì ， suì mí ， bú fù dé lù 。"
       },
       {
        "text": "南阳刘子骥，高尚士也，闻之，欣然规往。",
        "pinyin": "nán yáng liú zǐ jì ， gāo shàng shì yě ， wén zhī ， xīn rán guī wǎng 。"
       },
       {
        "text": "未果，寻病终。",
        "pinyin": "wèi guǒ ， xún bìng zhōng 。"
       },
       {
        "text": "后遂无问津者。",
        "pinyin": "hòu suì wú wèn jīn zhě 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-yuzhuyuansishu",
      "title": "与朱元思书",
      "author": "吴均",
      "dynasty": "苏教版",
      "grade": "九年级上册",
      "sentences": [
       {
        "text": "风烟俱净，天山共色。",
        "pinyin": "fēng yān jù jìng ， tiān shān gòng sè 。"
       },
       {
        "text": "从流飘荡，任意东西。",
        "pinyin": "cóng liú piāo dàng ， rèn yì dōng xī 。"
       },
       {
        "text": "自富阳至桐庐一百许里，奇山异水，天下独绝。",
        "pinyin": "zì fù yáng zhì tóng lú yì bǎi xǔ lǐ ， qí shān yì shuǐ ， tiān xià dú jué 。"
       },
       {
        "text": "水皆缥碧，千丈见底。",
        "pinyin": "shuǐ jiē piǎo bì ， qiān zhàng jiàn dǐ 。"
       },
       {
        "text": "游鱼细石，直视无碍。",
        "pinyin": "yóu yú xì shí ， zhí shì wú ài 。"
       },
       {
        "text": "急湍甚箭，猛浪若奔。",
        "pinyin": "jí tuān shèn jiàn ， měng làng ruò bēn 。"
       },
       {
        "text": "夹岸高山，皆生寒树，负势竞上，互相轩邈，争高直指，千百成峰。",
        "pinyin": "jiá àn gāo shān ， jiē shēng hán shù ， fù shì jìng shàng ， hù xiāng xuān miǎo ， zhēng gāo zhí zhǐ ， qiān bǎi chéng fēng 。"
       },
       {
        "text": "泉水激石，泠泠作响；",
        "pinyin": "quán shuǐ jī shí ， líng líng zuò xiǎng ；"
       },
       {
        "text": "好鸟相鸣，嘤嘤成韵。",
        "pinyin": "hǎo niǎo xiāng míng ， yīng yīng chéng yùn 。"
       },
       {
        "text": "蝉则千转不穷，猿则百叫无绝。",
        "pinyin": "chán zé qiān zhuǎn bù qióng ， yuán zé bǎi jiào wú jué 。"
       },
       {
        "text": "鸢飞戾天者，望峰息心；",
        "pinyin": "yuān fēi lì tiān zhě ， wàng fēng xī xīn ；"
       },
       {
        "text": "经纶世务者，窥谷忘反。",
        "pinyin": "jīng lún shì wù zhě ， kuī gǔ wàng fǎn 。"
       },
       {
        "text": "横柯上蔽，在昼犹昏；",
        "pinyin": "héng kē shàng bì ， zài zhòu yóu hūn ；"
       },
       {
        "text": "疏条交映，有时见日。",
        "pinyin": "shū tiáo jiāo yìng ， yǒu shí jiàn rì 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-bushezheshuo",
      "title": "捕蛇者说",
      "author": "柳宗元",
      "dynasty": "苏教版",
      "grade": "九年级上册",
      "sentences": [
       {
        "text": "永州之野产异蛇，黑质而白章；",
        "pinyin": "yǒng zhōu zhī yě chǎn yì shé ， hēi zhì ér bái zhāng ；"
       },
       {
        "text": "触草木，尽死；",
        "pinyin": "chù cǎo mù ， jìn sǐ ；"
       },
       {
        "text": "以啮人，无御之者。",
        "pinyin": "yǐ niè rén ， wú yù zhī zhě 。"
       },
       {
        "text": "然得而腊之以为饵，可以已大风、挛踠、瘘、疠，去死肌，杀三虫。",
        "pinyin": "rán dé ér là zhī yǐ wèi ěr ， kě yǐ yǐ dà fēng 、 luán wǎn 、 lòu 、 lì ， qù sǐ jī ， shā sān chóng 。"
       },
       {
        "text": "其始，太医以王命聚之，岁赋其二，募有能捕之者，当其租入。",
        "pinyin": "qí shǐ ， tài yī yǐ wáng mìng jù zhī ， suì fù qí èr ， mù yǒu néng bǔ zhī zhě ， dāng qí zū rù 。"
       },
       {
        "text": "永之人争奔走焉。",
        "pinyin": "yǒng zhī rén zhēng bēn zǒu yān 。"
       },
       {
        "text": "有蒋氏者，专其利三世矣。",
        "pinyin": "yǒu jiǎng shì zhě ， zhuān qí lì sān shì yǐ 。"
       },
       {
        "text": "问之，则曰：“吾祖死于是，吾父死于是。",
        "pinyin": "wèn zhī ， zé yuē ：“ wú zǔ sǐ yú shì ， wú fù sǐ yú shì 。"
       },
       {
        "text": "今吾嗣为之十二年，几死者数矣。",
        "pinyin": "jīn wú sì wèi zhī shí èr nián ， jǐ sǐ zhě shù yǐ 。"
       },
       {
        "text": "”言之，貌若甚戚者。",
        "pinyin": "” yán zhī ， mào ruò shèn qī zhě 。"
       },
       {
        "text": "余悲之，且曰：“若毒之乎？",
        "pinyin": "yú bēi zhī ， qiě yuē ：“ ruò dú zhī hū ？"
       },
       {
        "text": "余将告于莅事者，更若役，复若赋，则何如？",
        "pinyin": "yú jiāng gào yú lì shì zhě ， gèng ruò yì ， fù ruò fù ， zé hé rú ？"
       },
       {
        "text": "蒋氏大戚，汪然出涕曰：“君将哀而生之乎？",
        "pinyin": "jiǎng shì dà qī ， wāng rán chū tì yuē ：“ jūn jiāng āi ér shēng zhī hū ？"
       },
       {
        "text": "则吾斯役之不幸，未若复吾赋不幸之甚也。",
        "pinyin": "zé wú sī yì zhī bú xìng ， wèi ruò fù wú fù bú xìng zhī shèn yě 。"
       },
       {
        "text": "向吾不为斯役，则久已病矣。",
        "pinyin": "xiàng wú bú wèi sī yì ， zé jiǔ yǐ bìng yǐ 。"
       },
       {
        "text": "自吾氏三世居是乡，积于今六十岁矣，而乡邻之生日蹙，殚其地之出，竭其庐之入，号呼而转徙，饥渴而顿踣，触风雨，犯寒暑，呼嘘毒疠，往往而死者相藉也。",
        "pinyin": "zì wú shì sān shì jū shì xiāng ， jī yú jīn liù shí suì yǐ ， ér xiāng lín zhī shēng rì cù ， dān qí dì zhī chū ， jié qí lú zhī rù ， hào hū ér zhuǎn xǐ ， jī kě ér dùn bó ， chù fēng yǔ ， fàn hán shǔ ， hū xū dú lì ， wǎng wǎng ér sǐ zhě xiāng jiè yě 。"
       },
       {
        "text": "曩与吾祖居者，今其室十无一焉；",
        "pinyin": "nǎng yǔ wú zǔ jū zhě ， jīn qí shì shí wú yì yān ；"
       },
       {
        "text": "与吾父居者，今其室十无二三焉；",
        "pinyin": "yǔ wú fù jū zhě ， jīn qí shì shí wú èr sān yān ；"
       },
       {
        "text": "与吾居十二年者，今其室十无四五焉。",
        "pinyin": "yǔ wú jū shí èr nián zhě ， jīn qí shì shí wú sì wǔ yān 。"
       },
       {
        "text": "非死则徙尔。",
        "pinyin": "fēi sǐ zé xǐ ěr 。"
       },
       {
        "text": "而吾以捕蛇独存。",
        "pinyin": "ér wú yǐ bǔ shé dú cún 。"
       },
       {
        "text": "悍吏之来吾乡，叫嚣乎东西，隳突乎南北，哗然而骇者，虽鸡狗不得宁焉。",
        "pinyin": "hàn lì zhī lái wú xiāng ， jiào áo hū dōng xī ， huī tū hū nán běi ， huá rán ér hài zhě ， suī jī gǒu bù dé níng yān 。"
       },
       {
        "text": "吾恂恂而起，视其缶，而吾蛇尚存，则弛然而卧。",
        "pinyin": "wú xún xún ér qǐ ， shì qí fǒu ， ér wú shé shàng cún ， zé chí rán ér wò 。"
       },
       {
        "text": "谨食之，时而献焉。",
        "pinyin": "jǐn shí zhī ， shí ér xiàn yān 。"
       },
       {
        "text": "退而甘食其土之有，以尽吾齿。",
        "pinyin": "tuì ér gān shí qí tǔ zhī yǒu ， yǐ jìn wú chǐ 。"
       },
       {
        "text": "盖一岁之犯死者二焉；",
        "pinyin": "gài yí suì zhī fàn sǐ zhě èr yān ；"
       },
       {
        "text": "其余，则熙熙而乐。",
        "pinyin": "qí yú ， zé xī xī ér lè 。"
       },
       {
        "text": "岂若吾乡邻之旦旦有是哉！",
        "pinyin": "qǐ ruò wú xiāng lín zhī dàn dàn yǒu shì zāi ！"
       },
       {
        "text": "今虽死乎此，比吾乡邻之死则已后矣，又安敢毒耶？",
        "pinyin": "jīn suī sǐ hū cǐ ， bǐ wú xiāng lín zhī sǐ zé yǐ hòu yǐ ， yòu ān gǎn dú yē ？"
       },
       {
        "text": "余闻而愈悲。",
        "pinyin": "yú wén ér yù bēi 。"
       },
       {
        "text": "孔子曰：“苛政猛于虎也。",
        "pinyin": "kǒng zǐ yuē ：“ kē zhèng měng yú hǔ yě 。"
       },
       {
        "text": "”吾尝疑乎是，今以蒋氏观之，犹信。",
        "pinyin": "” wú cháng yí hū shì ， jīn yǐ jiǎng shì guān zhī ， yóu xìn 。"
       },
       {
        "text": "呜呼！",
        "pinyin": "wū hū ！"
       },
       {
        "text": "孰知赋敛之毒有甚是蛇者乎！",
        "pinyin": "shú zhī fù liǎn zhī dú yǒu shèn shì shé zhě hū ！"
       },
       {
        "text": "故为之说，以俟夫观人风者得焉。",
        "pinyin": "gù wèi zhī shuō ， yǐ sì fū guān rén fēng zhě dé yān 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-yueyanglouji",
      "title": "岳阳楼记",
      "author": "范仲淹",
      "dynasty": "苏教版",
      "grade": "九年级上册",
      "sentences": [
       {
        "text": "庆历四年春，滕子京谪守巴陵郡。",
        "pinyin": "qìng lì sì nián chūn ， téng zǐ jīng zhé shǒu bā líng jùn 。"
       },
       {
        "text": "越明年，政通人和，百废具兴。",
        "pinyin": "yuè míng nián ， zhèng tōng rén hé ， bǎi fèi jù xīng 。"
       },
       {
        "text": "乃重修岳阳楼，增其旧制，刻唐贤今人诗赋于其上。",
        "pinyin": "nǎi chóng xiū yuè yáng lóu ， zēng qí jiù zhì ， kè táng xián jīn rén shī fù yú qí shàng 。"
       },
       {
        "text": "属予作文以记之。",
        "pinyin": "shǔ yǔ zuò wén yǐ jì zhī 。"
       },
       {
        "text": "予观夫巴陵胜状，在洞庭一湖。",
        "pinyin": "yǔ guān fū bā líng shèng zhuàng ， zài dòng tíng yì hú 。"
       },
       {
        "text": "衔远山，吞长江，浩浩汤汤，横无际涯；",
        "pinyin": "xián yuǎn shān ， tūn cháng jiāng ， hào hào shāng shāng ， héng wú jì yá ；"
       },
       {
        "text": "朝晖夕阴，气象万千。",
        "pinyin": "cháo huī xī yīn ， qì xiàng wàn qiān 。"
       },
       {
        "text": "此则岳阳楼之大观也。",
        "pinyin": "cǐ zé yuè yáng lóu zhī dà guān yě 。"
       },
       {
        "text": "前人之述备矣。",
        "pinyin": "qián rén zhī shù bèi yǐ 。"
       },
       {
        "text": "然则北通巫峡，南极潇湘，迁客骚人，多会于此，览物之情，得无异乎？",
        "pinyin": "rán zé běi tōng wū xiá ， nán jí xiāo xiāng ， qiān kè sāo rén ， duō huì yú cǐ ， lǎn wù zhī qíng ， dé wú yì hū ？"
       },
       {
        "text": "若夫霪雨霏霏，连月不开，阴风怒号，浊浪排空；",
        "pinyin": "ruò fū yín yǔ fēi fēi ， lián yuè bù kāi ， yīn fēng nù háo ， zhuó làng pái kōng ；"
       },
       {
        "text": "日星隐曜，山岳潜形；",
        "pinyin": "rì xīng yǐn yào ， shān yuè qián xíng ；"
       },
       {
        "text": "商旅不行，樯倾楫摧；",
        "pinyin": "shāng lǚ bù xíng ， qiáng qīng jí cuī ；"
       },
       {
        "text": "薄暮冥冥，虎啸猿啼。",
        "pinyin": "bó mù míng míng ， hǔ xiào yuán tí 。"
       },
       {
        "text": "登斯楼也，则有去国怀乡，忧谗畏讥，满目萧然，感极而悲者矣。",
        "pinyin": "dēng sī lóu yě ， zé yǒu qù guó huái xiāng ， yōu chán wèi jī ， mǎn mù xiāo rán ， gǎn jí ér bēi zhě yǐ 。"
       },
       {
        "text": "至若春和景明，波澜不惊，上下天光，一碧万顷；",
        "pinyin": "zhì ruò chūn hé jǐng míng ， bō lán bù jīng ， shàng xià tiān guāng ， yí bì wàn qǐng ；"
       },
       {
        "text": "沙鸥翔集，锦鳞游泳；",
        "pinyin": "shā ōu xiáng jí ， jǐn lín yóu yǒng ；"
       },
       {
        "text": "岸芷汀兰，郁郁青青。",
        "pinyin": "àn zhǐ tīng lán ， yù yù qīng qīng 。"
       },
       {
        "text": "而或长烟一空，皓月千里，浮光跃金，静影沉璧，渔歌互答，此乐何极！",
        "pinyin": "ér huò cháng yān yì kōng ， hào yuè qiān lǐ ， fú guāng yuè jīn ， jìng yǐng chén bì ， yú gē hù dá ， cǐ lè hé jí ！"
       },
       {
        "text": "登斯楼也，则有心旷神怡，宠辱偕忘，把酒临风，其喜洋洋者矣。",
        "pinyin": "dēng sī lóu yě ， zé yǒu xīn kuàng shén yí ， chǒng rǔ xié wàng ， bǎ jiǔ lín fēng ， qí xǐ yáng yáng zhě yǐ 。"
       },
       {
        "text": "嗟夫！",
        "pinyin": "jiē fū ！"
       },
       {
        "text": "予尝求古仁人之心，或异二者之为，何哉？",
        "pinyin": "yǔ cháng qiú gǔ rén rén zhī xīn ， huò yì èr zhě zhī wèi ， hé zāi ？"
       },
       {
        "text": "不以物喜，不以己悲；",
        "pinyin": "bù yǐ wù xǐ ， bù yǐ jǐ bēi ；"
       },
       {
        "text": "居庙堂之高则忧其民，处江湖之远则忧其君。",
        "pinyin": "jū miào táng zhī gāo zé yōu qí mín ， chù jiāng hú zhī yuǎn zé yōu qí jūn 。"
       },
       {
        "text": "是进亦忧，退亦忧。",
        "pinyin": "shì jìn yì yōu ， tuì yì yōu 。"
       },
       {
        "text": "然则何时而乐耶？",
        "pinyin": "rán zé hé shí ér lè yē ？"
       },
       {
        "text": "其必曰“先天下之忧而忧，后天下之乐而乐”乎。",
        "pinyin": "qí bì yuē “ xiān tiān xià zhī yōu ér yōu ， hòu tiān xià zhī lè ér lè ” hū 。"
       },
       {
        "text": "噫！",
        "pinyin": "yī ！"
       },
       {
        "text": "微斯人，吾谁与归？",
        "pinyin": "wēi sī rén ， wú shuí yǔ guī ？"
       },
       {
        "text": "时六年九月十五日。",
        "pinyin": "shí liù nián jiǔ yuè shí wǔ rì 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-zuiwengtingji",
      "title": "醉翁亭记",
      "author": "欧阳修",
      "dynasty": "苏教版",
      "grade": "九年级上册",
      "sentences": [
       {
        "text": "环滁皆山也。",
        "pinyin": "huán chú jiē shān yě 。"
       },
       {
        "text": "其西南诸峰，林壑尤美，望之蔚然而深秀者，琅琊也。",
        "pinyin": "qí xī nán zhū fēng ， lín hè yóu měi ， wàng zhī wèi rán ér shēn xiù zhě ， láng yá yě 。"
       },
       {
        "text": "山行六七里，渐闻水声潺潺而泻出于两峰之间者，酿泉也。",
        "pinyin": "shān xíng liù qī lǐ ， jiàn wén shuǐ shēng chán chán ér xiè chū yú liǎng fēng zhī jiān zhě ， niàng quán yě 。"
       },
       {
        "text": "峰回路转，有亭翼然临于泉上者，醉翁亭也。",
        "pinyin": "fēng huí lù zhuǎn ， yǒu tíng yì rán lín yú quán shàng zhě ， zuì wēng tíng yě 。"
       },
       {
        "text": "作亭者谁？",
        "pinyin": "zuò tíng zhě shuí ？"
       },
       {
        "text": "山之僧智仙也。",
        "pinyin": "shān zhī sēng zhì xiān yě 。"
       },
       {
        "text": "名之者谁？",
        "pinyin": "míng zhī zhě shuí ？"
       },
       {
        "text": "太守自谓也。",
        "pinyin": "tài shǒu zì wèi yě 。"
       },
       {
        "text": "太守与客来饮于此，饮少辄醉，而年又最高，故自号曰醉翁也。",
        "pinyin": "tài shǒu yǔ kè lái yǐn yú cǐ ， yǐn shǎo zhé zuì ， ér nián yòu zuì gāo ， gù zì hào yuē zuì wēng yě 。"
       },
       {
        "text": "醉翁之意不在酒，在乎山水之间也。",
        "pinyin": "zuì wēng zhī yì bú zài jiǔ ， zài hū shān shuǐ zhī jiān yě 。"
       },
       {
        "text": "山水之乐，得之心而寓之酒也。",
        "pinyin": "shān shuǐ zhī lè ， dé zhī xīn ér yù zhī jiǔ yě 。"
       },
       {
        "text": "若夫日出而林霏开，云归而岩穴暝，晦明变化者，山间之朝暮也。",
        "pinyin": "ruò fū rì chū ér lín fēi kāi ， yún guī ér yán xué míng ， huì míng biàn huà zhě ， shān jiān zhī cháo mù yě 。"
       },
       {
        "text": "野芳发而幽香，佳木秀而繁阴，风霜高洁，水落而石出者，山间之四时也。",
        "pinyin": "yě fāng fā ér yōu xiāng ， jiā mù xiù ér fán yīn ， fēng shuāng gāo jié ， shuǐ luò ér shí chū zhě ， shān jiān zhī sì shí yě 。"
       },
       {
        "text": "朝而往，暮而归，四时之景不同，而乐亦无穷也。",
        "pinyin": "cháo ér wǎng ， mù ér guī ， sì shí zhī jǐng bù tóng ， ér lè yì wú qióng yě 。"
       },
       {
        "text": "至于负者歌于途，行者休于树，前者呼，后者应，伛偻提携，往来而不绝者，滁人游也。",
        "pinyin": "zhì yú fù zhě gē yú tú ， xíng zhě xiū yú shù ， qián zhě hū ， hòu zhě yìng ， yǔ lǚ tí xié ， wǎng lái ér bù jué zhě ， chú rén yóu yě 。"
       },
       {
        "text": "临溪而渔，溪深而鱼肥，酿泉为酒，泉香而酒洌，山肴野蔌，杂然而前陈者，太守宴也。",
        "pinyin": "lín xī ér yú ， xī shēn ér yú féi ， niàng quán wèi jiǔ ， quán xiāng ér jiǔ liè ， shān yáo yě sù ， zá rán ér qián chén zhě ， tài shǒu yàn yě 。"
       },
       {
        "text": "宴酣之乐，非丝非竹，射者中，弈者胜，觥筹交错，起坐而喧哗者，众宾欢也。",
        "pinyin": "yàn hān zhī lè ， fēi sī fēi zhú ， shè zhě zhōng ， yì zhě shèng ， gōng chóu jiāo cuò ， qǐ zuò ér xuān huá zhě ， zhòng bīn huān yě 。"
       },
       {
        "text": "苍颜白发，颓然乎其间者，太守醉也。",
        "pinyin": "cāng yán bái fà ， tuí rán hū qí jiān zhě ， tài shǒu zuì yě 。"
       },
       {
        "text": "已而夕阳在山，人影散乱，太守归而宾客从也。",
        "pinyin": "yǐ ér xī yáng zài shān ， rén yǐng sǎn luàn ， tài shǒu guī ér bīn kè cóng yě 。"
       },
       {
        "text": "树林阴翳，鸣声上下，游人去而禽鸟乐也。",
        "pinyin": "shù lín yīn yì ， míng shēng shàng xià ， yóu rén qù ér qín niǎo lè yě 。"
       },
       {
        "text": "然而禽鸟知山林之乐，而不知人之乐；",
        "pinyin": "rán ér qín niǎo zhī shān lín zhī lè ， ér bù zhī rén zhī lè ；"
       },
       {
        "text": "人知从太守游而乐，而不知太守之乐其乐也。",
        "pinyin": "rén zhī cóng tài shǒu yóu ér lè ， ér bù zhī tài shǒu zhī lè qí lè yě 。"
       },
       {
        "text": "醉能同其乐，醒能述以文者，太守也。",
        "pinyin": "zuì néng tóng qí lè ， xǐng néng shù yǐ wén zhě ， tài shǒu yě 。"
       },
       {
        "text": "太守谓谁？",
        "pinyin": "tài shǒu wèi shuí ？"
       },
       {
        "text": "庐陵欧阳修也。",
        "pinyin": "lú líng ōu yáng xiū yě 。"
       }
      ],
      "comment": ""
     }
    ]
   },
   {
    "id": "sj-vol-6",
    "name": "九年级下册",
    "articles": [
     {
      "id": "sj-caoguilunzhan",
      "title": "曹刿论战",
      "author": "《左传·庄公十年》",
      "dynasty": "苏教版",
      "grade": "九年级下册",
      "sentences": [
       {
        "text": "十年春，齐师伐我。",
        "pinyin": "shí nián chūn ， qí shī fá wǒ 。"
       },
       {
        "text": "公将战，曹刿请见。",
        "pinyin": "gōng jiāng zhàn ， cáo guì qǐng jiàn 。"
       },
       {
        "text": "其乡人曰：“肉食者谋之，又何间焉？",
        "pinyin": "qí xiāng rén yuē ：“ ròu shí zhě móu zhī ， yòu hé jiān yān ？"
       },
       {
        "text": "”刿曰：“肉食者鄙，未能远谋。",
        "pinyin": "” guì yuē ：“ ròu shí zhě bǐ ， wèi néng yuǎn móu 。"
       },
       {
        "text": "”乃入见。",
        "pinyin": "” nǎi rù jiàn 。"
       },
       {
        "text": "问：“何以战？",
        "pinyin": "wèn ：“ hé yǐ zhàn ？"
       },
       {
        "text": "”公曰：“衣食所安，弗敢专也，必以分人。",
        "pinyin": "” gōng yuē ：“ yī shí suǒ ān ， fú gǎn zhuān yě ， bì yǐ fēn rén 。"
       },
       {
        "text": "”对曰：“小惠未遍，民弗从也。",
        "pinyin": "” duì yuē ：“ xiǎo huì wèi biàn ， mín fú cóng yě 。"
       },
       {
        "text": "”公曰：“牺牲玉帛，弗敢加也，必以信。",
        "pinyin": "” gōng yuē ：“ xī shēng yù bó ， fú gǎn jiā yě ， bì yǐ xìn 。"
       },
       {
        "text": "”对曰：“小信未孚，神弗福也。",
        "pinyin": "” duì yuē ：“ xiǎo xìn wèi fú ， shén fú fú yě 。"
       },
       {
        "text": "”公曰：“小大之狱，虽不能察，必以情。",
        "pinyin": "” gōng yuē ：“ xiǎo dà zhī yù ， suī bù néng chá ， bì yǐ qíng 。"
       },
       {
        "text": "”对曰：“忠之属也。",
        "pinyin": "” duì yuē ：“ zhōng zhī shǔ yě 。"
       },
       {
        "text": "可以一战。",
        "pinyin": "kě yǐ yí zhàn 。"
       },
       {
        "text": "战则请从。",
        "pinyin": "zhàn zé qǐng cóng 。"
       },
       {
        "text": "公与之乘，战于长勺。",
        "pinyin": "gōng yǔ zhī chéng ， zhàn yú cháng sháo 。"
       },
       {
        "text": "公将鼓之。",
        "pinyin": "gōng jiāng gǔ zhī 。"
       },
       {
        "text": "刿曰：“未可。",
        "pinyin": "guì yuē ：“ wèi kě 。"
       },
       {
        "text": "”齐人三鼓。",
        "pinyin": "” qí rén sān gǔ 。"
       },
       {
        "text": "刿曰：“可矣。",
        "pinyin": "guì yuē ：“ kě yǐ 。"
       },
       {
        "text": "”齐师败绩。",
        "pinyin": "” qí shī bài jì 。"
       },
       {
        "text": "公将驰之。",
        "pinyin": "gōng jiāng chí zhī 。"
       },
       {
        "text": "刿曰：“未可。",
        "pinyin": "guì yuē ：“ wèi kě 。"
       },
       {
        "text": "”下视其辙，登轼而望之，曰：“可矣。",
        "pinyin": "” xià shì qí zhé ， dēng shì ér wàng zhī ， yuē ：“ kě yǐ 。"
       },
       {
        "text": "”遂逐齐师。",
        "pinyin": "” suì zhú qí shī 。"
       },
       {
        "text": "既克，公问其故。",
        "pinyin": "jì kè ， gōng wèn qí gù 。"
       },
       {
        "text": "对曰：“夫战，勇气也。",
        "pinyin": "duì yuē ：“ fū zhàn ， yǒng qì yě 。"
       },
       {
        "text": "一鼓作气，再而衰，三而竭。",
        "pinyin": "yì gǔ zuò qì ， zài ér shuāi ， sān ér jié 。"
       },
       {
        "text": "彼竭我盈，故克之。",
        "pinyin": "bǐ jié wǒ yíng ， gù kè zhī 。"
       },
       {
        "text": "夫大国，难测也，惧有伏焉。",
        "pinyin": "fū dà guó ， nán cè yě ， jù yǒu fú yān 。"
       },
       {
        "text": "吾视其辙乱，望其旗靡，故逐之。",
        "pinyin": "wú shì qí zhé luàn ， wàng qí qí mí ， gù zhú zhī 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-zoujifengqiwangnajian",
      "title": "邹忌讽齐王纳谏",
      "author": "《战国策·齐策》",
      "dynasty": "苏教版",
      "grade": "九年级下册",
      "sentences": [
       {
        "text": "邹忌修八尺有余，而形貌昳丽。",
        "pinyin": "zōu jì xiū bā chǐ yǒu yú ， ér xíng mào yì lì 。"
       },
       {
        "text": "朝服衣冠，窥镜，谓其妻曰：“我孰与城北徐公美？",
        "pinyin": "cháo fú yī guān ， kuī jìng ， wèi qí qī yuē ：“ wǒ shú yǔ chéng běi xú gōng měi ？"
       },
       {
        "text": "”其妻曰：“君美甚，徐公何能及君也？",
        "pinyin": "” qí qī yuē ：“ jūn měi shèn ， xú gōng hé néng jí jūn yě ？"
       },
       {
        "text": "”城北徐公，齐国之美丽者也。",
        "pinyin": "” chéng běi xú gōng ， qí guó zhī měi lì zhě yě 。"
       },
       {
        "text": "忌不自信，而复问其妾曰：“吾孰与徐公美？",
        "pinyin": "jì bú zì xìn ， ér fù wèn qí qiè yuē ：“ wú shú yǔ xú gōng měi ？"
       },
       {
        "text": "”妾曰：“徐公何能及君也？",
        "pinyin": "” qiè yuē ：“ xú gōng hé néng jí jūn yě ？"
       },
       {
        "text": "”旦日，客从外来，与坐谈，问之客曰：“吾与徐公孰美？",
        "pinyin": "” dàn rì ， kè cóng wài lái ， yǔ zuò tán ， wèn zhī kè yuē ：“ wú yǔ xú gōng shú měi ？"
       },
       {
        "text": "”客曰：“徐公不若君之美也。",
        "pinyin": "” kè yuē ：“ xú gōng bú ruò jūn zhī měi yě 。"
       },
       {
        "text": "”明日徐公来，孰视之，自以为不如；",
        "pinyin": "” míng rì xú gōng lái ， shú shì zhī ， zì yǐ wéi bù rú ；"
       },
       {
        "text": "窥镜而自视，又弗如远甚。",
        "pinyin": "kuī jìng ér zì shì ， yòu fú rú yuǎn shèn 。"
       },
       {
        "text": "暮寝而思之，曰：“吾妻之美我者，私我也；",
        "pinyin": "mù qǐn ér sī zhī ， yuē ：“ wú qī zhī měi wǒ zhě ， sī wǒ yě ；"
       },
       {
        "text": "妾之美我者，畏我也；",
        "pinyin": "qiè zhī měi wǒ zhě ， wèi wǒ yě ；"
       },
       {
        "text": "客之美我者，欲有求于我也。",
        "pinyin": "kè zhī měi wǒ zhě ， yù yǒu qiú yú wǒ yě 。"
       },
       {
        "text": "于是入朝见威王，曰：“臣诚知不如徐公美。",
        "pinyin": "yú shì rù cháo jiàn wēi wáng ， yuē ：“ chén chéng zhī bù rú xú gōng měi 。"
       },
       {
        "text": "臣之妻私臣，臣之妾畏臣，臣之客欲有求于臣，皆以美于徐公。",
        "pinyin": "chén zhī qī sī chén ， chén zhī qiè wèi chén ， chén zhī kè yù yǒu qiú yú chén ， jiē yǐ měi yú xú gōng 。"
       },
       {
        "text": "今齐地方千里，百二十城，宫妇左右莫不私王，朝廷之臣莫不畏王，四境之内莫不有求于王：由此观之，王之蔽甚矣。",
        "pinyin": "jīn qí dì fāng qiān lǐ ， bǎi èr shí chéng ， gōng fù zuǒ yòu mò bù sī wáng ， cháo tíng zhī chén mò bú wèi wáng ， sì jìng zhī nèi mò bù yǒu qiú yú wáng ： yóu cǐ guān zhī ， wáng zhī bì shèn yǐ 。"
       },
       {
        "text": "王曰：“善。",
        "pinyin": "wáng yuē ：“ shàn 。"
       },
       {
        "text": "”乃下令：“群臣吏民能面刺寡人之过者，受上赏；",
        "pinyin": "” nǎi xià lìng ：“ qún chén lì mín néng miàn cì guǎ rén zhī guò zhě ， shòu shàng shǎng ；"
       },
       {
        "text": "上书谏寡人者，受中赏；",
        "pinyin": "shàng shū jiàn guǎ rén zhě ， shòu zhōng shǎng ；"
       },
       {
        "text": "能谤讥于市朝，闻寡人之耳者，受下赏。",
        "pinyin": "néng bàng jī yú shì cháo ， wén guǎ rén zhī ěr zhě ， shòu xià shǎng 。"
       },
       {
        "text": "”令初下，群臣进谏，门庭若市；",
        "pinyin": "” lìng chū xià ， qún chén jìn jiàn ， mén tíng ruò shì ；"
       },
       {
        "text": "数月之后，时时而间进；",
        "pinyin": "shù yuè zhī hòu ， shí shí ér jiān jìn ；"
       },
       {
        "text": "期年之后，虽欲言，无可进者。",
        "pinyin": "qī nián zhī hòu ， suī yù yán ， wú kě jìn zhě 。"
       },
       {
        "text": "燕、赵、韩、魏闻之，皆朝于齐。",
        "pinyin": "yàn 、 zhào 、 hán 、 wèi wén zhī ， jiē cháo yú qí 。"
       },
       {
        "text": "此所谓战胜于朝廷。",
        "pinyin": "cǐ suǒ wèi zhàn shèng yú cháo tíng 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-yuwosuoyuye",
      "title": "鱼我所欲也",
      "author": "《孟子》",
      "dynasty": "苏教版",
      "grade": "九年级下册",
      "sentences": [
       {
        "text": "鱼，我所欲也，熊掌，亦我所欲也；",
        "pinyin": "yú ， wǒ suǒ yù yě ， xióng zhǎng ， yì wǒ suǒ yù yě ；"
       },
       {
        "text": "二者不可得兼，舍鱼而取熊掌者也。",
        "pinyin": "èr zhě bù kě dé jiān ， shè yú ér qǔ xióng zhǎng zhě yě 。"
       },
       {
        "text": "生，亦我所欲也，义，亦我所欲也；",
        "pinyin": "shēng ， yì wǒ suǒ yù yě ， yì ， yì wǒ suǒ yù yě ；"
       },
       {
        "text": "二者不可得兼，舍生而取义者也。",
        "pinyin": "èr zhě bù kě dé jiān ， shè shēng ér qǔ yì zhě yě 。"
       },
       {
        "text": "生亦我所欲，所欲有甚于生者，故不为苟得也；",
        "pinyin": "shēng yì wǒ suǒ yù ， suǒ yù yǒu shèn yú shēng zhě ， gù bú wèi gǒu dé yě ；"
       },
       {
        "text": "死亦我所恶，所恶有甚于死者，故患有所不辟也。",
        "pinyin": "sǐ yì wǒ suǒ è ， suǒ è yǒu shèn yú sǐ zhě ， gù huàn yǒu suǒ bú pì yě 。"
       },
       {
        "text": "如使人之所欲莫甚于生，则凡可以得生者何不用也？",
        "pinyin": "rú shǐ rén zhī suǒ yù mò shèn yú shēng ， zé fán kě yǐ dé shēng zhě hé bú yòng yě ？"
       },
       {
        "text": "使人之所恶莫甚于死者，则凡可以辟患者何不为也？",
        "pinyin": "shǐ rén zhī suǒ è mò shèn yú sǐ zhě ， zé fán kě yǐ pì huàn zhě hé bú wèi yě ？"
       },
       {
        "text": "由是则生而有不用也，由是则可以辟患而有不为也。",
        "pinyin": "yóu shì zé shēng ér yǒu bú yòng yě ， yóu shì zé kě yǐ pì huàn ér yǒu bú wèi yě 。"
       },
       {
        "text": "是故所欲有甚于生者，所恶有甚于死者。",
        "pinyin": "shì gù suǒ yù yǒu shèn yú shēng zhě ， suǒ è yǒu shèn yú sǐ zhě 。"
       },
       {
        "text": "非独贤者有是心也，人皆有之，贤者能勿丧耳。",
        "pinyin": "fēi dú xián zhě yǒu shì xīn yě ， rén jiē yǒu zhī ， xián zhě néng wù sàng ěr 。"
       },
       {
        "text": "一箪食，一豆羹，得之则生，弗得则死。",
        "pinyin": "yì dān shí ， yí dòu gēng ， dé zhī zé shēng ， fú dé zé sǐ 。"
       },
       {
        "text": "呼尔而与之，行道之人弗受；",
        "pinyin": "hū ěr ér yǔ zhī ， háng dào zhī rén fú shòu ；"
       },
       {
        "text": "蹴尔而与之，乞人不屑也。",
        "pinyin": "cù ěr ér yǔ zhī ， qǐ rén bú xiè yě 。"
       },
       {
        "text": "万钟则不辩礼义而受之，万钟于我何加焉！",
        "pinyin": "wàn zhōng zé bú biàn lǐ yì ér shòu zhī ， wàn zhōng yú wǒ hé jiā yān ！"
       },
       {
        "text": "为宫室之美，妻妾之奉，所识穷乏者得我与？",
        "pinyin": "wèi gōng shì zhī měi ， qī qiè zhī fèng ， suǒ shí qióng fá zhě dé wǒ yǔ ？"
       },
       {
        "text": "乡为身死而不受，今为宫室之美为之；",
        "pinyin": "xiāng wèi shēn sǐ ér bú shòu ， jīn wèi gōng shì zhī měi wèi zhī ；"
       },
       {
        "text": "乡为身死而不受，今为妻妾之奉为之；",
        "pinyin": "xiāng wèi shēn sǐ ér bú shòu ， jīn wèi qī qiè zhī fèng wèi zhī ；"
       },
       {
        "text": "乡为身死而不受，今为所识穷乏者得我而为之：是亦不可以已乎？",
        "pinyin": "xiāng wèi shēn sǐ ér bú shòu ， jīn wèi suǒ shí qióng fá zhě dé wǒ ér wèi zhī ： shì yì bù kě yǐ yǐ hū ？"
       },
       {
        "text": "此之谓失其本心。",
        "pinyin": "cǐ zhī wèi shī qí běn xīn 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-shengyuyouhuansiyuanle",
      "title": "生于忧患，死于安乐",
      "author": "《孟子》",
      "dynasty": "苏教版",
      "grade": "九年级下册",
      "sentences": [
       {
        "text": "舜发于畎亩之中，傅说举于版筑之间，胶鬲举于鱼盐之中，管夷吾举于士，孙叔敖举于海，百里奚举于市。",
        "pinyin": "shùn fā yú quǎn mǔ zhī zhōng ， fù shuō jǔ yú bǎn zhù zhī jiān ， jiāo gé jǔ yú yú yán zhī zhōng ， guǎn yí wú jǔ yú shì ， sūn shū áo jǔ yú hǎi ， bǎi lǐ xī jǔ yú shì 。"
       },
       {
        "text": "故天将降大任于是人也，必先苦其心志，劳其筋骨，饿其体肤，空乏其身，行拂乱其所为，所以动心忍性，曾益其所不能。",
        "pinyin": "gù tiān jiāng jiàng dà rèn yú shì rén yě ， bì xiān kǔ qí xīn zhì ， láo qí jīn gǔ ， è qí tǐ fū ， kōng fá qí shēn ， xíng fú luàn qí suǒ wèi ， suǒ yǐ dòng xīn rěn xìng ， céng yì qí suǒ bù néng 。"
       },
       {
        "text": "人恒过，然后能改；",
        "pinyin": "rén héng guò ， rán hòu néng gǎi ；"
       },
       {
        "text": "困于心，衡于虑，而后作；",
        "pinyin": "kùn yú xīn ， héng yú lǜ ， ér hòu zuò ；"
       },
       {
        "text": "征于色，发于声，而后喻。",
        "pinyin": "zhēng yú sè ， fā yú shēng ， ér hòu yù 。"
       },
       {
        "text": "入则法家拂士，出则无敌国外患者，国恒亡。",
        "pinyin": "rù zé fǎ jiā fú shì ， chū zé wú dí guó wài huàn zhě ， guó héng wáng 。"
       },
       {
        "text": "然后知生于忧患，而死于安乐也。",
        "pinyin": "rán hòu zhī shēng yú yōu huàn ， ér sǐ yú ān lè yě 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-yugongyishan",
      "title": "愚公移山",
      "author": "《列子·汤问》",
      "dynasty": "苏教版",
      "grade": "九年级下册",
      "sentences": [
       {
        "text": "太行、王屋二山，方七百里，高万仞。",
        "pinyin": "tài háng 、 wáng wū èr shān ， fāng qī bǎi lǐ ， gāo wàn rèn 。"
       },
       {
        "text": "本在冀州之南，河阳之北。",
        "pinyin": "běn zài jì zhōu zhī nán ， hé yáng zhī běi 。"
       },
       {
        "text": "北山愚公者，年且九十，面山而居。",
        "pinyin": "běi shān yú gōng zhě ， nián qiě jiǔ shí ， miàn shān ér jū 。"
       },
       {
        "text": "惩山北之塞，出入之迂也，聚室而谋曰：“吾与汝毕力平险，指通豫南，达于汉阴，可乎？",
        "pinyin": "chéng shān běi zhī sāi ， chū rù zhī yū yě ， jù shì ér móu yuē ：“ wú yǔ rǔ bì lì píng xiǎn ， zhǐ tōng yù nán ， dá yú hàn yīn ， kě hū ？"
       },
       {
        "text": "”杂然相许。",
        "pinyin": "” zá rán xiāng xǔ 。"
       },
       {
        "text": "其妻献疑曰：“以君之力，曾不能损魁父之丘，如太行、王屋何？",
        "pinyin": "qí qī xiàn yí yuē ：“ yǐ jūn zhī lì ， céng bù néng sǔn kuí fù zhī qiū ， rú tài háng 、 wáng wū hé ？"
       },
       {
        "text": "且焉置土石？",
        "pinyin": "qiě yān zhì tǔ shí ？"
       },
       {
        "text": "”杂曰：“投诸渤海之尾，隐土之北。",
        "pinyin": "” zá yuē ：“ tóu zhū bó hǎi zhī wěi ， yǐn tǔ zhī běi 。"
       },
       {
        "text": "”遂率子孙荷担者三夫，叩石垦壤，箕畚运于渤海之尾。",
        "pinyin": "” suì lǜ zǐ sūn hé dān zhě sān fū ， kòu shí kěn rǎng ， jī běn yùn yú bó hǎi zhī wěi 。"
       },
       {
        "text": "邻人京城氏之孀妻有遗男，始龀，跳往助之。",
        "pinyin": "lín rén jīng chéng shì zhī shuāng qī yǒu yí nán ， shǐ chèn ， tiào wǎng zhù zhī 。"
       },
       {
        "text": "寒暑易节，始一反焉。",
        "pinyin": "hán shǔ yì jié ， shǐ yì fǎn yān 。"
       },
       {
        "text": "河曲智叟笑而止之曰：“甚矣，汝之不惠！",
        "pinyin": "hé qǔ zhì sǒu xiào ér zhǐ zhī yuē ：“ shèn yǐ ， rǔ zhī bú huì ！"
       },
       {
        "text": "以残年余力，曾不能毁山之一毛，其如土石何？",
        "pinyin": "yǐ cán nián yú lì ， céng bù néng huǐ shān zhī yī máo ， qí rú tǔ shí hé ？"
       },
       {
        "text": "”北山愚公长息曰：“汝心之固，固不可彻，曾不若孀妻弱子。",
        "pinyin": "” běi shān yú gōng cháng xī yuē ：“ rǔ xīn zhī gù ， gù bù kě chè ， céng bú ruò shuāng qī ruò zǐ 。"
       },
       {
        "text": "虽我之死，有子存焉；",
        "pinyin": "suī wǒ zhī sǐ ， yǒu zǐ cún yān ；"
       },
       {
        "text": "子又生孙，孙又生子；",
        "pinyin": "zǐ yòu shēng sūn ， sūn yòu shēng zǐ ；"
       },
       {
        "text": "子又有子，子又有孙；",
        "pinyin": "zǐ yòu yǒu zǐ ， zǐ yòu yǒu sūn ；"
       },
       {
        "text": "子子孙孙无穷匮也，而山不加增，何苦而不平？",
        "pinyin": "zǐ zǐ sūn sūn wú qióng kuì yě ， ér shān bù jiā zēng ， hé kǔ ér bù píng ？"
       },
       {
        "text": "”河曲智叟亡以应。",
        "pinyin": "” hé qǔ zhì sǒu wáng yǐ yìng 。"
       },
       {
        "text": "操蛇之神闻之，惧其不已也，告之于帝。",
        "pinyin": "cāo shé zhī shén wén zhī ， jù qí bù yǐ yě ， gào zhī yú dì 。"
       },
       {
        "text": "帝感其诚，命夸娥氏二子负二山，一厝朔东，一厝雍南。",
        "pinyin": "dì gǎn qí chéng ， mìng kuā é shì èr zǐ fù èr shān ， yí cuò shuò dōng ， yí cuò yōng nán 。"
       },
       {
        "text": "自此，冀之南，汉之阴，无陇断焉。",
        "pinyin": "zì cǐ ， jì zhī nán ， hàn zhī yīn ， wú lǒng duàn yān 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-chushibiao",
      "title": "出师表",
      "author": "诸葛亮",
      "dynasty": "苏教版",
      "grade": "九年级下册",
      "sentences": [
       {
        "text": "先帝创业未半而中道崩殂，今天下三分，益州疲弊，此诚危急存亡之秋也。",
        "pinyin": "xiān dì chuàng yè wèi bàn ér zhōng dào bēng cú ， jīn tiān xià sān fēn ， yì zhōu pí bì ， cǐ chéng wēi jí cún wáng zhī qiū yě 。"
       },
       {
        "text": "然侍卫之臣不懈于内，忠志之士忘身于外者，盖追先帝之殊遇，欲报之于陛下也。",
        "pinyin": "rán shì wèi zhī chén bú xiè yú nèi ， zhōng zhì zhī shì wàng shēn yú wài zhě ， gài zhuī xiān dì zhī shū yù ， yù bào zhī yú bì xià yě 。"
       },
       {
        "text": "诚宜开张圣听，以光先帝遗德，恢弘志士之气，不宜妄自菲薄，引喻失义，以塞忠谏之路也。",
        "pinyin": "chéng yí kāi zhāng shèng tīng ， yǐ guāng xiān dì yí dé ， huī hóng zhì shì zhī qì ， bù yí wàng zì fěi bó ， yǐn yù shī yì ， yǐ sāi zhōng jiàn zhī lù yě 。"
       },
       {
        "text": "宫中府中，俱为一体，陟罚臧否，不宜异同。",
        "pinyin": "gōng zhōng fǔ zhōng ， jù wèi yì tǐ ， zhì fá zāng pǐ ， bù yí yì tóng 。"
       },
       {
        "text": "若有作奸犯科及为忠善者，宜付有司论其刑赏，以昭陛下平明之理，不宜偏私，使内外异法也。",
        "pinyin": "ruò yǒu zuò jiān fàn kē jí wèi zhōng shàn zhě ， yí fù yǒu sī lùn qí xíng shǎng ， yǐ zhāo bì xià píng míng zhī lǐ ， bù yí piān sī ， shǐ nèi wài yì fǎ yě 。"
       },
       {
        "text": "侍中、侍郎郭攸之、费祎、董允等，此皆良实，志虑忠纯，是以先帝简拔以遗陛下。",
        "pinyin": "shì zhōng 、 shì láng guō yōu zhī 、 fèi yī 、 dǒng yǔn děng ， cǐ jiē liáng shí ， zhì lǜ zhōng chún ， shì yǐ xiān dì jiǎn bá yǐ yí bì xià 。"
       },
       {
        "text": "愚以为宫中之事，事无大小，悉以咨之，然后施行，必能裨补阙漏，有所广益。",
        "pinyin": "yú yǐ wéi gōng zhōng zhī shì ， shì wú dà xiǎo ， xī yǐ zī zhī ， rán hòu shī xíng ， bì néng bì bǔ quē lòu ， yǒu suǒ guǎng yì 。"
       },
       {
        "text": "将军向宠，性行淑均，晓畅军事，试用于昔日，先帝称之曰能，是以众议举宠为督。",
        "pinyin": "jiāng jūn xiàng chǒng ， xìng xíng shū jūn ， xiǎo chàng jūn shì ， shì yòng yú xī rì ， xiān dì chēng zhī yuē néng ， shì yǐ zhòng yì jǔ chǒng wèi dū 。"
       },
       {
        "text": "愚以为营中之事，悉以咨之，必能使行阵和睦，优劣得所。",
        "pinyin": "yú yǐ wèi yíng zhōng zhī shì ， xī yǐ zī zhī ， bì néng shǐ xíng zhèn hé mù ， yōu liè dé suǒ 。"
       },
       {
        "text": "亲贤臣，远小人，此先汉所以兴隆也；",
        "pinyin": "qīn xián chén ， yuǎn xiǎo rén ， cǐ xiān hàn suǒ yǐ xīng lóng yě ；"
       },
       {
        "text": "亲小人，远贤臣，此后汉所以倾颓也。",
        "pinyin": "qīn xiǎo rén ， yuǎn xián chén ， cǐ hòu hàn suǒ yǐ qīng tuí yě 。"
       },
       {
        "text": "先帝在时，每与臣论此事，未尝不叹息痛恨于桓、灵也。",
        "pinyin": "xiān dì zài shí ， měi yǔ chén lùn cǐ shì ， wèi cháng bú tàn xī tòng hèn yú huán 、 líng yě 。"
       },
       {
        "text": "侍中、尚书、长史、参军，此悉贞良死节之臣，愿陛下亲之信之，则汉室之隆，可计日而待也。",
        "pinyin": "shì zhōng 、 shàng shū 、 zhǎng shǐ 、 cān jūn ， cǐ xī zhēn liáng sǐ jié zhī chén ， yuàn bì xià qīn zhī xìn zhī ， zé hàn shì zhī lóng ， kě jì rì ér dài yě 。"
       },
       {
        "text": "臣本布衣，躬耕于南阳，苟全性命于乱世，不求闻达于诸侯。",
        "pinyin": "chén běn bù yī ， gōng gēng yú nán yáng ， gǒu quán xìng mìng yú luàn shì ， bù qiú wén dá yú zhū hóu 。"
       },
       {
        "text": "先帝不以臣卑鄙，猥自枉屈，三顾臣于草庐之中，咨臣以当世之事，由是感激，遂许先帝以驱驰。",
        "pinyin": "xiān dì bù yǐ chén bēi bǐ ， wěi zì wǎng qū ， sān gù chén yú cǎo lú zhī zhōng ， zī chén yǐ dāng shì zhī shì ， yóu shì gǎn jī ， suì xǔ xiān dì yǐ qū chí 。"
       },
       {
        "text": "后值倾覆，受任于败军之际，奉命于危难之间，尔来二十有一年矣。",
        "pinyin": "hòu zhí qīng fù ， shòu rèn yú bài jūn zhī jì ， fèng mìng yú wēi nàn zhī jiān ， ěr lái èr shí yǒu yì nián yǐ 。"
       },
       {
        "text": "先帝知臣谨慎，故临崩寄臣以大事也。",
        "pinyin": "xiān dì zhī chén jǐn shèn ， gù lín bēng jì chén yǐ dà shì yě 。"
       },
       {
        "text": "受命以来，夙夜忧叹，恐托付不效，以伤先帝之明，故五月渡泸，深入不毛。",
        "pinyin": "shòu mìng yǐ lái ， sù yè yōu tàn ， kǒng tuō fù bú xiào ， yǐ shāng xiān dì zhī míng ， gù wǔ yuè dù lú ， shēn rù bù máo 。"
       },
       {
        "text": "今南方已定，兵甲已足，当奖率三军，北定中原，庶竭驽钝，攘除奸凶，兴复汉室，还于旧都。",
        "pinyin": "jīn nán fāng yǐ dìng ， bīng jiǎ yǐ zú ， dāng jiǎng lǜ sān jūn ， běi dìng zhōng yuán ， shù jié nú dùn ， rǎng chú jiān xiōng ， xīng fù hàn shì ， hái yú jiù dōu 。"
       },
       {
        "text": "此臣所以报先帝而忠陛下之职分也。",
        "pinyin": "cǐ chén suǒ yǐ bào xiān dì ér zhōng bì xià zhī zhí fēn yě 。"
       },
       {
        "text": "至于斟酌损益，进尽忠言，则攸之、祎、允之任也。",
        "pinyin": "zhì yú zhēn zhuó sǔn yì ， jìn jìn zhōng yán ， zé yōu zhī 、 yī 、 yǔn zhī rèn yě 。"
       },
       {
        "text": "愿陛下托臣以讨贼兴复之效，不效，则治臣之罪，以告先帝之灵。",
        "pinyin": "yuàn bì xià tuō chén yǐ tǎo zéi xīng fù zhī xiào ， bú xiào ， zé zhì chén zhī zuì ， yǐ gào xiān dì zhī líng 。"
       },
       {
        "text": "若无兴德之言，则责攸之、祎、允等之慢，以彰其咎；",
        "pinyin": "ruò wú xīng dé zhī yán ， zé zé yōu zhī 、 yī 、 yǔn děng zhī màn ， yǐ zhāng qí jiù ；"
       },
       {
        "text": "陛下亦宜自谋，以咨诹善道，察纳雅言，深追先帝遗诏。",
        "pinyin": "bì xià yì yí zì móu ， yǐ zī zōu shàn dào ， chá nà yǎ yán ， shēn zhuī xiān dì yí zhào 。"
       },
       {
        "text": "臣不胜受恩感激。",
        "pinyin": "chén bú shèng shòu ēn gǎn jī 。"
       },
       {
        "text": "今当远离，临表涕零，不知所言。",
        "pinyin": "jīn dāng yuǎn lí ， lín biǎo tì líng ， bù zhī suǒ yán 。"
       }
      ],
      "comment": ""
     }
    ]
   }
  ]
 },
 {
  "id": "sujiao-senior",
  "name": "苏教·高中",
  "volumes": [
   {
    "id": "sj-vol-7",
    "name": "高中语文必修一",
    "articles": [
     {
      "id": "sj-quanxue",
      "title": "劝学",
      "author": "《荀子》",
      "dynasty": "苏教版",
      "grade": "高中语文必修一",
      "sentences": [
       {
        "text": "君子曰：学不可以已。",
        "pinyin": "jūn zǐ yuē ： xué bù kě yǐ yǐ 。"
       },
       {
        "text": "青，取之于蓝，而青于蓝；",
        "pinyin": "qīng ， qǔ zhī yú lán ， ér qīng yú lán ；"
       },
       {
        "text": "冰，水为之，而寒于水。",
        "pinyin": "bīng ， shuǐ wèi zhī ， ér hán yú shuǐ 。"
       },
       {
        "text": "木直中绳，𫐓以为轮，其曲中规。",
        "pinyin": "mù zhí zhōng shéng ， róu yǐ wéi lún ， qí qǔ zhōng guī 。"
       },
       {
        "text": "虽有槁暴，不复挺者，𫐓使之然也。",
        "pinyin": "suī yǒu gǎo bào ， bú fù tǐng zhě ， róu shǐ zhī rán yě 。"
       },
       {
        "text": "故木受绳则直，金就砺则利，君子博学而日参省乎己，则知明而行无过矣。",
        "pinyin": "gù mù shòu shéng zé zhí ， jīn jiù lì zé lì ， jūn zǐ bó xué ér rì cān shěng hū jǐ ， zé zhī míng ér xíng wú guò yǐ 。"
       },
       {
        "text": "吾尝终日而思矣，不如须臾之所学也；",
        "pinyin": "wú cháng zhōng rì ér sī yǐ ， bù rú xū yú zhī suǒ xué yě ；"
       },
       {
        "text": "吾尝跂而望矣，不如登高之博见也。",
        "pinyin": "wú cháng qí ér wàng yǐ ， bù rú dēng gāo zhī bó jiàn yě 。"
       },
       {
        "text": "登高而招，臂非加长也，而见者远；",
        "pinyin": "dēng gāo ér zhāo ， bì fēi jiā cháng yě ， ér jiàn zhě yuǎn ；"
       },
       {
        "text": "顺风而呼，声非加疾也，而闻者彰。",
        "pinyin": "shùn fēng ér hū ， shēng fēi jiā jí yě ， ér wén zhě zhāng 。"
       },
       {
        "text": "假舆马者，非利足也，而致千里；",
        "pinyin": "jiǎ yú mǎ zhě ， fēi lì zú yě ， ér zhì qiān lǐ ；"
       },
       {
        "text": "假舟楫者，非能水也，而绝江河。",
        "pinyin": "jiǎ zhōu jí zhě ， fēi néng shuǐ yě ， ér jué jiāng hé 。"
       },
       {
        "text": "君子生非异也，善假于物也。",
        "pinyin": "jūn zǐ shēng fēi yì yě ， shàn jiǎ yú wù yě 。"
       },
       {
        "text": "积土成山，风雨兴焉；",
        "pinyin": "jī tǔ chéng shān ， fēng yǔ xīng yān ；"
       },
       {
        "text": "积水成渊，蛟龙生焉；",
        "pinyin": "jī shuǐ chéng yuān ， jiāo lóng shēng yān ；"
       },
       {
        "text": "积善成德，而神明自得，圣心备焉。",
        "pinyin": "jī shàn chéng dé ， ér shén míng zì dé ， shèng xīn bèi yān 。"
       },
       {
        "text": "故不积跬步，无以至千里；",
        "pinyin": "gù bù jī kuǐ bù ， wú yǐ zhì qiān lǐ ；"
       },
       {
        "text": "不积小流，无以成江海。",
        "pinyin": "bù jī xiǎo liú ， wú yǐ chéng jiāng hǎi 。"
       },
       {
        "text": "骐骥一跃，不能十步；",
        "pinyin": "qí jì yí yuè ， bù néng shí bù ；"
       },
       {
        "text": "驽马十驾，功在不舍。",
        "pinyin": "nú mǎ shí jià ， gōng zài bú shè 。"
       },
       {
        "text": "锲而舍之，朽木不折；",
        "pinyin": "qiè ér shè zhī ， xiǔ mù bù zhé ；"
       },
       {
        "text": "锲而不舍，金石可镂。",
        "pinyin": "qiè ér bù shě ， jīn shí kě lòu 。"
       },
       {
        "text": "蚓无爪牙之利，筋骨之强，上食埃土，下饮黄泉，用心一也。",
        "pinyin": "yǐn wú zhuǎ yá zhī lì ， jīn gǔ zhī qiáng ， shàng shí āi tǔ ， xià yǐn huáng quán ， yòng xīn yī yě 。"
       },
       {
        "text": "蟹六跪而二螯，非蛇鳝之穴无可寄托者，用心躁也。",
        "pinyin": "xiè liù guì ér èr áo ， fēi shé shàn zhī xué wú kě jì tuō zhě ， yòng xīn zào yě 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-shishuo",
      "title": "师说",
      "author": "韩愈",
      "dynasty": "苏教版",
      "grade": "高中语文必修一",
      "sentences": [
       {
        "text": "古之学者必有师。",
        "pinyin": "gǔ zhī xué zhě bì yǒu shī 。"
       },
       {
        "text": "师者，所以传道受业解惑也。",
        "pinyin": "shī zhě ， suǒ yǐ chuán dào shòu yè jiě huò yě 。"
       },
       {
        "text": "人非生而知之者，孰能无惑？",
        "pinyin": "rén fēi shēng ér zhī zhī zhě ， shú néng wú huò ？"
       },
       {
        "text": "惑而不从师，其为惑也，终不解矣。",
        "pinyin": "huò ér bù cóng shī ， qí wèi huò yě ， zhōng bù jiě yǐ 。"
       },
       {
        "text": "生乎吾前，其闻道也固先乎吾，吾从而师之；",
        "pinyin": "shēng hū wú qián ， qí wén dào yě gù xiān hū wú ， wú cóng ér shī zhī ；"
       },
       {
        "text": "生乎吾后，其闻道也亦先乎吾，吾从而师之。",
        "pinyin": "shēng hū wú hòu ， qí wén dào yě yì xiān hū wú ， wú cóng ér shī zhī 。"
       },
       {
        "text": "吾师道也，夫庸知其年之先后生于吾乎？",
        "pinyin": "wú shī dào yě ， fū yōng zhī qí nián zhī xiān hòu shēng yú wú hū ？"
       },
       {
        "text": "是故无贵无贱，无长无少，道之所存，师之所存也。",
        "pinyin": "shì gù wú guì wú jiàn ， wú cháng wú shǎo ， dào zhī suǒ cún ， shī zhī suǒ cún yě 。"
       },
       {
        "text": "嗟乎！",
        "pinyin": "jiē hū ！"
       },
       {
        "text": "师道之不传也久矣！",
        "pinyin": "shī dào zhī bù chuán yě jiǔ yǐ ！"
       },
       {
        "text": "欲人之无惑也难矣！",
        "pinyin": "yù rén zhī wú huò yě nán yǐ ！"
       },
       {
        "text": "古之圣人，其出人也远矣，犹且从师而问焉；",
        "pinyin": "gǔ zhī shèng rén ， qí chū rén yě yuǎn yǐ ， yóu qiě cóng shī ér wèn yān ；"
       },
       {
        "text": "今之众人，其下圣人也亦远矣，而耻学于师。",
        "pinyin": "jīn zhī zhòng rén ， qí xià shèng rén yě yì yuǎn yǐ ， ér chǐ xué yú shī 。"
       },
       {
        "text": "是故圣益圣，愚益愚。",
        "pinyin": "shì gù shèng yì shèng ， yú yì yú 。"
       },
       {
        "text": "圣人之所以为圣，愚人之所以为愚，其皆出于此乎？",
        "pinyin": "shèng rén zhī suǒ yǐ wéi shèng ， yú rén zhī suǒ yǐ wéi yú ， qí jiē chū yú cǐ hū ？"
       },
       {
        "text": "爱其子，择师而教之；",
        "pinyin": "ài qí zǐ ， zé shī ér jiào zhī ；"
       },
       {
        "text": "于其身也，则耻师焉，惑矣。",
        "pinyin": "yú qí shēn yě ， zé chǐ shī yān ， huò yǐ 。"
       },
       {
        "text": "彼童子之师，授之书而习其句读者，非吾所谓传其道解其惑者也。",
        "pinyin": "bǐ tóng zǐ zhī shī ， shòu zhī shū ér xí qí jù dòu zhě ， fēi wú suǒ wèi chuán qí dào jiě qí huò zhě yě 。"
       },
       {
        "text": "句读之不知，惑之不解，或师焉，或不焉，小学而大遗，吾未见其明也。",
        "pinyin": "jù dòu zhī bù zhī ， huò zhī bù jiě ， huò shī yān ， huò bù yān ， xiǎo xué ér dà yí ， wú wèi jiàn qí míng yě 。"
       },
       {
        "text": "巫医乐师百工之人，不耻相师。",
        "pinyin": "wū yī yuè shī bǎi gōng zhī rén ， bù chǐ xiāng shī 。"
       },
       {
        "text": "士大夫之族，曰师曰弟子云者，则群聚而笑之。",
        "pinyin": "shì dà fū zhī zú ， yuē shī yuē dì zǐ yún zhě ， zé qún jù ér xiào zhī 。"
       },
       {
        "text": "问之，则曰：“彼与彼年相若也，道相似也。",
        "pinyin": "wèn zhī ， zé yuē ：“ bǐ yǔ bǐ nián xiāng ruò yě ， dào xiāng sì yě 。"
       },
       {
        "text": "位卑则足羞，官盛则近谀。",
        "pinyin": "wèi bēi zé zú xiū ， guān shèng zé jìn yú 。"
       },
       {
        "text": "”呜呼！",
        "pinyin": "” wū hū ！"
       },
       {
        "text": "师道之不复可知矣。",
        "pinyin": "shī dào zhī bú fù kě zhī yǐ 。"
       },
       {
        "text": "巫医乐师百工之人，君子不齿，今其智乃反不能及，其可怪也欤！",
        "pinyin": "wū yī yuè shī bǎi gōng zhī rén ， jūn zǐ bù chǐ ， jīn qí zhì nǎi fǎn bù néng jí ， qí kě guài yě yú ！"
       },
       {
        "text": "圣人无常师。",
        "pinyin": "shèng rén wú cháng shī 。"
       },
       {
        "text": "孔子师郯子、苌弘、师襄、老聃。",
        "pinyin": "kǒng zǐ shī tán zǐ 、 cháng hóng 、 shī xiāng 、 lǎo dān 。"
       },
       {
        "text": "郯子之徒，其贤不及孔子。",
        "pinyin": "tán zǐ zhī tú ， qí xián bù jí kǒng zǐ 。"
       },
       {
        "text": "孔子曰：三人行，则必有我师。",
        "pinyin": "kǒng zǐ yuē ： sān rén xíng ， zé bì yǒu wǒ shī 。"
       },
       {
        "text": "是故弟子不必不如师，师不必贤于弟子，闻道有先后，术业有专攻，如是而已。",
        "pinyin": "shì gù dì zǐ bú bì bù rú shī ， shī bú bì xián yú dì zǐ ， wén dào yǒu xiān hòu ， shù yè yǒu zhuān gōng ， rú shì ér yǐ 。"
       },
       {
        "text": "李氏子蟠，年十七，好古文，六艺经传皆通习之，不拘于时，学于余。",
        "pinyin": "lǐ shì zǐ pán ， nián shí qī ， hǎo gǔ wén ， liù yì jīng zhuàn jiē tōng xí zhī ， bù jū yú shí ， xué yú yú 。"
       },
       {
        "text": "余嘉其能行古道，作《师说》以贻之。",
        "pinyin": "yú jiā qí néng xíng gǔ dào ， zuò 《 shī shuō 》 yǐ yí zhī 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-shidexishanyanyouji",
      "title": "始得西山宴游记",
      "author": "柳宗元",
      "dynasty": "苏教版",
      "grade": "高中语文必修一",
      "sentences": [
       {
        "text": "自余为僇人，居是州，恒惴栗。",
        "pinyin": "zì yú wèi lù rén ， jū shì zhōu ， héng zhuì lì 。"
       },
       {
        "text": "其隙也，则施施而行，漫漫而游。",
        "pinyin": "qí xì yě ， zé shī shī ér xíng ， màn màn ér yóu 。"
       },
       {
        "text": "日与其徒上高山，入深林，穷回溪，幽泉怪石，无远不到。",
        "pinyin": "rì yǔ qí tú shàng gāo shān ， rù shēn lín ， qióng huí xī ， yōu quán guài shí ， wú yuǎn bú dào 。"
       },
       {
        "text": "到则披草而坐，倾壶而醉。",
        "pinyin": "dào zé pī cǎo ér zuò ， qīng hú ér zuì 。"
       },
       {
        "text": "醉则更相枕以卧，卧而梦。",
        "pinyin": "zuì zé gèng xiāng zhěn yǐ wò ， wò ér mèng 。"
       },
       {
        "text": "意有所极，梦亦同趣。",
        "pinyin": "yì yǒu suǒ jí ， mèng yì tóng qù 。"
       },
       {
        "text": "觉而起，起而归。",
        "pinyin": "jué ér qǐ ， qǐ ér guī 。"
       },
       {
        "text": "以为凡是州之山水有异态者，皆我有也，而未始知西山之怪特。",
        "pinyin": "yǐ wéi fán shì zhōu zhī shān shuǐ yǒu yì tài zhě ， jiē wǒ yǒu yě ， ér wèi shǐ zhī xī shān zhī guài tè 。"
       },
       {
        "text": "今年九月二十八日，因坐法华西亭，望西山，始指异之。",
        "pinyin": "jīn nián jiǔ yuè èr shí bā rì ， yīn zuò fǎ huá xī tíng ， wàng xī shān ， shǐ zhǐ yì zhī 。"
       },
       {
        "text": "遂命仆人过湘江，缘染溪，斫榛莽，焚茅茷，穷山之高而止。",
        "pinyin": "suì mìng pú rén guò xiāng jiāng ， yuán rǎn xī ， zhuó zhēn mǎng ， fén máo fá ， qióng shān zhī gāo ér zhǐ 。"
       },
       {
        "text": "攀援而登，箕踞而遨，则凡数州之土壤，皆在衽席之下。",
        "pinyin": "pān yuán ér dēng ， jī jù ér áo ， zé fán shù zhōu zhī tǔ rǎng ， jiē zài rèn xí zhī xià 。"
       },
       {
        "text": "其高下之势，岈然洼然，若垤若穴，尺寸千里，攒蹙累积，莫得遁隐。",
        "pinyin": "qí gāo xià zhī shì ， yá rán wā rán ， ruò dié ruò xué ， chǐ cùn qiān lǐ ， zǎn cù lěi jī ， mò dé dùn yǐn 。"
       },
       {
        "text": "萦青缭白，外与天际，四望如一。",
        "pinyin": "yíng qīng liáo bái ， wài yǔ tiān jì ， sì wàng rú yī 。"
       },
       {
        "text": "然后知是山之特立，不与培塿为类。",
        "pinyin": "rán hòu zhī shì shān zhī tè lì ， bù yǔ péi lǒu wèi lèi 。"
       },
       {
        "text": "悠悠乎与颢气俱，而莫得其涯；",
        "pinyin": "yōu yōu hū yǔ hào qì jù ， ér mò dé qí yá ；"
       },
       {
        "text": "洋洋乎与造物者游，而不知其所穷。",
        "pinyin": "yáng yáng hū yǔ zào wù zhě yóu ， ér bù zhī qí suǒ qióng 。"
       },
       {
        "text": "引觞满酌，颓然就醉，不知日之入。",
        "pinyin": "yǐn shāng mǎn zhuó ， tuí rán jiù zuì ， bù zhī rì zhī rù 。"
       },
       {
        "text": "苍然暮色，自远而至，至无所见，而犹不欲归。",
        "pinyin": "cāng rán mù sè ， zì yuǎn ér zhì ， zhì wú suǒ jiàn ， ér yóu bú yù guī 。"
       },
       {
        "text": "心凝形释，与万化冥合。",
        "pinyin": "xīn níng xíng shì ， yǔ wàn huà míng hé 。"
       },
       {
        "text": "然后知吾向之未始游，游于是乎始，故为之文以志。",
        "pinyin": "rán hòu zhī wú xiàng zhī wèi shǐ yóu ， yóu yú shì hū shǐ ， gù wèi zhī wén yǐ zhì 。"
       },
       {
        "text": "是岁，元和四年也。",
        "pinyin": "shì suì ， yuán hé sì nián yě 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-chibifu",
      "title": "赤壁赋",
      "author": "苏轼",
      "dynasty": "苏教版",
      "grade": "高中语文必修一",
      "sentences": [
       {
        "text": "壬戌之秋，七月既望，苏子与客泛舟游于赤壁之下。",
        "pinyin": "rén xū zhī qiū ， qī yuè jì wàng ， sū zǐ yǔ kè fàn zhōu yóu yú chì bì zhī xià 。"
       },
       {
        "text": "清风徐来，水波不兴。",
        "pinyin": "qīng fēng xú lái ， shuǐ bō bù xīng 。"
       },
       {
        "text": "举酒属客，诵明月之诗，歌窈窕之章。",
        "pinyin": "jǔ jiǔ shǔ kè ， sòng míng yuè zhī shī ， gē yǎo tiǎo zhī zhāng 。"
       },
       {
        "text": "少焉，月出于东山之上，徘徊于斗牛之间。",
        "pinyin": "shǎo yān ， yuè chū yú dōng shān zhī shàng ， pái huái yú dòu niú zhī jiān 。"
       },
       {
        "text": "白露横江，水光接天。",
        "pinyin": "bái lù héng jiāng ， shuǐ guāng jiē tiān 。"
       },
       {
        "text": "纵一苇之所如，凌万顷之茫然。",
        "pinyin": "zòng yì wěi zhī suǒ rú ， líng wàn qǐng zhī máng rán 。"
       },
       {
        "text": "浩浩乎如冯虚御风，而不知其所止；",
        "pinyin": "hào hào hū rú féng xū yù fēng ， ér bù zhī qí suǒ zhǐ ；"
       },
       {
        "text": "飘飘乎如遗世独立，羽化而登仙。",
        "pinyin": "piāo piāo hū rú yí shì dú lì ， yǔ huà ér dēng xiān 。"
       },
       {
        "text": "于是饮酒乐甚，扣舷而歌之。",
        "pinyin": "yú shì yǐn jiǔ lè shèn ， kòu xián ér gē zhī 。"
       },
       {
        "text": "歌曰：“桂棹兮兰桨，击空明兮溯流光。",
        "pinyin": "gē yuē ：“ guì zhào xī lán jiǎng ， jī kōng míng xī sù liú guāng 。"
       },
       {
        "text": "渺渺兮予怀，望美人兮天一方。",
        "pinyin": "miǎo miǎo xī yǔ huái ， wàng měi rén xī tiān yì fāng 。"
       },
       {
        "text": "”客有吹洞箫者，倚歌而和之。",
        "pinyin": "” kè yǒu chuī dòng xiāo zhě ， yǐ gē ér hé zhī 。"
       },
       {
        "text": "其声呜呜然，如怨如慕，如泣如诉，余音袅袅，不绝如缕。",
        "pinyin": "qí shēng wū wū rán ， rú yuàn rú mù ， rú qì rú sù ， yú yīn niǎo niǎo ， bù jué rú lǚ 。"
       },
       {
        "text": "舞幽壑之潜蛟，泣孤舟之嫠妇。",
        "pinyin": "wǔ yōu hè zhī qián jiāo ， qì gū zhōu zhī lí fù 。"
       },
       {
        "text": "苏子愀然，正襟危坐而问客曰：“何为其然也？",
        "pinyin": "sū zǐ qiǎo rán ， zhèng jīn wēi zuò ér wèn kè yuē ：“ hé wèi qí rán yě ？"
       },
       {
        "text": "”客曰：“‘月明星稀，乌鹊南飞。",
        "pinyin": "” kè yuē ：“‘ yuè míng xīng xī ， wū què nán fēi 。"
       },
       {
        "text": "’此非曹孟德之诗乎？",
        "pinyin": "’ cǐ fēi cáo mèng dé zhī shī hū ？"
       },
       {
        "text": "西望夏口，东望武昌，山川相缪，郁乎苍苍，此非孟德之困于周郎者乎？",
        "pinyin": "xī wàng xià kǒu ， dōng wàng wǔ chāng ， shān chuān xiāng miù ， yù hū cāng cāng ， cǐ fēi mèng dé zhī kùn yú zhōu láng zhě hū ？"
       },
       {
        "text": "方其破荆州，下江陵，顺流而东也，舳舻千里，旌旗蔽空，酾酒临江，横槊赋诗，固一世之雄也，而今安在哉？",
        "pinyin": "fāng qí pò jīng zhōu ， xià jiāng líng ， shùn liú ér dōng yě ， zhú lú qiān lǐ ， jīng qí bì kōng ， shāi jiǔ lín jiāng ， héng shuò fù shī ， gù yí shì zhī xióng yě ， ér jīn ān zài zāi ？"
       },
       {
        "text": "况吾与子渔樵于江渚之上，侣鱼虾而友麋鹿，驾一叶之扁舟，举匏樽以相属。",
        "pinyin": "kuàng wú yǔ zǐ yú qiáo yú jiāng zhǔ zhī shàng ， lǚ yú xiā ér yǒu mí lù ， jià yí yè zhī piān zhōu ， jǔ páo zūn yǐ xiāng shǔ 。"
       },
       {
        "text": "寄蜉蝣于天地，渺沧海之一粟。",
        "pinyin": "jì fú yóu yú tiān dì ， miǎo cāng hǎi zhī yī sù 。"
       },
       {
        "text": "哀吾生之须臾，羡长江之无穷。",
        "pinyin": "āi wú shēng zhī xū yú ， xiàn cháng jiāng zhī wú qióng 。"
       },
       {
        "text": "挟飞仙以遨游，抱明月而长终。",
        "pinyin": "xié fēi xiān yǐ áo yóu ， bào míng yuè ér cháng zhōng 。"
       },
       {
        "text": "知不可乎骤得，托遗响于悲风。",
        "pinyin": "zhī bù kě hū zhòu dé ， tuō yí xiǎng yú bēi fēng 。"
       },
       {
        "text": "苏子曰：“客亦知夫水与月乎？",
        "pinyin": "sū zǐ yuē ：“ kè yì zhī fū shuǐ yǔ yuè hū ？"
       },
       {
        "text": "逝者如斯，而未尝往也；",
        "pinyin": "shì zhě rú sī ， ér wèi cháng wǎng yě ；"
       },
       {
        "text": "盈虚者如彼，而卒莫消长也。",
        "pinyin": "yíng xū zhě rú bǐ ， ér zú mò xiāo zhǎng yě 。"
       },
       {
        "text": "盖将自其变者而观之，则天地曾不能以一瞬；",
        "pinyin": "gài jiāng zì qí biàn zhě ér guān zhī ， zé tiān dì céng bù néng yǐ yí shùn ；"
       },
       {
        "text": "自其不变者而观之，则物与我皆无尽也，而又何羡乎！",
        "pinyin": "zì qí bú biàn zhě ér guān zhī ， zé wù yǔ wǒ jiē wú jìn yě ， ér yòu hé xiàn hū ！"
       },
       {
        "text": "且夫天地之间，物各有主，苟非吾之所有，虽一毫而莫取。",
        "pinyin": "qiě fū tiān dì zhī jiān ， wù gè yǒu zhǔ ， gǒu fēi wú zhī suǒ yǒu ， suī yì háo ér mò qǔ 。"
       },
       {
        "text": "惟江上之清风，与山间之明月，耳得之而为声，目遇之而成色，取之无禁，用之不竭。",
        "pinyin": "wéi jiāng shàng zhī qīng fēng ， yǔ shān jiān zhī míng yuè ， ěr dé zhī ér wèi shēng ， mù yù zhī ér chéng sè ， qǔ zhī wú jìn ， yòng zhī bù jié 。"
       },
       {
        "text": "是造物者之无尽藏也，而吾与子之所共适。",
        "pinyin": "shì zào wù zhě zhī wú jìn cáng yě ， ér wú yǔ zǐ zhī suǒ gòng shì 。"
       },
       {
        "text": "客喜而笑，洗盏更酌。",
        "pinyin": "kè xǐ ér xiào ， xǐ zhǎn gèng zhuó 。"
       },
       {
        "text": "肴核既尽，杯盘狼藉。",
        "pinyin": "yáo hé jì jìn ， bēi pán láng jí 。"
       },
       {
        "text": "相与枕藉乎舟中，不知东方之既白。",
        "pinyin": "xiāng yǔ zhěn jiè hū zhōu zhōng ， bù zhī dōng fāng zhī jì bái 。"
       }
      ],
      "comment": ""
     }
    ]
   },
   {
    "id": "sj-vol-8",
    "name": "高中语文必修二",
    "articles": [
     {
      "id": "sj-epanggongfu",
      "title": "阿房宫赋",
      "author": "杜牧",
      "dynasty": "苏教版",
      "grade": "高中语文必修二",
      "sentences": [
       {
        "text": "六王毕，四海一，蜀山兀，阿房出。",
        "pinyin": "liù wáng bì ， sì hǎi yī ， shǔ shān wù ， ā fáng chū 。"
       },
       {
        "text": "覆压三百余里，隔离天日。",
        "pinyin": "fù yā sān bǎi yú lǐ ， gé lí tiān rì 。"
       },
       {
        "text": "骊山北构而西折，直走咸阳。",
        "pinyin": "lí shān běi gòu ér xī zhé ， zhí zǒu xián yáng 。"
       },
       {
        "text": "二川溶溶，流入宫墙。",
        "pinyin": "èr chuān róng róng ， liú rù gōng qiáng 。"
       },
       {
        "text": "五步一楼，十步一阁；",
        "pinyin": "wǔ bù yī lóu ， shí bù yì gé ；"
       },
       {
        "text": "廊腰缦回，檐牙高啄；",
        "pinyin": "láng yāo màn huí ， yán yá gāo zhuó ；"
       },
       {
        "text": "各抱地势，钩心斗角。",
        "pinyin": "gè bào dì shì ， gōu xīn dòu jiǎo 。"
       },
       {
        "text": "盘盘焉，囷囷焉，蜂房水涡，矗不知其几千万落。",
        "pinyin": "pán pán yān ， qūn qūn yān ， fēng fáng shuǐ wō ， chù bù zhī qí jǐ qiān wàn luò 。"
       },
       {
        "text": "长桥卧波，未云何龙？",
        "pinyin": "cháng qiáo wò bō ， wèi yún hé lóng ？"
       },
       {
        "text": "复道行空，不霁何虹？",
        "pinyin": "fù dào heng kōng ， bú jì hé hóng ？"
       },
       {
        "text": "高低冥迷，不知西东。",
        "pinyin": "gāo dī míng mí ， bù zhī xī dōng 。"
       },
       {
        "text": "歌台暖响，春光融融；",
        "pinyin": "gē tái nuǎn xiǎng ， chūn guāng róng róng ；"
       },
       {
        "text": "舞殿冷袖，风雨凄凄。",
        "pinyin": "wǔ diàn lěng xiù ， fēng yǔ qī qī 。"
       },
       {
        "text": "一日之内，一宫之间，而气候不齐。",
        "pinyin": "yí rì zhī nèi ， yì gōng zhī jiān ， ér qì hòu bù qí 。"
       },
       {
        "text": "妃嫔媵嫱，王子皇孙，辞楼下殿，辇来于秦。",
        "pinyin": "fēi pín yìng qiáng ， wáng zǐ huáng sūn ， cí lóu xià diàn ， niǎn lái yú qín 。"
       },
       {
        "text": "朝歌夜弦，为秦宫人。",
        "pinyin": "cháo gē yè xián ， wèi qín gōng rén 。"
       },
       {
        "text": "明星荧荧，开妆镜也；",
        "pinyin": "míng xīng yíng yíng ， kāi zhuāng jìng yě ；"
       },
       {
        "text": "绿云扰扰，梳晓鬟也；",
        "pinyin": "lǜ yún rǎo rǎo ， shū xiǎo huán yě ；"
       },
       {
        "text": "渭流涨腻，弃脂水也；",
        "pinyin": "wèi liú zhǎng nì ， qì zhī shuǐ yě ；"
       },
       {
        "text": "烟斜雾横，焚椒兰也。",
        "pinyin": "yān xié wù héng ， fén jiāo lán yě 。"
       },
       {
        "text": "雷霆乍惊，宫车过也；",
        "pinyin": "léi tíng zhà jīng ， gōng chē guò yě ；"
       },
       {
        "text": "辘辘远听，杳不知其所之也。",
        "pinyin": "lù lù yuǎn tīng ， yǎo bù zhī qí suǒ zhī yě 。"
       },
       {
        "text": "一肌一容，尽态极妍，缦立远视，而望幸焉。",
        "pinyin": "yì jī yì róng ， jìn tài jí yán ， màn lì yuǎn shì ， ér wàng xìng yān 。"
       },
       {
        "text": "有不见者，三十六年。",
        "pinyin": "yǒu bú jiàn zhě ， sān shí liù nián 。"
       },
       {
        "text": "燕赵之收藏，韩魏之经营，齐楚之精英，几世几年，剽掠其人，倚叠如山。",
        "pinyin": "yān zhào zhī shōu cáng ， hán wèi zhī jīng yíng ， qí chǔ zhī jīng yīng ， jǐ shì jǐ nián ， piāo lüè qí rén ， yǐ dié rú shān 。"
       },
       {
        "text": "一旦不能有，输来其间。",
        "pinyin": "yí dàn bù néng yǒu ， shū lái qí jiān 。"
       },
       {
        "text": "鼎铛玉石，金块珠砾，弃掷逦迤，秦人视之，亦不甚惜。",
        "pinyin": "dǐng dāng yù shí ， jīn kuài zhū lì ， qì zhì lǐ yǐ ， qín rén shì zhī ， yì bú shèn xī 。"
       },
       {
        "text": "嗟乎！",
        "pinyin": "jiē hū ！"
       },
       {
        "text": "一人之心，千万人之心也。",
        "pinyin": "yì rén zhī xīn ， qiān wàn rén zhī xīn yě 。"
       },
       {
        "text": "秦爱纷奢，人亦念其家。",
        "pinyin": "qín ài fēn shē ， rén yì niàn qí jiā 。"
       },
       {
        "text": "奈何取之尽锱铢，用之如泥沙？",
        "pinyin": "nài hé qǔ zhī jìn zī zhū ， yòng zhī rú ní shā ？"
       },
       {
        "text": "使负栋之柱，多于南亩之农夫；",
        "pinyin": "shǐ fù dòng zhī zhù ， duō yú nán mǔ zhī nóng fū ；"
       },
       {
        "text": "架梁之椽，多于机上之工女；",
        "pinyin": "jià liáng zhī chuán ， duō yú jī shàng zhī gōng nǚ ；"
       },
       {
        "text": "钉头磷磷，多于在庾之粟粒；",
        "pinyin": "dīng tóu lín lín ， duō yú zài yǔ zhī sù lì ；"
       },
       {
        "text": "瓦缝参差，多于周身之帛缕；",
        "pinyin": "wǎ fèng cēn cī ， duō yú zhōu shēn zhī bó lǚ ；"
       },
       {
        "text": "直栏横槛，多于九土之城郭；",
        "pinyin": "zhí lán héng kǎn ， duō yú jiǔ tǔ zhī chéng guō ；"
       },
       {
        "text": "管弦呕哑，多于市人之言语。",
        "pinyin": "guǎn xián ǒu yǎ ， duō yú shì rén zhī yán yǔ 。"
       },
       {
        "text": "使天下之人，不敢言而敢怒。",
        "pinyin": "shǐ tiān xià zhī rén ， bù gǎn yán ér gǎn nù 。"
       },
       {
        "text": "独夫之心，日益骄固。",
        "pinyin": "dú fū zhī xīn ， rì yì jiāo gù 。"
       },
       {
        "text": "戍卒叫，函谷举，楚人一炬，可怜焦土！",
        "pinyin": "shù zú jiào ， hán gǔ jǔ ， chǔ rén yí jù ， kě lián jiāo tǔ ！"
       },
       {
        "text": "呜呼！",
        "pinyin": "wū hū ！"
       },
       {
        "text": "灭六国者六国也，非秦也；",
        "pinyin": "miè liù guó zhě liù guó yě ， fēi qín yě ；"
       },
       {
        "text": "族秦者秦也，非天下也。",
        "pinyin": "zú qín zhě qín yě ， fēi tiān xià yě 。"
       },
       {
        "text": "嗟乎！",
        "pinyin": "jiē hū ！"
       },
       {
        "text": "使六国各爱其人，则足以拒秦；",
        "pinyin": "shǐ liù guó gè ài qí rén ， zé zú yǐ jù qín ；"
       },
       {
        "text": "使秦复爱六国之人，则递三世可至万世而为君，谁得而族灭也？",
        "pinyin": "shǐ qín fù ài liù guó zhī rén ， zé dì sān shì kě zhì wàn shì ér wèi jūn ， shuí dé ér zú miè yě ？"
       },
       {
        "text": "秦人不暇自哀，而后人哀之；",
        "pinyin": "qín rén bù xiá zì āi ， ér hòu rén āi zhī ；"
       },
       {
        "text": "后人哀之而不鉴之，亦使后人而复哀后人也。",
        "pinyin": "hòu rén āi zhī ér bú jiàn zhī ， yì shǐ hòu rén ér fù āi hòu rén yě 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-liuguolun",
      "title": "六国论",
      "author": "苏洵",
      "dynasty": "苏教版",
      "grade": "高中语文必修二",
      "sentences": [
       {
        "text": "六国破灭，非兵不利，战不善，弊在赂秦。",
        "pinyin": "liù guó pò miè ， fēi bīng bú lì ， zhàn bú shàn ， bì zài lù qín 。"
       },
       {
        "text": "赂秦而力亏，破灭之道也。",
        "pinyin": "lù qín ér lì kuī ， pò miè zhī dào yě 。"
       },
       {
        "text": "或曰：六国互丧，率赂秦耶？",
        "pinyin": "huò yuē ： liù guó hù sàng ， lǜ lù qín yē ？"
       },
       {
        "text": "曰：不赂者以赂者丧。",
        "pinyin": "yuē ： bú lù zhě yǐ lù zhě sàng 。"
       },
       {
        "text": "盖失强援，不能独完。",
        "pinyin": "gài shī qiáng yuán ， bù néng dú wán 。"
       },
       {
        "text": "故曰：弊在赂秦也。",
        "pinyin": "gù yuē ： bì zài lù qín yě 。"
       },
       {
        "text": "秦以攻取之外，小则获邑，大则得城。",
        "pinyin": "qín yǐ gōng qǔ zhī wài ， xiǎo zé huò yì ， dà zé dé chéng 。"
       },
       {
        "text": "较秦之所得，与战胜而得者，其实百倍；",
        "pinyin": "jiào qín zhī suǒ dé ， yǔ zhàn shèng ér dé zhě ， qí shí bǎi bèi ；"
       },
       {
        "text": "诸侯之所亡，与战败而亡者，其实亦百倍。",
        "pinyin": "zhū hóu zhī suǒ wáng ， yǔ zhàn bài ér wáng zhě ， qí shí yì bǎi bèi 。"
       },
       {
        "text": "则秦之所大欲，诸侯之所大患，固不在战矣。",
        "pinyin": "zé qín zhī suǒ dà yù ， zhū hóu zhī suǒ dà huàn ， gù bú zài zhàn yǐ 。"
       },
       {
        "text": "思厥先祖父，暴霜露，斩荆棘，以有尺寸之地。",
        "pinyin": "sī jué xiān zǔ fù ， bào shuāng lù ， zhǎn jīng jí ， yǐ yǒu chǐ cùn zhī dì 。"
       },
       {
        "text": "子孙视之不甚惜，举以予人，如弃草芥。",
        "pinyin": "zǐ sūn shì zhī bú shèn xī ， jǔ yǐ yǔ rén ， rú qì cǎo jiè 。"
       },
       {
        "text": "今日割五城，明日割十城，然后得一夕安寝。",
        "pinyin": "jīn rì gē wǔ chéng ， míng rì gē shí chéng ， rán hòu dé yì xī ān qǐn 。"
       },
       {
        "text": "起视四境，而秦兵又至矣。",
        "pinyin": "qǐ shì sì jìng ， ér qín bīng yòu zhì yǐ 。"
       },
       {
        "text": "然则诸侯之地有限，暴秦之欲无厌，奉之弥繁，侵之愈急。",
        "pinyin": "rán zé zhū hóu zhī dì yǒu xiàn ， bào qín zhī yù wú yàn ， fèng zhī mí fán ， qīn zhī yù jí 。"
       },
       {
        "text": "故不战而强弱胜负已判矣。",
        "pinyin": "gù bú zhàn ér qiáng ruò shèng fù yǐ pàn yǐ 。"
       },
       {
        "text": "至于颠覆，理固宜然。",
        "pinyin": "zhì yú diān fù ， lǐ gù yí rán 。"
       },
       {
        "text": "古人云：“以地事秦，犹抱薪救火，薪不尽，火不灭。",
        "pinyin": "gǔ rén yún ：“ yǐ dì shì qín ， yóu bào xīn jiù huǒ ， xīn bú jìn ， huǒ bú miè 。"
       },
       {
        "text": "”此言得之。",
        "pinyin": "” cǐ yán dé zhī 。"
       },
       {
        "text": "齐人未尝赂秦，终继五国迁灭，何哉？",
        "pinyin": "qí rén wèi cháng lù qín ， zhōng jì wǔ guó qiān miè ， hé zāi ？"
       },
       {
        "text": "与嬴而不助五国也。",
        "pinyin": "yǔ yíng ér bú zhù wǔ guó yě 。"
       },
       {
        "text": "五国既丧，齐亦不免矣。",
        "pinyin": "wǔ guó jì sàng ， qí yì bù miǎn yǐ 。"
       },
       {
        "text": "燕赵之君，始有远略，能守其土，义不赂秦。",
        "pinyin": "yān zhào zhī jūn ， shǐ yǒu yuǎn lüè ， néng shǒu qí tǔ ， yì bú lù qín 。"
       },
       {
        "text": "是故燕虽小国而后亡，斯用兵之效也。",
        "pinyin": "shì gù yàn suī xiǎo guó ér hòu wáng ， sī yòng bīng zhī xiào yě 。"
       },
       {
        "text": "至丹以荆卿为计，始速祸焉。",
        "pinyin": "zhì dān yǐ jīng qīng wèi jì ， shǐ sù huò yān 。"
       },
       {
        "text": "赵尝五战于秦，二败而三胜。",
        "pinyin": "zhào cháng wǔ zhàn yú qín ， èr bài ér sān shèng 。"
       },
       {
        "text": "后秦击赵者再，李牧连却之。",
        "pinyin": "hòu qín jī zhào zhě zài ， lǐ mù lián què zhī 。"
       },
       {
        "text": "洎牧以谗诛，邯郸为郡，惜其用武而不终也。",
        "pinyin": "jì mù yǐ chán zhū ， hán dān wèi jùn ， xī qí yòng wǔ ér bù zhōng yě 。"
       },
       {
        "text": "且燕赵处秦革灭殆尽之际，可谓智力孤危，战败而亡，诚不得已。",
        "pinyin": "qiě yān zhào chù qín gé miè dài jìn zhī jì ， kě wèi zhì lì gū wēi ， zhàn bài ér wáng ， chéng bù dé yǐ 。"
       },
       {
        "text": "向使三国各爱其地，齐人勿附于秦，刺客不行，良将犹在，则胜负之数，存亡之理，当与秦相较，或未易量。",
        "pinyin": "xiàng shǐ sān guó gè ài qí dì ， qí rén wù fù yú qín ， cì kè bù xíng ， liáng jiàng yóu zài ， zé shèng fù zhī shù ， cún wáng zhī lǐ ， dāng yǔ qín xiāng jiào ， huò wèi yì liáng 。"
       },
       {
        "text": "呜呼！",
        "pinyin": "wū hū ！"
       },
       {
        "text": "以赂秦之地封天下之谋臣，以事秦之心礼天下之奇才，并力西向，则吾恐秦人食之不得下咽也。",
        "pinyin": "yǐ lù qín zhī dì fēng tiān xià zhī móu chén ， yǐ shì qín zhī xīn lǐ tiān xià zhī qí cái ， bìng lì xī xiàng ， zé wú kǒng qín rén shí zhī bù dé xià yàn yě 。"
       },
       {
        "text": "悲夫！",
        "pinyin": "bēi fū ！"
       },
       {
        "text": "有如此之势，而为秦人积威之所劫，日削月割，以趋于亡。",
        "pinyin": "yǒu rú cǐ zhī shì ， ér wèi qín rén jī wēi zhī suǒ jié ， rì xuē yuè gē ， yǐ qū yú wáng 。"
       },
       {
        "text": "为国者无使为积威之所劫哉！",
        "pinyin": "wèi guó zhě wú shǐ wèi jī wēi zhī suǒ jié zāi ！"
       },
       {
        "text": "夫六国与秦皆诸侯，其势弱于秦，而犹有可以不赂而胜之之势。",
        "pinyin": "fū liù guó yǔ qín jiē zhū hóu ， qí shì ruò yú qín ， ér yóu yǒu kě yǐ bú lù ér shèng zhī zhī shì 。"
       },
       {
        "text": "苟以天下之大，下而从六国破亡之故事，是又在六国下矣。",
        "pinyin": "gǒu yǐ tiān xià zhī dà ， xià ér cóng liù guó pò wáng zhī gù shì ， shì yòu zài liù guó xià yǐ 。"
       }
      ],
      "comment": ""
     }
    ]
   },
   {
    "id": "sj-vol-9",
    "name": "高中语文必修三",
    "articles": [
     {
      "id": "sj-zhinanluhouxu",
      "title": "指南录后序",
      "author": "文天祥",
      "dynasty": "苏教版",
      "grade": "高中语文必修三",
      "sentences": [
       {
        "text": "德祐二年二月十九日，予除右丞相兼枢密使，都督诸路军马。",
        "pinyin": "dé yòu èr nián èr yuè shí jiǔ rì ， yǔ chú yòu chéng xiàng jiān shū mì shǐ ， dū du zhū lù jūn mǎ 。"
       },
       {
        "text": "时北兵已迫修门外，战、守、迁皆不及施。",
        "pinyin": "shí běi bīng yǐ pò xiū mén wài ， zhàn 、 shǒu 、 qiān jiē bù jí shī 。"
       },
       {
        "text": "缙绅、大夫、士萃于左丞相府，莫知计所出。",
        "pinyin": "jìn shēn 、 dài fu 、 shì cuì yú zuǒ chéng xiàng fǔ ， mò zhī jì suǒ chū 。"
       },
       {
        "text": "会使辙交驰，北邀当国者相见，众谓予一行为可以纾祸。",
        "pinyin": "huì shǐ zhé jiāo chí ， běi yāo dāng guó zhě xiāng jiàn ， zhòng wèi yǔ yì xíng wéi kě yǐ shū huò 。"
       },
       {
        "text": "国事至此，予不得爱身；",
        "pinyin": "guó shì zhì cǐ ， yǔ bù dé ài shēn ；"
       },
       {
        "text": "意北亦尚可以口舌动也。",
        "pinyin": "yì běi yì shàng kě yǐ kǒu shé dòng yě 。"
       },
       {
        "text": "初，奉使往来，无留北者，予更欲一觇北，归而求救国之策。",
        "pinyin": "chū ， fèng shǐ wǎng lái ， wú liú běi zhě ， yǔ gèng yù yì chān běi ， guī ér qiú jiù guó zhī cè 。"
       },
       {
        "text": "于是辞相印不拜，翌日，以资政殿学士行。",
        "pinyin": "yú shì cí xiāng yìn bú bài ， yì rì ， yǐ zī zhèng diàn xué shì xíng 。"
       },
       {
        "text": "初至北营，抗辞慷慨，上下颇惊动，北亦未敢遽轻吾国。",
        "pinyin": "chū zhì běi yíng ， kàng cí kāng kǎi ， shàng xià pō jīng dòng ， běi yì wèi gǎn jù qīng wú guó 。"
       },
       {
        "text": "不幸吕师孟构恶于前，贾余庆献谄于后，予羁縻不得还，国事遂不可收拾。",
        "pinyin": "bú xìng lǚ shī mèng gòu è yú qián ， jiǎ yú qìng xiàn chǎn yú hòu ， yǔ jī mí bù dé hái ， guó shì suì bù kě shōu shi 。"
       },
       {
        "text": "予自度不得脱，则直前诟虏帅失信，数吕师孟叔侄为逆，但欲求死，不复顾利害。",
        "pinyin": "yǔ zì dù bù dé tuō ， zé zhí qián gòu lǔ shuài shī xìn ， shù lǚ shī mèng shū zhí wèi nì ， dàn yù qiú sǐ ， bú fù gù lì hài 。"
       },
       {
        "text": "北虽貌敬，实则愤怒。",
        "pinyin": "běi suī mào jìng ， shí zé fèn nù 。"
       },
       {
        "text": "二贵酋名曰“馆伴”，夜则以兵围所寓舍，而予不得归矣。",
        "pinyin": "èr guì qiú míng yuē “ guǎn bàn ”， yè zé yǐ bīng wéi suǒ yù shè ， ér yǔ bù dé guī yǐ 。"
       },
       {
        "text": "未几，贾余庆等以祈请使诣北；",
        "pinyin": "wèi jǐ ， jiǎ yú qìng děng yǐ qí qǐng shǐ yì běi ；"
       },
       {
        "text": "北驱予并往，而不在使者之目。",
        "pinyin": "běi qū yǔ bìng wǎng ， ér bú zài shǐ zhě zhī mù 。"
       },
       {
        "text": "予分当引决，然而隐忍以行。",
        "pinyin": "yǔ fēn dāng yǐn jué ， rán ér yǐn rěn yǐ xíng 。"
       },
       {
        "text": "昔人云：“将以有为也。",
        "pinyin": "xī rén yún ：“ jiāng yǐ yǒu wèi yě 。"
       },
       {
        "text": "至京口，得间奔真州，即具以北虚实告东西二阃，约以连兵大举。",
        "pinyin": "zhì jīng kǒu ， dé jiān bēn zhēn zhōu ， jí jù yǐ běi xū shí gào dōng xī èr kǔn ， yuē yǐ lián bīng dà jǔ 。"
       },
       {
        "text": "中兴机会，庶几在此。",
        "pinyin": "zhōng xīng jī huì ， shù jī zài cǐ 。"
       },
       {
        "text": "留二日，维扬帅下逐客之令。",
        "pinyin": "liú èr rì ， wéi yáng shuài xià zhú kè zhī lìng 。"
       },
       {
        "text": "不得已，变姓名，诡踪迹，草行露宿，日与北骑相出没于长淮间。",
        "pinyin": "bù dé yǐ ， biàn xìng míng ， guǐ zōng jì ， cǎo xíng lù sù ， rì yǔ běi qí xiāng chū mò yú cháng huái jiān 。"
       },
       {
        "text": "穷饿无聊，追购又急，天高地迥，号呼靡及。",
        "pinyin": "qióng è wú liáo ， zhuī gòu yòu jí ， tiān gāo dì jiǒng ， hào hū mí jí 。"
       },
       {
        "text": "已而得舟，避渚洲，出北海，然后渡扬子江，入苏州洋，展转四明、天台，以至于永嘉。",
        "pinyin": "yǐ ér dé zhōu ， bì zhǔ zhōu ， chū běi hǎi ， rán hòu dù yáng zǐ jiāng ， rù sū zhōu yáng ， zhǎn zhuǎn sì míng 、 tiān tái ， yǐ zhì yú yǒng jiā 。"
       },
       {
        "text": "呜呼！",
        "pinyin": "wū hū ！"
       },
       {
        "text": "予之及于死者，不知其几矣！",
        "pinyin": "yǔ zhī jí yú sǐ zhě ， bù zhī qí jǐ yǐ ！"
       },
       {
        "text": "诋大酋当死；",
        "pinyin": "dǐ dà qiú dāng sǐ ；"
       },
       {
        "text": "骂逆贼当死；",
        "pinyin": "mà nì zéi dāng sǐ ；"
       },
       {
        "text": "与贵酋相处二十日，争曲直，屡当死；",
        "pinyin": "yǔ guì qiú xiāng chǔ èr shí rì ， zhēng qū zhí ， lǚ dāng sǐ ；"
       },
       {
        "text": "去京口，挟匕首以备不测，几自刭死；",
        "pinyin": "qù jīng kǒu ， xié bǐ shǒu yǐ bèi bú cè ， jǐ zì jǐng sǐ ；"
       },
       {
        "text": "经北舰十余里，为巡船所物色，几从鱼腹死；",
        "pinyin": "jīng běi jiàn shí yú lǐ ， wèi xún chuán suǒ wù sè ， jǐ cóng yú fù sǐ ；"
       },
       {
        "text": "真州逐之城门外，几彷徨死；",
        "pinyin": "zhēn zhōu zhú zhī chéng mén wài ， jǐ páng huáng sǐ ；"
       },
       {
        "text": "如扬州，过瓜洲扬子桥，竟使遇哨，无不死；",
        "pinyin": "rú yáng zhōu ， guò guā zhōu yáng zǐ qiáo ， jìng shǐ yù shào ， wú bù sǐ ；"
       },
       {
        "text": "扬州城下，进退不由，殆例送死；",
        "pinyin": "yáng zhōu chéng xià ， jìn tuì bù yóu ， dài lì sòng sǐ ；"
       },
       {
        "text": "坐桂公塘土围中，骑数千过其门，几落贼手死；",
        "pinyin": "zuò guì gōng táng tǔ wéi zhōng ， qí shù qiān guò qí mén ， jǐ luò zéi shǒu sǐ ；"
       },
       {
        "text": "贾家庄几为巡徼所陵迫死；",
        "pinyin": "jiǎ jiā zhuāng jǐ wèi xún jiǎo suǒ líng pò sǐ ；"
       },
       {
        "text": "夜趋高邮，迷失道，几陷死；",
        "pinyin": "yè qū gāo yóu ， mí shī dào ， jǐ xiàn sǐ ；"
       },
       {
        "text": "质明，避哨竹林中，逻者数十骑，几无所逃死；",
        "pinyin": "zhì míng ， bì shào zhú lín zhōng ， luó zhě shù shí qí ， jǐ wú suǒ táo sǐ ；"
       },
       {
        "text": "至高邮，制府檄下，几以捕系死；",
        "pinyin": "zhì gāo yóu ， zhì fǔ xí xià ， jǐ yǐ bǔ xì sǐ ；"
       },
       {
        "text": "行城子河，出入乱尸中，舟与哨相后先，几邂逅死；",
        "pinyin": "xíng chéng zǐ hé ， chū rù luàn shī zhōng ， zhōu yǔ shào xiāng hòu xiān ， jǐ xiè hòu sǐ ；"
       },
       {
        "text": "至海陵，痛高沙，恐忽焉死；",
        "pinyin": "zhì hǎi líng ， tòng gāo shā ， kǒng hū yān sǐ ；"
       },
       {
        "text": "道海安、如皋，凡三百里，北与寇往来其间，无日而非可死也；",
        "pinyin": "dào hǎi ān 、 rú gāo ， fán sān bǎi lǐ ， běi yǔ kòu wǎng lái qí jiān ， wú rì ér fēi kě sǐ yě ；"
       },
       {
        "text": "至通州，几以不纳死；",
        "pinyin": "zhì tōng zhōu ， jǐ yǐ bú nà sǐ ；"
       },
       {
        "text": "以小舟涉鲸波出，无可奈何，而死固付之度外矣！",
        "pinyin": "yǐ xiǎo zhōu shè jīng bō chū ， wú kě nài hé ， ér sǐ gù fù zhī dù wài yǐ ！"
       },
       {
        "text": "呜呼！",
        "pinyin": "wū hū ！"
       },
       {
        "text": "死生，昼夜事也，死而死矣，而境界危恶，层见错出，非人世所堪。",
        "pinyin": "sǐ shēng ， zhòu yè shì yě ， sǐ ér sǐ yǐ ， ér jìng jiè wēi è ， céng jiàn cuò chū ， fēi rén shì suǒ kān 。"
       },
       {
        "text": "痛定思痛，痛何如哉！",
        "pinyin": "tòng dìng sī tòng ， tòng hé rú zāi ！"
       },
       {
        "text": "予在患难中，间以诗记所遭，今存其本不忍废，道中手自抄录。",
        "pinyin": "yǔ zài huàn nán zhōng ， jiān yǐ shī jì suǒ zāo ， jīn cún qí běn bù rěn fèi ， dào zhōng shǒu zì chāo lù 。"
       },
       {
        "text": "使北营，留北关外为一卷；",
        "pinyin": "shǐ běi yíng ， liú běi guān wài wèi yí juàn ；"
       },
       {
        "text": "发北关外，历吴门、毗陵，渡瓜洲，复还京口为一卷；",
        "pinyin": "fā běi guān wài ， lì wú mén 、 pí líng ， dù guā zhōu ， fù hái jīng kǒu wèi yí juàn ；"
       },
       {
        "text": "脱京口，趋真州、扬州、高邮、泰州、通州为一卷；",
        "pinyin": "tuō jīng kǒu ， qū zhēn zhōu 、 yáng zhōu 、 gāo yóu 、 tài zhōu 、 tōng zhōu wèi yí juàn ；"
       },
       {
        "text": "自海道至永嘉来三山为一卷。",
        "pinyin": "zì hǎi dào zhì yǒng jiā lái sān shān wèi yí juàn 。"
       },
       {
        "text": "将藏之于家，使来者读之，悲予志焉。",
        "pinyin": "jiāng cáng zhī yú jiā ， shǐ lái zhě dú zhī ， bēi yǔ zhì yān 。"
       },
       {
        "text": "呜呼！",
        "pinyin": "wū hū ！"
       },
       {
        "text": "予之生也幸，而幸生也何所为？",
        "pinyin": "yǔ zhī shēng yě xìng ， ér xìng shēng yě hé suǒ wèi ？"
       },
       {
        "text": "求乎为臣，主辱，臣死有余僇；",
        "pinyin": "qiú hū wèi chén ， zhǔ rǔ ， chén sǐ yǒu yú lù ；"
       },
       {
        "text": "所求乎为子，以父母之遗体行殆而死，有余责。",
        "pinyin": "suǒ qiú hū wèi zǐ ， yǐ fù mǔ zhī yí tǐ xíng dài ér sǐ ， yǒu yú zé 。"
       },
       {
        "text": "将请罪于君，君不许；",
        "pinyin": "jiāng qǐng zuì yú jūn ， jūn bù xǔ ；"
       },
       {
        "text": "请罪于母，母不许；",
        "pinyin": "qǐng zuì yú mǔ ， mǔ bù xǔ ；"
       },
       {
        "text": "请罪于先人之墓，生无以救国难，死犹为厉鬼以击贼，义也；",
        "pinyin": "qǐng zuì yú xiān rén zhī mù ， shēng wú yǐ jiù guó nán ， sǐ yóu wèi lì guǐ yǐ jī zéi ， yì yě ；"
       },
       {
        "text": "赖天之灵、宗庙之福，修我戈矛，从王于师，以为前驱，雪九庙之耻，复高祖之业，所谓“誓不与贼俱生”，所谓“鞠躬尽力，死而后已”，亦义也。",
        "pinyin": "lài tiān zhī líng 、 zōng miào zhī fú ， xiū wǒ gē máo ， cóng wáng yú shī ， yǐ wéi qián qū ， xuě jiǔ miào zhī chǐ ， fù gāo zǔ zhī yè ， suǒ wèi “ shì bù yǔ zéi jù shēng ”， suǒ wèi “ jū gōng jìn lì ， sǐ ér hòu yǐ ”， yì yì yě 。"
       },
       {
        "text": "嗟夫！",
        "pinyin": "jiē fū ！"
       },
       {
        "text": "若予者，将无往而不得死所矣。",
        "pinyin": "ruò yǔ zhě ， jiāng wú wǎng ér bù dé sǐ suǒ yǐ 。"
       },
       {
        "text": "向也，使予委骨于草莽，予虽浩然无所愧怍，然微以自文于君亲，君亲其谓予何！",
        "pinyin": "xiàng yě ， shǐ yǔ wěi gǔ yú cǎo mǎng ， yǔ suī hào rán wú suǒ kuì zuò ， rán wēi yǐ zì wén yú jūn qīn ， jūn qīn qí wèi yǔ hé ！"
       },
       {
        "text": "诚不自意返吾衣冠，重见日月，使旦夕得正丘首，复何憾哉！",
        "pinyin": "chéng bú zì yì fǎn wú yī guān ， zhòng jiàn rì yuè ， shǐ dàn xī dé zhèng qiū shǒu ， fù hé hàn zāi ！"
       },
       {
        "text": "复何憾哉！",
        "pinyin": "fù hé hàn zāi ！"
       },
       {
        "text": "是年夏五，改元景炎，庐陵文天祥自序其诗，名曰《指南录》。",
        "pinyin": "shì nián xià wǔ ， gǎi yuán jǐng yán ， lú líng wén tiān xiáng zì xù qí shī ， míng yuē 《 zhǐ nán lù 》。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-wurenmubeiji",
      "title": "五人墓碑记",
      "author": "张溥",
      "dynasty": "苏教版",
      "grade": "高中语文必修三",
      "sentences": [
       {
        "text": "五人者，盖当蓼洲周公之被逮，激于义而死焉者也。",
        "pinyin": "wǔ rén zhě ， gài dāng liǎo zhōu zhōu gōng zhī bèi dǎi ， jī yú yì ér sǐ yān zhě yě 。"
       },
       {
        "text": "至于今，郡之贤士大夫请于当道，即除魏阉废祠之址以葬之；",
        "pinyin": "zhì yú jīn ， jùn zhī xián shì dà fū qǐng yú dāng dào ， jí chú wèi yān fèi cí zhī zhǐ yǐ zàng zhī ；"
       },
       {
        "text": "且立石于其墓之门，以旌其所为。",
        "pinyin": "qiě lì shí yú qí mù zhī mén ， yǐ jīng qí suǒ wèi 。"
       },
       {
        "text": "呜呼，亦盛矣哉！",
        "pinyin": "wū hū ， yì shèng yǐ zāi ！"
       },
       {
        "text": "夫五人之死，去今之墓而葬焉，其为时止十有一月耳。",
        "pinyin": "fū wǔ rén zhī sǐ ， qù jīn zhī mù ér zàng yān ， qí wèi shí zhǐ shí yǒu yī yuè ěr 。"
       },
       {
        "text": "夫十有一月之中，凡富贵之子，慷慨得志之徒，其疾病而死，死而湮没不足道者，亦已众矣；",
        "pinyin": "fū shí yǒu yī yuè zhī zhōng ， fán fù guì zhī zǐ ， kāng kǎi dé zhì zhī tú ， qí jí bìng ér sǐ ， sǐ ér yān mò bù zú dào zhě ， yì yǐ zhòng yǐ ；"
       },
       {
        "text": "况草野之无闻者欤？",
        "pinyin": "kuàng cǎo yě zhī wú wén zhě yú ？"
       },
       {
        "text": "独五人之皦皦，何也？",
        "pinyin": "dú wǔ rén zhī jiǎo jiǎo ， hé yě ？"
       },
       {
        "text": "予犹记周公之被逮，在丁卯三月之望。",
        "pinyin": "yǔ yóu jì zhōu gōng zhī bèi dǎi ， zài dīng mǎo sān yuè zhī wàng 。"
       },
       {
        "text": "吾社之行为士先者，为之声义，敛赀财以送其行，哭声震动天地。",
        "pinyin": "wú shè zhī xíng wèi shì xiān zhě ， wèi zhī shēng yì ， liǎn zī cái yǐ sòng qí xíng ， kū shēng zhèn dòng tiān dì 。"
       },
       {
        "text": "缇骑按剑而前，问：“谁为哀者？",
        "pinyin": "tí qí àn jiàn ér qián ， wèn ：“ shuí wèi āi zhě ？"
       },
       {
        "text": "”众不能堪，抶而仆之。",
        "pinyin": "” zhòng bù néng kān ， chì ér pú zhī 。"
       },
       {
        "text": "是时以大中丞抚吴者为魏之私人，周公之逮所由使也；",
        "pinyin": "shì shí yǐ dà zhōng chéng fǔ wú zhě wèi wèi zhī sī rén ， zhōu gōng zhī dǎi suǒ yóu shǐ yě ；"
       },
       {
        "text": "吴之民方痛心焉，于是乘其厉声以呵，则噪而相逐。",
        "pinyin": "wú zhī mín fāng tòng xīn yān ， yú shì chéng qí lì shēng yǐ hē ， zé zào ér xiāng zhú 。"
       },
       {
        "text": "中丞匿于溷藩以免。",
        "pinyin": "zhōng chéng nì yú hùn fān yǐ miǎn 。"
       },
       {
        "text": "既而以吴民之乱请于朝，按诛五人，曰颜佩韦、杨念如、马杰、沈扬、周文元，即今之傫然在墓者也。",
        "pinyin": "jì ér yǐ wú mín zhī luàn qǐng yú cháo ， àn zhū wǔ rén ， yuē yán pèi wéi 、 yáng niàn rú 、 mǎ jié 、 shěn yáng 、 zhōu wén yuán ， jí jīn zhī lěi rán zài mù zhě yě 。"
       },
       {
        "text": "然五人之当刑也，意气扬扬，呼中丞之名而詈之，谈笑以死。",
        "pinyin": "rán wǔ rén zhī dāng xíng yě ， yì qì yáng yáng ， hū zhōng chéng zhī míng ér lì zhī ， tán xiào yǐ sǐ 。"
       },
       {
        "text": "断头置城上，颜色不少变。",
        "pinyin": "duàn tóu zhì chéng shàng ， yán sè bù shǎo biàn 。"
       },
       {
        "text": "有贤士大夫发五十金，买五人之脰而函之，卒与尸合。",
        "pinyin": "yǒu xián shì dà fū fā wǔ shí jīn ， mǎi wǔ rén zhī dòu ér hán zhī ， zú yǔ shī hé 。"
       },
       {
        "text": "故今之墓中，全乎为五人也。",
        "pinyin": "gù jīn zhī mù zhōng ， quán hū wèi wǔ rén yě 。"
       },
       {
        "text": "嗟夫！",
        "pinyin": "jiē fū ！"
       },
       {
        "text": "大阉之乱，缙绅而能不易其志者，四海之大，有几人欤？",
        "pinyin": "dà yān zhī luàn ， jìn shēn ér néng bú yì qí zhì zhě ， sì hǎi zhī dà ， yǒu jǐ rén yú ？"
       },
       {
        "text": "而五人生于编伍之间，素不闻诗书之训，激昂大义，蹈死不顾，亦曷故哉？",
        "pinyin": "ér wǔ rén shēng yú biān wǔ zhī jiān ， sù bù wén shī shū zhī xùn ， jī áng dà yì ， dǎo sǐ bú gù ， yì hé gù zāi ？"
       },
       {
        "text": "且矫诏纷出，钩党之捕遍于天下，卒以吾郡之发愤一击，不敢复有株治；",
        "pinyin": "qiě jiǎo zhào fēn chū ， gōu dǎng zhī bǔ biàn yú tiān xià ， zú yǐ wú jùn zhī fā fèn yì jī ， bù gǎn fù yǒu zhū zhì ；"
       },
       {
        "text": "大阉亦逡巡畏义，非常之谋难于猝发，待圣人之出而投缳道路，不可谓非五人之力也。",
        "pinyin": "dà yān yì qūn xún wèi yì ， fēi cháng zhī móu nán yú cù fā ， dài shèng rén zhī chū ér tóu huán dào lù ， bù kě wèi fēi wǔ rén zhī lì yě 。"
       },
       {
        "text": "由是观之，则今之高爵显位，一旦抵罪，或脱身以逃，不能容于远近，而又有剪发杜门，佯狂不知所之者，其辱人贱行，视五人之死，轻重固何如哉？",
        "pinyin": "yóu shì guān zhī ， zé jīn zhī gāo jué xiǎn wèi ， yí dàn dǐ zuì ， huò tuō shēn yǐ táo ， bù néng róng yú yuǎn jìn ， ér yòu yǒu jiǎn fà dù mén ， yáng kuáng bù zhī suǒ zhī zhě ， qí rǔ rén jiàn xíng ， shì wǔ rén zhī sǐ ， qīng zhòng gù hé rú zāi ？"
       },
       {
        "text": "是以蓼洲周公忠义暴于朝廷，赠谥美显，荣于身后；",
        "pinyin": "shì yǐ liǎo zhōu zhōu gōng zhōng yì bào yú cháo tíng ， zèng shì měi xiǎn ， róng yú shēn hòu ；"
       },
       {
        "text": "而五人亦得以加其土封，列其姓名于大堤之上，凡四方之士无不有过而拜且泣者，斯固百世之遇也。",
        "pinyin": "ér wǔ rén yì dé yǐ jiā qí tǔ fēng ， liè qí xìng míng yú dà dī zhī shàng ， fán sì fāng zhī shì wú bù yǒu guò ér bài qiě qì zhě ， sī gù bǎi shì zhī yù yě 。"
       },
       {
        "text": "不然，令五人者保其首领，以老于户牖之下，则尽其天年，人皆得以隶使之，安能屈豪杰之流，扼腕墓道，发其志士之悲哉？",
        "pinyin": "bù rán ， lìng wǔ rén zhě bǎo qí shǒu lǐng ， yǐ lǎo yú hù yǒu zhī xià ， zé jìn qí tiān nián ， rén jiē dé yǐ lì shǐ zhī ， ān néng qū háo jié zhī liú ， è wàn mù dào ， fā qí zhì shì zhī bēi zāi ？"
       },
       {
        "text": "故予与同社诸君子，哀斯墓之徒有其石也，而为之记，亦以明死生之大，匹夫之有重于社稷也。",
        "pinyin": "gù yǔ yǔ tóng shè zhū jūn zǐ ， āi sī mù zhī tú yǒu qí shí yě ， ér wèi zhī jì ， yì yǐ míng sǐ shēng zhī dà ， pǐ fū zhī yǒu zhòng yú shè jì yě 。"
       },
       {
        "text": "贤士大夫者，冏卿因之吴公，太史文起文公、孟长姚公也。",
        "pinyin": "xián shì dà fū zhě ， jiǒng qīng yīn zhī wú gōng ， tài shǐ wén qǐ wén gōng 、 mèng cháng yáo gōng yě 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-zhuzhiwutuiqinshi",
      "title": "烛之武退秦师",
      "author": "《左传·僖公三十年》",
      "dynasty": "苏教版",
      "grade": "高中语文必修三",
      "sentences": [
       {
        "text": "九月甲午，晋侯、秦伯围郑，以其无礼于晋，且贰于楚也。",
        "pinyin": "jiǔ yuè jiǎ wǔ ， jìn hóu 、 qín bó wéi zhèng ， yǐ qí wú lǐ yú jìn ， qiě èr yú chǔ yě 。"
       },
       {
        "text": "晋军函陵，秦军氾南。",
        "pinyin": "jìn jūn hán líng ， qín jūn fán nán 。"
       },
       {
        "text": "佚之狐言于郑伯曰：“国危矣，若使烛之武见秦君，师必退。",
        "pinyin": "yì zhī hú yán yú zhèng bó yuē ：“ guó wēi yǐ ， ruò shǐ zhú zhī wǔ jiàn qín jūn ， shī bì tuì 。"
       },
       {
        "text": "”公从之。",
        "pinyin": "” gōng cóng zhī 。"
       },
       {
        "text": "辞曰：“臣之壮也，犹不如人；",
        "pinyin": "cí yuē ：“ chén zhī zhuàng yě ， yóu bù rú rén ；"
       },
       {
        "text": "今老矣，无能为也已。",
        "pinyin": "jīn lǎo yǐ ， wú néng wèi yě yǐ 。"
       },
       {
        "text": "”公曰：“吾不能早用子，今急而求子，是寡人之过也。",
        "pinyin": "” gōng yuē ：“ wú bù néng zǎo yòng zǐ ， jīn jí ér qiú zǐ ， shì guǎ rén zhī guò yě 。"
       },
       {
        "text": "然郑亡，子亦有不利焉。",
        "pinyin": "rán zhèng wáng ， zǐ yì yǒu bú lì yān 。"
       },
       {
        "text": "”许之。",
        "pinyin": "” xǔ zhī 。"
       },
       {
        "text": "夜缒而出，见秦伯，曰：“秦、晋围郑，郑既知亡矣。",
        "pinyin": "yè zhuì ér chū ， jiàn qín bó ， yuē ：“ qín 、 jìn wéi zhèng ， zhèng jì zhī wáng yǐ 。"
       },
       {
        "text": "若亡郑而有益于君，敢以烦执事。",
        "pinyin": "ruò wáng zhèng ér yǒu yì yú jūn ， gǎn yǐ fán zhí shì 。"
       },
       {
        "text": "越国以鄙远，君知其难也。",
        "pinyin": "yuè guó yǐ bǐ yuǎn ， jūn zhī qí nán yě 。"
       },
       {
        "text": "焉用亡郑以陪邻？",
        "pinyin": "yān yòng wáng zhèng yǐ péi lín ？"
       },
       {
        "text": "邻之厚，君之薄也。",
        "pinyin": "lín zhī hòu ， jūn zhī báo yě 。"
       },
       {
        "text": "若舍郑以为东道主，行李之往来，共其乏困，君亦无所害。",
        "pinyin": "ruò shè zhèng yǐ wéi dōng dào zhǔ ， xíng li zhī wǎng lái ， gòng qí fá kùn ， jūn yì wú suǒ hài 。"
       },
       {
        "text": "且君尝为晋君赐矣，许君焦、瑕，朝济而夕设版焉，君之所知也。",
        "pinyin": "qiě jūn cháng wèi jìn jūn cì yǐ ， xǔ jūn jiāo 、 xiá ， cháo jì ér xī shè bǎn yān ， jūn zhī suǒ zhī yě 。"
       },
       {
        "text": "夫晋，何厌之有？",
        "pinyin": "fū jìn ， hé yàn zhī yǒu ？"
       },
       {
        "text": "既东封郑，又欲肆其西封，若不阙秦，将焉取之？",
        "pinyin": "jì dōng fēng zhèng ， yòu yù sì qí xī fēng ， ruò bù quē qín ， jiāng yān qǔ zhī ？"
       },
       {
        "text": "阙秦以利晋，唯君图之。",
        "pinyin": "quē qín yǐ lì jìn ， wéi jūn tú zhī 。"
       },
       {
        "text": "”秦伯说，与郑人盟。",
        "pinyin": "” qín bó shuō ， yǔ zhèng rén méng 。"
       },
       {
        "text": "使杞子、逢孙、杨孙戍之，乃还。",
        "pinyin": "shǐ qǐ zǐ 、 féng sūn 、 yáng sūn shù zhī ， nǎi hái 。"
       },
       {
        "text": "子犯请击之。",
        "pinyin": "zǐ fàn qǐng jī zhī 。"
       },
       {
        "text": "公曰：“不可。",
        "pinyin": "gōng yuē ：“ bù kě 。"
       },
       {
        "text": "微夫人之力不及此。",
        "pinyin": "wēi fū rén zhī lì bù jí cǐ 。"
       },
       {
        "text": "因人之力而敝之，不仁；",
        "pinyin": "yīn rén zhī lì ér bì zhī ， bù rén ；"
       },
       {
        "text": "失其所与，不知；",
        "pinyin": "shī qí suǒ yǔ ， bù zhī ；"
       },
       {
        "text": "以乱易整，不武。",
        "pinyin": "yǐ luàn yì zhěng ， bù wǔ 。"
       },
       {
        "text": "吾其还也。",
        "pinyin": "wú qí hái yě 。"
       },
       {
        "text": "”亦去之。",
        "pinyin": "” yì qù zhī 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-jiantaizongshisishu",
      "title": "谏太宗十思疏",
      "author": "魏征",
      "dynasty": "苏教版",
      "grade": "高中语文必修三",
      "sentences": [
       {
        "text": "臣闻求木之长者，必固其根本；",
        "pinyin": "chén wén qiú mù zhī zhǎng zhě ， bì gù qí gēn běn ；"
       },
       {
        "text": "欲流之远者，必浚其泉源；",
        "pinyin": "yù liú zhī yuǎn zhě ， bì jùn qí quán yuán ；"
       },
       {
        "text": "思国之安者，必积其德义。",
        "pinyin": "sī guó zhī ān zhě ， bì jī qí dé yì 。"
       },
       {
        "text": "源不深而望流之远，根不固而求木之长，德不厚而思国之理，臣虽下愚，知其不可，而况于明哲乎！",
        "pinyin": "yuán bù shēn ér wàng liú zhī yuǎn ， gēn bú gù ér qiú mù zhī cháng ， dé bú hòu ér sī guó zhī lǐ ， chén suī xià yú ， zhī qí bù kě ， ér kuàng yú míng zhé hū ！"
       },
       {
        "text": "人君当神器之重，居域中之大，将崇极天之峻，永保无疆之休。",
        "pinyin": "rén jūn dāng shén qì zhī zhòng ， jū yù zhōng zhī dà ， jiāng chóng jí tiān zhī jùn ， yǒng bǎo wú jiāng zhī xiū 。"
       },
       {
        "text": "不念居安思危，戒奢以俭，斯亦伐根以求木茂，塞源而欲流长也。",
        "pinyin": "bú niàn jū ān sī wēi ， jiè shē yǐ jiǎn ， sī yì fá gēn yǐ qiú mù mào ， sāi yuán ér yù liú cháng yě 。"
       },
       {
        "text": "凡百元首，承天景命，莫不殷忧而道著，功成而德衰。",
        "pinyin": "fán bǎi yuán shǒu ， chéng tiān jǐng mìng ， mò bù yīn yōu ér dào zhù ， gōng chéng ér dé shuāi 。"
       },
       {
        "text": "有善始者实繁，能克终者盖寡。",
        "pinyin": "yǒu shàn shǐ zhě shí fán ， néng kè zhōng zhě gài guǎ 。"
       },
       {
        "text": "岂取之易而守之难乎？",
        "pinyin": "qǐ qǔ zhī yì ér shǒu zhī nán hū ？"
       },
       {
        "text": "昔取之而有余，今守之而不足，何也？",
        "pinyin": "xī qǔ zhī ér yǒu yú ， jīn shǒu zhī ér bù zú ， hé yě ？"
       },
       {
        "text": "夫在殷忧，必竭诚以待下；",
        "pinyin": "fū zài yīn yōu ， bì jié chéng yǐ dài xià ；"
       },
       {
        "text": "既得志，则纵情以傲物。",
        "pinyin": "jì dé zhì ， zé zòng qíng yǐ ào wù 。"
       },
       {
        "text": "竭诚则胡越为一体，傲物则骨肉为行路。",
        "pinyin": "jié chéng zé hú yuè wèi yì tǐ ， ào wù zé gǔ ròu wèi xíng lù 。"
       },
       {
        "text": "虽董之以严刑，振之以威怒，终苟免而不怀仁，貌恭而不心服。",
        "pinyin": "suī dǒng zhī yǐ yán xíng ， zhèn zhī yǐ wēi nù ， zhōng gǒu miǎn ér bù huái rén ， mào gōng ér bù xīn fú 。"
       },
       {
        "text": "怨不在大，可畏惟人；",
        "pinyin": "yuàn bú zài dà ， kě wèi wéi rén ；"
       },
       {
        "text": "载舟覆舟，所宜深慎；",
        "pinyin": "zǎi zhōu fù zhōu ， suǒ yí shēn shèn ；"
       },
       {
        "text": "奔车朽索，其可忽乎！",
        "pinyin": "bēn chē xiǔ suǒ ， qí kě hū hū ！"
       },
       {
        "text": "君人者，诚能见可欲则思知足以自戒，将有作则思知止以安人，念高危则思谦冲而自牧，惧满溢则思江海下百川，乐盘游则思三驱以为度，忧懈怠则思慎始而敬终，虑壅蔽则思虚心以纳下，想谗邪则思正身以黜恶，恩所加则思无因喜以谬赏，罚所及则思无因怒而滥刑。",
        "pinyin": "jūn rén zhě ， chéng néng jiàn kě yù zé sī zhī zú yǐ zì jiè ， jiāng yǒu zuò zé sī zhī zhǐ yǐ ān rén ， niàn gāo wēi zé sī qiān chōng ér zì mù ， jù mǎn yì zé sī jiāng hǎi xià bǎi chuān ， lè pán yóu zé sī sān qū yǐ wéi dù ， yōu xiè dài zé sī shèn shǐ ér jìng zhōng ， lǜ yōng bì zé sī xū xīn yǐ nà xià ， xiǎng chán xié zé sī zhèng shēn yǐ chù è ， ēn suǒ jiā zé sī wú yīn xǐ yǐ miù shǎng ， fá suǒ jí zé sī wú yīn nù ér làn xíng 。"
       },
       {
        "text": "总此十思，弘兹九德，简能而任之，择善而从之，则智者尽其谋，勇者竭其力，仁者播其惠，信者效其忠。",
        "pinyin": "zǒng cǐ shí sī ， hóng zī jiǔ dé ， jiǎn néng ér rèn zhī ， zé shàn ér cóng zhī ， zé zhì zhě jìn qí móu ， yǒng zhě jié qí lì ， rén zhě bō qí huì ， xìn zhě xiào qí zhōng 。"
       },
       {
        "text": "文武争驰，君臣无事，可以尽豫游之乐，可以养松乔之寿，鸣琴垂拱，不言而化。",
        "pinyin": "wén wǔ zhēng chí ， jūn chén wú shì ， kě yǐ jìn yù yóu zhī lè ， kě yǐ yǎng sōng qiáo zhī shòu ， míng qín chuí gǒng ， bù yán ér huà 。"
       },
       {
        "text": "何必劳神苦思，代下司职，役聪明之耳目，亏无为之大道哉！",
        "pinyin": "hé bì láo shén kǔ sī ， dài xià sī zhí ， yì cōng ming zhī ěr mù ， kuī wú wéi zhī dà dào zāi ！"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-lianpolinxiangruliezhuan",
      "title": "廉颇蔺相如列传",
      "author": "司马迁",
      "dynasty": "苏教版",
      "grade": "高中语文必修三",
      "sentences": [
       {
        "text": "廉颇者，赵之良将也。",
        "pinyin": "lián pō zhě ， zhào zhī liáng jiàng yě 。"
       },
       {
        "text": "赵惠文王十六年，廉颇为赵将，伐齐，大破之，取阳晋，拜为上卿，以勇气闻于诸侯。",
        "pinyin": "zhào huì wén wáng shí liù nián ， lián pō wèi zhào jiāng ， fá qí ， dà pò zhī ， qǔ yáng jìn ， bài wèi shàng qīng ， yǐ yǒng qì wén yú zhū hóu 。"
       },
       {
        "text": "蔺相如者，赵人也。",
        "pinyin": "lìn xiāng rú zhě ， zhào rén yě 。"
       },
       {
        "text": "为赵宦者令缪贤舍人。",
        "pinyin": "wèi zhào huàn zhě lìng miù xián shè rén 。"
       },
       {
        "text": "赵惠文王时，得楚和氏璧。",
        "pinyin": "zhào huì wén wáng shí ， dé chǔ hé shì bì 。"
       },
       {
        "text": "秦昭王闻之，使人遗赵王书，愿以十五城请易璧。",
        "pinyin": "qín zhāo wáng wén zhī ， shǐ rén yí zhào wáng shū ， yuàn yǐ shí wǔ chéng qǐng yì bì 。"
       },
       {
        "text": "赵王与大将军廉颇诸大臣谋：欲予秦，秦城恐不可得，徒见欺；",
        "pinyin": "zhào wáng yǔ dà jiāng jūn lián pō zhū dà chén móu ： yù yǔ qín ， qín chéng kǒng bù kě dé ， tú jiàn qī ；"
       },
       {
        "text": "欲勿予，即患秦兵之来。",
        "pinyin": "yù wù yǔ ， jí huàn qín bīng zhī lái 。"
       },
       {
        "text": "计未定，求人可使报秦者，未得。",
        "pinyin": "jì wèi dìng ， qiú rén kě shǐ bào qín zhě ， wèi dé 。"
       },
       {
        "text": "宦者令缪贤曰：“臣舍人蔺相如可使。",
        "pinyin": "huàn zhě lìng miù xián yuē ：“ chén shè rén lìn xiāng rú kě shǐ 。"
       },
       {
        "text": "”王问：“何以知之？",
        "pinyin": "” wáng wèn ：“ hé yǐ zhī zhī ？"
       },
       {
        "text": "”对曰：“臣尝有罪，窃计欲亡走燕。",
        "pinyin": "” duì yuē ：“ chén cháng yǒu zuì ， qiè jì yù wáng zǒu yàn 。"
       },
       {
        "text": "臣舍人相如止臣曰：‘君何以知燕王？",
        "pinyin": "chén shè rén xiāng rú zhǐ chén yuē ：‘ jūn hé yǐ zhī yàn wáng ？"
       },
       {
        "text": "’臣语曰，臣尝从大王与燕王会于境上，燕王私握臣手曰‘愿结友’，以此知之，故欲往。",
        "pinyin": "’ chén yǔ yuē ， chén cháng cóng dà wáng yǔ yàn wáng huì yú jìng shàng ， yàn wáng sī wò chén shǒu yuē ‘ yuàn jié yǒu ’， yǐ cǐ zhī zhī ， gù yù wǎng 。"
       },
       {
        "text": "相如谓臣曰：‘夫赵强而燕弱，而君幸于赵王，故燕王欲结于君。",
        "pinyin": "xiāng rú wèi chén yuē ：‘ fū zhào qiáng ér yàn ruò ， ér jūn xìng yú zhào wáng ， gù yàn wáng yù jié yú jūn 。"
       },
       {
        "text": "今君乃亡赵走燕，燕畏赵，其势必不敢留君，而束君归赵矣。",
        "pinyin": "jīn jūn nǎi wáng zhào zǒu yàn ， yàn wèi zhào ， qí shì bì bù gǎn liú jūn ， ér shù jūn guī zhào yǐ 。"
       },
       {
        "text": "君不如肉袒伏斧质请罪，则幸得脱矣。",
        "pinyin": "jūn bù rú ròu tǎn fú fǔ zhì qǐng zuì ， zé xìng dé tuō yǐ 。"
       },
       {
        "text": "’臣从其计，大王亦幸赦臣。",
        "pinyin": "’ chén cóng qí jì ， dà wáng yì xìng shè chén 。"
       },
       {
        "text": "臣窃以为其人勇士，有智谋，宜可使。",
        "pinyin": "chén qiè yǐ wéi qí rén yǒng shì ， yǒu zhì móu ， yí kě shǐ 。"
       },
       {
        "text": "于是王召见，问蔺相如曰：“秦王以十五城请易寡人之璧，可予不？",
        "pinyin": "yú shì wáng zhào jiàn ， wèn lìn xiāng rú yuē ：“ qín wáng yǐ shí wǔ chéng qǐng yì guǎ rén zhī bì ， kě yǔ bù ？"
       },
       {
        "text": "”相如曰：“秦强而赵弱，不可不许。",
        "pinyin": "” xiāng rú yuē ：“ qín qiáng ér zhào ruò ， bù kě bù xǔ 。"
       },
       {
        "text": "”王曰：“取吾璧，不予我城，奈何？",
        "pinyin": "” wáng yuē ：“ qǔ wú bì ， bù yǔ wǒ chéng ， nài hé ？"
       },
       {
        "text": "”相如曰：“均之二策，宁许以负秦曲。",
        "pinyin": "” xiāng rú yuē ：“ jūn zhī èr cè ， níng xǔ yǐ fù qín qǔ 。"
       },
       {
        "text": "”王曰：“谁可使者？",
        "pinyin": "” wáng yuē ：“ shuí kě shǐ zhě ？"
       },
       {
        "text": "”相如曰：“王必无人，臣愿奉璧往使。",
        "pinyin": "” xiāng rú yuē ：“ wáng bì wú rén ， chén yuàn fèng bì wǎng shǐ 。"
       },
       {
        "text": "城入赵而璧留秦；",
        "pinyin": "chéng rù zhào ér bì liú qín ；"
       },
       {
        "text": "城不入，臣请完璧归赵。",
        "pinyin": "chéng bú rù ， chén qǐng wán bì guī zhào 。"
       },
       {
        "text": "”赵王于是遂遣相如奉璧西入秦。",
        "pinyin": "” zhào wáng yú shì suì qiǎn xiāng rú fèng bì xī rù qín 。"
       },
       {
        "text": "秦王坐章台见相如。",
        "pinyin": "qín wáng zuò zhāng tái jiàn xiāng rú 。"
       },
       {
        "text": "相如奉璧奏秦王。",
        "pinyin": "xiāng rú fèng bì zòu qín wáng 。"
       },
       {
        "text": "秦王大喜，传以示美人及左右，左右皆呼万岁。",
        "pinyin": "qín wáng dà xǐ ， chuán yǐ shì měi rén jí zuǒ yòu ， zuǒ yòu jiē hū wàn suì 。"
       },
       {
        "text": "相如视秦王无意偿赵王城邑，乃前曰：“璧有瑕，请指示王。",
        "pinyin": "xiāng rú shì qín wáng wú yì cháng zhào wáng chéng yì ， nǎi qián yuē ：“ bì yǒu xiá ， qǐng zhǐ shì wáng 。"
       },
       {
        "text": "”王授璧。",
        "pinyin": "” wáng shòu bì 。"
       },
       {
        "text": "相如因持璧却立，倚柱，怒发上冲冠，谓秦王曰：“大王欲得璧，使人发书至赵王，赵王悉召群臣议，皆曰‘秦贪，负其强，以空言求璧，偿城恐不可得’。",
        "pinyin": "xiāng rú yīn chí bì què lì ， yǐ zhù ， nù fā shàng chōng guān ， wèi qín wáng yuē ：“ dà wáng yù dé bì ， shǐ rén fā shū zhì zhào wáng ， zhào wáng xī zhào qún chén yì ， jiē yuē ‘ qín tān ， fù qí qiáng ， yǐ kōng yán qiú bì ， cháng chéng kǒng bù kě dé ’。"
       },
       {
        "text": "议不欲予秦璧。",
        "pinyin": "yì bú yù yǔ qín bì 。"
       },
       {
        "text": "臣以为布衣之交尚不相欺，况大国乎？",
        "pinyin": "chén yǐ wéi bù yī zhī jiāo shàng bù xiāng qī ， kuàng dà guó hū ？"
       },
       {
        "text": "且以一璧之故逆强秦之欢心，不可。",
        "pinyin": "qiě yǐ yí bì zhī gù nì qiáng qín zhī huān xīn ， bù kě 。"
       },
       {
        "text": "于是赵王乃斋戒五日，使臣奉璧，拜送书于庭。",
        "pinyin": "yú shì zhào wáng nǎi zhāi jiè wǔ rì ， shǐ chén fèng bì ， bài sòng shū yú tíng 。"
       },
       {
        "text": "何者？",
        "pinyin": "hé zhě ？"
       },
       {
        "text": "严大国之威以修敬也。",
        "pinyin": "yán dà guó zhī wēi yǐ xiū jìng yě 。"
       },
       {
        "text": "今臣至，大王见臣列观，礼节甚倨，得璧，传之美人，以戏弄臣。",
        "pinyin": "jīn chén zhì ， dà wáng jiàn chén liè guān ， lǐ jié shèn jù ， dé bì ， chuán zhī měi rén ， yǐ xì nòng chén 。"
       },
       {
        "text": "臣观大王无意偿赵王城邑，故臣复取璧。",
        "pinyin": "chén guān dà wáng wú yì cháng zhào wáng chéng yì ， gù chén fù qǔ bì 。"
       },
       {
        "text": "大王必欲急臣，臣头今与璧俱碎于柱矣！",
        "pinyin": "dà wáng bì yù jí chén ， chén tóu jīn yǔ bì jù suì yú zhù yǐ ！"
       },
       {
        "text": "相如持其璧睨柱，欲以击柱。",
        "pinyin": "xiāng rú chí qí bì nì zhù ， yù yǐ jī zhù 。"
       },
       {
        "text": "秦王恐其破璧也，乃辞谢固请，召有司案图，指从此以往十五都予赵。",
        "pinyin": "qín wáng kǒng qí pò bì yě ， nǎi cí xiè gù qǐng ， zhào yǒu sī àn tú ， zhǐ cóng cǐ yǐ wǎng shí wǔ dōu yǔ zhào 。"
       },
       {
        "text": "相如度秦王特以诈详为予赵城，实不可得，乃谓秦王曰：“和氏璧，天下所共传宝也，赵王恐，不敢不献。",
        "pinyin": "xiāng rú dù qín wáng tè yǐ zhà xiáng wèi yǔ zhào chéng ， shí bù kě dé ， nǎi wèi qín wáng yuē ：“ hé shì bì ， tiān xià suǒ gòng chuán bǎo yě ， zhào wáng kǒng ， bù gǎn bú xiàn 。"
       },
       {
        "text": "赵王送璧时斋戒五日，今大王亦宜斋戒五日，设九宾于廷，臣乃敢上璧。",
        "pinyin": "zhào wáng sòng bì shí zhāi jiè wǔ rì ， jīn dà wáng yì yí zhāi jiè wǔ rì ， shè jiǔ bīn yú tíng ， chén nǎi gǎn shàng bì 。"
       },
       {
        "text": "”秦王度之，终不可强夺，遂许斋五日，舍相如广成传。",
        "pinyin": "” qín wáng dù zhī ， zhōng bù kě qiáng duó ， suì xǔ zhāi wǔ rì ， shè xiāng rú guǎng chéng chuán 。"
       },
       {
        "text": "相如度秦王虽斋，决负约不偿城，乃使其从者衣褐，怀其璧，从径道亡，归璧于赵。",
        "pinyin": "xiāng rú dù qín wáng suī zhāi ， jué fù yuē bù cháng chéng ， nǎi shǐ qí cóng zhě yī hè ， huái qí bì ， cóng jìng dào wáng ， guī bì yú zhào 。"
       },
       {
        "text": "秦王斋五日后，乃设九宾礼于廷，引赵使者蔺相如。",
        "pinyin": "qín wáng zhāi wǔ rì hòu ， nǎi shè jiǔ bīn lǐ yú tíng ， yǐn zhào shǐ zhě lìn xiāng rú 。"
       },
       {
        "text": "相如至，谓秦王曰：“秦自缪公以来二十余君，未尝有坚明约束者也。",
        "pinyin": "xiāng rú zhì ， wèi qín wáng yuē ：“ qín zì miù gōng yǐ lái èr shí yú jūn ， wèi cháng yǒu jiān míng yuē shù zhě yě 。"
       },
       {
        "text": "臣诚恐见欺于王而负赵，故令人持璧归，间至赵矣。",
        "pinyin": "chén chéng kǒng jiàn qī yú wáng ér fù zhào ， gù lìng rén chí bì guī ， jiān zhì zhào yǐ 。"
       },
       {
        "text": "且秦强而赵弱，大王遣一介之使至赵，赵立奉璧来。",
        "pinyin": "qiě qín qiáng ér zhào ruò ， dà wáng qiǎn yí jiè zhī shǐ zhì zhào ， zhào lì fèng bì lái 。"
       },
       {
        "text": "今以秦之强而先割十五都予赵，赵岂敢留璧而得罪于大王乎？",
        "pinyin": "jīn yǐ qín zhī qiáng ér xiān gē shí wǔ dōu yǔ zhào ， zhào qǐ gǎn liú bì ér dé zuì yú dà wáng hū ？"
       },
       {
        "text": "臣知欺大王之罪当诛，臣请就汤镬。",
        "pinyin": "chén zhī qī dà wáng zhī zuì dāng zhū ， chén qǐng jiù tāng huò 。"
       },
       {
        "text": "唯大王与群臣孰计议之。",
        "pinyin": "wéi dà wáng yǔ qún chén shú jì yì zhī 。"
       },
       {
        "text": "”秦王与群臣相视而嘻。",
        "pinyin": "” qín wáng yǔ qún chén xiāng shì ér xī 。"
       },
       {
        "text": "左右或欲引相如就去之，秦王因曰：“今杀相如，终不能得璧也，而绝秦赵之欢，不如因而厚遇之，使归赵，赵王岂以一璧之故欺秦邪！",
        "pinyin": "zuǒ yòu huò yù yǐn xiāng rú jiù qù zhī ， qín wáng yīn yuē ：“ jīn shā xiāng rú ， zhōng bù néng dé bì yě ， ér jué qín zhào zhī huān ， bù rú yīn ér hòu yù zhī ， shǐ guī zhào ， zhào wáng qǐ yǐ yí bì zhī gù qī qín xié ！"
       },
       {
        "text": "”卒廷见相如，毕礼而归之。",
        "pinyin": "” zú tíng jiàn xiāng rú ， bì lǐ ér guī zhī 。"
       },
       {
        "text": "相如既归，赵王以为贤大夫，使不辱于诸侯，拜相如为上大夫。",
        "pinyin": "xiāng rú jì guī ， zhào wáng yǐ wéi xián dài fu ， shǐ bù rǔ yú zhū hóu ， bài xiāng rú wèi shàng dài fu 。"
       },
       {
        "text": "秦亦不以城予赵，赵亦终不予秦璧。",
        "pinyin": "qín yì bù yǐ chéng yǔ zhào ， zhào yì zhōng bù yǔ qín bì 。"
       },
       {
        "text": "其后秦伐赵，拔石城。",
        "pinyin": "qí hòu qín fá zhào ， bá shí chéng 。"
       },
       {
        "text": "明年，复攻赵，杀二万人。",
        "pinyin": "míng nián ， fù gōng zhào ， shā èr wàn rén 。"
       },
       {
        "text": "秦王使使者告赵王，欲与王为好，会于西河外渑池。",
        "pinyin": "qín wáng shǐ shǐ zhě gào zhào wáng ， yù yǔ wáng wèi hǎo ， huì yú xī hé wài miǎn chí 。"
       },
       {
        "text": "赵王畏秦，欲毋行。",
        "pinyin": "zhào wáng wèi qín ， yù wú xíng 。"
       },
       {
        "text": "廉颇、蔺相如计曰：“王不行，示赵弱且怯也。",
        "pinyin": "lián pō 、 lìn xiāng rú jì yuē ：“ wáng bù xíng ， shì zhào ruò qiě qiè yě 。"
       },
       {
        "text": "”赵王遂行。",
        "pinyin": "” zhào wáng suì xíng 。"
       },
       {
        "text": "相如从。",
        "pinyin": "xiāng rú cóng 。"
       },
       {
        "text": "廉颇送至境，与王诀曰：“王行，度道里会遇之礼毕，还，不过三十日。",
        "pinyin": "lián pō sòng zhì jìng ， yǔ wáng jué yuē ：“ wáng xíng ， dù dào lǐ huì yù zhī lǐ bì ， hái ， bú guò sān shí rì 。"
       },
       {
        "text": "三十日不还，则请立太子为王，以绝秦望。",
        "pinyin": "sān shí rì bù hái ， zé qǐng lì tài zǐ wèi wáng ， yǐ jué qín wàng 。"
       },
       {
        "text": "”王许之。",
        "pinyin": "” wáng xǔ zhī 。"
       },
       {
        "text": "遂与秦王会渑池。",
        "pinyin": "suì yǔ qín wáng huì miǎn chí 。"
       },
       {
        "text": "秦王饮酒酣，曰：“寡人窃闻赵王好音，请奏瑟。",
        "pinyin": "qín wáng yǐn jiǔ hān ， yuē ：“ guǎ rén qiè wén zhào wáng hǎo yīn ， qǐng zòu sè 。"
       },
       {
        "text": "”赵王鼓瑟。",
        "pinyin": "” zhào wáng gǔ sè 。"
       },
       {
        "text": "秦御史前书曰：“某年月日，秦王与赵王会饮，令赵王鼓瑟。",
        "pinyin": "qín yù shǐ qián shū yuē ：“ mǒu nián yuè rì ， qín wáng yǔ zhào wáng huì yǐn ， lìng zhào wáng gǔ sè 。"
       },
       {
        "text": "”蔺相如前曰：“赵王窃闻秦王善为秦声，请奉盆缻秦王，以相娱乐。",
        "pinyin": "” lìn xiāng rú qián yuē ：“ zhào wáng qiè wén qín wáng shàn wèi qín shēng ， qǐng fèng pén fǒu qín wáng ， yǐ xiāng yú lè 。"
       },
       {
        "text": "”秦王不肯击缻。",
        "pinyin": "” qín wáng bù kěn jī fǒu 。"
       },
       {
        "text": "相如曰：“五步之内，相如请得以颈血溅大王矣！",
        "pinyin": "xiāng rú yuē ：“ wǔ bù zhī nèi ， xiāng rú qǐng dé yǐ jǐng xuè jiàn dà wáng yǐ ！"
       },
       {
        "text": "”左右欲刃相如，相如张目叱之，左右皆靡。",
        "pinyin": "” zuǒ yòu yù rèn xiāng rú ， xiāng rú zhāng mù chì zhī ， zuǒ yòu jiē mí 。"
       },
       {
        "text": "于是相如前进缻，因跪请秦王。",
        "pinyin": "yú shì xiāng rú qián jìn fǒu ， yīn guì qǐng qín wáng 。"
       },
       {
        "text": "秦王不怿，为一击缻。",
        "pinyin": "qín wáng bú yì ， wèi yì jī fǒu 。"
       },
       {
        "text": "相如顾召赵御史书曰：“某年月日，秦王为赵王击缻。",
        "pinyin": "xiāng rú gù zhào zhào yù shǐ shū yuē ：“ mǒu nián yuè rì ， qín wáng wèi zhào wáng jī fǒu 。"
       },
       {
        "text": "”秦之群臣曰：“请以赵十五城为秦王寿。",
        "pinyin": "” qín zhī qún chén yuē ：“ qǐng yǐ zhào shí wǔ chéng wèi qín wáng shòu 。"
       },
       {
        "text": "”蔺相如亦曰：“请以秦之咸阳为赵王寿。",
        "pinyin": "” lìn xiāng rú yì yuē ：“ qǐng yǐ qín zhī xián yáng wèi zhào wáng shòu 。"
       },
       {
        "text": "”秦王竟酒，终不能加胜于赵。",
        "pinyin": "” qín wáng jìng jiǔ ， zhōng bù néng jiā shèng yú zhào 。"
       },
       {
        "text": "赵亦盛设兵以待秦，秦不敢动。",
        "pinyin": "zhào yì shèng shè bīng yǐ dài qín ， qín bù gǎn dòng 。"
       },
       {
        "text": "既罢，归国，以相如功大，拜为上卿，位在廉颇之右。",
        "pinyin": "jì bà ， guī guó ， yǐ xiāng rú gōng dà ， bài wèi shàng qīng ， wèi zài lián pō zhī yòu 。"
       },
       {
        "text": "廉颇曰：“我为赵将，有攻城野战之大功，而蔺相如徒以口舌为劳，而位居我上。",
        "pinyin": "lián pō yuē ：“ wǒ wèi zhào jiāng ， yǒu gōng chéng yě zhàn zhī dà gōng ， ér lìn xiāng rú tú yǐ kǒu shé wèi láo ， ér wèi jū wǒ shàng 。"
       },
       {
        "text": "且相如素贱人，吾羞，不忍为之下！",
        "pinyin": "qiě xiāng rú sù jiàn rén ， wú xiū ， bù rěn wèi zhī xià ！"
       },
       {
        "text": "”宣言曰：“我见相如，必辱之。",
        "pinyin": "” xuān yán yuē ：“ wǒ jiàn xiāng rú ， bì rǔ zhī 。"
       },
       {
        "text": "”相如闻，不肯与会。",
        "pinyin": "” xiāng rú wén ， bù kěn yù huì 。"
       },
       {
        "text": "相如每朝时，常称病，不欲与廉颇争列。",
        "pinyin": "xiāng rú měi cháo shí ， cháng chēng bìng ， bú yù yǔ lián pō zhēng liè 。"
       },
       {
        "text": "已而相如出，望见廉颇，相如引车避匿。",
        "pinyin": "yǐ ér xiāng rú chū ， wàng jiàn lián pō ， xiāng rú yǐn chē bì nì 。"
       },
       {
        "text": "于是舍人相与谏曰：“臣所以去亲戚而事君者，徒慕君之高义也。",
        "pinyin": "yú shì shè rén xiāng yǔ jiàn yuē ：“ chén suǒ yǐ qù qīn qi ér shì jūn zhě ， tú mù jūn zhī gāo yì yě 。"
       },
       {
        "text": "今君与廉颇同列，廉君宣恶言，而君畏匿之，恐惧殊甚。",
        "pinyin": "jīn jūn yǔ lián pō tóng liè ， lián jūn xuān è yán ， ér jūn wèi nì zhī ， kǒng jù shū shèn 。"
       },
       {
        "text": "且庸人尚羞之，况于将相乎！",
        "pinyin": "qiě yōng rén shàng xiū zhī ， kuàng yú jiàng xiàng hū ！"
       },
       {
        "text": "臣等不肖，请辞去。",
        "pinyin": "chén děng bú xiào ， qǐng cí qù 。"
       },
       {
        "text": "”蔺相如固止之，曰：“公之视廉将军孰与秦王？",
        "pinyin": "” lìn xiāng rú gù zhǐ zhī ， yuē ：“ gōng zhī shì lián jiāng jūn shú yǔ qín wáng ？"
       },
       {
        "text": "”曰：“不若也。",
        "pinyin": "” yuē ：“ bú ruò yě 。"
       },
       {
        "text": "”相如曰：“夫以秦王之威，而相如廷叱之，辱其群臣。",
        "pinyin": "” xiāng rú yuē ：“ fū yǐ qín wáng zhī wēi ， ér xiāng rú tíng chì zhī ， rǔ qí qún chén 。"
       },
       {
        "text": "相如虽驽，独畏廉将军哉？",
        "pinyin": "xiāng rú suī nú ， dú wèi lián jiāng jūn zāi ？"
       },
       {
        "text": "顾吾念之，强秦之所以不敢加兵于赵者，徒以吾两人在也。",
        "pinyin": "gù wú niàn zhī ， qiáng qín zhī suǒ yǐ bù gǎn jiā bīng yú zhào zhě ， tú yǐ wú liǎng rén zài yě 。"
       },
       {
        "text": "今两虎共斗，其势不俱生。",
        "pinyin": "jīn liǎng hǔ gòng dòu ， qí shì bú jù shēng 。"
       },
       {
        "text": "吾所以为此者，以先国家之急而后私仇也。",
        "pinyin": "wú suǒ yǐ wéi cǐ zhě ， yǐ xiān guó jiā zhī jí ér hòu sī chóu yě 。"
       },
       {
        "text": "”廉颇闻之，肉袒负荆，因宾客至蔺相如门谢罪，曰：“鄙贱之人，不知将军宽之至此也！",
        "pinyin": "” lián pō wén zhī ， ròu tǎn fù jīng ， yīn bīn kè zhì lìn xiāng rú mén xiè zuì ， yuē ：“ bǐ jiàn zhī rén ， bù zhī jiāng jūn kuān zhī zhì cǐ yě ！"
       },
       {
        "text": "”卒相与欢，为刎颈之交。",
        "pinyin": "” zú xiāng yǔ huān ， wèi wěn jǐng zhī jiāo 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-hongmenyan",
      "title": "鸿门宴",
      "author": "司马迁",
      "dynasty": "苏教版",
      "grade": "高中语文必修三",
      "sentences": [
       {
        "text": "沛公军霸上，未得与项羽相见。",
        "pinyin": "pèi gōng jūn bà shàng ， wèi dé yǔ xiàng yǔ xiāng jiàn 。"
       },
       {
        "text": "沛公左司马曹无伤使人言于项羽曰：“沛公欲王关中，使子婴为相，珍宝尽有之。",
        "pinyin": "pèi gōng zuǒ sī mǎ cáo wú shāng shǐ rén yán yú xiàng yǔ yuē ：“ pèi gōng yù wáng guān zhōng ， shǐ zǐ yīng wèi xiāng ， zhēn bǎo jìn yǒu zhī 。"
       },
       {
        "text": "”项羽大怒，曰：“旦日飨士卒，为击破沛公军！",
        "pinyin": "” xiàng yǔ dà nù ， yuē ：“ dàn rì xiǎng shì zú ， wèi jī pò pèi gōng jūn ！"
       },
       {
        "text": "”当是时，项羽兵四十万，在新丰鸿门；",
        "pinyin": "” dāng shì shí ， xiàng yǔ bīng sì shí wàn ， zài xīn fēng hóng mén ；"
       },
       {
        "text": "沛公兵十万，在霸上。",
        "pinyin": "pèi gōng bīng shí wàn ， zài bà shàng 。"
       },
       {
        "text": "范增说项羽曰：“沛公居山东时，贪于财货，好美姬。",
        "pinyin": "fàn zēng shuō xiàng yǔ yuē ：“ pèi gōng jū shān dōng shí ， tān yú cái huò ， hǎo měi jī 。"
       },
       {
        "text": "今入关，财物无所取，妇女无所幸，此其志不在小。",
        "pinyin": "jīn rù guān ， cái wù wú suǒ qǔ ， fù nǚ wú suǒ xìng ， cǐ qí zhì bú zài xiǎo 。"
       },
       {
        "text": "吾令人望其气，皆为龙虎，成五采，此天子气也。",
        "pinyin": "wú lìng rén wàng qí qì ， jiē wèi lóng hǔ ， chéng wǔ cǎi ， cǐ tiān zǐ qì yě 。"
       },
       {
        "text": "急击勿失！",
        "pinyin": "jí jī wù shī ！"
       },
       {
        "text": "楚左尹项伯者，项羽季父也，素善留侯张良。",
        "pinyin": "chǔ zuǒ yǐn xiàng bó zhě ， xiàng yǔ jì fù yě ， sù shàn liú hóu zhāng liáng 。"
       },
       {
        "text": "张良是时从沛公，项伯乃夜驰之沛公军，私见张良，具告以事，欲呼张良与俱去，曰：“毋从俱死也。",
        "pinyin": "zhāng liáng shì shí cóng pèi gōng ， xiàng bó nǎi yè chí zhī pèi gōng jūn ， sī jiàn zhāng liáng ， jù gào yǐ shì ， yù hū zhāng liáng yǔ jù qù ， yuē ：“ wú cóng jù sǐ yě 。"
       },
       {
        "text": "”张良曰：“臣为韩王送沛公，沛公今事有急，亡去不义，不可不语。",
        "pinyin": "” zhāng liáng yuē ：“ chén wèi hán wáng sòng pèi gōng ， pèi gōng jīn shì yǒu jí ， wáng qù bú yì ， bù kě bù yǔ 。"
       },
       {
        "text": "”良乃入，具告沛公。",
        "pinyin": "” liáng nǎi rù ， jù gào pèi gōng 。"
       },
       {
        "text": "沛公大惊，曰：“为之奈何？",
        "pinyin": "pèi gōng dà jīng ， yuē ：“ wèi zhī nài hé ？"
       },
       {
        "text": "”张良曰：“谁为大王为此计者？",
        "pinyin": "” zhāng liáng yuē ：“ shuí wèi dà wáng wèi cǐ jì zhě ？"
       },
       {
        "text": "”曰：“鲰生说我曰：‘距关，毋内诸侯，秦地可尽王也。",
        "pinyin": "” yuē ：“ zōu shēng shuō wǒ yuē ：‘ jù guān ， wú nèi zhū hóu ， qín dì kě jìn wáng yě 。"
       },
       {
        "text": "’故听之。",
        "pinyin": "’ gù tīng zhī 。"
       },
       {
        "text": "”良曰：“料大王士卒足以当项王乎？",
        "pinyin": "” liáng yuē ：“ liào dà wáng shì zú zú yǐ dāng xiàng wáng hū ？"
       },
       {
        "text": "”沛公默然，曰：“固不如也。",
        "pinyin": "” pèi gōng mò rán ， yuē ：“ gù bù rú yě 。"
       },
       {
        "text": "且为之奈何？",
        "pinyin": "qiě wèi zhī nài hé ？"
       },
       {
        "text": "”张良曰：“请往谓项伯，言沛公不敢背项王也。",
        "pinyin": "” zhāng liáng yuē ：“ qǐng wǎng wèi xiàng bó ， yán pèi gōng bù gǎn bèi xiàng wáng yě 。"
       },
       {
        "text": "”沛公曰：“君安与项伯有故？",
        "pinyin": "” pèi gōng yuē ：“ jūn ān yǔ xiàng bó yǒu gù ？"
       },
       {
        "text": "”张良曰：“秦时与臣游，项伯杀人，臣活之；",
        "pinyin": "” zhāng liáng yuē ：“ qín shí yǔ chén yóu ， xiàng bó shā rén ， chén huó zhī ；"
       },
       {
        "text": "今事有急，故幸来告良。",
        "pinyin": "jīn shì yǒu jí ， gù xìng lái gào liáng 。"
       },
       {
        "text": "”沛公曰：“孰与君少长？",
        "pinyin": "” pèi gōng yuē ：“ shú yǔ jūn shǎo cháng ？"
       },
       {
        "text": "”良曰：“长于臣。",
        "pinyin": "” liáng yuē ：“ cháng yú chén 。"
       },
       {
        "text": "”沛公曰：“君为我呼入，吾得兄事之。",
        "pinyin": "” pèi gōng yuē ：“ jūn wèi wǒ hū rù ， wú dé xiōng shì zhī 。"
       },
       {
        "text": "”张良出，要项伯。",
        "pinyin": "” zhāng liáng chū ， yào xiàng bó 。"
       },
       {
        "text": "项伯即入见沛公。",
        "pinyin": "xiàng bó jí rù jiàn pèi gōng 。"
       },
       {
        "text": "沛公奉卮酒为寿，约为婚姻，曰：“吾入关，秋毫不敢有所近，籍吏民，封府库，而待将军。",
        "pinyin": "pèi gōng fèng zhī jiǔ wèi shòu ， yuē wèi hūn yīn ， yuē ：“ wú rù guān ， qiū háo bù gǎn yǒu suǒ jìn ， jí lì mín ， fēng fǔ kù ， ér dài jiāng jūn 。"
       },
       {
        "text": "所以遣将守关者，备他盗之出入与非常也。",
        "pinyin": "suǒ yǐ qiǎn jiāng shǒu guān zhě ， bèi tā dào zhī chū rù yǔ fēi cháng yě 。"
       },
       {
        "text": "日夜望将军至，岂敢反乎！",
        "pinyin": "rì yè wàng jiāng jūn zhì ， qǐ gǎn fǎn hū ！"
       },
       {
        "text": "愿伯具言臣之不敢倍德也。",
        "pinyin": "yuàn bó jù yán chén zhī bù gǎn bèi dé yě 。"
       },
       {
        "text": "”项伯许诺，谓沛公曰：“旦日不可不蚤自来谢项王。",
        "pinyin": "” xiàng bó xǔ nuò ， wèi pèi gōng yuē ：“ dàn rì bù kě bù zǎo zì lái xiè xiàng wáng 。"
       },
       {
        "text": "”沛公曰：“诺。",
        "pinyin": "” pèi gōng yuē ：“ nuò 。"
       },
       {
        "text": "”于是项伯复夜去，至军中，具以沛公言报项王。",
        "pinyin": "” yú shì xiàng bó fù yè qù ， zhì jūn zhōng ， jù yǐ pèi gōng yán bào xiàng wáng 。"
       },
       {
        "text": "因言曰：“沛公不先破关中，公岂敢入乎？",
        "pinyin": "yīn yán yuē ：“ pèi gōng bù xiān pò guān zhōng ， gōng qǐ gǎn rù hū ？"
       },
       {
        "text": "今人有大功而击之，不义也。",
        "pinyin": "jīn rén yǒu dà gōng ér jī zhī ， bú yì yě 。"
       },
       {
        "text": "不如因善遇之。",
        "pinyin": "bù rú yīn shàn yù zhī 。"
       },
       {
        "text": "”项王许诺。",
        "pinyin": "” xiàng wáng xǔ nuò 。"
       },
       {
        "text": "沛公旦日从百余骑来见项王，至鸿门，谢曰：“臣与将军戮力而攻秦，将军战河北，臣战河南，然不自意能先入关破秦，得复见将军于此。",
        "pinyin": "pèi gōng dàn rì cóng bǎi yú qí lái jiàn xiàng wáng ， zhì hóng mén ， xiè yuē ：“ chén yǔ jiāng jūn lù lì ér gōng qín ， jiāng jūn zhàn hé běi ， chén zhàn hé nán ， rán bú zì yì néng xiān rù guān pò qín ， dé fù jiàn jiāng jūn yú cǐ 。"
       },
       {
        "text": "今者有小人之言，令将军与臣有郤。",
        "pinyin": "jīn zhě yǒu xiǎo rén zhī yán ， lìng jiāng jūn yǔ chén yǒu xì 。"
       },
       {
        "text": "”项王曰：“此沛公左司马曹无伤言之；",
        "pinyin": "” xiàng wáng yuē ：“ cǐ pèi gōng zuǒ sī mǎ cáo wú shāng yán zhī ；"
       },
       {
        "text": "不然，籍何以至此。",
        "pinyin": "bù rán ， jí hé yǐ zhì cǐ 。"
       },
       {
        "text": "”项王即日因留沛公与饮。",
        "pinyin": "” xiàng wáng jí rì yīn liú pèi gōng yǔ yǐn 。"
       },
       {
        "text": "项王、项伯东向坐；",
        "pinyin": "xiàng wáng 、 xiàng bó dōng xiàng zuò ；"
       },
       {
        "text": "亚父南向坐——亚父者，范增也；",
        "pinyin": "yà fù nán xiàng zuò —— yà fù zhě ， fàn zēng yě ；"
       },
       {
        "text": "沛公北向坐；",
        "pinyin": "pèi gōng běi xiàng zuò ；"
       },
       {
        "text": "张良西向侍。",
        "pinyin": "zhāng liáng xī xiàng shì 。"
       },
       {
        "text": "范增数目项王，举所佩玉玦以示之者三，项王默然不应。",
        "pinyin": "fàn zēng shù mù xiàng wáng ， jǔ suǒ pèi yù jué yǐ shì zhī zhě sān ， xiàng wáng mò rán bú yìng 。"
       },
       {
        "text": "范增起，出，召项庄，谓曰：“君王为人不忍。",
        "pinyin": "fàn zēng qǐ ， chū ， zhào xiàng zhuāng ， wèi yuē ：“ jūn wáng wèi rén bù rěn 。"
       },
       {
        "text": "若入前为寿，寿毕，请以剑舞，因击沛公于坐，杀之。",
        "pinyin": "ruò rù qián wèi shòu ， shòu bì ， qǐng yǐ jiàn wǔ ， yīn jī pèi gōng yú zuò ， shā zhī 。"
       },
       {
        "text": "不者，若属皆且为所虏！",
        "pinyin": "bù zhě ， ruò shǔ jiē qiě wèi suǒ lǔ ！"
       },
       {
        "text": "”庄则入为寿。",
        "pinyin": "” zhuāng zé rù wèi shòu 。"
       },
       {
        "text": "寿毕，曰：“君王与沛公饮，军中无以为乐，请以剑舞。",
        "pinyin": "shòu bì ， yuē ：“ jūn wáng yǔ pèi gōng yǐn ， jūn zhōng wú yǐ wéi lè ， qǐng yǐ jiàn wǔ 。"
       },
       {
        "text": "”项王曰：“诺。",
        "pinyin": "” xiàng wáng yuē ：“ nuò 。"
       },
       {
        "text": "”项庄拔剑起舞，项伯亦拔剑起舞，常以身翼蔽沛公，庄不得击。",
        "pinyin": "” xiàng zhuāng bá jiàn qǐ wǔ ， xiàng bó yì bá jiàn qǐ wǔ ， cháng yǐ shēn yì bì pèi gōng ， zhuāng bù dé jī 。"
       },
       {
        "text": "于是张良至军门见樊哙。",
        "pinyin": "yú shì zhāng liáng zhì jūn mén jiàn fán kuài 。"
       },
       {
        "text": "樊哙曰：“今日之事何如？",
        "pinyin": "fán kuài yuē ：“ jīn rì zhī shì hé rú ？"
       },
       {
        "text": "”良曰：“甚急！",
        "pinyin": "” liáng yuē ：“ shèn jí ！"
       },
       {
        "text": "今者项庄拔剑舞，其意常在沛公也。",
        "pinyin": "jīn zhě xiàng zhuāng bá jiàn wǔ ， qí yì cháng zài pèi gōng yě 。"
       },
       {
        "text": "”哙曰：“此迫矣！",
        "pinyin": "” kuài yuē ：“ cǐ pò yǐ ！"
       },
       {
        "text": "臣请入，与之同命！",
        "pinyin": "chén qǐng rù ， yǔ zhī tóng mìng ！"
       },
       {
        "text": "”哙即带剑拥盾入军门，交戟之卫士欲止不内，樊哙侧其盾以撞，卫士仆地，哙遂入，披帷西向立，瞋目视项王，头发上指，目眦尽裂。",
        "pinyin": "” kuài jí dài jiàn yōng dùn rù jūn mén ， jiāo jǐ zhī wèi shì yù zhǐ bú nèi ， fán kuài cè qí dùn yǐ zhuàng ， wèi shì pú dì ， kuài suì rù ， pī wéi xī xiàng lì ， chēn mù shì xiàng wáng ， tóu fa shàng zhǐ ， mù zì jìn liè 。"
       },
       {
        "text": "项王按剑而跽曰：“客何为者？",
        "pinyin": "xiàng wáng àn jiàn ér jì yuē ：“ kè hé wèi zhě ？"
       },
       {
        "text": "”张良曰：“沛公之参乘樊哙者也。",
        "pinyin": "” zhāng liáng yuē ：“ pèi gōng zhī cān chéng fán kuài zhě yě 。"
       },
       {
        "text": "”项王曰：“壮士！",
        "pinyin": "” xiàng wáng yuē ：“ zhuàng shì ！"
       },
       {
        "text": "赐之卮酒。",
        "pinyin": "cì zhī zhī jiǔ 。"
       },
       {
        "text": "”则与斗卮酒。",
        "pinyin": "” zé yǔ dòu zhī jiǔ 。"
       },
       {
        "text": "哙拜谢，起，立而饮之。",
        "pinyin": "kuài bài xiè ， qǐ ， lì ér yǐn zhī 。"
       },
       {
        "text": "项王曰：“赐之彘肩。",
        "pinyin": "xiàng wáng yuē ：“ cì zhī zhì jiān 。"
       },
       {
        "text": "”则与一生彘肩。",
        "pinyin": "” zé yǔ yì shēng zhì jiān 。"
       },
       {
        "text": "樊哙覆其盾于地，加彘肩上，拔剑切而啖之。",
        "pinyin": "fán kuài fù qí dùn yú dì ， jiā zhì jiān shàng ， bá jiàn qiè ér dàn zhī 。"
       },
       {
        "text": "项王曰：“壮士！",
        "pinyin": "xiàng wáng yuē ：“ zhuàng shì ！"
       },
       {
        "text": "能复饮乎？",
        "pinyin": "néng fù yǐn hū ？"
       },
       {
        "text": "”樊哙曰：“臣死且不避，卮酒安足辞！",
        "pinyin": "” fán kuài yuē ：“ chén sǐ qiě bú bì ， zhī jiǔ ān zú cí ！"
       },
       {
        "text": "夫秦王有虎狼之心，杀人如不能举，刑人如恐不胜，天下皆叛之。",
        "pinyin": "fū qín wáng yǒu hǔ láng zhī xīn ， shā rén rú bù néng jǔ ， xíng rén rú kǒng bú shèng ， tiān xià jiē pàn zhī 。"
       },
       {
        "text": "怀王与诸将约曰：‘先破秦入咸阳者王之。",
        "pinyin": "huái wáng yǔ zhū jiāng yuē yuē ：‘ xiān pò qín rù xián yáng zhě wáng zhī 。"
       },
       {
        "text": "’今沛公先破秦入咸阳，毫毛不敢有所近，封闭宫室，还军霸上，以待大王来。",
        "pinyin": "’ jīn pèi gōng xiān pò qín rù xián yáng ， háo máo bù gǎn yǒu suǒ jìn ， fēng bì gōng shì ， hái jūn bà shàng ， yǐ dài dà wáng lái 。"
       },
       {
        "text": "故遣将守关者，备他盗出入与非常也。",
        "pinyin": "gù qiǎn jiāng shǒu guān zhě ， bèi tā dào chū rù yǔ fēi cháng yě 。"
       },
       {
        "text": "劳苦而功高如此，未有封侯之赏，而听细说，欲诛有功之人，此亡秦之续耳。",
        "pinyin": "láo kǔ ér gōng gāo rú cǐ ， wèi yǒu fēng hóu zhī shǎng ， ér tīng xì shuō ， yù zhū yǒu gōng zhī rén ， cǐ wáng qín zhī xù ěr 。"
       },
       {
        "text": "窃为大王不取也！",
        "pinyin": "qiè wèi dà wáng bù qǔ yě ！"
       },
       {
        "text": "”项王未有以应，曰：“坐。",
        "pinyin": "” xiàng wáng wèi yǒu yǐ yìng ， yuē ：“ zuò 。"
       },
       {
        "text": "”樊哙从良坐。",
        "pinyin": "” fán kuài cóng liáng zuò 。"
       },
       {
        "text": "坐须臾，沛公起如厕，因招樊哙出。",
        "pinyin": "zuò xū yú ， pèi gōng qǐ rú cè ， yīn zhāo fán kuài chū 。"
       },
       {
        "text": "沛公已出，项王使都尉陈平召沛公。",
        "pinyin": "pèi gōng yǐ chū ， xiàng wáng shǐ dōu wèi chén píng zhào pèi gōng 。"
       },
       {
        "text": "沛公曰：“今者出，未辞也，为之奈何？",
        "pinyin": "pèi gōng yuē ：“ jīn zhě chū ， wèi cí yě ， wèi zhī nài hé ？"
       },
       {
        "text": "”樊哙曰：“大行不顾细谨，大礼不辞小让。",
        "pinyin": "” fán kuài yuē ：“ dà xíng bú gù xì jǐn ， dà lǐ bù cí xiǎo ràng 。"
       },
       {
        "text": "如今人方为刀俎，我为鱼肉，何辞为？",
        "pinyin": "rú jīn rén fāng wèi dāo zǔ ， wǒ wèi yú ròu ， hé cí wèi ？"
       },
       {
        "text": "”于是遂去。",
        "pinyin": "” yú shì suì qù 。"
       },
       {
        "text": "乃令张良留谢。",
        "pinyin": "nǎi lìng zhāng liáng liú xiè 。"
       },
       {
        "text": "良问曰：“大王来何操？",
        "pinyin": "liáng wèn yuē ：“ dà wáng lái hé cāo ？"
       },
       {
        "text": "”曰：“我持白璧一双，欲献项王；",
        "pinyin": "” yuē ：“ wǒ chí bái bì yì shuāng ， yù xiàn xiàng wáng ；"
       },
       {
        "text": "玉斗一双，欲与亚父。",
        "pinyin": "yù dòu yì shuāng ， yù yǔ yà fù 。"
       },
       {
        "text": "会其怒，不敢献。",
        "pinyin": "huì qí nù ， bù gǎn xiàn 。"
       },
       {
        "text": "公为我献之。",
        "pinyin": "gōng wèi wǒ xiàn zhī 。"
       },
       {
        "text": "”张良曰：“谨诺。",
        "pinyin": "” zhāng liáng yuē ：“ jǐn nuò 。"
       },
       {
        "text": "”当是时，项王军在鸿门下，沛公军在霸上，相去四十里。",
        "pinyin": "” dāng shì shí ， xiàng wáng jūn zài hóng mén xià ， pèi gōng jūn zài bà shàng ， xiāng qù sì shí lǐ 。"
       },
       {
        "text": "沛公则置车骑，脱身独骑，与樊哙、夏侯婴、靳强、纪信等四人持剑盾步走，从郦山下，道芷阳间行。",
        "pinyin": "pèi gōng zé zhì chē qí ， tuō shēn dú qí ， yǔ fán kuài 、 xià hóu yīng 、 jìn qiáng 、 jì xìn děng sì rén chí jiàn dùn bù zǒu ， cóng lì shān xià ， dào zhǐ yáng jiān xíng 。"
       },
       {
        "text": "沛公谓张良曰：“从此道至吾军，不过二十里耳。",
        "pinyin": "pèi gōng wèi zhāng liáng yuē ：“ cóng cǐ dào zhì wú jūn ， bú guò èr shí lǐ ěr 。"
       },
       {
        "text": "度我至军中，公乃入。",
        "pinyin": "dù wǒ zhì jūn zhōng ， gōng nǎi rù 。"
       },
       {
        "text": "沛公已去，间至军中，张良入谢，曰：“沛公不胜杯杓，不能辞。",
        "pinyin": "pèi gōng yǐ qù ， jiān zhì jūn zhōng ， zhāng liáng rù xiè ， yuē ：“ pèi gōng bú shèng bēi sháo ， bù néng cí 。"
       },
       {
        "text": "谨使臣良奉白璧一双，再拜献大王足下；",
        "pinyin": "jǐn shǐ chén liáng fèng bái bì yì shuāng ， zài bài xiàn dà wáng zú xià ；"
       },
       {
        "text": "玉斗一双，再拜奉大将军足下。",
        "pinyin": "yù dòu yì shuāng ， zài bài fèng dà jiàng jūn zú xià 。"
       },
       {
        "text": "”项王曰：“沛公安在？",
        "pinyin": "” xiàng wáng yuē ：“ pèi gōng ān zài ？"
       },
       {
        "text": "”良曰：“闻大王有意督过之，脱身独去，已至军矣。",
        "pinyin": "” liáng yuē ：“ wén dà wáng yǒu yì dū guò zhī ， tuō shēn dú qù ， yǐ zhì jūn yǐ 。"
       },
       {
        "text": "”项王则受璧，置之坐上。",
        "pinyin": "” xiàng wáng zé shòu bì ， zhì zhī zuò shàng 。"
       },
       {
        "text": "亚父受玉斗，置之地，拔剑撞而破之，曰：“唉！",
        "pinyin": "yà fù shòu yù dòu ， zhì zhī dì ， bá jiàn zhuàng ér pò zhī ， yuē ：“ ài ！"
       },
       {
        "text": "竖子不足与谋！",
        "pinyin": "shù zǐ bù zú yǔ móu ！"
       },
       {
        "text": "夺项王天下者，必沛公也。",
        "pinyin": "duó xiàng wáng tiān xià zhě ， bì pèi gōng yě 。"
       },
       {
        "text": "吾属今为之虏矣！",
        "pinyin": "wú shǔ jīn wèi zhī lǔ yǐ ！"
       },
       {
        "text": "沛公至军，立诛杀曹无伤。",
        "pinyin": "pèi gōng zhì jūn ， lì zhū shā cáo wú shāng 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-qiushui",
      "title": "秋水",
      "author": "《庄子》",
      "dynasty": "苏教版",
      "grade": "高中语文必修三",
      "sentences": [
       {
        "text": "秋水时至，百川灌河。",
        "pinyin": "qiū shuǐ shí zhì ， bǎi chuān guàn hé 。"
       },
       {
        "text": "泾流之大，两涘渚崖之间，不辩牛马。",
        "pinyin": "jīng liú zhī dà ， liǎng sì zhǔ yá zhī jiān ， bú biàn niú mǎ 。"
       },
       {
        "text": "于是焉河伯欣然自喜，以天下之美为尽在己。",
        "pinyin": "yú shì yān hé bó xīn rán zì xǐ ， yǐ tiān xià zhī měi wèi jìn zài jǐ 。"
       },
       {
        "text": "顺流而东行，至于北海，东面而视，不见水端。",
        "pinyin": "shùn liú ér dōng xíng ， zhì yú běi hǎi ， dōng miàn ér shì ， bú jiàn shuǐ duān 。"
       },
       {
        "text": "于是焉河伯始旋其面目，望洋向若而叹曰：“野语有之曰：‘闻道百，以为莫己若者’，我之谓也。",
        "pinyin": "yú shì yān hé bó shǐ xuán qí miàn mù ， wàng yáng xiàng ruò ér tàn yuē ：“ yě yǔ yǒu zhī yuē ：‘ wén dào bǎi ， yǐ wéi mò jǐ ruò zhě ’， wǒ zhī wèi yě 。"
       },
       {
        "text": "且夫我尝闻少仲尼之闻，而轻伯夷之义者，始吾弗信，今我睹子之难穷也，吾非至于子之门，则殆矣，吾长见笑于大方之家。",
        "pinyin": "qiě fū wǒ cháng wén shǎo zhòng ní zhī wén ， ér qīng bó yí zhī yì zhě ， shǐ wú fú xìn ， jīn wǒ dǔ zǐ zhī nán qióng yě ， wú fēi zhì yú zǐ zhī mén ， zé dài yǐ ， wú cháng jiàn xiào yú dà fāng zhī jiā 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-feigong",
      "title": "非攻",
      "author": "《墨子》",
      "dynasty": "苏教版",
      "grade": "高中语文必修三",
      "sentences": [
       {
        "text": "今有一人，入人园圃，窃其桃李，众闻则非之，上为政者得则罚之。",
        "pinyin": "jīn yǒu yì rén ， rù rén yuán pǔ ， qiè qí táo lǐ ， zhòng wén zé fēi zhī ， shàng wéi zhèng zhě dé zé fá zhī 。"
       },
       {
        "text": "此何也？",
        "pinyin": "cǐ hé yě ？"
       },
       {
        "text": "以亏人自利也。",
        "pinyin": "yǐ kuī rén zì lì yě 。"
       },
       {
        "text": "至攘人犬豕鸡豚者，其不义又甚入人园圃窃人桃李。",
        "pinyin": "zhì rǎng rén quǎn shǐ jī tún zhě ， qí bú yì yòu shèn rù rén yuán pǔ qiè rén táo lǐ 。"
       },
       {
        "text": "是何故也？",
        "pinyin": "shì hé gù yě ？"
       },
       {
        "text": "以亏人愈多。",
        "pinyin": "yǐ kuī rén yù duō 。"
       },
       {
        "text": "苟亏人愈多，其不仁兹甚，罪益厚。",
        "pinyin": "gǒu kuī rén yù duō ， qí bù rén zī shèn ， zuì yì hòu 。"
       },
       {
        "text": "至入人栏厩，取人马牛者，其不仁义又甚攘人犬豕鸡豚。",
        "pinyin": "zhì rù rén lán jiù ， qǔ rén mǎ niú zhě ， qí bù rén yì yòu shèn rǎng rén quǎn shǐ jī tún 。"
       },
       {
        "text": "此何故也？",
        "pinyin": "cǐ hé gù yě ？"
       },
       {
        "text": "以其亏人愈多。",
        "pinyin": "yǐ qí kuī rén yù duō 。"
       },
       {
        "text": "苟亏人愈多，其不仁兹甚，罪益厚。",
        "pinyin": "gǒu kuī rén yù duō ， qí bù rén zī shèn ， zuì yì hòu 。"
       },
       {
        "text": "至杀不辜人也，拖其衣裘，取戈剑者，其不义又甚入人栏厩取人马牛。",
        "pinyin": "zhì shā bù gū rén yě ， tuō qí yī qiú ， qǔ gē jiàn zhě ， qí bú yì yòu shèn rù rén lán jiù qǔ rén mǎ niú 。"
       },
       {
        "text": "此何故也？",
        "pinyin": "cǐ hé gù yě ？"
       },
       {
        "text": "以其亏人愈多。",
        "pinyin": "yǐ qí kuī rén yù duō 。"
       },
       {
        "text": "苟亏人愈多，其不仁兹甚，罪益厚。",
        "pinyin": "gǒu kuī rén yù duō ， qí bù rén zī shèn ， zuì yì hòu 。"
       },
       {
        "text": "当此，天下之君子皆知而非之，谓之不义。",
        "pinyin": "dāng cǐ ， tiān xià zhī jūn zǐ jiē zhī ér fēi zhī ， wèi zhī bú yì 。"
       },
       {
        "text": "今至大为攻国，则弗知非，从而誉之，谓之义。",
        "pinyin": "jīn zhì dà wèi gōng guó ， zé fú zhī fēi ， cóng ér yù zhī ， wèi zhī yì 。"
       },
       {
        "text": "此可谓知义与不义之别乎？",
        "pinyin": "cǐ kě wèi zhī yì yǔ bú yì zhī bié hū ？"
       }
      ],
      "comment": ""
     }
    ]
   },
   {
    "id": "sj-vol-10",
    "name": "高中语文必修四",
    "articles": [
     {
      "id": "sj-jishijiangfazhuanyu",
      "title": "季氏将伐颛臾",
      "author": "《论语·季氏》",
      "dynasty": "苏教版",
      "grade": "高中语文必修四",
      "sentences": [
       {
        "text": "季氏将伐颛臾。",
        "pinyin": "jì shì jiāng fá zhuān yú 。"
       },
       {
        "text": "冉有、季路见于孔子曰：“季氏将有事于颛臾。",
        "pinyin": "rǎn yǒu 、 jì lù jiàn yú kǒng zǐ yuē ：“ jì shì jiāng yǒu shì yú zhuān yú 。"
       },
       {
        "text": "孔子曰：“求！",
        "pinyin": "kǒng zǐ yuē ：“ qiú ！"
       },
       {
        "text": "无乃尔是过与？",
        "pinyin": "wú nǎi ěr shì guò yǔ ？"
       },
       {
        "text": "夫颛臾，昔者先王以为东蒙主，且在邦域之中矣，是社稷之臣也。",
        "pinyin": "fū zhuān yú ， xī zhě xiān wáng yǐ wéi dōng méng zhǔ ， qiě zài bāng yù zhī zhōng yǐ ， shì shè jì zhī chén yě 。"
       },
       {
        "text": "何以伐为？",
        "pinyin": "hé yǐ fá wèi ？"
       },
       {
        "text": "冉有曰：“夫子欲之，吾二臣者皆不欲也。",
        "pinyin": "rǎn yǒu yuē ：“ fū zǐ yù zhī ， wú èr chén zhě jiē bú yù yě 。"
       },
       {
        "text": "孔子曰：“求！",
        "pinyin": "kǒng zǐ yuē ：“ qiú ！"
       },
       {
        "text": "周任有言曰：‘陈力就列，不能者止。",
        "pinyin": "zhōu rèn yǒu yán yuē ：‘ chén lì jiù liè ， bù néng zhě zhǐ 。"
       },
       {
        "text": "’危而不持，颠而不扶，则将焉用彼相矣？",
        "pinyin": "’ wēi ér bù chí ， diān ér bù fú ， zé jiāng yān yòng bǐ xiāng yǐ ？"
       },
       {
        "text": "且尔言过矣。",
        "pinyin": "qiě ěr yán guò yǐ 。"
       },
       {
        "text": "虎兕出于柙，龟玉毁于椟中，是谁之过与？",
        "pinyin": "hǔ sì chū yú xiá ， guī yù huǐ yú dú zhōng ， shì shuí zhī guò yǔ ？"
       },
       {
        "text": "冉有曰：“今夫颛臾，固而近于费。",
        "pinyin": "rǎn yǒu yuē ：“ jīn fū zhuān yú ， gù ér jìn yú fèi 。"
       },
       {
        "text": "今不取，后世必为子孙忧。",
        "pinyin": "jīn bù qǔ ， hòu shì bì wèi zǐ sūn yōu 。"
       },
       {
        "text": "孔子曰：“求！",
        "pinyin": "kǒng zǐ yuē ：“ qiú ！"
       },
       {
        "text": "君子疾夫舍曰‘欲之’而必为之辞。",
        "pinyin": "jūn zǐ jí fū shè yuē ‘ yù zhī ’ ér bì wèi zhī cí 。"
       },
       {
        "text": "丘也闻有国有家者，不患寡而患不均，不患贫而患不安。",
        "pinyin": "qiū yě wén yǒu guó yǒu jiā zhě ， bú huàn guǎ ér huàn bù jūn ， bú huàn pín ér huàn bù ān 。"
       },
       {
        "text": "盖均无贫，和无寡，安无倾。",
        "pinyin": "gài jūn wú pín ， hé wú guǎ ， ān wú qīng 。"
       },
       {
        "text": "夫如是，故远人不服，则修文德以来之。",
        "pinyin": "fū rú shì ， gù yuǎn rén bù fú ， zé xiū wén dé yǐ lái zhī 。"
       },
       {
        "text": "既来之，则安之。",
        "pinyin": "jì lái zhī ， zé ān zhī 。"
       },
       {
        "text": "今由与求也，相夫子，远人不服而不能来也，邦分崩离析而不能守也，而谋动干戈于邦内。",
        "pinyin": "jīn yóu yǔ qiú yě ， xiāng fū zǐ ， yuǎn rén bù fú ér bù néng lái yě ， bāng fēn bēng lí xī ér bù néng shǒu yě ， ér móu dòng gān gē yú bāng nèi 。"
       },
       {
        "text": "吾恐季孙之忧，不在颛臾，而在萧墙之内也。",
        "pinyin": "wú kǒng jì sūn zhī yōu ， bú zài zhuān yú ， ér zài xiāo qiáng zhī nèi yě 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-guarenzhiyuguoye",
      "title": "寡人之于国也",
      "author": "《孟子·梁惠王上》",
      "dynasty": "苏教版",
      "grade": "高中语文必修四",
      "sentences": [
       {
        "text": "梁惠王曰：“寡人之于国也，尽心焉耳矣。",
        "pinyin": "liáng huì wáng yuē ：“ guǎ rén zhī yú guó yě ， jìn xīn yān ěr yǐ 。"
       },
       {
        "text": "河内凶，则移其民于河东，移其粟于河内；",
        "pinyin": "hé nèi xiōng ， zé yí qí mín yú hé dōng ， yí qí sù yú hé nèi ；"
       },
       {
        "text": "河东凶亦然。",
        "pinyin": "hé dōng xiōng yì rán 。"
       },
       {
        "text": "察邻国之政，无如寡人之用心者。",
        "pinyin": "chá lín guó zhī zhèng ， wú rú guǎ rén zhī yòng xīn zhě 。"
       },
       {
        "text": "邻国之民不加少，寡人之民不加多，何也？",
        "pinyin": "lín guó zhī mín bù jiā shǎo ， guǎ rén zhī mín bù jiā duō ， hé yě ？"
       },
       {
        "text": "孟子对曰：“王好战，请以战喻。",
        "pinyin": "mèng zǐ duì yuē ：“ wáng hào zhàn ， qǐng yǐ zhàn yù 。"
       },
       {
        "text": "填然鼓之，兵刃既接，弃甲曳兵而走。",
        "pinyin": "tián rán gǔ zhī ， bīng rèn jì jiē ， qì jiǎ yè bīng ér zǒu 。"
       },
       {
        "text": "或百步而后止，或五十步而后止。",
        "pinyin": "huò bǎi bù ér hòu zhǐ ， huò wǔ shí bù ér hòu zhǐ 。"
       },
       {
        "text": "以五十步笑百步，则何如？",
        "pinyin": "yǐ wǔ shí bù xiào bǎi bù ， zé hé rú ？"
       },
       {
        "text": "曰：“不可，直不百步耳，是亦走也。",
        "pinyin": "yuē ：“ bù kě ， zhí bù bǎi bù ěr ， shì yì zǒu yě 。"
       },
       {
        "text": "曰：“王如知此，则无望民之多于邻国也。",
        "pinyin": "yuē ：“ wáng rú zhī cǐ ， zé wú wàng mín zhī duō yú lín guó yě 。"
       },
       {
        "text": "不违农时，谷不可胜食也；",
        "pinyin": "bù wéi nóng shí ， gǔ bù kě shèng shí yě ；"
       },
       {
        "text": "数罟不入洿池，鱼鳖不可胜食也；",
        "pinyin": "shù gǔ bú rù wū chí ， yú biē bù kě shèng shí yě ；"
       },
       {
        "text": "斧斤以时入山林，材木不可胜用也。",
        "pinyin": "fǔ jīn yǐ shí rù shān lín ， cái mù bù kě shèng yòng yě 。"
       },
       {
        "text": "谷与鱼鳖不可胜食，材木不可胜用，是使民养生丧死无憾也。",
        "pinyin": "gǔ yǔ yú biē bù kě shèng shí ， cái mù bù kě shèng yòng ， shì shǐ mín yǎng shēng sàng sǐ wú hàn yě 。"
       },
       {
        "text": "养生丧死无憾，王道之始也。",
        "pinyin": "yǎng shēng sàng sǐ wú hàn ， wáng dào zhī shǐ yě 。"
       },
       {
        "text": "五亩之宅，树之以桑，五十者可以衣帛矣。",
        "pinyin": "wǔ mǔ zhī zhái ， shù zhī yǐ sāng ， wǔ shí zhě kě yǐ yī bó yǐ 。"
       },
       {
        "text": "鸡豚狗彘之畜，无失其时，七十者可以食肉矣。",
        "pinyin": "jī tún gǒu zhì zhī chù ， wú shī qí shí ， qī shí zhě kě yǐ shí ròu yǐ 。"
       },
       {
        "text": "百亩之田，勿夺其时，数口之家，可以无饥矣。",
        "pinyin": "bǎi mǔ zhī tián ， wù duó qí shí ， shù kǒu zhī jiā ， kě yǐ wú jī yǐ 。"
       },
       {
        "text": "谨庠序之教，申之以孝悌之义，颁白者不负戴于道路矣。",
        "pinyin": "jǐn xiáng xù zhī jiào ， shēn zhī yǐ xiào tì zhī yì ， bān bái zhě bú fù dài yú dào lù yǐ 。"
       },
       {
        "text": "七十者衣帛食肉，黎民不饥不寒，然而不王者，未之有也。",
        "pinyin": "qī shí zhě yī bó shí ròu ， lí mín bù jī bù hán ， rán ér bù wáng zhě ， wèi zhī yǒu yě 。"
       },
       {
        "text": "狗彘食人食而不知检，涂有饿莩而不知发；",
        "pinyin": "gǒu zhì shí rén shí ér bù zhī jiǎn ， tú yǒu è piǎo ér bù zhī fā ；"
       },
       {
        "text": "人死，则曰：‘非我也，岁也。",
        "pinyin": "rén sǐ ， zé yuē ：‘ fēi wǒ yě ， suì yě 。"
       },
       {
        "text": "’是何异于刺人而杀之，曰‘非我也，兵也’？",
        "pinyin": "’ shì hé yì yú cì rén ér shā zhī ， yuē ‘ fēi wǒ yě ， bīng yě ’？"
       },
       {
        "text": "王无罪岁，斯天下之民至焉。",
        "pinyin": "wáng wú zuì suì ， sī tiān xià zhī mín zhì yān 。"
       }
      ],
      "comment": ""
     }
    ]
   },
   {
    "id": "sj-vol-11",
    "name": "高中语文必修五",
    "articles": [
     {
      "id": "sj-chenqingbiao",
      "title": "陈情表",
      "author": "李密",
      "dynasty": "苏教版",
      "grade": "高中语文必修五",
      "sentences": [
       {
        "text": "臣密言：臣以险衅，夙遭闵凶。",
        "pinyin": "chén mì yán ： chén yǐ xiǎn xìn ， sù zāo mǐn xiōng 。"
       },
       {
        "text": "生孩六月，慈父见背；",
        "pinyin": "shēng hái liù yuè ， cí fù jiàn bèi ；"
       },
       {
        "text": "行年四岁，舅夺母志。",
        "pinyin": "xíng nián sì suì ， jiù duó mǔ zhì 。"
       },
       {
        "text": "祖母刘愍臣孤弱，躬亲抚养。",
        "pinyin": "zǔ mǔ liú mǐn chén gū ruò ， gōng qīn fǔ yǎng 。"
       },
       {
        "text": "臣少多疾病，九岁不行，零丁孤苦，至于成立。",
        "pinyin": "chén shǎo duō jí bìng ， jiǔ suì bù xíng ， líng dīng gū kǔ ， zhì yú chéng lì 。"
       },
       {
        "text": "既无伯叔，终鲜兄弟，门衰祚薄，晚有儿息。",
        "pinyin": "jì wú bó shū ， zhōng xiān xiōng dì ， mén shuāi zuò báo ， wǎn yǒu ér xī 。"
       },
       {
        "text": "外无期功强近之亲，内无应门五尺之僮，茕茕孑立，形影相吊。",
        "pinyin": "wài wú qī gōng qiáng jìn zhī qīn ， nèi wú yìng mén wǔ chǐ zhī tóng ， qióng qióng jié lì ， xíng yǐng xiāng diào 。"
       },
       {
        "text": "而刘夙婴疾病，常在床蓐，臣侍汤药，未曾废离。",
        "pinyin": "ér liú sù yīng jí bìng ， cháng zài chuáng rù ， chén shì tāng yào ， wèi céng fèi lí 。"
       },
       {
        "text": "逮奉圣朝，沐浴清化。",
        "pinyin": "dǎi fèng shèng cháo ， mù yù qīng huà 。"
       },
       {
        "text": "前太守臣逵察臣孝廉，后刺史臣荣举臣秀才。",
        "pinyin": "qián tài shǒu chén kuí chá chén xiào lián ， hòu cì shǐ chén róng jǔ chén xiù cái 。"
       },
       {
        "text": "臣以供养无主，辞不赴命。",
        "pinyin": "chén yǐ gòng yǎng wú zhǔ ， cí bú fù mìng 。"
       },
       {
        "text": "诏书特下，拜臣郎中，寻蒙国恩，除臣洗马。",
        "pinyin": "zhào shū tè xià ， bài chén láng zhōng ， xún méng guó ēn ， chú chén xǐ mǎ 。"
       },
       {
        "text": "猥以微贱，当侍东宫，非臣陨首所能上报。",
        "pinyin": "wěi yǐ wēi jiàn ， dāng shì dōng gōng ， fēi chén yǔn shǒu suǒ néng shàng bào 。"
       },
       {
        "text": "臣具以表闻，辞不就职。",
        "pinyin": "chén jù yǐ biǎo wén ， cí bú jiù zhí 。"
       },
       {
        "text": "诏书切峻，责臣逋慢；",
        "pinyin": "zhào shū qiè jùn ， zé chén bū màn ；"
       },
       {
        "text": "郡县逼迫，催臣上道；",
        "pinyin": "jùn xiàn bī pò ， cuī chén shàng dào ；"
       },
       {
        "text": "州司临门，急于星火。",
        "pinyin": "zhōu sī lín mén ， jí yú xīng huǒ 。"
       },
       {
        "text": "臣欲奉诏奔驰，则刘病日笃；",
        "pinyin": "chén yù fèng zhào bēn chí ， zé liú bìng rì dǔ ；"
       },
       {
        "text": "欲苟顺私情，则告诉不许：臣之进退，实为狼狈。",
        "pinyin": "yù gǒu shùn sī qíng ， zé gào sù bù xǔ ： chén zhī jìn tuì ， shí wèi láng bèi 。"
       },
       {
        "text": "伏惟圣朝以孝治天下，凡在故老，犹蒙矜育，况臣孤苦，特为尤甚。",
        "pinyin": "fú wéi shèng cháo yǐ xiào zhì tiān xià ， fán zài gù lǎo ， yóu méng jīn yù ， kuàng chén gū kǔ ， tè wèi yóu shèn 。"
       },
       {
        "text": "且臣少仕伪朝，历职郎署，本图宦达，不矜名节。",
        "pinyin": "qiě chén shǎo shì wěi cháo ， lì zhí láng shǔ ， běn tú huàn dá ， bù jīn míng jié 。"
       },
       {
        "text": "今臣亡国贱俘，至微至陋，过蒙拔擢，宠命优渥，岂敢盘桓，有所希冀。",
        "pinyin": "jīn chén wáng guó jiàn fú ， zhì wēi zhì lòu ， guò méng bá zhuó ， chǒng mìng yōu wò ， qǐ gǎn pán huán ， yǒu suǒ xī jì 。"
       },
       {
        "text": "但以刘日薄西山，气息奄奄，人命危浅，朝不虑夕。",
        "pinyin": "dàn yǐ liú rì bó xī shān ， qì xī yān yān ， rén mìng wēi qiǎn ， cháo bú lǜ xī 。"
       },
       {
        "text": "臣无祖母，无以至今日；",
        "pinyin": "chén wú zǔ mǔ ， wú yǐ zhì jīn rì ；"
       },
       {
        "text": "祖母无臣，无以终余年。",
        "pinyin": "zǔ mǔ wú chén ， wú yǐ zhōng yú nián 。"
       },
       {
        "text": "母孙二人，更相为命，是以区区不能废远。",
        "pinyin": "mǔ sūn èr rén ， gèng xiāng wèi mìng ， shì yǐ qū qū bù néng fèi yuǎn 。"
       },
       {
        "text": "臣密今年四十有四，祖母刘今年九十有六，是臣尽节于陛下之日长，报养刘之日短也。",
        "pinyin": "chén mì jīn nián sì shí yǒu sì ， zǔ mǔ liú jīn nián jiǔ shí yǒu liù ， shì chén jìn jié yú bì xià zhī rì cháng ， bào yǎng liú zhī rì duǎn yě 。"
       },
       {
        "text": "乌鸟私情，愿乞终养。",
        "pinyin": "wū niǎo sī qíng ， yuàn qǐ zhōng yǎng 。"
       },
       {
        "text": "臣之辛苦，非独蜀之人士及二州牧伯所见明知，皇天后土，实所共鉴。",
        "pinyin": "chén zhī xīn kǔ ， fēi dú shǔ zhī rén shì jí èr zhōu mù bó suǒ jiàn míng zhī ， huáng tiān hòu tǔ ， shí suǒ gòng jiàn 。"
       },
       {
        "text": "愿陛下矜愍愚诚，听臣微志，庶刘侥幸，保卒余年。",
        "pinyin": "yuàn bì xià jīn mǐn yú chéng ， tīng chén wēi zhì ， shù liú jiǎo xìng ， bǎo zú yú nián 。"
       },
       {
        "text": "臣生当陨首，死当结草。",
        "pinyin": "chén shēng dāng yǔn shǒu ， sǐ dāng jié cǎo 。"
       },
       {
        "text": "臣不胜犬马怖惧之情，谨拜表以闻。",
        "pinyin": "chén bú shèng quǎn mǎ bù jù zhī qíng ， jǐn bài biǎo yǐ wén 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-xiangjixuanzhi",
      "title": "项脊轩志",
      "author": "归有光",
      "dynasty": "苏教版",
      "grade": "高中语文必修五",
      "sentences": [
       {
        "text": "项脊轩，旧南阁子也。",
        "pinyin": "xiàng jǐ xuān ， jiù nán gé zǐ yě 。"
       },
       {
        "text": "室仅方丈，可容一人居。",
        "pinyin": "shì jǐn fāng zhàng ， kě róng yì rén jū 。"
       },
       {
        "text": "百年老屋，尘泥渗漉，雨泽下注；",
        "pinyin": "bǎi nián lǎo wū ， chén ní shèn lù ， yǔ zé xià zhù ；"
       },
       {
        "text": "每移案，顾视无可置者。",
        "pinyin": "měi yí àn ， gù shì wú kě zhì zhě 。"
       },
       {
        "text": "又北向，不能得日，日过午已昏。",
        "pinyin": "yòu běi xiàng ， bù néng dé rì ， rì guò wǔ yǐ hūn 。"
       },
       {
        "text": "余稍为修葺，使不上漏。",
        "pinyin": "yú shāo wéi xiū qì ， shǐ bú shàng lòu 。"
       },
       {
        "text": "前辟四窗，垣墙周庭，以当南日，日影反照，室始洞然。",
        "pinyin": "qián pì sì chuāng ， yuán qiáng zhōu tíng ， yǐ dāng nán rì ， rì yǐng fǎn zhào ， shì shǐ dòng rán 。"
       },
       {
        "text": "又杂植兰桂竹木于庭，旧时栏楯，亦遂增胜。",
        "pinyin": "yòu zá zhí lán guì zhú mù yú tíng ， jiù shí lán dùn ， yì suì zēng shèng 。"
       },
       {
        "text": "借书满架，偃仰啸歌，冥然兀坐，万籁有声；",
        "pinyin": "jiè shū mǎn jià ， yǎn yǎng xiào gē ， míng rán wù zuò ， wàn lài yǒu shēng ；"
       },
       {
        "text": "而庭阶寂寂，小鸟时来啄食，人至不去。",
        "pinyin": "ér tíng jiē jì jì ， xiǎo niǎo shí lái zhuó shí ， rén zhì bú qù 。"
       },
       {
        "text": "三五之夜，明月半墙，桂影斑驳，风移影动，珊珊可爱。",
        "pinyin": "sān wǔ zhī yè ， míng yuè bàn qiáng ， guì yǐng bān bó ， fēng yí yǐng dòng ， shān shān kě ài 。"
       },
       {
        "text": "然余居于此，多可喜，亦多可悲。",
        "pinyin": "rán yú jū yú cǐ ， duō kě xǐ ， yì duō kě bēi 。"
       },
       {
        "text": "先是，庭中通南北为一。",
        "pinyin": "xiān shì ， tíng zhōng tōng nán běi wèi yī 。"
       },
       {
        "text": "迨诸父异爨，内外多置小门墙，往往而是。",
        "pinyin": "dài zhū fù yì cuàn ， nèi wài duō zhì xiǎo mén qiáng ， wǎng wǎng ér shì 。"
       },
       {
        "text": "东犬西吠，客逾庖而宴，鸡栖于厅。",
        "pinyin": "dōng quǎn xī fèi ， kè yú páo ér yàn ， jī qī yú tīng 。"
       },
       {
        "text": "庭中始为篱，已为墙，凡再变矣。",
        "pinyin": "tíng zhōng shǐ wèi lí ， yǐ wèi qiáng ， fán zài biàn yǐ 。"
       },
       {
        "text": "家有老妪，尝居于此。",
        "pinyin": "jiā yǒu lǎo yù ， cháng jū yú cǐ 。"
       },
       {
        "text": "妪，先大母婢也，乳二世，先妣抚之甚厚。",
        "pinyin": "yù ， xiān dà mǔ bì yě ， rǔ èr shì ， xiān bǐ fǔ zhī shèn hòu 。"
       },
       {
        "text": "室之西连于中闺，先妣尝一至。",
        "pinyin": "shì zhī xī lián yú zhōng guī ， xiān bǐ cháng yí zhì 。"
       },
       {
        "text": "妪每谓余曰：“某所，而母立于兹。",
        "pinyin": "yù měi wèi yú yuē ：“ mǒu suǒ ， ér mǔ lì yú zī 。"
       },
       {
        "text": "”妪又曰：“汝姊在吾怀，呱呱而泣；",
        "pinyin": "” yù yòu yuē ：“ rǔ zǐ zài wú huái ， guā guā ér qì ；"
       },
       {
        "text": "娘以指叩门扉曰：‘儿寒乎？",
        "pinyin": "niáng yǐ zhǐ kòu mén fēi yuē ：‘ ér hán hū ？"
       },
       {
        "text": "欲食乎？",
        "pinyin": "yù shí hū ？"
       },
       {
        "text": "’吾从板外相为应答。",
        "pinyin": "’ wú cóng bǎn wài xiàng wèi yìng dá 。"
       },
       {
        "text": "”语未毕，余泣，妪亦泣。",
        "pinyin": "” yǔ wèi bì ， yú qì ， yù yì qì 。"
       },
       {
        "text": "余自束发读书轩中，一日，大母过余曰：“吾儿，久不见若影，何竟日默默在此，大类女郎也？",
        "pinyin": "yú zì shù fā dú shū xuān zhōng ， yí rì ， dà mǔ guò yú yuē ：“ wú ér ， jiǔ bú jiàn ruò yǐng ， hé jìng rì mò mò zài cǐ ， dà lèi nǚ láng yě ？"
       },
       {
        "text": "”比去，以手阖门，自语曰：“吾家读书久不效，儿之成，则可待乎！",
        "pinyin": "” bǐ qù ， yǐ shǒu hé mén ， zì yǔ yuē ：“ wú jiā dú shū jiǔ bú xiào ， ér zhī chéng ， zé kě dài hū ！"
       },
       {
        "text": "”顷之，持一象笏至，曰：“此吾祖太常公宣德间执此以朝，他日汝当用之！",
        "pinyin": "” qǐng zhī ， chí yí xiàng hù zhì ， yuē ：“ cǐ wú zǔ tài cháng gōng xuān dé jiān zhí cǐ yǐ cháo ， tā rì rǔ dāng yòng zhī ！"
       },
       {
        "text": "”瞻顾遗迹，如在昨日，令人长号不自禁。",
        "pinyin": "” zhān gù yí jì ， rú zài zuó rì ， lìng rén cháng hào bú zì jīn 。"
       },
       {
        "text": "轩东故尝为厨，人往，从轩前过。",
        "pinyin": "xuān dōng gù cháng wèi chú ， rén wǎng ， cóng xuān qián guò 。"
       },
       {
        "text": "余扃牖而居，久之，能以足音辨人。",
        "pinyin": "yú jiōng yǒu ér jū ， jiǔ zhī ， néng yǐ zú yīn biàn rén 。"
       },
       {
        "text": "轩凡四遭火，得不焚，殆有神护者。",
        "pinyin": "xuān fán sì zāo huǒ ， dé bù fén ， dài yǒu shén hù zhě 。"
       },
       {
        "text": "余既为此志，后五年，吾妻来归，时至轩中，从余问古事，或凭几学书。",
        "pinyin": "yú jì wèi cǐ zhì ， hòu wǔ nián ， wú qī lái guī ， shí zhì xuān zhōng ， cóng yú wèn gǔ shì ， huò píng jǐ xué shū 。"
       },
       {
        "text": "吾妻归宁，述诸小妹语曰：“闻姊家有阁子，且何谓阁子也？",
        "pinyin": "wú qī guī níng ， shù zhū xiǎo mèi yǔ yuē ：“ wén zǐ jiā yǒu gé zǐ ， qiě hé wèi gé zǐ yě ？"
       },
       {
        "text": "”其后六年，吾妻死，室坏不修。",
        "pinyin": "” qí hòu liù nián ， wú qī sǐ ， shì huài bù xiū 。"
       },
       {
        "text": "其后二年，余久卧病无聊，乃使人复葺南阁子，其制稍异于前。",
        "pinyin": "qí hòu èr nián ， yú jiǔ wò bìng wú liáo ， nǎi shǐ rén fù qì nán gé zǐ ， qí zhì shāo yì yú qián 。"
       },
       {
        "text": "然自后余多在外，不常居。",
        "pinyin": "rán zì hòu yú duō zài wài ， bù cháng jū 。"
       },
       {
        "text": "庭有枇杷树，吾妻死之年所手植也，今已亭亭如盖矣。",
        "pinyin": "tíng yǒu pí pá shù ， wú qī sǐ zhī nián suǒ shǒu zhí yě ， jīn yǐ tíng tíng rú gài yǐ 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-yufu",
      "title": "渔父",
      "author": "《楚辞》",
      "dynasty": "苏教版",
      "grade": "高中语文必修五",
      "sentences": [
       {
        "text": "屈原既放，游于江潭，行吟泽畔，颜色憔悴，形容枯槁。",
        "pinyin": "qū yuán jì fàng ， yóu yú jiāng tán ， xíng yín zé pàn ， yán sè qiáo cuì ， xíng róng kū gǎo 。"
       },
       {
        "text": "渔父见而问之曰：“子非三闾大夫与？",
        "pinyin": "yú fù jiàn ér wèn zhī yuē ：“ zǐ fēi sān lǘ dài fu yǔ ？"
       },
       {
        "text": "何故至于斯？",
        "pinyin": "hé gù zhì yú sī ？"
       },
       {
        "text": "”屈原曰：“举世皆浊我独清，众人皆醉我独醒，是以见放。",
        "pinyin": "” qū yuán yuē ：“ jǔ shì jiē zhuó wǒ dú qīng ， zhòng rén jiē zuì wǒ dú xǐng ， shì yǐ jiàn fàng 。"
       },
       {
        "text": "渔父曰：“圣人不凝滞于物，而能与世推移。",
        "pinyin": "yú fù yuē ：“ shèng rén bù níng zhì yú wù ， ér néng yǔ shì tuī yí 。"
       },
       {
        "text": "世人皆浊，何不淈其泥而扬其波？",
        "pinyin": "shì rén jiē zhuó ， hé bù gǔ qí ní ér yáng qí bō ？"
       },
       {
        "text": "众人皆醉，何不餔其糟而歠其醨？",
        "pinyin": "zhòng rén jiē zuì ， hé bù bū qí zāo ér chuò qí lí ？"
       },
       {
        "text": "何故深思高举，自令放为？",
        "pinyin": "hé gù shēn sī gāo jǔ ， zì lìng fàng wèi ？"
       },
       {
        "text": "屈原曰：“吾闻之，新沐者必弹冠，新浴者必振衣。",
        "pinyin": "qū yuán yuē ：“ wú wén zhī ， xīn mù zhě bì tán guān ， xīn yù zhě bì zhèn yī 。"
       },
       {
        "text": "安能以身之察察，受物之汶汶者乎？",
        "pinyin": "ān néng yǐ shēn zhī chá chá ， shòu wù zhī wèn wèn zhě hū ？"
       },
       {
        "text": "宁赴湘流，葬于江鱼之腹中。",
        "pinyin": "níng fù xiāng liú ， zàng yú jiāng yú zhī fù zhōng 。"
       },
       {
        "text": "安能以皓皓之白，而蒙世俗之尘埃乎？",
        "pinyin": "ān néng yǐ hào hào zhī bái ， ér méng shì sú zhī chén āi hū ？"
       },
       {
        "text": "渔父莞尔而笑，鼓枻而去，乃歌曰：“沧浪之水清兮，可以濯吾缨；",
        "pinyin": "yú fù wǎn ěr ér xiào ， gǔ yì ér qù ， nǎi gē yuē ：“ cāng làng zhī shuǐ qīng xī ， kě yǐ zhuó wú yīng ；"
       },
       {
        "text": "沧浪之水浊兮，可以濯吾足。",
        "pinyin": "cāng làng zhī shuǐ zhuó xī ， kě yǐ zhuó wú zú 。"
       },
       {
        "text": "”遂去，不复与言。",
        "pinyin": "” suì qù ， bú fù yǔ yán 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-baorenanshujiexuan",
      "title": "报任安书（节选）",
      "author": "司马迁",
      "dynasty": "苏教版",
      "grade": "高中语文必修五",
      "sentences": [
       {
        "text": "太史公牛马走司马迁再拜言。",
        "pinyin": "tài shǐ gōng niú mǎ zǒu sī mǎ qiān zài bài yán 。"
       },
       {
        "text": "少卿足下：曩者辱赐书，教以慎于接物，推贤进士为务，意气勤勤恳恳，若望仆不相师，而用流俗人之言。",
        "pinyin": "shǎo qīng zú xià ： nǎng zhě rǔ cì shū ， jiào yǐ shèn yú jiē wù ， tuī xián jìn shì wèi wù ， yì qì qín qín kěn kěn ， ruò wàng pú bù xiāng shī ， ér yòng liú sú rén zhī yán 。"
       },
       {
        "text": "仆非敢如此也。",
        "pinyin": "pú fēi gǎn rú cǐ yě 。"
       },
       {
        "text": "仆虽罢驽，亦尝侧闻长者之遗风矣。",
        "pinyin": "pú suī bà nú ， yì cháng cè wén zhǎng zhě zhī yí fēng yǐ 。"
       },
       {
        "text": "顾自以为身残处秽，动而见尤，欲益反损，是以独郁悒而无谁语。",
        "pinyin": "gù zì yǐ wéi shēn cán chù huì ， dòng ér jiàn yóu ， yù yì fǎn sǔn ， shì yǐ dú yù yì ér wú shuí yǔ 。"
       },
       {
        "text": "谚曰：“谁为为之？",
        "pinyin": "yàn yuē ：“ shuí wèi wèi zhī ？"
       },
       {
        "text": "孰令听之？",
        "pinyin": "shú lìng tīng zhī ？"
       },
       {
        "text": "”盖钟子期死，伯牙终身不复鼓琴。",
        "pinyin": "” gài zhōng zǐ qī sǐ ， bó yá zhōng shēn bú fù gǔ qín 。"
       },
       {
        "text": "何则？",
        "pinyin": "hé zé ？"
       },
       {
        "text": "士为知己者用，女为悦己者容。",
        "pinyin": "shì wèi zhī jǐ zhě yòng ， nǚ wèi yuè jǐ zhě róng 。"
       },
       {
        "text": "若仆大质已亏缺矣，虽材怀随和，行若由夷，终不可以为荣，适足以发笑而自点耳。",
        "pinyin": "ruò pú dà zhì yǐ kuī quē yǐ ， suī cái huái suí hé ， xíng ruò yóu yí ， zhōng bù kě yǐ wéi róng ， shì zú yǐ fā xiào ér zì diǎn ěr 。"
       },
       {
        "text": "书辞宜答，会东从上来，又迫贱事，相见日浅，卒卒无须臾之闲，得竭指意。",
        "pinyin": "shū cí yí dá ， huì dōng cóng shàng lái ， yòu pò jiàn shì ， xiāng jiàn rì qiǎn ， zú zú wú xū yú zhī xián ， dé jié zhǐ yì 。"
       },
       {
        "text": "今少卿抱不测之罪，涉旬月，迫季冬，仆又薄从上雍，恐卒然不可为讳，是仆终已不得舒愤懑以晓左右，则长逝者魂魄私恨无穷。",
        "pinyin": "jīn shǎo qīng bào bú cè zhī zuì ， shè xún yuè ， pò jì dōng ， pú yòu báo cóng shàng yōng ， kǒng zú rán bù kě wèi huì ， shì pú zhōng yǐ bù dé shū fèn mèn yǐ xiǎo zuǒ yòu ， zé cháng shì zhě hún pò sī hèn wú qióng 。"
       },
       {
        "text": "请略陈固陋。",
        "pinyin": "qǐng lüè chén gù lòu 。"
       },
       {
        "text": "阙然久不报，幸勿为过。",
        "pinyin": "quē rán jiǔ bú bào ， xìng wù wèi guò 。"
       },
       {
        "text": "仆闻之：修身者，智之符也；",
        "pinyin": "pú wén zhī ： xiū shēn zhě ， zhì zhī fú yě ；"
       },
       {
        "text": "爱施者，仁之端也；",
        "pinyin": "ài shī zhě ， rén zhī duān yě ；"
       },
       {
        "text": "取予者，义之表也；",
        "pinyin": "qǔ yǔ zhě ， yì zhī biǎo yě ；"
       },
       {
        "text": "耻辱者，勇之决也；",
        "pinyin": "chǐ rǔ zhě ， yǒng zhī jué yě ；"
       },
       {
        "text": "立名者，行之极也。",
        "pinyin": "lì míng zhě ， xíng zhī jí yě 。"
       },
       {
        "text": "士有此五者，然后可以托于世，列于君子之林矣。",
        "pinyin": "shì yǒu cǐ wǔ zhě ， rán hòu kě yǐ tuō yú shì ， liè yú jūn zǐ zhī lín yǐ 。"
       },
       {
        "text": "故祸莫憯于欲利，悲莫痛于伤心，行莫丑于辱先，诟莫大于宫刑。",
        "pinyin": "gù huò mò cǎn yú yù lì ， bēi mò tòng yú shāng xīn ， xíng mò chǒu yú rǔ xiān ， gòu mò dà yú gōng xíng 。"
       },
       {
        "text": "刑余之人，无所比数，非一世也，所从来远矣。",
        "pinyin": "xíng yú zhī rén ， wú suǒ bǐ shù ， fēi yí shì yě ， suǒ cóng lái yuǎn yǐ 。"
       },
       {
        "text": "昔卫灵公与雍渠同载，孔子适陈；",
        "pinyin": "xī wèi líng gōng yǔ yōng qú tóng zǎi ， kǒng zǐ shì chén ；"
       },
       {
        "text": "商鞅因景监见，赵良寒心；",
        "pinyin": "shāng yāng yīn jǐng jiān jiàn ， zhào liáng hán xīn ；"
       },
       {
        "text": "同子参乘，袁丝变色：自古而耻之。",
        "pinyin": "tóng zǐ cān chéng ， yuán sī biàn sè ： zì gǔ ér chǐ zhī 。"
       },
       {
        "text": "夫以中材之人，事有关于宦竖，莫不伤气，而况于慷慨之士乎！",
        "pinyin": "fū yǐ zhōng cái zhī rén ， shì yǒu guān yú huàn shù ， mò bù shāng qì ， ér kuàng yú kāng kǎi zhī shì hū ！"
       },
       {
        "text": "如今朝廷虽乏人，奈何令刀锯之余，荐天下之豪俊哉！",
        "pinyin": "rú jīn cháo tíng suī fá rén ， nài hé lìng dāo jù zhī yú ， jiàn tiān xià zhī háo jùn zāi ！"
       },
       {
        "text": "仆之先人，非有剖符丹书之功，文史星历，近乎卜祝之间，固主上所戏弄，倡优畜之，流俗之所轻也。",
        "pinyin": "pú zhī xiān rén ， fēi yǒu pōu fú dān shū zhī gōng ， wén shǐ xīng lì ， jìn hū bǔ zhù zhī jiān ， gù zhǔ shàng suǒ xì nòng ， chàng yōu chù zhī ， liú sú zhī suǒ qīng yě 。"
       },
       {
        "text": "假令仆伏法受诛，若九牛亡一毛，与蝼蚁何以异？",
        "pinyin": "jiǎ lìng pú fú fǎ shòu zhū ， ruò jiǔ niú wáng yì máo ， yǔ lóu yǐ hé yǐ yì ？"
       },
       {
        "text": "而世又不与能死节者比，特以为智穷罪极，不能自免，卒就死耳。",
        "pinyin": "ér shì yòu bù yǔ néng sǐ jié zhě bǐ ， tè yǐ wéi zhì qióng zuì jí ， bù néng zì miǎn ， zú jiù sǐ ěr 。"
       },
       {
        "text": "何也？",
        "pinyin": "hé yě ？"
       },
       {
        "text": "素所自树立使然也。",
        "pinyin": "sù suǒ zì shù lì shǐ rán yě 。"
       },
       {
        "text": "人固有一死，或重于泰山，或轻于鸿毛，用之所趋异也。",
        "pinyin": "rén gù yǒu yì sǐ ， huò zhòng yú tài shān ， huò qīng yú hóng máo ， yòng zhī suǒ qū yì yě 。"
       },
       {
        "text": "太上不辱先，其次不辱身，其次不辱理色，其次不辱辞令，其次诎体受辱，其次易服受辱，其次关木索、被箠楚受辱，其次鬄毛发、婴金铁受辱，其次毁肌肤、断肢体受辱，最下腐刑极矣！",
        "pinyin": "tài shàng bù rǔ xiān ， qí cì bù rǔ shēn ， qí cì bù rǔ lǐ sè ， qí cì bù rǔ cí lìng ， qí cì qū tǐ shòu rǔ ， qí cì yì fú shòu rǔ ， qí cì guān mù suǒ 、 bèi chuí chǔ shòu rǔ ， qí cì tì máo fà 、 yīng jīn tiě shòu rǔ ， qí cì huǐ jī fū 、 duàn zhī tǐ shòu rǔ ， zuì xià fǔ xíng jí yǐ ！"
       },
       {
        "text": "传曰：“刑不上大夫。",
        "pinyin": "chuán yuē ：“ xíng bú shàng dài fu 。"
       },
       {
        "text": "”此言士节不可不勉厉也。",
        "pinyin": "” cǐ yán shì jié bù kě bù miǎn lì yě 。"
       },
       {
        "text": "猛虎在深山，百兽震恐，及在槛阱之中，摇尾而求食，积威约之渐也。",
        "pinyin": "měng hǔ zài shēn shān ， bǎi shòu zhèn kǒng ， jí zài kǎn jǐng zhī zhōng ， yáo wěi ér qiú shí ， jī wēi yuē zhī jiàn yě 。"
       },
       {
        "text": "故士有画地为牢，势不可入；",
        "pinyin": "gù shì yǒu huà dì wéi láo ， shì bù kě rù ；"
       },
       {
        "text": "削木为吏，议不对，定计于鲜也。",
        "pinyin": "xuē mù wéi lì ， yì bú duì ， dìng jì yú xiān yě 。"
       },
       {
        "text": "今交手足，受木索，暴肌肤，受榜箠，幽于圜墙之中。",
        "pinyin": "jīn jiāo shǒu zú ， shòu mù suǒ ， bào jī fū ， shòu bǎng chuí ， yōu yú huán qiáng zhī zhōng 。"
       },
       {
        "text": "当此之时，见狱吏则头枪地，视徒隶则心惕息。",
        "pinyin": "dāng cǐ zhī shí ， jiàn yù lì zé tóu qiāng dì ， shì tú lì zé xīn tì xī 。"
       },
       {
        "text": "何者？",
        "pinyin": "hé zhě ？"
       },
       {
        "text": "积威约之势也。",
        "pinyin": "jī wēi yuē zhī shì yě 。"
       },
       {
        "text": "及已至是，言不辱者，所谓强颜耳，曷足贵乎！",
        "pinyin": "jí yǐ zhì shì ， yán bù rǔ zhě ， suǒ wèi qiáng yán ěr ， hé zú guì hū ！"
       },
       {
        "text": "且西伯，伯也，拘于羑里；",
        "pinyin": "qiě xī bó ， bó yě ， jū yú yǒu lǐ ；"
       },
       {
        "text": "李斯，相也，具于五刑；",
        "pinyin": "lǐ sī ， xiāng yě ， jù yú wǔ xíng ；"
       },
       {
        "text": "淮阴，王也，受械于陈；",
        "pinyin": "huái yīn ， wáng yě ， shòu xiè yú chén ；"
       },
       {
        "text": "彭越、张敖，南面称孤，系狱抵罪；",
        "pinyin": "péng yuè 、 zhāng áo ， nán miàn chēng gū ， xì yù dǐ zuì ；"
       },
       {
        "text": "绛侯诛诸吕，权倾五伯，囚于请室；",
        "pinyin": "jiàng hóu zhū zhū lǚ ， quán qīng wǔ bó ， qiú yú qǐng shì ；"
       },
       {
        "text": "魏其，大将也，衣赭衣，关三木；",
        "pinyin": "wèi qí ， dà jiàng yě ， yī zhě yī ， guān sān mù ；"
       },
       {
        "text": "季布为朱家钳奴；",
        "pinyin": "jì bù wèi zhū jiā qián nú ；"
       },
       {
        "text": "灌夫受辱于居室。",
        "pinyin": "guàn fū shòu rǔ yú jū shì 。"
       },
       {
        "text": "此人皆身至王侯将相，声闻邻国，及罪至罔加，不能引决自裁，在尘埃之中。",
        "pinyin": "cǐ rén jiē shēn zhì wáng hóu jiàng xiàng ， shēng wén lín guó ， jí zuì zhì wǎng jiā ， bù néng yǐn jué zì cái ， zài chén āi zhī zhōng 。"
       },
       {
        "text": "古今一体，安在其不辱也？",
        "pinyin": "gǔ jīn yì tǐ ， ān zài qí bù rǔ yě ？"
       },
       {
        "text": "由此言之，勇怯，势也；",
        "pinyin": "yóu cǐ yán zhī ， yǒng qiè ， shì yě ；"
       },
       {
        "text": "强弱，形也。",
        "pinyin": "qiáng ruò ， xíng yě 。"
       },
       {
        "text": "审矣，何足怪乎？",
        "pinyin": "shěn yǐ ， hé zú guài hū ？"
       },
       {
        "text": "夫人不能早自裁绳墨之外，以稍陵迟，至于鞭箠之间，乃欲引节，斯不亦远乎！",
        "pinyin": "fū rén bù néng zǎo zì cái shéng mò zhī wài ， yǐ shāo líng chí ， zhì yú biān chuí zhī jiān ， nǎi yù yǐn jié ， sī bú yì yuǎn hū ！"
       },
       {
        "text": "古人所以重施刑于大夫者，殆为此也。",
        "pinyin": "gǔ rén suǒ yǐ zhòng shī xíng yú dài fu zhě ， dài wèi cǐ yě 。"
       },
       {
        "text": "夫人情莫不贪生恶死，念父母，顾妻子，至激于义理者不然，乃有所不得已也。",
        "pinyin": "fū rén qíng mò bù tān shēng è sǐ ， niàn fù mǔ ， gù qī zǐ ， zhì jī yú yì lǐ zhě bù rán ， nǎi yǒu suǒ bù dé yǐ yě 。"
       },
       {
        "text": "今仆不幸，早失父母，无兄弟之亲，独身孤立，少卿视仆于妻子何如哉？",
        "pinyin": "jīn pú bú xìng ， zǎo shī fù mǔ ， wú xiōng dì zhī qīn ， dú shēn gū lì ， shǎo qīng shì pú yú qī zǐ hé rú zāi ？"
       },
       {
        "text": "且勇者不必死节，怯夫慕义，何处不勉焉！",
        "pinyin": "qiě yǒng zhě bú bì sǐ jié ， qiè fū mù yì ， hé chù bù miǎn yān ！"
       },
       {
        "text": "仆虽怯懦，欲苟活，亦颇识去就之分矣，何至自沉溺缧绁之辱哉！",
        "pinyin": "pú suī qiè nuò ， yù gǒu huó ， yì pō shí qù jiù zhī fēn yǐ ， hé zhì zì chén nì léi xiè zhī rǔ zāi ！"
       },
       {
        "text": "且夫臧获婢妾，犹能引决，况仆之不得已乎？",
        "pinyin": "qiě fū zāng huò bì qiè ， yóu néng yǐn jué ， kuàng pú zhī bù dé yǐ hū ？"
       },
       {
        "text": "所以隐忍苟活，幽于粪土之中而不辞者，恨私心有所不尽，鄙陋没世，而文采不表于后世也。",
        "pinyin": "suǒ yǐ yǐn rěn gǒu huó ， yōu yú fèn tǔ zhī zhōng ér bù cí zhě ， hèn sī xīn yǒu suǒ bú jìn ， bǐ lòu méi shì ， ér wén cǎi bù biǎo yú hòu shì yě 。"
       },
       {
        "text": "古者富贵而名摩灭，不可胜记，唯倜傥非常之人称焉。",
        "pinyin": "gǔ zhě fù guì ér míng mó miè ， bù kě shèng jì ， wéi tì tǎng fēi cháng zhī rén chēng yān 。"
       },
       {
        "text": "盖文王拘而演《周易》；",
        "pinyin": "gài wén wáng jū ér yǎn 《 zhōu yì 》；"
       },
       {
        "text": "仲尼厄而作《春秋》；",
        "pinyin": "zhòng ní è ér zuò 《 chūn qiū 》；"
       },
       {
        "text": "屈原放逐，乃赋《离骚》；",
        "pinyin": "qū yuán fàng zhú ， nǎi fù 《 lí sāo 》；"
       },
       {
        "text": "左丘失明，厥有《国语》；",
        "pinyin": "zuǒ qiū shī míng ， jué yǒu 《 guó yǔ 》；"
       },
       {
        "text": "孙子膑脚，《兵法》修列；",
        "pinyin": "sūn zi bìn jiǎo ，《 bīng fǎ 》 xiū liè ；"
       },
       {
        "text": "不韦迁蜀，世传《吕览》；",
        "pinyin": "bù wéi qiān shǔ ， shì chuán 《 lǚ lǎn 》；"
       },
       {
        "text": "韩非囚秦，《说难》《孤愤》；",
        "pinyin": "hán fēi qiú qín ，《 shuō nán 》《 gū fèn 》；"
       },
       {
        "text": "《诗》三百篇，大底圣贤发愤之所为作也。",
        "pinyin": "《 shī 》 sān bǎi piān ， dà dǐ shèng xián fā fèn zhī suǒ wèi zuò yě 。"
       },
       {
        "text": "此人皆意有所郁结，不得通其道，故述往事，思来者。",
        "pinyin": "cǐ rén jiē yì yǒu suǒ yù jié ， bù dé tōng qí dào ， gù shù wǎng shì ， sī lái zhě 。"
       },
       {
        "text": "乃如左丘无目，孙子断足，终不可用，退而论书策，以舒其愤，思垂空文以自见。",
        "pinyin": "nǎi rú zuǒ qiū wú mù ， sūn zi duàn zú ， zhōng bù kě yòng ， tuì ér lùn shū cè ， yǐ shū qí fèn ， sī chuí kōng wén yǐ zì jiàn 。"
       },
       {
        "text": "仆窃不逊，近自托于无能之辞，网罗天下放失旧闻，略考其行事，综其终始，稽其成败兴坏之纪。",
        "pinyin": "pú qiè bú xùn ， jìn zì tuō yú wú néng zhī cí ， wǎng luó tiān xià fàng shī jiù wén ， lüè kǎo qí xíng shì ， zōng qí zhōng shǐ ， jī qí chéng bài xìng huài zhī jì 。"
       },
       {
        "text": "上计轩辕，下至于兹，为十表，本纪十二，书八章，世家三十，列传七十，凡百三十篇。",
        "pinyin": "shàng jì xuān yuán ， xià zhì yú zī ， wèi shí biǎo ， běn jì shí èr ， shū bā zhāng ， shì jiā sān shí ， liè zhuàn qī shí ， fán bǎi sān shí piān 。"
       },
       {
        "text": "亦欲以究天人之际，通古今之变，成一家之言。",
        "pinyin": "yì yù yǐ jiū tiān rén zhī jì ， tōng gǔ jīn zhī biàn ， chéng yì jiā zhī yán 。"
       },
       {
        "text": "草创未就，会遭此祸，惜其不成，是以就极刑而无愠色。",
        "pinyin": "cǎo chuàng wèi jiù ， huì zāo cǐ huò ， xī qí bù chéng ， shì yǐ jiù jí xíng ér wú yùn sè 。"
       },
       {
        "text": "仆诚以著此书，藏之名山，传之其人，通邑大都，则仆偿前辱之责，虽万被戮，岂有悔哉！",
        "pinyin": "pú chéng yǐ zhù cǐ shū ， cáng zhī míng shān ， chuán zhī qí rén ， tōng yì dà dōu ， zé pú cháng qián rǔ zhī zé ， suī wàn bèi lù ， qǐ yǒu huǐ zāi ！"
       },
       {
        "text": "然此可为智者道，难为俗人言也！",
        "pinyin": "rán cǐ kě wèi zhì zhě dào ， nán wéi sú rén yán yě ！"
       },
       {
        "text": "且负下未易居，下流多谤议。",
        "pinyin": "qiě fù xià wèi yì jū ， xià liú duō bàng yì 。"
       },
       {
        "text": "仆以口语遇遭此祸，重为乡党戮笑，以污辱先人，亦何面目复上父母之丘墓乎？",
        "pinyin": "pú yǐ kǒu yǔ yù zāo cǐ huò ， zhòng wèi xiāng dǎng lù xiào ， yǐ wū rǔ xiān rén ， yì hé miàn mù fù shàng fù mǔ zhī qiū mù hū ？"
       },
       {
        "text": "虽累百世，垢弥甚耳！",
        "pinyin": "suī lèi bǎi shì ， gòu mí shèn ěr ！"
       },
       {
        "text": "是以肠一日而九回，居则忽忽若有所亡，出则不知其所往。",
        "pinyin": "shì yǐ cháng yí rì ér jiǔ huí ， jū zé hū hū ruò yǒu suǒ wáng ， chū zé bù zhī qí suǒ wǎng 。"
       },
       {
        "text": "每念斯耻，汗未尝不发背沾衣也！",
        "pinyin": "měi niàn sī chǐ ， hàn wèi cháng bù fā bèi zhān yī yě ！"
       },
       {
        "text": "身直为闺阁之臣，宁得自引深藏于岩穴邪？",
        "pinyin": "shēn zhí wèi guī gé zhī chén ， níng dé zì yǐn shēn cáng yú yán xué xié ？"
       },
       {
        "text": "故且从俗浮沉，与时俯仰，以通其狂惑。",
        "pinyin": "gù qiě cóng sú fú chén ， yǔ shí fǔ yǎng ， yǐ tōng qí kuáng huò 。"
       },
       {
        "text": "今少卿乃教以推贤进士，无乃与仆私心剌谬乎？",
        "pinyin": "jīn shǎo qīng nǎi jiào yǐ tuī xián jìn shì ， wú nǎi yǔ pú sī xīn là miù hū ？"
       },
       {
        "text": "今虽欲自雕琢，曼辞以自饰，无益，于俗不信，适足取辱耳。",
        "pinyin": "jīn suī yù zì diāo zhuó ， màn cí yǐ zì shì ， wú yì ， yú sú bú xìn ， shì zú qǔ rǔ ěr 。"
       },
       {
        "text": "要之，死日然后是非乃定。",
        "pinyin": "yào zhī ， sǐ rì rán hòu shì fēi nǎi dìng 。"
       },
       {
        "text": "书不能悉意，故略陈固陋。",
        "pinyin": "shū bù néng xī yì ， gù lüè chén gù lòu 。"
       },
       {
        "text": "谨再拜。",
        "pinyin": "jǐn zài bài 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-xiaoyaoyoujiexuan",
      "title": "逍遥游（节选）",
      "author": "《庄子》",
      "dynasty": "苏教版",
      "grade": "高中语文必修五",
      "sentences": [
       {
        "text": "北冥有鱼，其名为鲲。",
        "pinyin": "běi míng yǒu yú ， qí míng wèi kūn 。"
       },
       {
        "text": "鲲之大，不知其几千里也；",
        "pinyin": "kūn zhī dà ， bù zhī qí jǐ qiān lǐ yě ；"
       },
       {
        "text": "化而为鸟，其名为鹏。",
        "pinyin": "huà ér wèi niǎo ， qí míng wèi péng 。"
       },
       {
        "text": "鹏之背，不知其几千里也；",
        "pinyin": "péng zhī bèi ， bù zhī qí jǐ qiān lǐ yě ；"
       },
       {
        "text": "怒而飞，其翼若垂天之云。",
        "pinyin": "nù ér fēi ， qí yì ruò chuí tiān zhī yún 。"
       },
       {
        "text": "是鸟也，海运则将徙于南冥。",
        "pinyin": "shì niǎo yě ， hǎi yùn zé jiāng xǐ yú nán míng 。"
       },
       {
        "text": "南冥者，天池也。",
        "pinyin": "nán míng zhě ， tiān chí yě 。"
       },
       {
        "text": "《齐谐》者，志怪者也。",
        "pinyin": "《 qí xié 》 zhě ， zhì guài zhě yě 。"
       },
       {
        "text": "《谐》之言曰：“鹏之徙于南冥也，水击三千里，抟扶摇而上者九万里，去以六月息者也。",
        "pinyin": "《 xié 》 zhī yán yuē ：“ péng zhī xǐ yú nán míng yě ， shuǐ jī sān qiān lǐ ， tuán fú yáo ér shàng zhě jiǔ wàn lǐ ， qù yǐ liù yuè xī zhě yě 。"
       },
       {
        "text": "”野马也，尘埃也，生物之以息相吹也。",
        "pinyin": "” yě mǎ yě ， chén āi yě ， shēng wù zhī yǐ xī xiāng chuī yě 。"
       },
       {
        "text": "天之苍苍，其正色邪？",
        "pinyin": "tiān zhī cāng cāng ， qí zhèng sè xié ？"
       },
       {
        "text": "其远而无所至极邪？",
        "pinyin": "qí yuǎn ér wú suǒ zhì jí xié ？"
       },
       {
        "text": "其视下也，亦若是则已矣。",
        "pinyin": "qí shì xià yě ， yì ruò shì zé yǐ yǐ 。"
       },
       {
        "text": "且夫水之积也不厚，则其负大舟也无力。",
        "pinyin": "qiě fū shuǐ zhī jī yě bú hòu ， zé qí fù dà zhōu yě wú lì 。"
       },
       {
        "text": "覆杯水于坳堂之上，则芥为之舟；",
        "pinyin": "fù bēi shuǐ yú ào táng zhī shàng ， zé jiè wèi zhī zhōu ；"
       },
       {
        "text": "置杯焉则胶，水浅而舟大也。",
        "pinyin": "zhì bēi yān zé jiāo ， shuǐ qiǎn ér zhōu dà yě 。"
       },
       {
        "text": "风之积也不厚，则其负大翼也无力。",
        "pinyin": "fēng zhī jī yě bú hòu ， zé qí fù dà yì yě wú lì 。"
       },
       {
        "text": "故九万里，则风斯在下矣，而后乃今培风；",
        "pinyin": "gù jiǔ wàn lǐ ， zé fēng sī zài xià yǐ ， ér hòu nǎi jīn péi fēng ；"
       },
       {
        "text": "背负青天，而莫之夭阏者，而后乃今将图南。",
        "pinyin": "bēi fù qīng tiān ， ér mò zhī yāo è zhě ， ér hòu nǎi jīn jiāng tú nán 。"
       },
       {
        "text": "蜩与学鸠笑之曰：“我决起而飞，抢榆枋而止，时则不至，而控于地而已矣，奚以之九万里而南为？",
        "pinyin": "tiáo yǔ xué jiū xiào zhī yuē ：“ wǒ jué qǐ ér fēi ， qiǎng yú fāng ér zhǐ ， shí zé bú zhì ， ér kòng yú dì ér yǐ yǐ ， xī yǐ zhī jiǔ wàn lǐ ér nán wèi ？"
       },
       {
        "text": "”适莽苍者，三餐而反，腹犹果然；",
        "pinyin": "” shì mǎng cāng zhě ， sān cān ér fǎn ， fù yóu guǒ rán ；"
       },
       {
        "text": "适百里者，宿舂粮；",
        "pinyin": "shì bǎi lǐ zhě ， sù chōng liáng ；"
       },
       {
        "text": "适千里者，三月聚粮。",
        "pinyin": "shì qiān lǐ zhě ， sān yuè jù liáng 。"
       },
       {
        "text": "之二虫又何知！",
        "pinyin": "zhī èr chóng yòu hé zhī ！"
       },
       {
        "text": "小知不及大知，小年不及大年。",
        "pinyin": "xiǎo zhī bù jí dà zhī ， xiǎo nián bù jí dà nián 。"
       },
       {
        "text": "奚以知其然也？",
        "pinyin": "xī yǐ zhī qí rán yě ？"
       },
       {
        "text": "朝菌不知晦朔，蟪蛄不知春秋，此小年也。",
        "pinyin": "cháo jūn bù zhī huì shuò ， huì gū bù zhī chūn qiū ， cǐ xiǎo nián yě 。"
       },
       {
        "text": "楚之南有冥灵者，以五百岁为春，五百岁为秋；",
        "pinyin": "chǔ zhī nán yǒu míng líng zhě ， yǐ wǔ bǎi suì wèi chūn ， wǔ bǎi suì wèi qiū ；"
       },
       {
        "text": "上古有大椿者，以八千岁为春，八千岁为秋。",
        "pinyin": "shàng gǔ yǒu dà chūn zhě ， yǐ bā qiān suì wèi chūn ， bā qiān suì wèi qiū 。"
       },
       {
        "text": "而彭祖乃今以久特闻，众人匹之，不亦悲乎！",
        "pinyin": "ér péng zǔ nǎi jīn yǐ jiǔ tè wén ， zhòng rén pǐ zhī ， bú yì bēi hū ！"
       },
       {
        "text": "汤之问棘也是已：穷发之北，有冥海者，天池也。",
        "pinyin": "tāng zhī wèn jí yě shì yǐ ： qióng fā zhī běi ， yǒu míng hǎi zhě ， tiān chí yě 。"
       },
       {
        "text": "有鱼焉，其广数千里，未有知其修者，其名为鲲。",
        "pinyin": "yǒu yú yān ， qí guǎng shù qiān lǐ ， wèi yǒu zhī qí xiū zhě ， qí míng wèi kūn 。"
       },
       {
        "text": "有鸟焉，其名为鹏，背若泰山，翼若垂天之云；",
        "pinyin": "yǒu niǎo yān ， qí míng wèi péng ， bèi ruò tài shān ， yì ruò chuí tiān zhī yún ；"
       },
       {
        "text": "抟扶摇羊角而上者九万里，绝云气，负青天，然后图南，且适南冥也。",
        "pinyin": "tuán fú yáo yáng jiǎo ér shàng zhě jiǔ wàn lǐ ， jué yún qì ， fù qīng tiān ， rán hòu tú nán ， qiě shì nán míng yě 。"
       },
       {
        "text": "斥鴳笑之曰：“彼且奚适也？",
        "pinyin": "chì yàn xiào zhī yuē ：“ bǐ qiě xī shì yě ？"
       },
       {
        "text": "我腾跃而上，不过数仞而下，翱翔蓬蒿之间，此亦飞之至也。",
        "pinyin": "wǒ téng yuè ér shàng ， bú guò shù rèn ér xià ， áo xiáng péng hāo zhī jiān ， cǐ yì fēi zhī zhì yě 。"
       },
       {
        "text": "而彼且奚适也？",
        "pinyin": "ér bǐ qiě xī shì yě ？"
       },
       {
        "text": "”此小大之辩也。",
        "pinyin": "” cǐ xiǎo dà zhī biàn yě 。"
       },
       {
        "text": "故夫知效一官，行比一乡，德合一君，而征一国者，其自视也，亦若此矣。",
        "pinyin": "gù fū zhī xiào yì guān ， xíng bǐ yì xiāng ， dé hé yī jūn ， ér zhēng yì guó zhě ， qí zì shì yě ， yì ruò cǐ yǐ 。"
       },
       {
        "text": "而宋荣子犹然笑之。",
        "pinyin": "ér sòng róng zǐ yóu rán xiào zhī 。"
       },
       {
        "text": "且举世誉之而不加劝，举世非之而不加沮，定乎内外之分，辩乎荣辱之境，斯已矣。",
        "pinyin": "qiě jǔ shì yù zhī ér bù jiā quàn ， jǔ shì fēi zhī ér bù jiā jǔ ， dìng hū nèi wài zhī fēn ， biàn hū róng rǔ zhī jìng ， sī yǐ yǐ 。"
       },
       {
        "text": "彼其于世，未数数然也。",
        "pinyin": "bǐ qí yú shì ， wèi shuò shuò rán yě 。"
       },
       {
        "text": "虽然，犹有未树也。",
        "pinyin": "suī rán ， yóu yǒu wèi shù yě 。"
       },
       {
        "text": "夫列子御风而行，泠然善也，旬有五日而后反。",
        "pinyin": "fū liè zǐ yù fēng ér xíng ， líng rán shàn yě ， xún yǒu wǔ rì ér hòu fǎn 。"
       },
       {
        "text": "彼于致福者，未数数然也。",
        "pinyin": "bǐ yú zhì fú zhě ， wèi shuò shuò rán yě 。"
       },
       {
        "text": "此虽免乎行，犹有所待者也。",
        "pinyin": "cǐ suī miǎn hū xíng ， yóu yǒu suǒ dài zhě yě 。"
       },
       {
        "text": "若夫乘天地之正，而御六气之辩，以游无穷者，彼且恶乎待哉？",
        "pinyin": "ruò fū chéng tiān dì zhī zhèng ， ér yù liù qì zhī biàn ， yǐ yóu wú qióng zhě ， bǐ qiě è hū dài zāi ？"
       },
       {
        "text": "故曰：至人无己，神人无功，圣人无名。",
        "pinyin": "gù yuē ： zhì rén wú jǐ ， shén rén wú gōng ， shèng rén wú míng 。"
       },
       {
        "text": "惠子谓庄子曰：“魏王贻我大瓠之种，我树之成而实五石。",
        "pinyin": "huì zǐ wèi zhuāng zǐ yuē ：“ wèi wáng yí wǒ dà hù zhī zhǒng ， wǒ shù zhī chéng ér shí wǔ shí 。"
       },
       {
        "text": "以盛水浆，其坚不能自举也。",
        "pinyin": "yǐ shèng shuǐ jiāng ， qí jiān bù néng zì jǔ yě 。"
       },
       {
        "text": "剖之以为瓢，则瓠落无所容。",
        "pinyin": "pōu zhī yǐ wéi piáo ， zé hù luò wú suǒ róng 。"
       },
       {
        "text": "非不呺然大也，吾为其无用而掊之。",
        "pinyin": "fēi bù háo rán dà yě ， wú wèi qí wú yòng ér póu zhī 。"
       },
       {
        "text": "”庄子曰：“夫子固拙于用大矣。",
        "pinyin": "” zhuāng zǐ yuē ：“ fū zǐ gù zhuō yú yòng dà yǐ 。"
       },
       {
        "text": "宋人有善为不龟手之药者，世世以洴澼絖为事。",
        "pinyin": "sòng rén yǒu shàn wèi bù guī shǒu zhī yào zhě ， shì shì yǐ píng pì kuàng wèi shì 。"
       },
       {
        "text": "客闻之，请买其方百金。",
        "pinyin": "kè wén zhī ， qǐng mǎi qí fāng bǎi jīn 。"
       },
       {
        "text": "聚族而谋曰：‘我世世为洴澼絖，不过数金；",
        "pinyin": "jù zú ér móu yuē ：‘ wǒ shì shì wèi píng pì kuàng ， bú guò shù jīn ；"
       },
       {
        "text": "今一朝而鬻技百金，请与之。",
        "pinyin": "jīn yì cháo ér yù jì bǎi jīn ， qǐng yǔ zhī 。"
       },
       {
        "text": "’客得之，以说吴王。",
        "pinyin": "’ kè dé zhī ， yǐ shuō wú wáng 。"
       },
       {
        "text": "越有难，吴王使之将，冬与越人水战，大败越人，裂地而封之。",
        "pinyin": "yuè yǒu nán ， wú wáng shǐ zhī jiāng ， dōng yǔ yuè rén shuǐ zhàn ， dà bài yuè rén ， liè dì ér fēng zhī 。"
       },
       {
        "text": "能不龟手一也，或以封，或不免于洴澼絖，则所用之异也。",
        "pinyin": "néng bù guī shǒu yī yě ， huò yǐ fēng ， huò bù miǎn yú píng pì kuàng ， zé suǒ yòng zhī yì yě 。"
       },
       {
        "text": "今子有五石之瓠，何不虑以为大樽而浮乎江湖，而忧其瓠落无所容？",
        "pinyin": "jīn zǐ yǒu wǔ shí zhī hù ， hé bú lǜ yǐ wéi dà zūn ér fú hū jiāng hú ， ér yōu qí hù luò wú suǒ róng ？"
       },
       {
        "text": "则夫子犹有蓬之心也夫！",
        "pinyin": "zé fū zǐ yóu yǒu péng zhī xīn yě fū ！"
       },
       {
        "text": "惠子谓庄子曰：“吾有大树，人谓之樗。",
        "pinyin": "huì zǐ wèi zhuāng zǐ yuē ：“ wú yǒu dà shù ， rén wèi zhī chū 。"
       },
       {
        "text": "其大本拥肿而不中绳墨，其小枝卷曲而不中规矩。",
        "pinyin": "qí dà běn yōng zhǒng ér bù zhōng shéng mò ， qí xiǎo zhī juǎn qū ér bù zhōng guī jǔ 。"
       },
       {
        "text": "立之涂，匠者不顾。",
        "pinyin": "lì zhī tú ， jiàng zhě bú gù 。"
       },
       {
        "text": "今子之言，大而无用，众所同去也。",
        "pinyin": "jīn zǐ zhī yán ， dà ér wú yòng ， zhòng suǒ tóng qù yě 。"
       },
       {
        "text": "”庄子曰：“子独不见狸狌乎？",
        "pinyin": "” zhuāng zǐ yuē ：“ zǐ dú bú jiàn lí xīng hū ？"
       },
       {
        "text": "卑身而伏，以候敖者；",
        "pinyin": "bēi shēn ér fú ， yǐ hòu áo zhě ；"
       },
       {
        "text": "东西跳梁，不辟高下；",
        "pinyin": "dōng xī tiào liáng ， bú pì gāo xià ；"
       },
       {
        "text": "中于机辟，死于罔罟。",
        "pinyin": "zhōng yú jī pì ， sǐ yú wǎng gǔ 。"
       },
       {
        "text": "今夫斄牛，其大若垂天之云。",
        "pinyin": "jīn fū lí niú ， qí dà ruò chuí tiān zhī yún 。"
       },
       {
        "text": "此能为大矣，而不能执鼠。",
        "pinyin": "cǐ néng wèi dà yǐ ， ér bù néng zhí shǔ 。"
       },
       {
        "text": "今子有大树，患其无用，何不树之于无何有之乡，广莫之野，彷徨乎无为其侧，逍遥乎寝卧其下。",
        "pinyin": "jīn zǐ yǒu dà shù ， huàn qí wú yòng ， hé bú shù zhī yú wú hé yǒu zhī xiāng ， guǎng mò zhī yě ， páng huáng hū wú wéi qí cè ， xiāo yáo hū qǐn wò qí xià 。"
       },
       {
        "text": "不夭斤斧，物无害者，无所可用，安所困苦哉！",
        "pinyin": "bù yāo jīn fǔ ， wù wú hài zhě ， wú suǒ kě yòng ， ān suǒ kùn kǔ zāi ！"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-lantingjixu",
      "title": "兰亭集序",
      "author": "王羲之",
      "dynasty": "苏教版",
      "grade": "高中语文必修五",
      "sentences": [
       {
        "text": "永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。",
        "pinyin": "yǒng hé jiǔ nián ， suì zài guǐ chǒu ， mù chūn zhī chū ， huì yú huì jī shān yīn zhī lán tíng ， xiū xì shì yě 。"
       },
       {
        "text": "群贤毕至，少长咸集。",
        "pinyin": "qún xián bì zhì ， shǎo cháng xián jí 。"
       },
       {
        "text": "此地有崇山峻岭，茂林修竹，又有清流激湍，映带左右，引以为流觞曲水，列坐其次。",
        "pinyin": "cǐ dì yǒu chóng shān jùn lǐng ， mào lín xiū zhú ， yòu yǒu qīng liú jī tuān ， yìng dài zuǒ yòu ， yǐn yǐ wéi liú shāng qū shuǐ ， liè zuò qí cì 。"
       },
       {
        "text": "虽无丝竹管弦之盛，一觞一咏，亦足以畅叙幽情。",
        "pinyin": "suī wú sī zhú guǎn xián zhī shèng ， yì shāng yì yǒng ， yì zú yǐ chàng xù yōu qíng 。"
       },
       {
        "text": "是日也，天朗气清，惠风和畅。",
        "pinyin": "shì rì yě ， tiān lǎng qì qīng ， huì fēng hé chàng 。"
       },
       {
        "text": "仰观宇宙之大，俯察品类之盛，所以游目骋怀，足以极视听之娱，信可乐也。",
        "pinyin": "yǎng guān yǔ zhòu zhī dà ， fǔ chá pǐn lèi zhī shèng ， suǒ yǐ yóu mù chěng huái ， zú yǐ jí shì tīng zhī yú ， xìn kě lè yě 。"
       },
       {
        "text": "夫人之相与，俯仰一世。",
        "pinyin": "fū rén zhī xiāng yǔ ， fǔ yǎng yí shì 。"
       },
       {
        "text": "或取诸怀抱，悟言一室之内；",
        "pinyin": "huò qǔ zhū huái bào ， wù yán yí shì zhī nèi ；"
       },
       {
        "text": "或因寄所托，放浪形骸之外。",
        "pinyin": "huò yīn jì suǒ tuō ， fàng làng xíng hái zhī wài 。"
       },
       {
        "text": "虽趣舍万殊，静躁不同，当其欣于所遇，暂得于己，快然自足，不知老之将至；",
        "pinyin": "suī qù shè wàn shū ， jìng zào bù tóng ， dāng qí xīn yú suǒ yù ， zàn dé yú jǐ ， kuài rán zì zú ， bù zhī lǎo zhī jiāng zhì ；"
       },
       {
        "text": "及其所之既倦，情随事迁，感慨系之矣。",
        "pinyin": "jí qí suǒ zhī jì juàn ， qíng suí shì qiān ， gǎn kǎi xì zhī yǐ 。"
       },
       {
        "text": "向之所欣，俯仰之间，已为陈迹，犹不能不以之兴怀，况修短随化，终期于尽！",
        "pinyin": "xiàng zhī suǒ xīn ， fǔ yǎng zhī jiān ， yǐ wèi chén jì ， yóu bù néng bù yǐ zhī xīng huái ， kuàng xiū duǎn suí huà ， zhōng qī yú jìn ！"
       },
       {
        "text": "古人云：“死生亦大矣。",
        "pinyin": "gǔ rén yún ：“ sǐ shēng yì dà yǐ 。"
       },
       {
        "text": "”岂不痛哉！",
        "pinyin": "” qǐ bú tòng zāi ！"
       },
       {
        "text": "每览昔人兴感之由，若合一契，未尝不临文嗟悼，不能喻之于怀。",
        "pinyin": "měi lǎn xī rén xīng gǎn zhī yóu ， ruò hé yī qì ， wèi cháng bù lín wén jiē dào ， bù néng yù zhī yú huái 。"
       },
       {
        "text": "固知一死生为虚诞，齐彭殇为妄作。",
        "pinyin": "gù zhī yì sǐ shēng wèi xū dàn ， qí péng shāng wèi wàng zuò 。"
       },
       {
        "text": "后之视今，亦犹今之视昔，悲夫！",
        "pinyin": "hòu zhī shì jīn ， yì yóu jīn zhī shì xī ， bēi fū ！"
       },
       {
        "text": "故列叙时人，录其所述，虽世殊事异，所以兴怀，其致一也。",
        "pinyin": "gù liè xù shí rén ， lù qí suǒ shù ， suī shì shū shì yì ， suǒ yǐ xīng huái ， qí zhì yī yě 。"
       },
       {
        "text": "后之览者，亦将有感于斯文。",
        "pinyin": "hòu zhī lǎn zhě ， yì jiāng yǒu gǎn yú sī wén 。"
       }
      ],
      "comment": ""
     },
     {
      "id": "sj-tengwanggexubingshi",
      "title": "滕王阁序并诗",
      "author": "王勃",
      "dynasty": "苏教版",
      "grade": "高中语文必修五",
      "sentences": [
       {
        "text": "豫章故郡，洪都新府。",
        "pinyin": "yù zhāng gù jùn ， hóng dōu xīn fǔ 。"
       },
       {
        "text": "星分翼轸，地接衡庐。",
        "pinyin": "xīng fēn yì zhěn ， dì jiē héng lú 。"
       },
       {
        "text": "襟三江而带五湖，控蛮荆而引瓯越。",
        "pinyin": "jīn sān jiāng ér dài wǔ hú ， kòng mán jīng ér yǐn ōu yuè 。"
       },
       {
        "text": "物华天宝，龙光射牛斗之墟；",
        "pinyin": "wù huá tiān bǎo ， lóng guāng shè niú dòu zhī xū ；"
       },
       {
        "text": "人杰地灵，徐孺下陈蕃之榻。",
        "pinyin": "rén jié dì líng ， xú rú xià chén fān zhī tà 。"
       },
       {
        "text": "雄州雾列，俊采星驰。",
        "pinyin": "xióng zhōu wù liè ， jùn cǎi xīng chí 。"
       },
       {
        "text": "台隍枕夷夏之交，宾主尽东南之美。",
        "pinyin": "tái huáng zhěn yí xià zhī jiāo ， bīn zhǔ jìn dōng nán zhī měi 。"
       },
       {
        "text": "都督阎公之雅望，棨戟遥临；",
        "pinyin": "dū du yán gōng zhī yǎ wàng ， qǐ jǐ yáo lín ；"
       },
       {
        "text": "宇文新州之懿范，襜帷暂驻。",
        "pinyin": "yǔ wén xīn zhōu zhī yì fàn ， chān wéi zàn zhù 。"
       },
       {
        "text": "十旬休假，胜友如云；",
        "pinyin": "shí xún xiū jià ， shèng yǒu rú yún ；"
       },
       {
        "text": "千里逢迎，高朋满座。",
        "pinyin": "qiān lǐ féng yíng ， gāo péng mǎn zuò 。"
       },
       {
        "text": "腾蛟起凤，孟学士之词宗；",
        "pinyin": "téng jiāo qǐ fèng ， mèng xué shì zhī cí zōng ；"
       },
       {
        "text": "紫电青霜，王将军之武库。",
        "pinyin": "zǐ diàn qīng shuāng ， wáng jiāng jūn zhī wǔ kù 。"
       },
       {
        "text": "家君作宰，路出名区；",
        "pinyin": "jiā jūn zuò zǎi ， lù chū míng qū ；"
       },
       {
        "text": "童子何知，躬逢胜饯。",
        "pinyin": "tóng zǐ hé zhī ， gōng féng shèng jiàn 。"
       },
       {
        "text": "时维九月，序属三秋。",
        "pinyin": "shí wéi jiǔ yuè ， xù shǔ sān qiū 。"
       },
       {
        "text": "潦水尽而寒潭清，烟光凝而暮山紫。",
        "pinyin": "liáo shuǐ jìn ér hán tán qīng ， yān guāng níng ér mù shān zǐ 。"
       },
       {
        "text": "俨骖騑于上路，访风景于崇阿。",
        "pinyin": "yǎn cān fēi yú shàng lù ， fǎng fēng jǐng yú chóng ā 。"
       },
       {
        "text": "临帝子之长洲，得天人之旧馆。",
        "pinyin": "lín dì zǐ zhī cháng zhōu ， dé tiān rén zhī jiù guǎn 。"
       },
       {
        "text": "层峦耸翠，上出重霄；",
        "pinyin": "céng luán sǒng cuì ， shàng chū zhòng xiāo ；"
       },
       {
        "text": "飞阁流丹，下临无地。",
        "pinyin": "fēi gé liú dān ， xià lín wú dì 。"
       },
       {
        "text": "鹤汀凫渚，穷岛屿之萦回；",
        "pinyin": "hè tīng fú zhǔ ， qióng dǎo yǔ zhī yíng huí ；"
       },
       {
        "text": "桂殿兰宫，即冈峦之体势。",
        "pinyin": "guì diàn lán gōng ， jí gāng luán zhī tǐ shì 。"
       },
       {
        "text": "披绣闼，俯雕甍，山原旷其盈视，川泽纡其骇瞩。",
        "pinyin": "pī xiù tà ， fǔ diāo méng ， shān yuán kuàng qí yíng shì ， chuān zé yū qí hài zhǔ 。"
       },
       {
        "text": "闾阎扑地，舸舰弥津；",
        "pinyin": "lǘ yán pū dì ， gě jiàn mí jīn ；"
       },
       {
        "text": "云销雨霁，彩彻区明。",
        "pinyin": "yún xiāo yǔ jì ， cǎi chè qū míng 。"
       },
       {
        "text": "落霞与孤鹜齐飞，秋水共长天一色。",
        "pinyin": "luò xiá yǔ gū wù qí fēi ， qiū shuǐ gòng cháng tiān yí sè 。"
       },
       {
        "text": "渔舟唱晚，响穷彭蠡之滨；",
        "pinyin": "yú zhōu chàng wǎn ， xiǎng qióng péng lí zhī bīn ；"
       },
       {
        "text": "雁阵惊寒，声断衡阳之浦。",
        "pinyin": "yàn zhèn jīng hán ， shēng duàn héng yáng zhī pǔ 。"
       },
       {
        "text": "遥襟甫畅，逸兴遄飞。",
        "pinyin": "yáo jīn fǔ chàng ， yì xìng chuán fēi 。"
       },
       {
        "text": "爽籁发而清风生，纤歌凝而白云遏。",
        "pinyin": "shuǎng lài fā ér qīng fēng shēng ， xiān gē níng ér bái yún è 。"
       },
       {
        "text": "睢园绿竹，气凌彭泽之樽；",
        "pinyin": "suī yuán lǜ zhú ， qì líng péng zé zhī zūn ；"
       },
       {
        "text": "邺水朱华，光照临川之笔。",
        "pinyin": "yè shuǐ zhū huá ， guāng zhào lín chuān zhī bǐ 。"
       },
       {
        "text": "四美具，二难并。",
        "pinyin": "sì měi jù ， èr nán bìng 。"
       },
       {
        "text": "穷睇眄于中天，极娱游于暇日。",
        "pinyin": "qióng dì miǎn yú zhōng tiān ， jí yú yóu yú xiá rì 。"
       },
       {
        "text": "天高地迥，觉宇宙之无穷；",
        "pinyin": "tiān gāo dì jiǒng ， jué yǔ zhòu zhī wú qióng ；"
       },
       {
        "text": "兴尽悲来，识盈虚之有数。",
        "pinyin": "xīng jìn bēi lái ， shí yíng xū zhī yǒu shù 。"
       },
       {
        "text": "望长安于日下，目吴会于云间。",
        "pinyin": "wàng cháng ān yú rì xià ， mù wú huì yú yún jiān 。"
       },
       {
        "text": "地势极而南溟深，天柱高而北辰远。",
        "pinyin": "dì shì jí ér nán míng shēn ， tiān zhù gāo ér běi chén yuǎn 。"
       },
       {
        "text": "关山难越，谁悲失路之人；",
        "pinyin": "guān shān nán yuè ， shuí bēi shī lù zhī rén ；"
       },
       {
        "text": "萍水相逢，尽是他乡之客。",
        "pinyin": "píng shuǐ xiāng féng ， jìn shì tā xiāng zhī kè 。"
       },
       {
        "text": "怀帝阍而不见，奉宣室以何年？",
        "pinyin": "huái dì hūn ér bú jiàn ， fèng xuān shì yǐ hé nián ？"
       },
       {
        "text": "嗟乎！",
        "pinyin": "jiē hū ！"
       },
       {
        "text": "时运不齐，命途多舛。",
        "pinyin": "shí yùn bù qí ， mìng tú duō chuǎn 。"
       },
       {
        "text": "冯唐易老，李广难封。",
        "pinyin": "féng táng yì lǎo ， lǐ guǎng nán fēng 。"
       },
       {
        "text": "屈贾谊于长沙，非无圣主；",
        "pinyin": "qū jiǎ yì yú cháng shā ， fēi wú shèng zhǔ ；"
       },
       {
        "text": "窜梁鸿于海曲，岂乏明时？",
        "pinyin": "cuàn liáng hóng yú hǎi qǔ ， qǐ fá míng shí ？"
       },
       {
        "text": "所赖君子见机，达人知命。",
        "pinyin": "suǒ lài jūn zǐ jiàn jī ， dá rén zhī mìng 。"
       },
       {
        "text": "老当益壮，宁移白首之心？",
        "pinyin": "lǎo dāng yì zhuàng ， níng yí bái shǒu zhī xīn ？"
       },
       {
        "text": "穷且益坚，不坠青云之志。",
        "pinyin": "qióng qiě yì jiān ， bú zhuì qīng yún zhī zhì 。"
       },
       {
        "text": "酌贪泉而觉爽，处涸辙以犹欢。",
        "pinyin": "zhuó tān quán ér jué shuǎng ， chù hé zhé yǐ yóu huān 。"
       },
       {
        "text": "北海虽赊，扶摇可接；",
        "pinyin": "běi hǎi suī shē ， fú yáo kě jiē ；"
       },
       {
        "text": "东隅已逝，桑榆非晚。",
        "pinyin": "dōng yú yǐ shì ， sāng yú fēi wǎn 。"
       },
       {
        "text": "孟尝高洁，空余报国之情；",
        "pinyin": "mèng cháng gāo jié ， kòng yú bào guó zhī qíng ；"
       },
       {
        "text": "阮籍猖狂，岂效穷途之哭！",
        "pinyin": "ruǎn jí chāng kuáng ， qǐ xiào qióng tú zhī kū ！"
       },
       {
        "text": "勃，三尺微命，一介书生。",
        "pinyin": "bó ， sān chǐ wēi mìng ， yí jiè shū shēng 。"
       },
       {
        "text": "无路请缨，等终军之弱冠；",
        "pinyin": "wú lù qǐng yīng ， děng zhōng jūn zhī ruò guàn ；"
       },
       {
        "text": "有怀投笔，慕宗悫之长风。",
        "pinyin": "yǒu huái tóu bǐ ， mù zōng què zhī cháng fēng 。"
       },
       {
        "text": "舍簪笏于百龄，奉晨昏于万里。",
        "pinyin": "shè zān hù yú bǎi líng ， fèng chén hūn yú wàn lǐ 。"
       },
       {
        "text": "非谢家之宝树，接孟氏之芳邻。",
        "pinyin": "fēi xiè jiā zhī bǎo shù ， jiē mèng shì zhī fāng lín 。"
       },
       {
        "text": "他日趋庭，叨陪鲤对；",
        "pinyin": "tā rì qū tíng ， dāo péi lǐ duì ；"
       },
       {
        "text": "今兹捧袂，喜托龙门。",
        "pinyin": "jīn zī pěng mèi ， xǐ tuō lóng mén 。"
       },
       {
        "text": "杨意不逢，抚凌云而自惜；",
        "pinyin": "yáng yì bù féng ， fǔ líng yún ér zì xī ；"
       },
       {
        "text": "钟期既遇，奏流水以何惭？",
        "pinyin": "zhōng qī jì yù ， zòu liú shuǐ yǐ hé cán ？"
       },
       {
        "text": "呜呼！",
        "pinyin": "wū hū ！"
       },
       {
        "text": "胜地不常，盛筵难再；",
        "pinyin": "shèng dì bù cháng ， shèng yán nán zài ；"
       },
       {
        "text": "兰亭已矣，梓泽丘墟。",
        "pinyin": "lán tíng yǐ yǐ ， zǐ zé qiū xū 。"
       },
       {
        "text": "临别赠言，幸承恩于伟饯；",
        "pinyin": "lín bié zèng yán ， xìng chéng ēn yú wěi jiàn ；"
       },
       {
        "text": "登高作赋，是所望于群公。",
        "pinyin": "dēng gāo zuò fù ， shì suǒ wàng yú qún gōng 。"
       },
       {
        "text": "敢竭鄙怀，恭疏短引；",
        "pinyin": "gǎn jié bǐ huái ， gōng shū duǎn yǐn ；"
       },
       {
        "text": "一言均赋，四韵俱成。",
        "pinyin": "yì yán jūn fù ， sì yùn jù chéng 。"
       },
       {
        "text": "请洒潘江，各倾陆海云尔。",
        "pinyin": "qǐng sǎ pān jiāng ， gè qīng lù hǎi yún ěr 。"
       },
       {
        "text": "《滕王阁》",
        "pinyin": "《 téng wáng gé 》"
       },
       {
        "text": "滕王高阁临江渚，佩玉鸣鸾罢歌舞。",
        "pinyin": "téng wáng gāo gé lín jiāng zhǔ ， pèi yù míng luán bà gē wǔ 。"
       },
       {
        "text": "画栋朝飞南浦云，珠帘暮卷西山雨。",
        "pinyin": "huà dòng cháo fēi nán pǔ yún ， zhū lián mù juàn xī shān yǔ 。"
       },
       {
        "text": "闲云潭影日悠悠，物换星移几度秋。",
        "pinyin": "xián yún tán yǐng rì yōu yōu ， wù huàn xīng yí jǐ dù qiū 。"
       },
       {
        "text": "阁中帝子今何在？",
        "pinyin": "gé zhōng dì zǐ jīn hé zài ？"
       },
       {
        "text": "槛外长江空自流。",
        "pinyin": "kǎn wài zhǎng jiāng kōng zì liú 。"
       }
      ],
      "comment": ""
     }
    ]
   }
  ]
 }
]
