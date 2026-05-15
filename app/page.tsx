import Link from 'next/link';
import Header from '@/components/ui/Header';
import PathSelect from './PathSelect';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        {/* Hero */}
        <section className="text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-cube-yellow text-cube-blue text-sm font-semibold mb-4">
            🧊 v1 MVP · 6 岁也能学
          </div>
          <h1 className="!text-4xl md:!text-5xl leading-tight">
            小魔方大师 —
            <span className="text-cube-blue">你的 AI 魔方教练</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600">
            从「拧不开」到「能还原」，再到「拼速度」。
            <br className="hidden md:block" />
            零基础教程 + 二阶 + 三阶公式库，一站搞定。
          </p>
        </section>

        {/* 分流 */}
        <PathSelect />

        {/* 卖点 */}
        <section className="mt-16 grid md:grid-cols-3 gap-4 md:gap-6">
          {[
            { e: '👶', t: '6 岁也能开始', d: '层先法 8 节课，箭头+字母并排，可朗读引导。' },
            { e: '🧊', t: '二阶 + 三阶', d: '二阶 Ortega 12 公式，三阶 57 OLL + 21 PLL 全收录。' },
            { e: '🏆', t: '记进度有成就', d: '热力图、连续天数、徽章，孩子越练越上瘾。' },
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
