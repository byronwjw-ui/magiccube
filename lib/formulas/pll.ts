// ============================================================================
// 21 个 PLL 公式 — 标准 CFOP，算法参照 J Perm / Cubeskills 通用版本
//
// 免费策略：学习路径前 5 个入门 PLL：Ua / Ub / H / Z / Aa
// 其余 16 个标记 isPremium = true
//
// PLL 编号沿用社区惯例：1..21（按字母顺序：Aa Ab E F Ga Gb Gc Gd H Ja Jb Na Nb Ra Rb T Ua Ub V Y Z）
// ============================================================================
import type { Formula } from '@/types';
import { invertAlgorithm } from '@/lib/utils';

const FREE_PLL = new Set<string>(['Ua', 'Ub', 'H', 'Z', 'Aa']);

function mk(
  number: number,
  code: string,
  name: string,
  subCategory: string,
  algorithm: string,
  difficulty: 1 | 2 | 3,
  alternativeAlgorithms?: string[],
  tip?: string,
): Formula {
  return {
    id: `pll-${code.toLowerCase()}`,
    category: 'PLL',
    subCategory,
    number,
    name,
    algorithm,
    alternativeAlgorithms,
    setupMoves: invertAlgorithm(algorithm),
    difficulty,
    isPremium: !FREE_PLL.has(code),
    tip,
  };
}

export const PLL_FORMULAS: Formula[] = [
  // ---- 仅交换角 (Corners Only) ----
  mk(1, 'Aa', 'Aa Perm', 'Corners Only', "x (R' U R') D2 (R U' R') D2 R2 x'", 1, [
    "y' x' (R2 D2) (R' U' R) D2 (R' U R')",
  ], '右后顺时针三角换'),
  mk(2, 'Ab', 'Ab Perm', 'Corners Only', "x R2' D2 (R U R') D2 (R U' R) x'", 1, [
    "y2 x (R2 D2 R U R' D2 R U' R)",
  ]),
  mk(3, 'E', 'E Perm', 'Corners Only', "x' (R U' R' D) (R U R' D') (R U R' D) (R U' R' D') x", 3),

  // ---- 仅交换棱 (Edges Only) ----
  mk(17, 'Ua', 'Ua Perm', 'Edges Only', "(R U' R U R U) (R U' R' U' R2)", 1, [
    "M2 U M U2 M' U M2",
  ], '前棱逆时针三换'),
  mk(18, 'Ub', 'Ub Perm', 'Edges Only', "R2 U (R U R' U') (R' U' R' U R')", 1, [
    "M2 U' M U2 M' U' M2",
  ], '前棱顺时针三换'),
  mk(9, 'H', 'H Perm', 'Edges Only', "M2 U M2 U2 M2 U M2", 1, [], '对面棱对换'),
  mk(21, 'Z', 'Z Perm', 'Edges Only', "M' U M2 U M2 U M' U2 M2", 1, [
    "M2 U M2 U M' U2 M2 U2 M'",
  ], '相邻棱对换'),

  // ---- 邻角交换 ----
  mk(10, 'Ja', 'Ja Perm', 'Adjacent Swap', "(R' U L' U2) (R U' R' U2 R L)", 2, [
    "x R2 F R F' R U2 r' U r U2 x'",
  ]),
  mk(11, 'Jb', 'Jb Perm', 'Adjacent Swap', "(R U R' F') (R U R' U') R' F R2 U' R'", 2),
  mk(16, 'T', 'T Perm', 'Adjacent Swap', "(R U R' U') (R' F R2 U' R' U') (R U R' F')", 1, [], '最常用 PLL'),
  mk(4, 'F', 'F Perm', 'Adjacent Swap', "(R' U' F') (R U R' U') (R' F R2 U' R' U') (R U R' U R)", 3),
  mk(14, 'Ra', 'Ra Perm', 'Adjacent Swap', "(R U' R' U') (R U R D) (R' U' R D') R' U2 R'", 3),
  mk(15, 'Rb', 'Rb Perm', 'Adjacent Swap', "(R' U2 R U2') R' F (R U R' U') R' F' R2", 3),

  // ---- G 系列 ----
  mk(5, 'Ga', 'Ga Perm', 'G Perms', "R2 U (R' U R' U') (R U' R2) D U' (R' U R) D'", 3),
  mk(6, 'Gb', 'Gb Perm', 'G Perms', "(R' U' R) U D' (R2 U R' U) (R U' R U' R2 D)", 3),
  mk(7, 'Gc', 'Gc Perm', 'G Perms', "R2' U' (R U' R U) (R' U R2 D') (U R U' R') D", 3),
  mk(8, 'Gd', 'Gd Perm', 'G Perms', "(R U R') U' D (R2 U' R U') (R' U R' U R2) D'", 3),

  // ---- 对角换 (Diagonal Swap) ----
  mk(12, 'Na', 'Na Perm', 'Diagonal Swap', "(R U R' U) (R U R' F') (R U R' U') (R' F R2 U' R' U2 R U' R')", 3, [
    "z U R' D R2 U' R D' U R' D R2 U' R D' z'",
  ]),
  mk(13, 'Nb', 'Nb Perm', 'Diagonal Swap', "(R' U R U') (R' F' U' F) (R U R' F) R' F' (R U' R)", 3),
  mk(19, 'V', 'V Perm', 'Diagonal Swap', "(R' U R' U') y (R' F' R2 U') (R' U R' F) R F", 3),
  mk(20, 'Y', 'Y Perm', 'Diagonal Swap', "F R U' R' U' (R U R' F') (R U R' U') (R' F R F')", 2),
]
  .filter((f, i, arr) => arr.findIndex((x) => x.id === f.id) === i)
  .sort((a, b) => a.number - b.number);
