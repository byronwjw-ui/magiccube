// ============================================================================
// 二阶魔方 Ortega 法 — 12 公式
//
// Ortega 法流程：
//   1. 随意还原一个面（不需要侧面对齐）
//   2. OLL：顶面 4 个角朝上（共 7 个 case，除了全上）
//   3. PBL：同时处理上下两层的角位（共 5 个 case，除了全对）
//
// 免费策略：馆许设计 — OLL 只开 Sune 和 Anti-Sune，PBL 只开顶棱邻插/顶棱对插
// 其余 8 个作为 Pro 内容
// ============================================================================
import type { Formula } from '@/types';
import { invertAlgorithm } from '@/lib/utils';

const FREE_2X2 = new Set<string>(['2oll-sune', '2oll-antisune', '2pbl-adj', '2pbl-opp']);

function mkOLL(
  id: string,
  number: number,
  name: string,
  algorithm: string,
  difficulty: 1 | 2 | 3,
  tip?: string,
  alts?: string[],
): Formula {
  return {
    id,
    category: 'OLL-2x2',
    subCategory: 'Ortega-OLL',
    number,
    name,
    algorithm,
    alternativeAlgorithms: alts,
    setupMoves: invertAlgorithm(algorithm),
    difficulty,
    isPremium: !FREE_2X2.has(id),
    tip,
    puzzle: '2x2x2',
  };
}

function mkPBL(
  id: string,
  number: number,
  name: string,
  algorithm: string,
  difficulty: 1 | 2 | 3,
  tip?: string,
  alts?: string[],
): Formula {
  return {
    id,
    category: 'PBL-2x2',
    subCategory: 'Ortega-PBL',
    number,
    name,
    algorithm,
    alternativeAlgorithms: alts,
    setupMoves: invertAlgorithm(algorithm),
    difficulty,
    isPremium: !FREE_2X2.has(id),
    tip,
    puzzle: '2x2x2',
  };
}

// ============================ Ortega OLL（7 个） ============================
export const TWO_OLL: Formula[] = [
  mkOLL('2oll-sune', 1, 'Sune', "R U R' U R U2 R'", 1, '与三阶 Sune 一样。三个黄色角顺时针指向外侧。'),
  mkOLL('2oll-antisune', 2, 'Anti-Sune', "R U2 R' U' R U' R'", 1, '与三阶 Anti-Sune 一样。逆时针版。'),
  mkOLL('2oll-pi', 3, 'Pi (H)', "R U2 R2 U' R2 U' R2 U2 R", 2, '两对同色面面对面。', [
    "F (R U R' U') (R U R' U') F'",
  ]),
  mkOLL('2oll-u', 4, 'U', "R2 U2 R U2 R2", 2, '两个黄色角靠在后面，前面两个角黄色朝下。'),
  mkOLL('2oll-t', 5, 'T', "R U R' U' R' F R2 U' R' U' R U R' F'", 2, '两个黄角在前面一排，后面黄色朝后。'),
  mkOLL('2oll-l', 6, 'L', "F R U' R' U' R U R' F'", 2, '两个黄角在对角线上。'),
  mkOLL('2oll-h', 7, 'H (Bowtie)', "F (R U R' U') F'", 1, '与三阶 OLL 45 一样的手感。'),
];

// ============================ Ortega PBL（5 个） ============================
export const TWO_PBL: Formula[] = [
  mkPBL('2pbl-adj', 1, '顶邻换·底对换', "R U' R F2 R' U R'", 1, '上层邻角互换，下层对角互换。', [
    "R2 U' B2 U2 R2 U' R2",
  ]),
  mkPBL('2pbl-opp', 2, '顶对换·底对换', "R2 F2 R2", 1, '上下层都是对角互换。最短公式！'),
  mkPBL('2pbl-bottom-only', 3, '仅底对换', "R2 U' R2 U2 y R2 U' R2", 2, '上层已全部对位，仅交换底层对角。', [
    "R2 U' B2 U2 R2 U' R2",
  ]),
  mkPBL('2pbl-top-only', 4, '仅顶对换', "R2 U R2 U2 F2 U R2", 2, '底层已全部对位，仅交换顶层对角。'),
  mkPBL('2pbl-adj-top-bottom', 5, '顶邻换·底邻换', "R U' R U2 F2 U' R U R2 F2", 3, '上下层都是邻角互换，最难的 case。', [
    "R U' R F2 R' U R' · (U) · R U' R F2 R' U R'",
  ]),
];

export const TWO_FORMULAS: Formula[] = [...TWO_OLL, ...TWO_PBL];

export function getTwoFormulaById(id: string): Formula | undefined {
  return TWO_FORMULAS.find((f) => f.id === id);
}
