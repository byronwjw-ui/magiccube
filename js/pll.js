/* =============================================================================
 * 21 个 PLL 公式 — 标准 CFOP，沿用 J Perm / Cubeskills 通用版本
 * 免费 5 个：Ua / Ub / H / Z / Aa
 * ============================================================================= */
(function(){
  function pllEntry(number, code, name, sub, alg, diff, alts, tip) {
    return {
      id: 'pll-' + code.toLowerCase(),
      category: 'PLL',
      subCategory: sub,
      number: number,
      name: name,
      algorithm: alg,
      alternativeAlgorithms: alts || [],
      setupMoves: invertAlgorithm(alg),
      difficulty: diff,
      isPremium: !FREE_PLL_CODES[code],
      tip: tip || ''
    };
  }

  PLL_FORMULAS = [
    // Corners Only
    pllEntry(1, 'Aa', 'Aa Perm', 'Corners Only', "x (R' U R') D2 (R U' R') D2 R2 x'", 1,
      ["y' x' (R2 D2) (R' U' R) D2 (R' U R')"], '右后顺时针三角换'),
    pllEntry(2, 'Ab', 'Ab Perm', 'Corners Only', "x R2' D2 (R U R') D2 (R U' R) x'", 1,
      ["y2 x (R2 D2 R U R' D2 R U' R)"]),
    pllEntry(3, 'E',  'E Perm',  'Corners Only', "x' (R U' R' D) (R U R' D') (R U R' D) (R U' R' D') x", 3),

    // Edges Only
    pllEntry(17, 'Ua', 'Ua Perm', 'Edges Only', "(R U' R U R U) (R U' R' U' R2)", 1,
      ["M2 U M U2 M' U M2"], '前棱逆时针三换'),
    pllEntry(18, 'Ub', 'Ub Perm', 'Edges Only', "R2 U (R U R' U') (R' U' R' U R')", 1,
      ["M2 U' M U2 M' U' M2"], '前棱顺时针三换'),
    pllEntry(9,  'H',  'H Perm',  'Edges Only', "M2 U M2 U2 M2 U M2", 1, [], '对面棱对换'),
    pllEntry(21, 'Z',  'Z Perm',  'Edges Only', "M' U M2 U M2 U M' U2 M2", 1,
      ["M2 U M2 U M' U2 M2 U2 M'"], '相邻棱对换'),

    // Adjacent Swap
    pllEntry(10, 'Ja', 'Ja Perm', 'Adjacent Swap', "(R' U L' U2) (R U' R' U2 R L)", 2,
      ["x R2 F R F' R U2 r' U r U2 x'"]),
    pllEntry(11, 'Jb', 'Jb Perm', 'Adjacent Swap', "(R U R' F') (R U R' U') R' F R2 U' R'", 2),
    pllEntry(16, 'T',  'T Perm',  'Adjacent Swap', "(R U R' U') (R' F R2 U' R' U') (R U R' F')", 1, [], '最常用 PLL'),
    pllEntry(4,  'F',  'F Perm',  'Adjacent Swap', "(R' U' F') (R U R' U') (R' F R2 U' R' U') (R U R' U R)", 3),
    pllEntry(14, 'Ra', 'Ra Perm', 'Adjacent Swap', "(R U' R' U') (R U R D) (R' U' R D') R' U2 R'", 3),
    pllEntry(15, 'Rb', 'Rb Perm', 'Adjacent Swap', "(R' U2 R U2') R' F (R U R' U') R' F' R2", 3),

    // G Perms
    pllEntry(5, 'Ga', 'Ga Perm', 'G Perms', "R2 U (R' U R' U') (R U' R2) D U' (R' U R) D'", 3),
    pllEntry(6, 'Gb', 'Gb Perm', 'G Perms', "(R' U' R) U D' (R2 U R' U) (R U' R U' R2 D)", 3),
    pllEntry(7, 'Gc', 'Gc Perm', 'G Perms', "R2' U' (R U' R U) (R' U R2 D') (U R U' R') D", 3),
    pllEntry(8, 'Gd', 'Gd Perm', 'G Perms', "(R U R') U' D (R2 U' R U') (R' U R' U R2) D'", 3),

    // Diagonal Swap
    pllEntry(12, 'Na', 'Na Perm', 'Diagonal Swap', "(R U R' U) (R U R' F') (R U R' U') (R' F R2 U' R' U2 R U' R')", 3,
      ["z U R' D R2 U' R D' U R' D R2 U' R D' z'"]),
    pllEntry(13, 'Nb', 'Nb Perm', 'Diagonal Swap', "(R' U R U') (R' F' U' F) (R U R' F) R' F' (R U' R)", 3),
    pllEntry(19, 'V',  'V Perm',  'Diagonal Swap', "(R' U R' U') y (R' F' R2 U') (R' U R' F) R F", 3),
    pllEntry(20, 'Y',  'Y Perm',  'Diagonal Swap', "F R U' R' U' (R U R' F') (R U R' U') (R' F R F')", 2)
  ];

  // 重建索引 + 重渲染当前视图
  if (typeof buildFormulaIndex === 'function') buildFormulaIndex();
  if (typeof router === 'function') router();
})();
