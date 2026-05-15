// ============================================================================
// 二阶零基础入门教程 — 4 节课，Ortega 法
//
// 面向 6 岁孩子。二阶只有8个角块，没有棱和中心。
// 注意：他共用 lessons.ts 的 LessonStep 类型，TwistyPlayer 需要 puzzle=2x2x2
// 该文件抱歉 lesson 里没法直接传 puzzle 字段、现阶段在页面上统一指定 2x2x2
// ============================================================================
import type { Lesson, LessonStep } from './lessons';

export const LESSONS_2X2: Lesson[] = [
  // ============================== 第 1 课 ==============================
  {
    id: 'tutorial2-1',
    number: 1,
    title: '认识二阶',
    subtitle: '二阶只有 8 个角',
    emoji: '👀',
    durationMin: 4,
    goal: '让孩子知道二阶和三阶的区别。',
    introducesLetters: false,
    steps: [
      {
        title: '二阶是什么',
        speech: '二阶魔方看起来像三阶的“小个子”。他只有 2x2 的格子，不要害怕。',
        alg: 'y y',
      },
      {
        title: '二阶只有角块',
        speech: '二阶一共只有 8 个角块。没有棱，没有中心。所以比三阶简单很多。',
        emojiVisual: {
          caption: '二阶 vs 三阶：二阶只有24个贴纸，三阶有54个',
          grid: [
            ['🔵🔵', 'VS', '🔵🔵🔵'],
            ['🔵🔵', '', '🔵🔵🔵'],
            ['二阶', '', '🔵🔵🔵'],
            ['', '', '三阶'],
          ],
        },
      },
      {
        title: '三步法',
        speech: '二阶只要 3 步就能还原：第一步还原一个面，第二步让顶面黄色朝上，第三步上下层一起归位。',
        emojiVisual: {
          caption: '📖 三步流程',
          grid: [
            ['1️⃣ 底面', '→', '2️⃣ 顶面黄', '→', '3️⃣ 全还原'],
          ],
        },
      },
      {
        title: '小测验',
        speech: '我们来玩个小游戏。',
        quiz: {
          question: '二阶一共有多少块？',
          options: [
            { label: '4 块', correct: false, explain: '不够哦。' },
            { label: '8 块', correct: true, explain: '对！4 个上面的角加上 4 个下面的角。' },
            { label: '12 块', correct: false, explain: '多了，二阶没有棱块。' },
          ],
        },
      },
    ],
  },

  // ============================== 第 2 课 ==============================
  {
    id: 'tutorial2-2',
    number: 2,
    title: '第一步：底面',
    subtitle: '先还原一个面',
    emoji: '⬜',
    durationMin: 8,
    goal: '拼出一个完整的白色面（底面），侧面不需要对齐。',
    introducesLetters: false,
    steps: [
      {
        title: '选个颜色当底',
        speech: '我们一般选白色作底面。你要把 4 个“有白色”的角块拼到一起，让它们的白色朝下。',
      },
      {
        title: '找白角',
        speech: '看魔方 8 个角块。有4 个有白色。先找一个，把它转到底那个位置。',
      },
      {
        title: '右手小口诀 (sexy move)',
        speech: '如果角块在顶部，让它在“右上后”位置，然后念这个口诀。跟三阶一样。',
        alg: "R U R' U'",
        arrowHint: '右↑ 上↻ 右↓ 上↺',
        wcaHint: "R U R' U'",
        parentTip: '这个就是三阶里最重要的 sexy move。二阶玩熟到重返三阶也会用。',
      },
      {
        title: '4 个白角都这样拼',
        speech: '一个一个拼。拼完一个后转一下底层，让下一个空位对着你。',
      },
      {
        title: '完成后',
        speech: '底面应该是整片白色。侧面是“乱的”也没关系，不要求对齐。',
        goalImage: {
          caption: '✅ 底面全白',
          face: [
            ['⬜', '⬜'],
            ['⬜', '⬜'],
          ] as unknown as string[][],
        },
      },
    ],
  },

  // ============================== 第 3 课 ==============================
  {
    id: 'tutorial2-3',
    number: 3,
    title: '第二步：顶面黄色',
    subtitle: '让顶上 4 个黄色朝上',
    emoji: '🟡',
    durationMin: 8,
    goal: '不管位置对不对，让顶面全黄。',
    introducesLetters: true,
    steps: [
      {
        title: '看顶面黄色个数',
        speech: '把白面继续放在下面。看顶面 4 个角，有3种情况：0 个黄、邻边 2 个黄、对角 2 个黄。',
      },
      {
        title: '情况一：Sune',
        speech: '如果只有1个黄角朝上，把它放在左前，念 Sune 公式。',
        alg: "R U R' U R U2 R'",
        arrowHint: '右↑ 上↻ 右↓ 上↻ 右↑ 上↻↻ 右↓',
        wcaHint: "R U R' U R U2 R'",
      },
      {
        title: '情况二：Anti-Sune',
        speech: '如果有3个黄角朝上且唯一不黄的在右前，念 Anti-Sune。',
        alg: "R U2 R' U' R U' R'",
        arrowHint: '右↑ 上↻↻ 右↓ 上↺ 右↑ 上↺ 右↓',
        wcaHint: "R U2 R' U' R U' R'",
      },
      {
        title: '其他情况',
        speech: '还有5 种不同的顶面状态。每种都有专属公式，可以去「二阶 · OLL」里查。不着急，先背 Sune 和 Anti-Sune足够应付起步。',
      },
      {
        title: '完成后',
        speech: '顶面 4 个贴纸应该都是黄色。侧面颜色还是乱的，别担心，下一课处理。',
        goalImage: {
          caption: '✅ 顶面全黄',
          face: [
            ['🟨', '🟨'],
            ['🟨', '🟨'],
          ] as unknown as string[][],
        },
      },
    ],
  },

  // ============================== 第 4 课 ==============================
  {
    id: 'tutorial2-4',
    number: 4,
    title: '第三步：PBL归位',
    subtitle: '上下两层同时归位',
    emoji: '🏆',
    durationMin: 8,
    goal: '一个公式同时调上下层 4 个角。二阶还原。',
    introducesLetters: true,
    steps: [
      {
        title: '先看底面需要怎么调',
        speech: '现在顶面全黄。拿起魔方从侧面看。底下那层 4 个角，有3 种可能：全对、邻互换、对互换。',
      },
      {
        title: '情况一：上下全对换',
        speech: '如果上下两层都是“对角互换”，念这个超短公式，只有 3 步。',
        alg: 'R2 F2 R2',
        arrowHint: '右↻↻ 前↻↻ 右↻↻',
        wcaHint: 'R2 F2 R2',
      },
      {
        title: '情况二：顶邻·底对',
        speech: '顶层是邻角互换，底层是对角互换。这是最常见的情况。',
        alg: "R U' R F2 R' U R'",
        arrowHint: '邻换公式',
        wcaHint: "R U' R F2 R' U R'",
      },
      {
        title: '其他 PBL',
        speech: '还有 3 种情况，可以去「二阶 · PBL」里查。不着急。',
      },
      {
        title: '完成！',
        speech: '二阶还原！你是二阶小高手 🎉',
        parentTip: '二阶熟了平均 30 秒能还原。接下来可以试三阶入门教程。',
      },
    ],
  },
];

export function getLesson2x2ById(id: string): Lesson | undefined {
  return LESSONS_2X2.find((l) => l.id === id);
}

export function getAdjacent2x2Lesson(id: string): { prev?: Lesson; next?: Lesson } {
  const idx = LESSONS_2X2.findIndex((l) => l.id === id);
  if (idx < 0) return {};
  return {
    prev: idx > 0 ? LESSONS_2X2[idx - 1] : undefined,
    next: idx < LESSONS_2X2.length - 1 ? LESSONS_2X2[idx + 1] : undefined,
  };
}

export type { Lesson, LessonStep };
