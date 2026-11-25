const caseDef = {
  id: "lighthouse",
  title: "灰烬灯塔",
  subtitle: "Some truths are better left undiscovered.",
  tagline: "七年前的照片里，拍下你的人就站在你身后。",
  intro:
    "你收到一封没有寄件人的邮件。附件只有一张灯塔照片，拍摄时间是七年前。\n照片角落里有一块监控屏幕，屏幕上的画面里，有一个人站在拍摄者身后。\n那个人，穿着你今天穿的外套。",
  cover: "lighthouse",
  danger: "高",
  start: "n1",
  dangerRegex: /(徒手|直接碰|摸电箱|跳下|跳进海|砸碎|砸烂|引爆|掐死)/,
  keywords: [
    { test: /咖啡杯|杯子|杯底/, text: "监控画面里的咖啡杯还冒着热气。杯底朝上，像一只闭着的眼睛。", clue: { id: "c_cup_hint", name: "杯底有字", description: "监控里的杯子，杯底刻着四位数字。" }, flags: { cupHint: true } },
    { test: /监控|录像|摄像头/, text: "四路监控都在运行：一楼入口、二楼走廊、塔顶、地下储藏室。画面里没有人，但每一路都慢半拍。" },
    { test: /密码|数字/, text: "控制台键盘上，只有 0、4、1、7 四个键的漆掉得最厉害。" },
    { test: /短信|手机|号码/, text: "手机屏幕亮了。未知号码又发来一条：『别相信你看到的时间。』" },
    { test: /灯|主灯|点亮/, text: "灯塔的灯七年没亮了。灯室的门虚掩着，里面有一股很淡的煤油味。" },
    { test: /磁带|录音|录音机/, text: "录音机的按键很旧，但还能用。磁带里似乎录着很长一段话。" }
  ],
  nodes: {
    n1: {
      id: "n1",
      scene: "海边 · 雨夜",
      level: 1,
      image: "lighthouse",
      text:
        "大巴把你放在海边公路的尽头。雨很大，灯塔在两百米外的礁石上，黑着。\n\n手机没有信号，但邮件可以打开。那张照片的时间戳是七年前的今天，晚上 03:17。\n\n铁门虚掩着，门口的控制箱里传来很轻的电流声。",
      phone: { from: "未知号码", text: "你到了。别开主灯。" },
      clue: { id: "c_mail", name: "无寄件人的邮件", description: "一张七年前的灯塔照片，拍摄时间 03:17，照片里的监控屏幕映出拍摄者身后的人。" },
      choices: [
        { text: "推开铁门走进去", to: "n2" },
        { text: "先检查门口的控制箱", to: "n2b" },
        { text: "站在雨里，再看看那张照片", to: "n2" }
      ]
    },

    n2b: {
      id: "n2b",
      scene: "灯塔入口 · 控制箱",
      level: 2,
      text:
        "控制箱的锁锈住了，你用石头敲开。里面有一排老式闸刀，最左边那一只是热的。\n\n箱盖内侧贴着一张泛黄的纸条：『主电源 7788。别碰备用。』\n\n字迹很用力，像是写的人手在抖。",
      clue: { id: "c_note", name: "控制箱里的纸条", description: "主电源密码 7788；纸条上写着『别碰备用』。" },
      choices: [
        { text: "记住密码，推门进塔", to: "n2" },
        { text: "先合上最左边那只闸刀", to: "n2c" }
      ]
    },

    n2c: {
      id: "n2c",
      scene: "灯塔入口 · 控制箱",
      level: 3,
      text:
        "闸刀合上的瞬间，整座塔发出一声低沉的嗡鸣。\n\n二楼的窗户亮起一格冷光，又灭了。\n\n你听见有人在塔里走动。",
      setFlags: { powerOnEarly: true },
      choices: [{ text: "推门进去", to: "n2" }]
    },

    n2: {
      id: "n2",
      scene: "一楼 · 门厅",
      level: 4,
      text:
        "门厅里的空气是凉的，混着海盐和铁锈的味道。\n\n墙上钉着一排钥匙板，少了两把。地上有一道被拖过的痕迹，从楼梯口一直延伸到储藏室方向。\n\n正对面的房间开着门，里面亮着几块监控屏幕。",
      clue: { id: "c_drag", name: "被拖过的痕迹", description: "从楼梯口延伸到储藏室的地面拖痕，边缘已经干了。" },
      choices: [
        { text: "进入监控室", to: "n3" },
        { text: "先顺着拖痕往储藏室走", to: "n8" },
        { text: "直接上二楼", to: "n7" }
      ]
    },

    n3: {
      id: "n3",
      scene: "一楼 · 监控室",
      level: 5,
      text:
        "四块屏幕拼成一面墙。信号不太稳，画面偶尔会跳一下。\n\n你可以切换到不同的视角，看看这座塔里现在到底有什么。\n\n一楼入口的画面里，桌上放着一只杯子。",
      phone: { from: "未知号码", text: "看监控。别只看一个画面。" },
      clue: { id: "c_cams", name: "四路监控", description: "一楼入口、二楼走廊、塔顶、地下储藏室，四路仍在运行。" },
      ui: {
        type: "camera",
        views: [
          {
            id: "entrance",
            name: "一楼入口",
            hotspots: [
              { id: "cup", label: "桌上的杯子", x: 55, y: 58, w: 16, h: 20 },
              { id: "log", label: "门口的值班日志", x: 16, y: 64, w: 18, h: 18 }
            ]
          },
          {
            id: "corridor",
            name: "二楼走廊",
            hotspots: [
              { id: "clock", label: "墙上的钟", x: 44, y: 14, w: 14, h: 14, to: "n4" },
              { id: "door", label: "走廊尽头的门", x: 70, y: 34, w: 16, h: 36 }
            ]
          },
          { id: "top", name: "塔顶", hotspots: [{ id: "lamp", label: "主灯", x: 42, y: 20, w: 20, h: 24 }] },
          { id: "cellar", name: "地下储藏室", hotspots: [{ id: "box", label: "铁皮柜", x: 34, y: 50, w: 22, h: 26 }] }
        ],
        reveals: {
          cup: {
            text: "你放大一楼入口的画面。杯子被一只手拿起来过，杯底朝上——杯底刻着四个数字：9912。",
            clue: { id: "c_9912", name: "杯底数字 9912", description: "监控画面里，咖啡杯底刻着 9912。" },
            flag: "seenCup"
          },
          log: {
            text: "值班日志翻开在最后一页：『今天没有人来。』落款处的名字被水泡糊了。",
            clue: { id: "c_log", name: "值班日志最后一页", description: "最后一页写着『今天没有人来』，落款被泡糊。" },
            flag: "seenLog"
          },
          door: {
            text: "走廊尽头的门锁着。门缝里有光，像是有人在里面点了灯。",
            clue: { id: "c_door", name: "走廊尽头的灯", description: "门锁着，但门缝里有光。" },
            flag: "seenDoor"
          },
          lamp: {
            text: "塔顶的主灯是暗的。但透镜的角度不对——它被转向了礁石区。",
            clue: { id: "c_lens", name: "透镜角度", description: "主灯透镜被转向礁石区，而不是航道。" },
            flag: "seenLens"
          },
          box: {
            text: "储藏室角落有一只铁皮柜。柜门关着，锁是四位的机械锁。",
            clue: { id: "c_box", name: "铁皮柜", description: "地下储藏室有一只四位机械锁的铁皮柜。" },
            flag: "seenBox"
          }
        }
      },
      choices: [
        { text: "去二楼控制台", to: "n5" },
        { text: "先查看一楼入口的杯子", to: "n3" },
        { text: "回到门厅", to: "n2" }
      ]
    },

    n4: {
      id: "n4",
      scene: "二楼走廊 · 时钟",
      level: 6,
      text:
        "你从监控里看清了那只钟。指针停在 03:17，和照片上的时间一模一样。\n\n下一秒，走廊的灯自己亮了。\n\n监控画面里，一个穿旧雨衣的人正从画面边缘走过去，没有脸。",
      phone: { from: "未知号码", text: "03:17。七年前也是这个时间。" },
      clue: { id: "c_0317", name: "03:17", description: "走廊的钟停在 03:17，与七年前照片的时间一致。" },
      choices: [
        { text: "去二楼控制台", to: "n5" },
        { text: "追进储藏室", to: "n8" }
      ]
    },

    n5: {
      id: "n5",
      scene: "二楼 · 控制台",
      level: 7,
      image: "console",
      text:
        "控制台亮着，屏幕上只有一行字：『请输入主电源密码（四位）』。\n\n键盘还是温的。\n\n你想起控制箱里那张纸条。",
      clue: { id: "c_console", name: "控制台锁定", description: "需要四位主电源密码。" },
      ui: {
        type: "keypad",
        name: "主电源",
        answer: "7788",
        success: "n6",
        maxMistakes: 3,
        failEnding: "death1",
        hint: "控制箱里的纸条：7788"
      },
      choices: [
        { text: "回想那张纸条", to: "n5" },
        { text: "回一楼再看一次控制箱", to: "n2b" }
      ]
    },

    n6: {
      id: "n6",
      scene: "二楼 · 控制台",
      level: 8,
      text:
        "主电源接通。整座塔轻轻震了一下，像有什么东西终于醒了。\n\n屏幕切到监控：值班室里，一杯咖啡还冒着热气。一个穿着旧雨衣的人站在桌边，背对着镜头。\n\n他没有动。可你能听见他在呼吸。",
      phone: { from: "未知号码", text: "他不在监控里。他在你后面。" },
      clue: { id: "c_figure", name: "雨衣人", description: "监控里出现穿旧雨衣的人，背对镜头，画面里能听见呼吸声。" },
      choices: [
        { text: "回头", to: "n6b" },
        { text: "盯着屏幕，不动", to: "n6c" },
        { text: "立刻跑向储藏室", to: "n8" }
      ]
    },

    n6b: {
      id: "n6b",
      scene: "二楼 · 控制台",
      level: 9,
      text:
        "你猛地回头。走廊空的，只有你自己的影子被灯拉得很长。\n\n再转回去时，屏幕上的雨衣人已经不见了。桌上那杯咖啡，正对着镜头，杯底朝上。",
      clue: { id: "c_turned", name: "消失的雨衣人", description: "回头后，监控里的雨衣人消失，只剩杯底朝上的咖啡杯。" },
      choices: [{ text: "下楼去储藏室", to: "n8" }]
    },

    n6c: {
      id: "n6c",
      scene: "二楼 · 控制台",
      level: 9,
      text:
        "你没有回头。屏幕里的雨衣人慢慢抬起手，指向画面的左侧——也就是，楼梯的方向。\n\n然后他按下了一个你看不见的按钮。\n\n储藏室的门，在楼下『咔』地响了一声。",
      clue: { id: "c_opened", name: "储藏室的门开了", description: "雨衣人按下了某个按钮，储藏室的门自动打开。" },
      choices: [{ text: "下楼去储藏室", to: "n8" }]
    },

    n8: {
      id: "n8",
      scene: "地下 · 储藏室门",
      level: 10,
      text:
        "储藏室的铁门上有第二道锁，四位机械锁，漆已经磨掉。\n\n门缝里飘出很淡的霉味，还有一点，像是烧过纸的味道。\n\n你在监控里见过的那个数字，应该用得上。",
      clue: { id: "c_lock2", name: "储藏室的四位锁", description: "第二道锁是四位机械锁。" },
      ui: {
        type: "keypad",
        name: "储藏室",
        answer: "9912",
        success: "n9",
        maxMistakes: 4,
        failEnding: "death1",
        hint: "监控里，杯底刻着 9912"
      },
      choices: [
        { text: "回去再看一次监控", to: "n3" },
        { text: "去二楼控制台", to: "n5" }
      ]
    },

    n9: {
      id: "n9",
      scene: "地下 · 储藏室",
      level: 11,
      image: "storage",
      text:
        "门开了。储藏室里堆着旧木箱、缆绳，和一只铁皮柜。\n\n铁皮柜的锁是四位的。柜顶压着一台老式录音机，磁带还卡在里面。\n\n墙上的值班表被人撕掉了一角，剩下的部分写着：『03:17，主灯异常。』",
      clue: { id: "c_tape", name: "旧录音机", description: "储藏室铁皮柜上有一台录音机，磁带卡在里面。" },
      choices: [
        { text: "先打开铁皮柜", to: "n10" },
        { text: "直接按下录音机", to: "n11" }
      ]
    },

    n10: {
      id: "n10",
      scene: "地下 · 铁皮柜",
      level: 12,
      text:
        "铁皮柜的锁上刻着一行很小的数字：0417。\n\n你盯着它，忽然想起照片背面的日期。\n\n柜子里会有什么？",
      clue: { id: "c_0417", name: "铁皮柜上的 0417", description: "铁皮柜锁上刻着 0417。" },
      ui: {
        type: "keypad",
        name: "铁皮柜",
        answer: "0417",
        success: "n11",
        maxMistakes: 5,
        failEnding: "death1",
        hint: "锁上刻着 0417"
      },
      choices: [
        { text: "先听录音机", to: "n11" },
        { text: "回监控室", to: "n3" }
      ]
    },

    n11: {
      id: "n11",
      scene: "地下 · 录音",
      level: 13,
      image: "tape",
      text:
        "录音机开始转。先是海浪声，然后是老周的声音。\n\n『今天是第七年。我把值班表换了，把灯修好了。』\n\n『如果有人在听，别开主灯。开了，它就会知道有人来过。』\n\n磁带卡住了。",
      phone: { from: "未知号码", text: "听完了？现在你知道我不是谁了。" },
      clue: { id: "c_tape2", name: "老周的录音", description: "录音提到第七年、换了值班表、别开主灯。" },
      choices: [
        { text: "把磁带收好", to: "n12" },
        { text: "继续找铁皮柜里的东西", to: "n10" }
      ]
    },

    n12: {
      id: "n12",
      scene: "地下 · 储藏室",
      level: 14,
      text:
        "你转过身。\n\n门口站着一个人，穿着旧雨衣，帽檐压得很低。他手里拿着一只煤油灯，灯火把走廊照得发黄。\n\n『你不该来。』他说。",
      clue: { id: "c_meet", name: "雨衣人现身", description: "储藏室门口出现雨衣人，手里拿着煤油灯。" },
      choices: [
        { text: "举起手，慢慢后退", to: "n13" },
        { text: "冲上去按住他", to: "n12b", danger: "death2" },
        { text: "问他：你是谁", to: "n13b" }
      ]
    },

    n12b: {
      id: "n12b",
      scene: "地下 · 冲突",
      level: 15,
      finish: "death2",
      text: "你冲上去。煤油灯摔在地上，火焰舔到缆绳。",
      choices: []
    },

    n13: {
      id: "n13",
      scene: "地下 · 后退",
      level: 16,
      text:
        "你后退了两步。他没有动，只是把煤油灯放在地上。\n\n『我是周。这塔的守夜人。』\n\n『七年前的事，是我做的。我把它留在磁带里，等一个愿意听到底的人。』",
      phone: { from: "未知号码", text: "现在你知道了。下一步，你打算怎么办？" },
      clue: { id: "c_zhou", name: "守夜人老周", description: "雨衣人自称周，七年前的当事人。" },
      choices: [
        { text: "听他把话说完", to: "n14" },
        { text: "质问：六个人是怎么死的", to: "n14" }
      ]
    },

    n13b: {
      id: "n13b",
      scene: "地下 · 对质",
      level: 16,
      text:
        "『我是周。』他摘下帽檐，露出一张比照片上老得多的脸。\n\n『七年前那天，透镜被转到礁石区。补给船撞上来的时候，我在塔顶。』\n\n『我看见了，但没有开灯示警。』",
      clue: { id: "c_zhou2", name: "周的自述", description: "透镜被人为转向礁石区，老周当时在塔顶，没有开灯示警。" },
      choices: [{ text: "继续听", to: "n14" }]
    },

    n14: {
      id: "n14",
      scene: "塔顶 · 灯室",
      level: 17,
      image: "lamp",
      text:
        "你们一起上了塔顶。风很大，雨还没停。\n\n老周把煤油灯放在灯室门口，指着主灯：『灯还能亮。亮了，船就会来。但所有人都会知道，是我。』\n\n他退后一步，把决定留给了你。",
      phone: { from: "未知号码", text: "这一次，由你决定。" },
      clue: { id: "c_final", name: "主灯还能亮", description: "点亮主灯会引来救援，也会暴露老周。" },
      choices: [
        { text: "点亮主灯", to: "n15" },
        { text: "带着磁带离开", to: "n15b" },
        { text: "把磁带交给老周，转身离开", to: "n15c" }
      ]
    },

    n15: {
      id: "n15",
      scene: "塔顶 · 天亮",
      level: 18,
      finish: "good1",
      text:
        "你把手放在闸刀上。\n\n老周没有拦你。他只是站在雨里，看着海面。\n\n灯亮了。三短三长三短。远处，有一盏灯回应了你。",
      choices: []
    },

    n15b: {
      id: "n15b",
      scene: "塔顶 · 离开",
      level: 18,
      finish: "good2",
      text:
        "你把磁带揣进内袋，转身下楼。\n\n老周没有追。他只是说了一句：『替我告诉他们，别再把灯转向礁石。』\n\n海面上，天开始亮。",
      choices: []
    },

    n15c: {
      id: "n15c",
      scene: "塔顶 · 沉默",
      level: 18,
      finish: "good3",
      text:
        "你把磁带放在他手里。他愣了一下，手指收得很紧。\n\n『你不想知道全部？』\n\n你摇了摇头，往楼下走。海风把门吹得上下一晃。",
      choices: []
    }
  },

  endings: {
    good1: {
      id: "good1",
      type: "survive",
      title: "天亮离岛",
      text:
        "你点亮主灯，三短三长三短。\n\n救援船在黎明靠岸。老周站在塔顶没有下来。\n\n你把磁带交给了警方。七年前的事故重开调查，六个人的名字，终于又被念了一遍。",
      hint: "点亮主灯"
    },
    good2: {
      id: "good2",
      type: "survive",
      title: "守夜人的证词",
      text:
        "你带着磁带离开灯塔。\n\n三个月后，那份录音出现在报纸头版。老周没有逃，他在开审那天自己走进了法庭。\n\n灯塔依旧黑着，但再没人说那六个人是死于意外。",
      hint: "带着证据离开"
    },
    good3: {
      id: "good3",
      type: "survive",
      title: "把选择还给他",
      text:
        "你把磁带留给老周，独自离开。\n\n没有报道，没有人被审判。\n\n但第二年冬天，灯塔的灯在某个夜里亮了三次，又灭了。镇上的人说，那大概是风。",
      hint: "把磁带交给老周"
    },
    death1: {
      id: "death1",
      type: "death",
      title: "高压电箱",
      text:
        "你把手伸进配电箱。\n\n焦糊味在雨里散开，你甚至没来得及喊出声。\n\n第二天，管理员在记录本上写了一行：『临时工，触电，意外。』",
      error: "不该徒手接触配电箱。",
      hint: "徒手碰电箱"
    },
    death2: {
      id: "death2",
      type: "death",
      title: "煤油灯",
      text:
        "你冲上去按住他。煤油灯脱手，火苗舔上浸了油的缆绳。\n\n储藏室在几分钟里变成了一个发烫的盒子。\n\n你听见老周在火里说了一句：『算了。』",
      error: "在狭窄空间里与持灯的人发生冲突。",
      hint: "冲上去对峙"
    }
  }
};

export default caseDef;
