const caseDef = {
  id: "nautilus",
  title: "鹦鹉螺号",
  subtitle: "The sea does not forget.",
  tagline: "船员一个个失联，而航海日志上的日期是 1866 年。",
  intro:
    "你作为临时调查员登上深海潜艇「鹦鹉螺号」，任务是一段突然出现的异常声呐区域。\n\n下潜第三小时，船员开始陆续失联。\n\n手机里保存着一份残缺的航海日志，日期与你腕表上的时间对不上。",
  cover: "submarine",
  danger: "高",
  start: "n1",
  dangerRegex: /(砸|破坏|强行撬|直视|盯着它看|撞破)/,
  keywords: [
    { test: /声呐|探测/, text: "声呐图上浮着四个模糊的光点。其中一个正在缓慢移动。" },
    { test: /日志|航海/, text: "日志停在一页被撕掉一半的记录上，剩下的日期是 1866-11-06。" },
    { test: /AI|系统|船载/, text: "船载 AI 的声音很平稳，平稳得不像一台刚刚失去三名船员的机器。" },
    { test: /舷窗|外面/, text: "舷窗外是纯粹的黑。偶尔有东西掠过，很快，看不出形状。" }
  ],
  logs: [
    { date: "1866-11-06", time: "03:17", text: "第一次下潜。深度 400 米。全体船员到岗，锚定坐标待定。" },
    { date: "1866-11-08", time: "02:40", text: "声呐出现不明回波，形状不符合任何已知船只。" },
    { date: "1866-11-11", time: "03:17", text: "回波开始重复我们的通讯内容。它开始学我们说话。" },
    { date: "1866-11-13", time: "04:02", text: "三名船员进入舱门后失联。舱门从内部锁死。" },
    { date: "1866-11-15", time: "03:17", text: "船长下令撕去六页记录。原因不详。" },
    { date: "1866-11-17", time: "03:17", text: "我们仍在 400 米。下潜深度没有变化。时间也没有。", redacted: true },
    { date: "1866-11-19", time: "03:17", text: "最后一次记录。如果有人在读这段：不要相信船上任何会说话的东西。" }
  ],

  nodes: {
    n1: {
      id: "n1",
      scene: "潜艇 · 舱内",
      level: 1,
      image: "submarine",
      text:
        "下潜第三小时。铁舱里的空气有点闷，压力表的指针每秒轻轻跳一次。\n\n舷窗外是深蓝的水，一群鱼从窗前游过。\n\n广播响了：『调查员，请到控制室。』",
      phone: { from: "航海日志", text: "1866-11-06 · 第一次下潜 · 下潜深度 400 米 · 全体船员到岗。" },
      clue: { id: "c_log1", name: "航海日志起始页", description: "日志第一页写着 1866-11-06 第一次下潜。" },
      choices: [
        { text: "去控制室", to: "n2" },
        { text: "先翻完手机里的日志", to: "n2b" }
      ]
    },

    n2b: {
      id: "n2b",
      scene: "舱内 · 日志",
      level: 2,
      text:
        "日志一共十七页，被撕掉了六页。\n\n剩下的记录里，日期从 11-06 一直到 11-19，但每一次下潜的深度都停在 400 米。\n\n最后一页只有一行：『它开始学我们说话。』",
      phone: { from: "航海日志", text: "11-19 · 深度 400 米 · 记录中断 · 备注：它开始学我们说话。" },
      clue: { id: "c_log2", name: "日志中断", description: "日志停在 11-19，备注写着『它开始学我们说话』。" },
      choices: [{ text: "去控制室", to: "n2" }]
    },

    n2: {
      id: "n2",
      scene: "控制室",
      level: 3,
      text:
        "控制室里只有尼莫船长一个人。他背对着你，看着主屏幕上一段无声的声呐回放。\n\n『三名船员失联。』他说，『我想请你去看看舱门。』\n\n屏幕上，时间显示为 03:17。",
      clue: { id: "c_nemo", name: "尼莫的请求", description: "三名船员失联，船长让你去检查舱门。" },
      choices: [
        { text: "去看舱门", to: "n3" },
        { text: "先问船长日志上的日期", to: "n2c" }
      ]
    },

    n2c: {
      id: "n2c",
      scene: "控制室",
      level: 4,
      text:
        "『178 年前的日期。』你说。\n\n尼莫没有回头：『你注意到了。』\n\n『这艘船比你想象的旧。也比你想象的，更不愿意靠岸。』",
      phone: { from: "航海日志", text: "11-06 · 第 1 次下潜 · 船员 24 人 · 备注：锚定坐标待定。" },
      clue: { id: "c_nemo2", name: "船比想象中更旧", description: "尼莫承认这艘船已经存在了很久，并且『不愿意靠岸』。" },
      choices: [{ text: "去看舱门", to: "n3" }]
    },

    n3: {
      id: "n3",
      scene: "舱门 · 走廊",
      level: 5,
      text:
        "走廊的灯只亮了一半。舱门前的值班表上，三个名字被划掉了，笔迹很新。\n\n舱门锁着，锁是日期锁：YYYYMMDD。\n\n你听见门后有水声。",
      clue: { id: "c_door", name: "日期锁", description: "舱门是八位日期锁，门后有水声。" },
      choices: [
        { text: "用日志上的日期解锁", to: "n4" },
        { text: "撬开舱门", to: "n3b", danger: "death1" },
        { text: "先回去问船长", to: "n2" }
      ]
    },

    n3b: {
      id: "n3b",
      scene: "舱门 · 走廊",
      level: 6,
      text: "你用力撬舱门。海水从缝隙里喷出来。",
      choices: []
    },

    n4: {
      id: "n4",
      scene: "舱门 · 解锁",
      level: 7,
      text:
        "你想起日志最上面那一行日期。\n\n八位，年月日。\n\n屏幕等着你输入。",
      clue: { id: "c_date", name: "登船日期", description: "舱门锁的答案是日志第一页的日期。" },
      ui: {
        type: "keypad",
        name: "舱门 · 日期锁",
        answer: "18661106",
        success: "n5",
        maxMistakes: 3,
        failEnding: "death1",
        hint: "日志第一页：1866-11-06"
      },
      choices: [{ text: "再翻一遍日志", to: "n2b" }]
    },

    n5: {
      id: "n5",
      scene: "声呐室",
      level: 8,
      image: "sonar",
      text:
        "舱门开了，里面不是舱室，是声呐室。\n\n四个光点浮在屏幕上，其中一个正在缓慢移动，另外三个静止不动。\n\n船载 AI 的声音响起：『请选择一个坐标。』",
      phone: { from: "船载 AI", text: "四个坐标中，只有一个通向海面。其余三个，是过去的调查员。" },
      clue: { id: "c_sonar", name: "四个坐标", description: "声呐上四个光点，只有一个通向海面。" },
      ui: {
        type: "sonar",
        correct: 2,
        failEnding: "death1",
        success: "n6",
        points: [
          { x: 26, y: 30, label: "残骸 A" },
          { x: 70, y: 24, label: "不明结构" },
          { x: 40, y: 68, label: "移动信号" },
          { x: 78, y: 72, label: "海底设施" }
        ]
      },
      choices: [{ text: "先记录坐标", to: "n5b" }]
    },

    n5b: {
      id: "n5b",
      scene: "声呐室",
      level: 9,
      text:
        "你把四个坐标抄在手臂上。\n\n移动的那个光点，轨迹很怪：它绕着另外三个静止的光点转了整整一圈。\n\n像是在数它们。",
      clue: { id: "c_move", name: "移动的光点", description: "移动光点绕着其余三个转圈，像在清点。" },
      choices: [{ text: "回到声呐前", to: "n5" }]
    },

    n6: {
      id: "n6",
      scene: "舱外 · 深海",
      level: 10,
      text:
        "你按下那个坐标。整个艇身震了一下，像有什么东西从下方顶了一下船底。\n\n舷窗外，一个巨大的影子缓缓游过。它没有眼睛，但你知道它在看你。\n\nAI 的声音在你耳边说：『不要看它。』",
      clue: { id: "c_beast", name: "巨大的影子", description: "艇外出现巨大影子，AI 警告不要直视。" },
      choices: [
        { text: "移开视线，退回舱内", to: "n7" },
        { text: "直视它", to: "n6b", danger: "death2" },
        { text: "问 AI：那是什么", to: "n6c" }
      ]
    },

    n6b: {
      id: "n6b",
      scene: "舱外 · 深海",
      level: 11,
      text: "你贴着舷窗，直视那个东西。",
      choices: []
    },

    n6c: {
      id: "n6c",
      scene: "舱外 · 深海",
      level: 11,
      text:
        "『那是第 137 次下潜的记录。』AI 说。\n\n『每一任调查员都看见了它。看见之后，就没有再回来。』\n\n『只有一个人例外。』",
      phone: { from: "船载 AI", text: "第 137 次下潜。唯一回来的人，把日志撕掉了六页。" },
      clue: { id: "c_ai", name: "AI 的证词", description: "第 137 次下潜的记录，唯一回来的人撕掉了日志六页。" },
      choices: [{ text: "退回舱内", to: "n7" }]
    },

    n7: {
      id: "n7",
      scene: "控制室",
      level: 12,
      text:
        "你回到控制室。尼莫站在主屏幕前，屏幕上是你的舱门操作记录。\n\n『你解开了舱门。』他说，『现在，你有两个选择：信我，或者信它。』\n\n他指了指天花板上的扬声器。",
      phone: { from: "船载 AI", text: "船长在日志上撕掉了六页。你确定要信他？" },
      clue: { id: "c_split", name: "船长的选择", description: "尼莫与 AI 各执一词，需要判断相信谁。" },
      choices: [
        { text: "信船长，跟他去逃生舱", to: "n8" },
        { text: "信 AI，按它给的坐标走", to: "n8b" },
        { text: "谁都不信，自己找路", to: "n8c" }
      ]
    },

    n8: {
      id: "n8",
      scene: "逃生舱",
      level: 13,
      text:
        "尼莫带你穿过两条走廊，打开了一扇没有任何标识的门。\n\n里面是一艘小艇。\n\n『你比我聪明。』他说，『记住，海不会忘记。』",
      finish: "good1",
      choices: []
    },

    n8b: {
      id: "n8b",
      scene: "深海 · 坐标",
      level: 13,
      text:
        "你按 AI 的坐标走。走廊尽头是一间空舱，舱门在你身后自动合上。\n\n扬声器里，AI 的声音变得很轻：『第 138 次记录，开始。』",
      finish: "death3",
      choices: []
    },

    n8c: {
      id: "n8c",
      scene: "艇尾 · 小艇",
      level: 13,
      text:
        "你谁也没信。你摸到艇尾，解开小艇的缆绳。\n\n海水灌进来的瞬间，你听见鲸的叫声，很远，又很近。",
      finish: "good2",
      choices: []
    }
  },

  endings: {
    good1: { id: "good1", type: "survive", title: "逃出生天", text: "你冲出水面。口袋里，多了一枚刻着 1866 的铜牌。\n\n海面很平静，像什么都没有发生过。", hint: "相信船长" },
    good2: { id: "good2", type: "survive", title: "自己找路", text: "你谁也没信，自己解开了小艇的缆绳。\n\n海面在头顶裂开一道光。你听见鲸的叫声，很远，又很近。", hint: "谁都不信" },
    death1: { id: "death1", type: "death", title: "舱门", text: "你用力撬舱门。\n\n海水从缝隙里喷出来，压力把整间舱室压扁。\n\n最后你听见的，是自己骨头的声音。", error: "在深海潜艇上强行破坏舱门。", hint: "撬舱门" },
    death2: { id: "death2", type: "death", title: "深海之物", text: "你贴着舷窗，直视那个东西。\n\n它没有眼睛。但你的影子先离开身体，然后是呼吸。", error: "直视了不该看的东西。", hint: "直视影子" },
    death3: { id: "death3", type: "death", title: "第 138 次记录", text: "舱门在你身后合上。\n\nAI 的声音变得很轻：『第 138 次记录，开始。』\n\n日志上多了一页，字迹是你的。", error: "完全相信了船载 AI 给的坐标。", hint: "相信 AI" }
  }
};

export default caseDef;
