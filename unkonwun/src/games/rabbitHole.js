const deck = [
  { id: "hA", suit: "heart", rank: "A", color: "red" },
  { id: "sK", suit: "spade", rank: "K", color: "black" },
  { id: "d7", suit: "diamond", rank: "7", color: "red" },
  { id: "c3", suit: "club", rank: "3", color: "black" },
  { id: "joker", suit: "joker", rank: "JOKER", color: "black" },
  { id: "h5", suit: "heart", rank: "5", color: "red" },
  { id: "s9", suit: "spade", rank: "9", color: "black" },
  { id: "dQ", suit: "diamond", rank: "Q", color: "red" }
];

const caseDef = {
  id: "rabbit",
  title: "坠入兔子洞",
  subtitle: "Every rule here is a trap.",
  tagline: "这座庄园的每一条规则，都在等你犯错。",
  intro:
    "你收到一张没有落款的邀请函。醒来时，你坐在一张长桌前，桌上摆着永远喝不完的茶。\n墙上挂着一只没有指针的钟。\n手机里多了一个联系人：柴郡猫。",
  cover: "cat",
  danger: "极高",
  start: "r1",
  dangerRegex: /(喝下|喝掉|吞下|砸碎镜子|顶撞王后|骂王后)/,
  keywords: [
    { test: /扑克|牌/, text: "牌背上有一层很薄的反光，像有人从背面看着你。" },
    { test: /猫|柴郡/, text: "空气里传来一声笑，但你找不到笑的来源。" },
    { test: /钟|时间/, text: "钟没有指针，却在你注视它的时候，轻轻响了一声。" },
    { test: /规则/, text: "墙上的规则一共七条，其中三条的字迹比另外四条新。" }
  ],
  nodes: {
    r1: {
      id: "r1",
      scene: "庄园 · 长桌",
      level: 1,
      image: "cat",
      text:
        "你在一张长桌前醒来。桌上摆着茶具，茶还是热的，可桌边一个人也没有。\n\n墙上贴着一张请柬：『三点，别迟到。』\n\n手机震了一下，屏幕亮起，联系人名叫「柴郡猫」。",
      phone: { from: "柴郡猫", text: "你醒了。先别喝任何东西。" },
      clue: { id: "c_invite", name: "没有落款的请柬", description: "请柬上只有一句：三点，别迟到。" },
      choices: [
        { text: "先看墙上的规则", to: "r2" },
        { text: "顺着走廊往里走", to: "r2" },
        { text: "对着空桌子问一句「有人吗」", to: "r1b" }
      ]
    },

    r1b: {
      id: "r1b",
      scene: "庄园 · 长桌",
      level: 2,
      text:
        "没有人回答。\n\n但你听见头顶传来很轻的一声笑，像是有人正倒挂在天花板上看你。\n\n茶杯里的水面晃了一下。",
      phone: { from: "柴郡猫", text: "我在。只是你还没学会往上看。" },
      clue: { id: "c_laugh", name: "头顶的笑声", description: "空无一人的房间里，头顶传来笑声。" },
      choices: [{ text: "往上看", to: "r2" }]
    },

    r2: {
      id: "r2",
      scene: "庄园 · 规则墙",
      level: 3,
      text:
        "墙上钉着一张纸，七条规则，字迹深浅不一：\n\n一、不要在午夜后回答敲门声。\n二、不要相信没有影子的客人。\n三、钟响三次时，不要回头。\n四、不要连续翻开两张同花色的牌。\n五、王后说的每一句话都是真的。\n六、王后说的每一句话都是假的。\n七、以上规则，至少有一条是假的。",
      clue: { id: "c_rules", name: "七条规则", description: "规则里同时存在『王后永远真』和『王后永远假』，第七条规定至少一条是假的。" },
      choices: [
        { text: "记住规则，去牌桌", to: "r3" },
        { text: "把规则纸撕下来带走", to: "r2b" },
        { text: "问柴郡猫哪几条是真的", to: "r2c" }
      ]
    },

    r2b: {
      id: "r2b",
      scene: "庄园 · 规则墙",
      level: 4,
      text:
        "你把纸撕下来的瞬间，走廊尽头的灯全灭了。\n\n再亮起来时，纸还在墙上，字迹变得更新了。\n\n最下面多了一行：『八、撕纸的人要留下来。』",
      clue: { id: "c_rule8", name: "多出来的第八条", description: "撕下规则纸后，墙上多了一条针对你的规则。" },
      choices: [{ text: "立刻离开这面墙", to: "r3" }]
    },

    r2c: {
      id: "r2c",
      scene: "庄园 · 规则墙",
      level: 4,
      text:
        "柴郡猫只回了三个字：『都别信。』\n\n然后又补了一句：『也别信这句。』\n\n你盯着屏幕，忽然意识到，这只猫从出现到现在，一次都没有站在地上。",
      phone: { from: "柴郡猫", text: "都别信。也别信这句。" },
      clue: { id: "c_cat_lie", name: "猫的悖论", description: "柴郡猫说『都别信』，又说『也别信这句』。" },
      choices: [{ text: "去牌桌", to: "r3" }]
    },

    r3: {
      id: "r3",
      scene: "庄园 · 牌桌",
      level: 5,
      text:
        "牌桌上摊着八张牌，背面朝上。\n\n庄家是个没有脸的人，他指了指桌上的字：『三局。翻对了，门开；翻错了，你留下。』\n\n手机又震了。",
      phone: { from: "柴郡猫", text: "第一局：找那张红桃 A。别翻错。" },
      clue: { id: "c_card_table", name: "三局牌", description: "必须连续翻对三张牌，才能打开门。" },
      ui: {
        type: "cards",
        deck,
        rounds: [
          { hint: "第一局：红桃 A", correct: "hA" },
          { hint: "第二局：没有影子的那一张", correct: "s9" },
          { hint: "第三局：它不属于任何一种花色", correct: "joker" }
        ],
        success: "r4",
        failEnding: "death1"
      },
      choices: [{ text: "先看看牌桌周围", to: "r3b" }]
    },

    r3b: {
      id: "r3b",
      scene: "庄园 · 牌桌",
      level: 6,
      text:
        "牌桌底下刻着一行小字：『第二局，别看红色。』\n\n你抬起头时，庄家已经把手伸到了牌堆上方。",
      clue: { id: "c_tip2", name: "桌下的提示", description: "第二局不要选红色花色。" },
      choices: [{ text: "回到牌桌", to: "r3" }]
    },

    r4: {
      id: "r4",
      scene: "庄园 · 门",
      level: 7,
      text:
        "最后一张牌翻过来时，整座庄园安静了。\n\n牌桌后面的墙裂开一道门缝，缝里有光。\n\n庄家把没有脸的头转过来：『你赢了。可门后面，是王后。』",
      phone: { from: "柴郡猫", text: "门开了。王后在等你，小心她的话。" },
      clue: { id: "c_door", name: "门后是王后", description: "赢了牌局，门后是红心王后的法庭。" },
      choices: [
        { text: "推门进去", to: "r5" },
        { text: "先在门口停一下", to: "r4b" }
      ]
    },

    r4b: {
      id: "r4b",
      scene: "庄园 · 门缝",
      level: 8,
      text:
        "你贴着门缝往里看。王后坐在高处，手里拿着一份名单，正在一个一个划掉名字。\n\n名单最后一行的名字，是你的。\n\n她划到了倒数第二个。",
      clue: { id: "c_list", name: "名单", description: "王后手里的名单，最后一行是玩家的名字。" },
      choices: [{ text: "进去", to: "r5" }]
    },

    r5: {
      id: "r5",
      scene: "法庭",
      level: 9,
      image: "mirror",
      text:
        "法庭是由镜子围成的。你走进去的时候，看见了几十个自己，每一个都在做不一样的动作。\n\n红心王后开口：『你偷看了牌。』\n\n她的声音很轻，像在念一句规则。",
      clue: { id: "c_queen", name: "镜子法庭", description: "法庭四周都是镜子，镜中的自己动作并不一致。" },
      choices: [
        { text: "承认看过牌，并引用规则", to: "r6" },
        { text: "反问：规则哪一条禁止看牌", to: "r6" },
        { text: "当众顶撞王后", to: "r5b", danger: "death2" }
      ]
    },

    r5b: {
      id: "r5b",
      scene: "法庭",
      level: 10,
      text: "王后只抬了一下手指。",
      choices: []
    },

    r6: {
      id: "r6",
      scene: "法庭",
      level: 11,
      text:
        "王后沉默了很久。\n\n『规则确实没写。』她说，『那就换一条。』\n\n她抬了抬手，镜子里的几十个你同时转过头来，看向同一个方向——走廊尽头那面最大的镜子。",
      phone: { from: "柴郡猫", text: "镜子里的你，不全是你的。跟着最小的那个走。" },
      clue: { id: "c_mirror", name: "镜子里的自己", description: "镜中的自己有动作不一致，柴郡猫说跟着最小的那个。" },
      choices: [
        { text: "走向最大的镜子", to: "r7" },
        { text: "寻找镜子里的『最小的自己』", to: "r7b" },
        { text: "砸碎镜子", to: "r6b", danger: "death2" }
      ]
    },

    r6b: {
      id: "r6b",
      scene: "法庭",
      level: 12,
      text: "镜子碎裂的声音像很多人同时笑了一下。",
      choices: []
    },

    r7: {
      id: "r7",
      scene: "镜廊",
      level: 13,
      text:
        "你走到最大的镜子前。镜子里的人比你慢半拍才抬手。\n\n镜面像水一样晃了晃，里面伸出一只手，手里捏着一张牌——小丑。",
      clue: { id: "c_joker", name: "镜中的小丑牌", description: "镜子里递出一张小丑牌。" },
      choices: [
        { text: "接过那张牌", to: "r8" },
        { text: "后退，不接", to: "r7b" }
      ]
    },

    r7b: {
      id: "r7b",
      scene: "镜廊",
      level: 13,
      text:
        "你后退了一步。镜中的手停在半空，然后慢慢收了回去，连带着镜子里的光一起暗了一格。\n\n走廊尽头传来疯帽匠的声音：『不接牌的人，得自己走回去。』",
      clue: { id: "c_hatter", name: "疯帽匠的声音", description: "走廊尽头有人在说话。" },
      choices: [{ text: "顺着声音走", to: "r8" }]
    },

    r8: {
      id: "r8",
      scene: "茶厅",
      level: 14,
      text:
        "疯帽匠坐在茶桌尽头，帽檐压得很低。他推过来一杯茶和一把钥匙。\n\n『茶是真的，钥匙也是真的。』\n\n他笑了一下：『但只有一样能带你出去。』",
      phone: { from: "柴郡猫", text: "茶会让人留下，钥匙会让人离开。选吧。" },
      clue: { id: "c_key", name: "茶与钥匙", description: "帽匠给出茶和钥匙，只有一样能离开。" },
      choices: [
        { text: "拿起钥匙", to: "r9" },
        { text: "喝下那杯茶", to: "r8b", danger: "death1" },
        { text: "两样都不要", to: "r9" }
      ]
    },

    r8b: {
      id: "r8b",
      scene: "茶厅",
      level: 15,
      text: "茶是甜的。甜得不像这个世界该有的东西。",
      choices: []
    },

    r9: {
      id: "r9",
      scene: "门厅",
      level: 16,
      text:
        "你拿着钥匙走到门厅。门就在那里，锁孔的形状很怪——不是圆的，是一张牌的轮廓。\n\n身后，整座庄园的灯一盏一盏亮起来。\n\n王后的声音从很远的地方传来：『你可以走，也可以留下来，替我看着这些规则。』",
      clue: { id: "c_final", name: "最后的门", description: "锁孔是牌的轮廓，王后给出了留下或离开的选择。" },
      choices: [
        { text: "把牌插进锁孔，开门离开", to: "r10" },
        { text: "留下，坐上王后的位置", to: "r10b" },
        { text: "把钥匙扔在地上，转身面对王后", to: "r10c" }
      ]
    },

    r10: {
      id: "r10",
      scene: "门外",
      level: 17,
      text:
        "牌插进锁孔的一瞬间，门开了。外面是草地、阳光，和远远喊你名字的人。\n\n你回头，猫在门框上笑。",
      finish: "good1",
      choices: []
    },

    r10b: {
      id: "r10b",
      scene: "王座",
      level: 17,
      text:
        "你坐上那把椅子。庄园的规则一条一条浮到眼前，等着你重新写。\n\n从今天起，这里讲你的规矩。",
      finish: "good2",
      choices: []
    },

    r10c: {
      id: "r10c",
      scene: "门厅",
      level: 17,
      text:
        "你把钥匙扔在地上，转过身。王后看着你，第一次没有笑。\n\n『你知道留下意味着什么。』\n\n『我知道。』你说。",
      finish: "good3",
      choices: []
    }
  },

  endings: {
    good1: { id: "good1", type: "survive", title: "找到那扇门", text: "门开了。外面是草地、阳光，和远远喊你名字的人。\n\n你回头，猫在门框上笑。", hint: "用牌打开门" },
    good2: { id: "good2", type: "survive", title: "新的王", text: "你坐上王座。庄园的规则一条一条浮到眼前，等着你重新写。\n\n从今天起，这里讲你的规矩。", hint: "留下" },
    good3: { id: "good3", type: "survive", title: "不再逃的人", text: "你扔掉钥匙，转身面对王后。\n\n她没有砍你的头。她只是把那份名单递给你，让你自己划掉名字。", hint: "转身面对" },
    death1: { id: "death1", type: "death", title: "翻错的牌", text: "你翻开那张牌。牌面是空白的。\n\n空白里伸出一只手，把你按进牌堆。\n\n第二天，牌桌上多了一张新牌。", error: "连续三局牌，翻错任何一张都会留下。", hint: "翻错牌" },
    death2: { id: "death2", type: "death", title: "王后的判决", text: "王后只抬了一下手指。\n\n十二张扑克牌压下来时，你听见最后一句：『砍头。』", error: "在镜子法庭里与王后正面冲突。", hint: "顶撞王后" }
  }
};

export default caseDef;
