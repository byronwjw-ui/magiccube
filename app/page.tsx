import Link from 'next/link';
import Header from '@/components/ui/Header';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        {/* Hero */}
        <section className="text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-cube-yellow text-cube-blue text-sm font-semibold mb-4">
            🧊 v1 MVP · 面向 9-15 岁孩子
          </div>
          <h1 className="!text-4xl md:!text-5xl leading-tight">
            小魔方大师 —
            <span className="text-cube-blue">你的 AI 魔方教练</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600">
            57 个 OLL + 21 个 PLL 公式，告别纸质打印。
            <br className="hidden md:block" />
            在浏览器里看动画、练闪卡、记进度。
          </p>
          <div className="mt-8 flex flex-col md:flex-row gap-3 justify-center">
            <Link href="/learn" className="btn-primary text-lg">🚀 开始免费学习</Link>
            <Link href="/pricing" className="btn-ghost text-lg">查看 Pro 功能</Link>
          </div>
        </section>

        {/* 卖点 */}
        <section className="mt-16 grid md:grid-cols-3 gap-4 md:gap-6">
          {[
            { e: '📚', t: '系统化公式库', d: '57 OLL + 21 PLL 全收录，按图形分类，一眼看懂。' },
            { e: '🎯', t: '智能练习跟踪', d: '闪卡、计时挑战、弱项重点推荐，练难点不重复。' },
            { e: '🏆', t: '闯关式成就', d: '连续学习、掌握里程碑、徽章增加坚持习惯。' },
          ].map((x) => (
            <div key={x.t} className="card text-center">
              <div className="text-4xl">{x.e}</div>
              <h3 className="mt-2">{x.t}</h3>
              <p className="mt-2 text-gray-600">{x.d}</p>
            </div>
          ))}
        </section>

        {/* 定价入口 */}
        <section className="mt-16 card flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3>⏳ Pro 版即将上线</h3>
            <p className="text-gray-600 mt-1">解锁全部公式、计时挑战、弱项 AI 推荐。</p>
          </div>
          <Link href="/pricing" className="btn-secondary">了解详情</Link>
        </section>

        <footer className="mt-16 py-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} 小魔方大师 · 面向少年与魔方机构
        </footer>
      </main>
    </>
  );
}
