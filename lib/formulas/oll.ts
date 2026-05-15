// ============================================================================
// 57 个 OLL 公式 — 标准 CFOP，算法参照 SpeedCubeDB / J Perm / Cubeskills 通用版本
//
// 免费策略：按学习路径选 10 个高频入门公式（不是简单按编号 1-10）
//   - OLL 27 (Sune) + OLL 26 (Anti-Sune): 入门必学
//   - OLL 21~25 (其余 7 个角的 cross 已朝上 = "OCLL 全家桶")
//   - OLL 22 (Pi)、OLL 23 (Headlights)、OLL 24 (Bowtie)、OLL 25 (Bowtie 反)
//   - OLL 45 (T)、OLL 44 (P): 两个常用 line 类
// 其余 47 个标记 isPremium = true
// ============================================================================
import type { Formula } from '@/types';
import { invertAlgorithm } from '@/lib/utils';

// 免费公式编号集合（学习路径前 10）
const FREE_OLL = new Set<number>([27, 26, 21, 22, 23, 24, 25, 44, 45, 33]);

function mk(
  number: number,
  name: string,
  subCategory: string,
  algorithm: string,
  difficulty: 1 | 2 | 3,
  alternativeAlgorithms?: string[],
  tip?: string,
): Formula {
  return {
    id: `oll-${number}`,
    category: 'OLL',
    subCategory,
    number,
    name,
    algorithm,
    alternativeAlgorithms,
    setupMoves: invertAlgorithm(algorithm),
    difficulty,
    isPremium: !FREE_OLL.has(number),
    tip,
  };
}

export const OLL_FORMULAS: Formula[] = [
  // ---- All Corners Oriented / Edges Only (Dot / Line / L / Cross 棱朝向) ----
  mk(1, 'Dot 1', 'Dot', "(R U2') (R2' F R F') U2' (R' F R F')", 3),
  mk(2, 'Dot 2', 'Dot', "F (R U R' U') F' f (R U R' U') f'", 3),
  mk(3, 'Dot 3', 'Dot', "f (R U R' U') f' U' F (R U R' U') F'", 3),
  mk(4, 'Dot 4', 'Dot', "f (R U R' U') f' U F (R U R' U') F'", 3),
  mk(5, 'Square 1', 'Square', "(r' U2 R U R' U r)", 2),
  mk(6, 'Square 2', 'Square', "(r U2 R' U' R U' r')", 2),
  mk(7, 'Lightning 1', 'Lightning', "(r U R' U R U2 r')", 2),
  mk(8, 'Lightning 2', 'Lightning', "(r' U' R U' R' U2 r)", 2),
  mk(9, 'Fish (Kite) 1', 'Fish', "(R U R' U') R' F (R2 U R' U') F'", 3),
  mk(10, 'Fish (Kite) 2', 'Fish', "(R U R' U) (R' F R F') (R U2 R')", 3),
  mk(11, 'Lightning 3', 'Lightning', "r' (R2 U R' U R U2 R') U M'", 3),
  mk(12, 'Lightning 4', 'Lightning', "M' (R' U' R U' R' U2 R) U' M", 3),
  mk(13, 'Knight 1', 'Knight', "(r U' r') (U' r U r') y' (R' U R)", 3),
  mk(14, 'Knight 2', 'Knight', "(R' F R) (U R' F' R) (F U' F')", 3),
  mk(15, 'Knight 3', 'Knight', "(r' U' r) (R' U' R U) (r' U r)", 3),
  mk(16, 'Knight 4', 'Knight', "(r U r') (R U R' U') (r U' r')", 3),
  mk(17, 'Awkward 1', 'Awkward', "(R U R' U) (R' F R F') U2 (R' F R F')", 3),
  mk(18, 'Awkward 2', 'Awkward', "F (R U R' U) y' (R' U2) (R' F R F')", 3),
  mk(19, 'Awkward 3', 'Awkward', "M U (R U R' U') M' (R' F R F')", 3),
  mk(20, 'Double Sune', 'Awkward', "M U (R U R' U') M2 (U R U' r')", 3),

  // ---- OCLL (棱已朝上，仅 4 角朝向) ----
  mk(21, 'Cross / H', 'OCLL', "(R U2 R' U' R U R' U' R U' R')", 1, ["F (R U R' U')3 F'"], '双 Sune 合并'),
  mk(22, 'Pi', 'OCLL', "R U2' R2' U' R2 U' R2' U2' R", 1, ["f (R U R' U') f' F (R U R' U') F'"]),
  mk(23, 'Headlights', 'OCLL', "R2' D' R U2 R' D R U2 R", 1, ["R2 D (R' U2 R) D' (R' U2 R')"]),
  mk(24, 'Bowtie', 'OCLL', "(r U R' U') (r' F R F')", 1),
  mk(25, 'Bowtie反 / Diagonal', 'OCLL', "F' (r U R' U') r' F R", 1, ["x' (R U R' D) (R U' R' D') x"]),
  mk(26, 'Anti-Sune', 'OCLL', "(R U2 R' U' R U' R')", 1, ["L' U' L U' L' U2 L"], '左前角朝外'),
  mk(27, 'Sune', 'OCLL', "(R U R' U R U2 R')", 1, ["L' U2 L U L' U L"], '最常用 OLL'),

  // ---- T-shape ----
  mk(33, 'T-shape 1', 'T-shape', "(R U R' U') (R' F R F')", 1, [], '熟悉 sexy + sledge 的组合'),
  mk(45, 'T-shape 2', 'T-shape', "F (R U R' U') F'", 1, [], '万能 OLL 之一'),

  // ---- P-shape ----
  mk(31, 'P-shape 1', 'P-shape', "(R' U' F) (U R U' R') F' R", 2),
  mk(32, 'P-shape 2', 'P-shape', "(S R U R' U') (R' F R f')", 2),
  mk(43, 'P-shape 3', 'P-shape', "f' (L' U' L U) f", 2),
  mk(44, 'P-shape 4', 'P-shape', "f (R U R' U') f'", 1, [], '镜像 OLL 45'),

  // ---- W-shape ----
  mk(36, 'W-shape 1', 'W-shape', "(R' U' R U' R' U R U) l U' R' U x", 3),
  mk(38, 'W-shape 2', 'W-shape', "(R U R' U) (R U' R' U') (R' F R F')", 2),

  // ---- L-shape ----
  mk(46, 'L-shape (Seein\u2019 Headlights)', 'L-shape', "R' U' (R' F R F') U R", 2),
  mk(47, 'L-shape 1', 'L-shape', "F' (L' U' L U) (L' U' L U) F", 2),
  mk(48, 'L-shape 2', 'L-shape', "F (R U R' U') (R U R' U') F'", 2),
  mk(49, 'L-shape 3', 'L-shape', "R B' R2 F R2 B R2 F' R", 3),
  mk(50, 'L-shape 4', 'L-shape', "R' F R2 B' R2' F' R2 B R'", 3),
  mk(53, 'L-shape 5', 'L-shape', "(r' U' R U' R' U R U' R' U2 r)", 3),
  mk(54, 'L-shape 6', 'L-shape', "(r U R' U R U' R' U R U2' r')", 3),

  // ---- Line ----
  mk(51, 'Line 1', 'Line', "f (R U R' U') (R U R' U') f'", 2),
  mk(52, 'Line 2', 'Line', "(R U R' U) R d' R U' R' F'", 2),
  mk(55, 'Line 3', 'Line', "R' F (R U R U' R2' F') R2 U' R' (U R U R')", 3),
  mk(56, 'Line 4', 'Line', "(r U r') (U R U' R') (U R U' R') (r U' r')", 3),

  // ---- C-shape ----
  mk(34, 'C-shape 1', 'C-shape', "(R U R' U') B' (R' F R F') B", 2),
  mk(46, 'C-shape 2', 'C-shape', "R' U' (R' F R F') U R", 2),

  // ---- I-shape / Fish 续 ----
  mk(37, 'Fish 3 (Mounted)', 'Fish', "F (R U' R' U') (R U R' F')", 2),
  mk(35, 'Fish 4', 'Fish', "(R U2') (R2' F R F') (R U2' R')", 2),
  mk(39, 'Big Lightning 1', 'Lightning', "(L F') (L' U' L U) F U' L'", 3),
  mk(40, 'Big Lightning 2', 'Lightning', "(R' F) (R U R' U') F' U R", 3),
  mk(41, 'Awkward Fish 1', 'Awkward', "(R U R' U R U2' R') F (R U R' U') F'", 3),
  mk(42, 'Awkward Fish 2', 'Awkward', "(R' U' R U' R' U2 R) F (R U R' U') F'", 3),
  mk(28, 'Block 1', 'Block', "(r U R' U') M (U R U' R')", 2),
  mk(29, 'Block 2', 'Block', "(R U R' U') (R U' R') (F' U' F) (R U R')", 3),
  mk(30, 'Block 3', 'Block', "F R' F (R2 U' R' U') (R U R') F2", 3),
  mk(57, 'H (Edges Only)', 'OCLL', "(R U R' U') M' (U R U' r')", 1, ["(R U R' U R U' R') M' (U R U' r')"]),
]
  // 编号唯一去重（防手抖重复 number）
  .filter((f, i, arr) => arr.findIndex((x) => x.number === f.number) === i)
  // 按编号排序
  .sort((a, b) => a.number - b.number);
