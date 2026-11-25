const caseDef = {
  id: "island",
  title: "荒岛二十日",
  subtitle: "The sea keeps what it takes.",
  tagline: "地图上不存在的岛，和每天夜里靠近的东西。",
  intro:
    "船在风暴里断了。你在沙滩上醒来，身边只有一只木箱和半截断桨。\n\n手机还能开机，无线电时断时续。\n\n天黑之前，你必须决定：先找水，还是先找火。",
  cover: "island",
  danger: "中",
  start: "i1",
  dangerRegex: /(生吃|吃下野果|喝海水|跳进海里|徒手抓)/,
  keywords: [
    { test: /水|淡水/, text: "你在岛东侧找到一小片湿地，水是凉的，尝起来不咸。" },
    { test: /雷达|方位/, text: "雷达屏幕亮着，红点在缓慢移动。方位刻度被盐雾磨得发白。" },
    { test: /无线电|信号/, text: "无线电里只有杂音，偶尔夹着几个数字，像有人在水下数数。" },
    { test: /火|生火/, text: "火柴受潮了，但你把它们摊在石头上晒过，也许还能用。" }
  ],
  nodes: {
    i1: {
      id: "i1",
      scene: "海滩 · 第 1 天",
      level: 1,
      image: "island",
      text:
        "你在沙滩上醒来。潮水刚退，木箱半埋在沙里，断桨插在礁石缝中。\n\n远处有一片椰林，再远处是礁石区，那里卡着半截船身。\n\n手机屏幕亮着，信号一格。",
      phone: { from: "无线电", text: "……这里是……救援……信号……断续……" },
      clue: { id: "c_wreck", name: "礁石间的沉船", description: "礁石区卡着半截船身，可能有补给。" },
      choices: [
        { text: "先打开木箱", to: "i2" },
        { text: "去礁石区的沉船", to: "i3", effects: { water: -1 } },
        { text: "先找淡水", to: "i2b", effects: { water: 2 } }
      ]
    },

    i2b: {
      id: "i2b",
      scene: "溪地 · 第 1 天",
      level: 2,
      text:
        "你在岛东侧找到一小片湿地。水是凉的，尝起来不咸。\n\n你把水壶灌满，抬头时看见椰林深处有一道很旧的车辙印。\n\n这座岛上不该有车。",
      clue: { id: "c_track", name: "岛上的车辙", description: "荒岛深处有旧车辙印，说明有人长期活动。" },
      choices: [
        { text: "顺着车辙往里走", to: "i3b" },
        { text: "先回海滩", to: "i2" }
      ]
    },

    i2: {
      id: "i2",
      scene: "海滩 · 木箱",
      level: 2,
      text:
        "木箱里有：一把刀、一卷绳、一盒受潮的火柴，还有半罐压缩饼干。\n\n箱盖内侧印着一行编号，像是某种物资清单的一部分。",
      clue: { id: "c_box", name: "木箱编号", description: "木箱内侧印着物资编号，不像民用船只的装备。" },
      choices: [
        { text: "带上所有东西", to: "i4", effects: { food: 2, material: 1 } },
        { text: "只带刀和火柴", to: "i4", effects: { food: 1 } }
      ]
    },

    i3: {
      id: "i3",
      scene: "礁石 · 沉船",
      level: 3,
      text:
        "半截船身卡在两块礁石之间。船舱里有一股很重的柴油味。\n\n你翻出两只完好的蓄电池、一卷防水布，和一本被泡烂一半的值班簿。\n\n值班簿最后一页写着：『第七次补给。它们又来了。』",
      clue: { id: "c_log", name: "沉船值班簿", description: "值班簿提到『第七次补给』和『它们又来了』，说明这里长期有人。" },
      choices: [
        { text: "把电池和防水布搬回去", to: "i4", effects: { material: 2, power: 2 } },
        { text: "继续翻找船舱", to: "i3b", effects: { material: 1 } }
      ]
    },

    i3b: {
      id: "i3b",
      scene: "礁石 · 沉船",
      level: 4,
      text:
        "船舱底部有一只上锁的铁柜。锁被撬开过，里面空了，只剩一张照片。\n\n照片上是这座岛，拍摄角度来自灯塔方向。\n\n照片背面写着：『实验区 3 号。别让他们上岸。』",
      clue: { id: "c_photo", name: "实验区照片", description: "照片背面写着『实验区 3 号』，这座岛被当作实验区。" },
      choices: [{ text: "带着照片回去", to: "i4", effects: { material: 1 } }]
    },

    i4: {
      id: "i4",
      scene: "营地 · 第 3 天",
      level: 5,
      image: "radar",
      text:
        "你把营地搭在背风的礁石后面。雷达接上电池，屏幕亮了。\n\n白天什么都没有。可一到夜里，红点就会出现，从不同方向靠近。\n\n无线电里的方位，和雷达上的红点是同一个。",
      phone: { from: "无线电", text: "……今夜方位……45……重复……45……" },
      clue: { id: "c_radar", name: "雷达与无线电", description: "无线电播报的方位与雷达红点一致，可以据此防守。" },
      choices: [
        { text: "守着雷达过夜", to: "i5" },
        { text: "先加固棚屋", to: "i4b", effects: { material: -1 } }
      ]
    },

    i4b: {
      id: "i4b",
      scene: "营地 · 第 4 天",
      level: 6,
      text:
        "你用防水布和木桩把棚屋围了一圈。\n\n天黑时，风里传来一种很低的声音，像有什么东西在沙子上拖行。",
      choices: [{ text: "回到雷达前", to: "i5" }]
    },

    i5: {
      id: "i5",
      scene: "营地 · 连续五夜",
      level: 7,
      text:
        "第一个红点出现了。它沿着海岸线移动，方向缓慢地偏转。\n\n你必须根据无线电播报的方位，在雷达上选定角度开火。\n\n打偏三次，它就会上岸。",
      phone: { from: "无线电", text: "……目标接近……方位 45……保持在雷达范围内……" },
      clue: { id: "c_defend", name: "连续防守", description: "每一夜的目标方位都会变化，失误三次就会被靠近。" },
      ui: {
        type: "radar",
        goal: 5,
        angles: [45, 120, 200, 300, 30],
        tolerance: 12,
        maxMiss: 3,
        success: "i6",
        failEnding: "death1"
      },
      choices: [{ text: "先检查弹药", to: "i5b" }]
    },

    i5b: {
      id: "i5b",
      scene: "营地 · 第 5 天",
      level: 8,
      text:
        "炮位只剩五发照明弹。你把它们一发一发擦干净，摆在礁石上。\n\n海面上浮着一层很薄的雾，雾里有光。",
      choices: [{ text: "回到雷达", to: "i5" }]
    },

    i6: {
      id: "i6",
      scene: "营地 · 第 20 天",
      level: 9,
      text:
        "第五个红点在火光外停了很久，最终退走。\n\n接下来的夜里，雷达上再没有出现新的目标。\n\n第二十天清晨，海平线上出现了一个黑点。它比以往的船都慢。",
      phone: { from: "无线电", text: "……补给船……靠岸……二十分钟……" },
      clue: { id: "c_ship", name: "第二十天的船", description: "补给船正在靠近，但它比正常的船慢得多。" },
      choices: [
        { text: "点起三堆火，等它靠岸", to: "i7" },
        { text: "带着照片和值班簿，主动出海", to: "i7b" },
        { text: "继续守在炮位上，观察它", to: "i7c" }
      ]
    },

    i7: {
      id: "i7",
      scene: "海滩 · 获救",
      level: 10,
      text:
        "补给船靠岸。甲板上站着几个人，穿着没有标识的制服。\n\n他们看见你，愣了一下，然后问你：『你是怎么活下来的？』\n\n你把值班簿和照片递过去。",
      finish: "good1",
      choices: []
    },

    i7b: {
      id: "i7b",
      scene: "海上 · 主动出击",
      level: 10,
      text:
        "你划着断桨改的木筏出海，在雾里截住了那艘船。\n\n船上没有补给，只有一排空着的笼子。\n\n你把照片拍在船长面前。他看了很久，说：『你比上一批聪明。』",
      finish: "good2",
      choices: []
    },

    i7c: {
      id: "i7c",
      scene: "炮位 · 清晨",
      level: 10,
      text:
        "你没有点灯，也没有出海。你只是坐在炮位上，看着那艘船慢慢靠近。\n\n船在离岸一百米的地方停下，放下了救生艇。\n\n艇上只有一个人，举着双手。",
      finish: "good3",
      choices: []
    }
  },

  endings: {
    good1: { id: "good1", type: "survive", title: "等到救援", text: "补给船靠岸。你把值班簿和照片递过去。\n\n他们问你：『你是怎么活下来的？』\n\n你说：『我每天晚上都醒着。』", hint: "点三堆火等船" },
    good2: { id: "good2", type: "survive", title: "主动出海", text: "你在雾里截住了那艘船。船上只有一排空笼子。\n\n船长看了照片很久，说：『你比上一批聪明。』", hint: "主动出海" },
    good3: { id: "good3", type: "survive", title: "举着双手的人", text: "救生艇上只有一个人，举着双手。\n\n你放下炮，看着他慢慢走上沙滩。\n\n他说：『我是来关掉这座岛的。』", hint: "守在炮位上观察" },
    death1: { id: "death1", type: "death", title: "夜袭", text: "第三次打偏时，雷达上的红点消失了。\n\n你听见沙子上有拖行的声音，越来越近，最后停在棚屋门口。\n\n第二天，棚屋还在，人没了。", error: "连续三次判断错方位，防线被突破。", hint: "防守失误三次" },
    death2: { id: "death2", type: "death", title: "红色的果子", text: "那种果子很甜，甜得不像荒岛该有的东西。\n\n你吃了三个。半小时后，你看见海面站了起来。", error: "在荒岛上吃下了来路不明的野果。", hint: "吃下野果" },
    death3: { id: "death3", type: "death", title: "脱水", text: "水壶见底的时候，你还在往岛内走。\n\n第三天，你倒在椰林的阴影里，听见远处无线电还在播报方位。", error: "淡水耗尽，仍继续消耗体力。", hint: "水耗尽" }
  }
};

export default caseDef;
