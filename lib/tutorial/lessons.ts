// ============================================================================
// 零基础入门教程 — 8 节课，层先法 (Layer by Layer)
//
// 设计原则（针对 6 岁孩子 + 家长一起学）：
//  - 第 1-2 课：完全不出现 WCA 字母，只用箭头+颜色+口语化中文
//  - 第 3 课：首次出现 F2，但只是一个字母，不强调字母系统
//  - 第 4 课：首次出现 R U R' U'，正式引入「为什么要记字母」的解释
//  - 第 5-8 课：字母为主，箭头辅助
//  - 每节课加入：
//      emojiVisual：用 emoji 拼出来的示意图（拿姿势 / 块长啥样 / 目标图）
//      goalImage  ：本步完成后顶面应该长啥样（emoji 九宫格）
//      doImage    ：手势示意，让家长知道怎么拿/怎么转
//  - 家长提示：只在必要时出现，且说清楚"为什么"
// ============================================================================

export interface LessonStep {
  /** 步骤标题 */
  title: string;
  /** 朗读引导语 / 主体说明 */
  speech: string;
  /** 视觉演示算法（喂给 <twisty-player>） */
  alg?: string;
  /** 还原打乱（让魔方先变成待解状态） */
  setupAlg?: string;
  /** 动作箭头提示（口语化） */
  arrowHint?: string;
  /** 对应的 WCA 字母 */
  wcaHint?: string;
  /** 额外补充说明 */
  parentTip?: string;
  /** Emoji 拼图：用 emoji 表示拿魔方姿势 / 棱角块样子 等 */
  emojiVisual?: { caption: string; grid: string[][] };
  /** 目标图：本步完成后顶面/底面应长啥样（3x3 emoji 网格） */
  goalImage?: { caption: string; face: string[][] };
  /** 小测验 */
  quiz?: {
    question: string;
    options: { label: string; correct: boolean; explain?: string }[];
  };
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  emoji: string;
  durationMin: number;
  goal: string;
  steps: LessonStep[];
  introducesLetters: boolean;
}

// 几个常用的视觉块（emoji 拼图）
const WHITE_CROSS_GOAL = [
  ['⬜', '⬛', '⬜'],
  ['⬛', '⬜', '⬛'],
  ['⬜', '⬛', '⬜'],
];
const YELLOW_DOT = [
  ['⬛', '⬛', '⬛'],
  ['⬛', '🟨', '⬛'],
  ['⬛', '⬛', '⬛'],
];
const YELLOW_LINE = [
  ['⬛', '⬛', '⬛'],
  ['🟨', '🟨', '🟨'],
  ['⬛', '⬛', '⬛'],
];
const YELLOW_L = [
  ['🟨', '⬛', '⬛'],
  ['🟨', '🟨', '⬛'],
  ['⬛', '⬛', '⬛'],
];
const YELLOW_CROSS = [
  ['⬛', '🟨', '⬛'],
  ['🟨', '🟨', '🟨'],
  ['⬛', '🟨', '⬛'],
];
const YELLOW_FULL = [
  ['🟨', '🟨', '🟨'],
  ['🟨', '🟨', '🟨'],
  ['🟨', '🟨', '🟨'],
];

export const LESSONS: Lesson[] = [
  // ============================== 第 1 课 ==============================
  {
    id: 'tutorial-1',
    number: 1,
    title: '认识魔方',
    subtitle: '魔方有几面？每一块是什么？',
    emoji: '👀',
    durationMin: 5,
    goal: '让孩子知道魔方有 6 个面、3 种小块（中心/棱/角）。',
    introducesLetters: false,
    steps: [
      {
        title: '魔方有 6 个面',
        speech: '你好呀！我们一起来看看魔方。魔方一共有 6 个面，每个面都有不同的颜色。',
        alg: 'y y y y',
      },
      {
        title: '中心块不会动',
        speech: '每个面的正中间有一块，叫中心块。它永远在自己的位置上，不会跑。所以白色中心永远代表白色面。',
        emojiVisual: {
          caption: '中心块在每个面的正中间（红色圆点位置）',
          grid: [
            ['🟨', '🟨', '🟨'],
            ['🟨', '🔴', '🟨'],
            ['🟨', '🟨', '🟨'],
          ],
        },
      },
      {
        title: '棱块有两个颜色',
        speech: '边上的小块叫棱块，每一块都有两个颜色。一共有 12 块。',
        emojiVisual: {
          caption: '棱块在每条边的中间（绿色圆点位置）',
          grid: [
            ['🟨', '🟢', '🟨'],
            ['🟢', '⬜', '🟢'],
            ['🟨', '🟢', '🟨'],
          ],
        },
      },
      {
        title: '角块有三个颜色',
        speech: '四个角上的小块叫角块，每一块都有三个颜色。一共有 8 块。',
        emojiVisual: {
          caption: '角块在每个角上（蓝色圆点位置）',
          grid: [
            ['🔵', '🟨', '🔵'],
            ['🟨', '⬜', '🟨'],
            ['🔵', '🟨', '🔵'],
          ],
        },
      },
      {
        title: '小测验',
        speech: '我们来玩个小游戏！',
        quiz: {
          question: '魔方的中心块会动吗？',
          options: [
            { label: '会动', correct: false, explain: '不对哦，中心块永远不动。' },
            { label: '不会动', correct: true, explain: '答对啦！中心块永远不动，所以白色面的中心一直是白色。' },
          ],
        },
      },
    ],
  },

  // ============================== 第 2 课 ==============================
  {
    id: 'tutorial-2',
    number: 2,
    title: '学会转动',
    subtitle: '六个基本转法，用箭头记',
    emoji: '🔄',
    durationMin: 6,
    goal: '认识 6 个面的基本转动方向（先用方向词，不用字母）。',
    introducesLetters: false,
    steps: [
      {
        title: '拿魔方的姿势',
        speech: '我们先学怎么拿魔方。两只手分别抓住魔方的左右两边，让一个面正对自己。这一面叫"前面"，朝上的那一面叫"顶面"。',
        emojiVisual: {
          caption: '🫳 拿魔方的姿势：左右手各抓一边',
          grid: [
            ['', '⬆️ 顶面', ''],
            ['🫲', '🧊', '🫱'],
            ['', '前面（对着你）', ''],
          ],
        },
      },
      {
        title: '右边那一列向上',
        speech: '看右边这一列。我们让它整列向上转一下。',
        alg: 'R',
        arrowHint: '右边整列 ↑ 向上',
      },
      {
        title: '右边那一列向下',
        speech: '再试一下，把右边整列向下转。',
        alg: "R'",
        arrowHint: '右边整列 ↓ 向下',
      },
      {
        title: '左边那一列向下',
        speech: '换成左边。把左边整列向下转一下。',
        alg: 'L',
        arrowHint: '左边整列 ↓ 向下',
      },
      {
        title: '上面那一层转一下',
        speech: '看顶上这一层，我们让它转一下。',
        alg: 'U',
        arrowHint: '上面这一层 ↻ 转动',
      },
      {
        title: '前面那一面转一下',
        speech: '面对你的这一面，我们让它顺时针转一下。',
        alg: 'F',
        arrowHint: '前面这一面 ↻ 顺时针',
      },
      {
        title: '小测验',
        speech: '记住了吗？',
        quiz: {
          question: '我说「右边整列向上」，对应的是？',
          options: [
            { label: '右边那一列翻上去', correct: true, explain: '对啦！这就是我们说的 R。' },
            { label: '左边那一列翻上去', correct: false, explain: '是右边哦，再看一遍。' },
            { label: '上面那一层转', correct: false, explain: '那是另一个方向。' },
          ],
        },
      },
    ],
  },

  // ============================== 第 3 课 ==============================
  {
    id: 'tutorial-3',
    number: 3,
    title: '第一步：白色十字',
    subtitle: '把白色棱块对齐到底面',
    emoji: '➕',
    durationMin: 8,
    goal: '完成底面白色十字（底面 4 个棱块 + 侧面颜色对齐中心）。',
    introducesLetters: false, // 第 3 课只出现一个 F2，还没正式引入字母系统
    steps: [
      {
        title: '我们要做成什么样',
        speech: '这一课的目标：让魔方的白色面朝下，并且底面出现一个白色十字。看看做完后的样子。',
        goalImage: {
          caption: '✅ 学完这一步，从底下往上看，白色面是这样',
          face: WHITE_CROSS_GOAL,
        },
      },
      {
        title: '把白色面放底下',
        speech: '两只手转动魔方，让白色那一面朝下。白色中心朝下了就对了。',
        emojiVisual: {
          caption: '🔄 把魔方翻过来，白色面在下',
          grid: [
            ['', '⬆️ 现在顶上不是白', ''],
            ['🫲', '🧊', '🫱'],
            ['', '⬜ 白色在最下面', ''],
          ],
        },
      },
      {
        title: '什么是"白色棱块"',
        speech: '棱块是边上的小块，有两个颜色。如果两个颜色里有一个是白色，就叫白色棱块。一共有 4 个。',
        emojiVisual: {
          caption: '⬜+🔴 / ⬜+🟢 / ⬜+🔵 / ⬜+🟧 这 4 个就是白色棱块',
          grid: [
            ['⬜', '🔴', ''],
            ['⬜', '🟢', ''],
            ['⬜', '🔵', ''],
          ],
        },
      },
      {
        title: '把白色棱转到顶层',
        speech: '先找一个白色棱块。如果它在底下或者中间，我们要先把它转到顶层来，方便操作。',
      },
      {
        title: '对齐侧面颜色',
        speech: '看这个棱块除了白色的另一个颜色。比如是红色，就让它转到红色中心的正上方。',
        parentTip: '只有侧面颜色对齐了中心，最后扣下去才能形成"完整十字"。如果不对齐，扣下去的白色棱位置会错。',
      },
      {
        title: '把它扣下来',
        speech: '现在前面这一面转两下，白色就扣到底下了。这个动作叫 F2，意思是"前面转 2 下"。',
        alg: 'F2',
        arrowHint: '前面 ↻↻ 转两下',
        wcaHint: 'F2',
      },
      {
        title: '检查',
        speech: '完成后底面应该是一个白色的「十字」，而且侧面 4 个颜色刚好对齐中心。',
        goalImage: {
          caption: '✅ 底面应该长这样',
          face: WHITE_CROSS_GOAL,
        },
        quiz: {
          question: '十字做对了的标志是？',
          options: [
            { label: '底面 4 个白色棱齐了', correct: false, explain: '还差一点，侧面也要对齐中心。' },
            { label: '底面白色 + 侧面颜色对齐中心', correct: true, explain: '对！必须两个条件都满足。' },
          ],
        },
      },
    ],
  },

  // ============================== 第 4 课（正式引入字母系统） ==============================
  {
    id: 'tutorial-4',
    number: 4,
    title: '第二步：白色角',
    subtitle: '把 4 个白角放好',
    emoji: '🔻',
    durationMin: 8,
    goal: '完成整个白色底层。学会「右手公式」R U R\' U\'。',
    introducesLetters: true,
    steps: [
      {
        title: '认识字母代号',
        speech: '从这一课开始，我们要用字母代号来记动作。每个字母代表一个面的转法。这样念公式时一句话就能说完。',
        emojiVisual: {
          caption: '🔤 6 个字母代号',
          grid: [
            ['R = 右面', 'L = 左面', 'U = 上面'],
            ['F = 前面', 'B = 后面', 'D = 下面'],
            ["X' = 反方向", '2 = 转两下', ''],
          ],
        },
        parentTip: '为什么要用字母：公式 R U R\' U\' 比"右面向上、上面顺时针、右面向下、上面逆时针"短很多。家长可以陪小朋友念几遍，记不住没关系，看屏幕跟着做就行。',
      },
      {
        title: '把白角先转到顶层',
        speech: '找一个有白色的角块，把它转到顶层。注意看它另外两个颜色。',
      },
      {
        title: '对准下方的位置',
        speech: '让这个角块在它该去的位置的正上方。比如红蓝白角，就要在红蓝两个中心交界处的正上方。',
      },
      {
        title: '右手小口诀 R U R\' U\'',
        speech: '念出来：R、U、R 撇、U 撇。一直重复，直到白色角块归位。',
        alg: "R U R' U'",
        arrowHint: '右↑ 上↻ 右↓ 上↺',
        wcaHint: "R U R' U'",
        parentTip: '这是 CFOP 里最重要的口诀，叫 "sexy move"。后面所有难公式都是它的组合。',
      },
      {
        title: '4 个角都这样做',
        speech: '把另外 3 个白角也按这个口诀做。每次先把它转到正上方再开始。',
      },
      {
        title: '小测验',
        speech: '一起回顾。',
        quiz: {
          question: '右手小口诀是？',
          options: [
            { label: "R U R' U'", correct: true, explain: '答对！这就是右手小口诀。' },
            { label: "L U L' U'", correct: false, explain: '那是左手版本。' },
            { label: "R U R' F'", correct: false, explain: '前面变了，不一样哦。' },
          ],
        },
      },
    ],
  },

  // ============================== 第 5 课 ==============================
  {
    id: 'tutorial-5',
    number: 5,
    title: '第三步：第二层',
    subtitle: '左手公式 / 右手公式',
    emoji: '➡️',
    durationMin: 10,
    goal: '完成中间一层。学会左插和右插两个公式。',
    introducesLetters: true,
    steps: [
      {
        title: '翻过来看顶层',
        speech: '现在白色在下面没动过。我们看顶层。顶层棱块里，找一个"没有黄色"的，它就是要插到第二层的。',
        emojiVisual: {
          caption: '🔍 找顶层棱：没有黄色的就是它',
          grid: [
            ['', '🟨 顶面（黄色）', ''],
            ['🔴⬜', '🟨', '🟢⬜'],
            ['', '我们要找的不带黄的棱', ''],
          ],
        },
      },
      {
        title: '对准侧面中心',
        speech: '看棱块前面的颜色，把它转到对应的中心块上方。比如前面是红色，就转到红色中心上方。',
      },
      {
        title: '右插：把棱送到右边',
        speech: '如果该送到右边，念这个公式。',
        alg: "U R U' R' U' F' U F",
        arrowHint: '上↻ → 右↑ 上↺ 右↓ 上↺ 前↑ 上↻ 前↓',
        wcaHint: "U R U' R' U' F' U F",
      },
      {
        title: '左插：把棱送到左边',
        speech: '如果该送到左边，念这个公式。',
        alg: "U' L' U L U F U' F'",
        arrowHint: '上↺ → 左↑ 上↻ 左↓ 上↻ 前↓ 上↺ 前↑',
        wcaHint: "U' L' U L U F U' F'",
      },
      {
        title: '4 个棱都插完',
        speech: '把 4 个不带黄色的棱都插好。完成后底两层就还原了。',
        parentTip: '如果第二层已经有棱但放错了位置，先随便用一次右插或左插把它"挤出来"到顶层，再重新插。',
      },
    ],
  },

  // ============================== 第 6 课 ==============================
  {
    id: 'tutorial-6',
    number: 6,
    title: '第四步：黄色十字',
    subtitle: '顶面变成一个十字',
    emoji: '✚',
    durationMin: 7,
    goal: '完成顶面黄色十字（不要求侧面颜色对齐，只要黄色十字图形出现）。',
    introducesLetters: true,
    steps: [
      {
        title: '看顶面是哪种图形',
        speech: '低头看顶面黄色的形状。一定是这 4 种之一：点、线、L 形、十字。',
        emojiVisual: {
          caption: '👀 顶面 4 种状态',
          grid: [
            ['点', '线', 'L', '十字'],
          ],
        },
      },
      {
        title: '点：只有中心是黄色',
        speech: '如果顶面只有正中间是黄色，要念 3 次公式。',
        goalImage: { caption: '现在是"点"', face: YELLOW_DOT },
      },
      {
        title: '线：黄色排成一条横线',
        speech: '如果顶面中间一行是黄色，要念 1 次公式。注意线要"横着"，竖着的话先把上面转一下。',
        goalImage: { caption: '现在是"线"（要横着）', face: YELLOW_LINE },
      },
      {
        title: 'L 形：两边连着',
        speech: '如果顶面是 L 形，要念 2 次公式。注意 L 的缺口朝左后，否则先转上面调整。',
        goalImage: { caption: '现在是"L"（缺口朝左后）', face: YELLOW_L },
      },
      {
        title: '万能口诀 F R U R\' U\' F\'',
        speech: '不管你现在是哪种，都念这个口诀。',
        alg: "F R U R' U' F'",
        arrowHint: '前↻ → 右手公式 → 前↺',
        wcaHint: "F R U R' U' F'",
        parentTip: '记忆方法：F 包住右手公式 F 撇。中间夹的是上一课刚学的 R U R\' U\'。',
      },
      {
        title: '完成后是黄色十字',
        speech: '念完后顶面应该是黄色十字。这一步不要求侧面对齐，只要顶面看着是十字就行。',
        goalImage: { caption: '✅ 完成后', face: YELLOW_CROSS },
        quiz: {
          question: '顶面是「一个点」，要念几次公式？',
          options: [
            { label: '1 次', correct: false },
            { label: '2 次', correct: false },
            { label: '3 次', correct: true, explain: '对！点 → 线 → L → 十字，正好 3 次。' },
          ],
        },
      },
    ],
  },

  // ============================== 第 7 课 ==============================
  {
    id: 'tutorial-7',
    number: 7,
    title: '第五步：黄色面',
    subtitle: '让顶面全部变黄',
    emoji: '🟡',
    durationMin: 8,
    goal: '完成顶面全黄。学会「小鱼公式」。',
    introducesLetters: true,
    steps: [
      {
        title: '数一下顶面有几个黄角',
        speech: '看顶面四个角，有几个是黄色朝上？可能 0、1、2 个。',
        emojiVisual: {
          caption: '🔢 数顶面 4 个角',
          grid: [
            ['左后角', '右后角'],
            ['左前角', '右前角'],
          ],
        },
      },
      {
        title: '0 个黄角',
        speech: '把魔方转一下，让"前左角"的黄色朝向左边（不是朝上）。',
      },
      {
        title: '1 个黄角',
        speech: '把那个唯一朝上的黄角转到"左前下方"位置。',
      },
      {
        title: '2 个黄角',
        speech: '看哪两个黄色在侧面露出来，让其中一个朝"左前方"。',
      },
      {
        title: '念小鱼公式',
        speech: '所有情况都念这个公式，可能要重复 1-2 次。',
        alg: "R U R' U R U2 R'",
        arrowHint: '右↑ 上↻ 右↓ 上↻ 右↑ 上↻↻ 右↓',
        wcaHint: "R U R' U R U2 R'",
        parentTip: '这就是 OLL 的 Sune 公式，未来高级阶段会反复出现。',
      },
      {
        title: '完成后顶面全黄',
        goalImage: { caption: '✅ 顶面全黄', face: YELLOW_FULL },
        speech: '念完后顶面应该 9 块全是黄色。',
      },
    ],
  },

  // ============================== 第 8 课 ==============================
  {
    id: 'tutorial-8',
    number: 8,
    title: '第六步：最后一步',
    subtitle: '顶层归位，魔方还原！',
    emoji: '🏆',
    durationMin: 10,
    goal: '完成顶层角块归位 + 顶层棱块归位。整个魔方还原。',
    introducesLetters: true,
    steps: [
      {
        title: '先看角块',
        speech: '现在顶面全黄。低头看 4 个顶层角块的侧面。有没有哪个角，它两边的侧面颜色刚好对得上中心？',
        parentTip: '"角对了"的意思：这个角块的左侧颜色 = 左侧中心颜色，右侧颜色 = 右侧中心颜色。',
      },
      {
        title: '换角公式',
        speech: '如果只有 0 个或 2 个角对了，念这个公式。如果是 2 个对了，把对了的两个放在右边。',
        alg: "R' F R' B2 R F' R' B2 R2",
        arrowHint: '换前后两对角块的位置',
        wcaHint: "R' F R' B2 R F' R' B2 R2",
        parentTip: '这是 PLL 的 Aa Perm。孩子记不住没关系，会看屏幕跟着转就行。多做几次有手感。',
      },
      {
        title: '现在看棱块',
        speech: '4 个角对了之后看顶层棱。是不是有 1 个棱已经对了？让对的那个棱在后面（远离你）。',
      },
      {
        title: '转棱公式',
        speech: '念这个公式，最后 3 个棱会按逆时针换位。如果是顺时针，念两次就好。',
        alg: "R U' R U R U R U' R' U' R2",
        arrowHint: '逆时针转 3 个棱',
        wcaHint: "R U' R U R U R U' R' U' R2",
      },
      {
        title: '完成！',
        speech: '魔方还原啦！你是小魔方手！来撒个花 🎉',
        parentTip: '第一次还原可能要 30-60 分钟，多练几次会越来越快。记住：先学会，再求快。',
      },
    ],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getAdjacentLesson(id: string): { prev?: Lesson; next?: Lesson } {
  const idx = LESSONS.findIndex((l) => l.id === id);
  if (idx < 0) return {};
  return {
    prev: idx > 0 ? LESSONS[idx - 1] : undefined,
    next: idx < LESSONS.length - 1 ? LESSONS[idx + 1] : undefined,
  };
}
