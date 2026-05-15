// ============================================================================
// 零基础入门教程 — 8 节课，层先法 (Layer by Layer)
//
// 设计原则（针对 6 岁孩子）：
//  - 第 1-2 课：完全不出现 WCA 字母，只用箭头+颜色+口语化中文
//  - 第 3-4 课开始：箭头 + 字母「并排显示」，逐渐建立映射
//  - 第 5-8 课：字母为主，箭头辅助
//  - 每节课 5-8 分钟，3-6 个小步骤，每步带朗读引导语
//  - 每节课完成给 3 颗星 + 撒花
// ============================================================================

export interface LessonStep {
  /** 步骤标题 */
  title: string;
  /** 朗读引导语 / 主体说明 */
  speech: string;
  /** 视觉演示算法（喂给 <twisty-player>），为空表示纯讲解 */
  alg?: string;
  /** 还原打乱（让魔方先变成待解状态） */
  setupAlg?: string;
  /** 动作箭头提示（口语化），如 '把右边那一列向上转' */
  arrowHint?: string;
  /** 对应的 WCA 字母（用于「箭头 + 字母」并排显示），如 "R" */
  wcaHint?: string;
  /** 额外补充说明（家长提示等） */
  parentTip?: string;
  /** 该步骤的小测验，做对得星星，可选 */
  quiz?: {
    question: string;
    options: { label: string; correct: boolean; explain?: string }[];
  };
}

export interface Lesson {
  id: string;             // tutorial-1 .. tutorial-8
  number: number;         // 1..8
  title: string;
  subtitle: string;
  emoji: string;
  /** 预计用时分钟数 */
  durationMin: number;
  /** 学习目标，给家长看的 */
  goal: string;
  /** 步骤列表 */
  steps: LessonStep[];
  /** 该课开始引入字母？影响是否显示 wcaHint */
  introducesLetters: boolean;
}

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
        parentTip: '请家长和小朋友一起数一数，看到了几种颜色？',
      },
      {
        title: '中心块不会动',
        speech: '每个面的正中间有一块，叫中心块。它永远在自己的位置上，不会跑。所以白色中心永远代表白色面。',
        alg: '',
        parentTip: '可以让小朋友指出魔方上的 6 个中心块。',
      },
      {
        title: '棱块有两个颜色',
        speech: '边上的小块叫棱块，每一块都有两个颜色。一共有 12 块。',
      },
      {
        title: '角块有三个颜色',
        speech: '四个角上的小块叫角块，每一块都有三个颜色。一共有 8 块。',
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
        title: '右边那一列向上',
        speech: '把魔方拿正，看右边这一列。我们让它整列向上转一下。',
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

  // ============================== 第 3 课（首次引入字母） ==============================
  {
    id: 'tutorial-3',
    number: 3,
    title: '第一步：白色十字',
    subtitle: '把白色棱块对齐到底面',
    emoji: '➕',
    durationMin: 8,
    goal: '完成底面白色十字（底面 4 个棱块 + 侧面颜色对齐中心）。从这节开始字母和箭头并排显示。',
    introducesLetters: true,
    steps: [
      {
        title: '把白色面放底下',
        speech: '我们把白色面翻到下面。从现在开始，每一步我会告诉你「转哪一面」，也会告诉你它的英文字母名字。',
        parentTip: '家长可以陪小朋友一起念字母。R 念「ar」, U 念「优」, F 念「ef」。',
      },
      {
        title: '找一个白色棱块',
        speech: '找一个有白色的棱块。把它转到顶层，让白色朝上或朝侧面。',
      },
      {
        title: '对齐侧面颜色',
        speech: '看棱块另一个颜色，把它转到对应的中心块上面。比如红白棱块就转到红色中心上方。',
      },
      {
        title: '把它扣下来',
        speech: '现在让前面这一面转两下，白色就扣到底下了。',
        alg: 'F2',
        arrowHint: '前面 ↻↻ 转两下',
        wcaHint: 'F2',
      },
      {
        title: '一个一个来',
        speech: '把其余 3 个白色棱块也这样做。每做完一个，就转动底层让下一个空位对着你。',
        alg: "F2 R2 U' R2",
      },
      {
        title: '检查',
        speech: '完成后底面应该是一个白色的「十字」，而且侧面 4 个颜色刚好对齐中心。',
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

  // ============================== 第 4 课 ==============================
  {
    id: 'tutorial-4',
    number: 4,
    title: '第二步：白色角',
    subtitle: '把 4 个白角放好',
    emoji: '🔻',
    durationMin: 8,
    goal: '完成整个白色底层（白色面 + 侧面三个颜色对齐）。学会「右手公式」雏形。',
    introducesLetters: true,
    steps: [
      {
        title: '把白角先转到顶层',
        speech: '找一个有白色的角块，把它转到顶层。注意看它另外两个颜色。',
      },
      {
        title: '对准下方的位置',
        speech: '让这个角块在它该去的位置的正上方。比如红蓝白角，就要在红蓝两个中心交界处的正上方。',
      },
      {
        title: '右手小口诀',
        speech: '念出来：右上、右下、左上、左下。一直重复，直到角块归位。',
        alg: "R U R' U'",
        arrowHint: '右↑ 上↻ 右↓ 上↺',
        wcaHint: "R U R' U'",
        parentTip: '这是 CFOP 的「sexy move」，未来 OLL/PLL 都要用，最重要的口诀之一。',
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
        title: '翻过来',
        speech: '把白色面翻到下面。现在我们看顶层棱块。',
      },
      {
        title: '找不含黄色的顶层棱',
        speech: '顶层的棱块里，找一个没有黄色的。看它前面的颜色，对准侧面的中心。',
      },
      {
        title: '右插：把棱送到右边',
        speech: '如果要送到右边，先把上面顺时针转一下，然后用右手公式。',
        alg: "U R U' R' U' F' U F",
        arrowHint: '上↻ → 右手公式 → 上↺ → 前手公式',
        wcaHint: "U R U' R' U' F' U F",
      },
      {
        title: '左插：把棱送到左边',
        speech: '如果要送到左边，先把上面逆时针转一下，然后用左手公式。',
        alg: "U' L' U L U F U' F'",
        arrowHint: '上↺ → 左手公式 → 上↻ → 前手公式',
        wcaHint: "U' L' U L U F U' F'",
      },
      {
        title: '4 个棱都插完',
        speech: '把 4 个中间棱都插好。完成后底两层就还原了。',
        parentTip: '如果第二层已经有棱但放错了位置，先把任意一个错的棱「插出来」到顶层，再重新插。',
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
        title: '看顶面图形',
        speech: '看顶面黄色的形状：可能是「一个点」「一条线」「L 形」或者已经是「十字」。',
      },
      {
        title: '万能口诀',
        speech: '不管是哪种，都念这个口诀。可能要念 1-3 次才能变成十字。',
        alg: "F R U R' U' F'",
        arrowHint: '前↻ → 右手公式 → 前↺',
        wcaHint: "F R U R' U' F'",
        parentTip: '点 → 念 3 次；L → 念 2 次（L 缺口朝左后）；线 → 念 1 次（线横着）。',
      },
      {
        title: '小测验',
        speech: '记一下。',
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
      },
      {
        title: '0 个黄角：让前左角的黄色朝左',
        speech: '把魔方转一下，让前左角的黄色朝向左边。',
      },
      {
        title: '1 个黄角：让黄角在左下',
        speech: '把那个唯一的黄角转到左前下方位置。',
      },
      {
        title: '2 个黄角：让黄色朝向左前',
        speech: '看哪两个黄色露在外侧，让其中一个朝左前方。',
      },
      {
        title: '念小鱼公式',
        speech: '念这个口诀，可能要重复 1-2 次。',
        alg: "R U R' U R U2 R'",
        arrowHint: '右↑ 上↻ 右↓ 上↻ 右↑ 上↻↻ 右↓',
        wcaHint: "R U R' U R U2 R'",
        parentTip: '这就是 OLL 的 Sune 公式，未来高级阶段会反复出现。',
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
        speech: '看 4 个顶层角块。是不是有 2 个已经在正确位置（侧面颜色对了两边）？',
      },
      {
        title: '换角公式',
        speech: '如果只有 0 或 2 个角对了，念这个公式。',
        alg: "R' F R' B2 R F' R' B2 R2",
        arrowHint: '换前后两对角块的位置',
        wcaHint: "R' F R' B2 R F' R' B2 R2",
        parentTip: '这是「Aa Perm」的简化版本，孩子记不住没关系，会看公式跟着做就行。',
      },
      {
        title: '再看棱块',
        speech: '4 个角对了之后看顶层棱。是不是有 1 个棱已经对了？',
      },
      {
        title: '转棱公式',
        speech: '让对的那个棱在后面，然后念公式。',
        alg: "R U' R U R U R U' R' U' R2",
        arrowHint: '逆时针转 3 个棱',
        wcaHint: "R U' R U R U R U' R' U' R2",
      },
      {
        title: '完成！',
        speech: '魔方还原啦！你是小魔方手！',
        parentTip: '第一次还原可能要 30-60 分钟，多练几次会越来越快。',
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
