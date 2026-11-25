const RULES = {
  lighthouse: [
    { test: /咖啡杯|杯子|杯底/, text: "你把监控画面放大到最大。杯子还在那里，杯底朝上，像一只闭着的眼睛。画面边缘的时间戳跳了一下。" },
    { test: /监控|摄像头|录像/, text: "四路监控都在运行。一楼入口、二楼走廊、塔顶、地下储藏室。画面里没有人，但每一路都有轻微的延迟。" },
    { test: /密码|数字|键盘/, text: "控制台上的数字键盘泛着冷光。你注意到按键上的磨损：只有 0、4、1、7 四个数字的漆掉得最厉害。" },
    { test: /灯|主灯|点亮/, text: "灯塔的灯已经七年没亮过了。灯室的门虚掩着，里面有一股很淡的煤油味。" },
    { test: /短信|手机|号码/, text: "手机又震了一下。屏幕上的时间比墙上的钟快了十分钟。" }
  ],
  rabbit: [
    { test: /扑克|牌/, text: "桌上的牌背对着你，像一排闭着的眼睛。你能感觉到它们在等你先动。" },
    { test: /猫|柴郡/, text: "空气里传来一声笑，但你找不到笑的来源。" },
    { test: /时钟|时间/, text: "墙上那只钟没有指针。可你分明听见了滴答声。" }
  ],
  island: [
    { test: /雷达|方位/, text: "雷达屏幕上有一个红点，正在缓慢地靠近。方位刻度的数字被磨得看不清。" },
    { test: /无线电|信号/, text: "无线电里只有杂音，偶尔夹着几个数字，像有人在水下数数。" }
  ],
  nautilus: [
    { test: /声呐|探测/, text: "声呐图上浮着四个模糊的光点。其中有一个，正在缓慢地移动。" },
    { test: /日志|航海/, text: "手机里的航海日志停在一页被撕掉一半的记录上，剩下的日期是 1866-11-06。" }
  ]
};

const DANGER = /(跳下|跳进|跳崖|徒手|砸碎|砸烂|砸毁|拆掉|拔掉电源|掐死|开枪|引爆|撞破|直接冲上去|喝下药水|吞下)/;

const GENERIC = [
  "你做了这件事。空气里有一点变化，但什么都没有发生。",
  "你试着这么做，四周静得能听见自己的呼吸。",
  "这个念头刚冒出来，就被一阵从走廊深处吹来的风打断了。"
];

export function localNarrative(caseId, action) {
  if (DANGER.test(action)) {
    return {
      narrative:
        "你的动作比理智快了一步。\n\n金属、海水或者别的什么在黑暗里发出声音，你意识到自己已经没法回头了。",
      danger: true
    };
  }
  const table = RULES[caseId] || [];
  for (const rule of table) {
    if (rule.test.test(action)) return { narrative: rule.text, danger: false };
  }
  return { narrative: GENERIC[Math.floor(Math.random() * GENERIC.length)], danger: false };
}
