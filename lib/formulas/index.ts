// ============================================================================
// 公式数据统一入口
// ============================================================================
import type { Formula, FormulaCategory } from '@/types';
import { OLL_FORMULAS } from './oll';
import { PLL_FORMULAS } from './pll';

export const ALL_FORMULAS: Formula[] = [...OLL_FORMULAS, ...PLL_FORMULAS];

export function getFormulasByCategory(category: FormulaCategory): Formula[] {
  return ALL_FORMULAS.filter((f) => f.category === category);
}

export function getFormulaById(id: string): Formula | undefined {
  return ALL_FORMULAS.find((f) => f.id === id);
}

export function getSubCategories(category: FormulaCategory): string[] {
  const set = new Set<string>();
  for (const f of ALL_FORMULAS) if (f.category === category) set.add(f.subCategory);
  return [...set];
}

export function getAdjacentFormulas(id: string): { prev?: Formula; next?: Formula } {
  const f = getFormulaById(id);
  if (!f) return {};
  const list = getFormulasByCategory(f.category).sort((a, b) => a.number - b.number);
  const idx = list.findIndex((x) => x.id === id);
  return {
    prev: idx > 0 ? list[idx - 1] : undefined,
    next: idx < list.length - 1 ? list[idx + 1] : undefined,
  };
}

export { OLL_FORMULAS, PLL_FORMULAS };
