'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const FREE_FEATURES = [
  '免费 15 个入门公式（OLL 10 + PLL 5）',
  '闪卡练习模式',
  '基础进度记录',
  '30 天热力图',
];
const PRO_FEATURES = [
  '解锁全部 78 个公式',
  '⏱️ 计时挑战模式',
  '🎯 弱项 AI 推荐',
  '📊 详细数据报告 + 导出',
  '无广告、优先更新',
  '全平台同步（即将上线）',
];

export default function PricingPage() {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('yearly');

  useEffect(() => {
    track('pricing_view');
  }, []);

  function onCta() {
    track('pricing_cta_click', { period });
    alert('支付即将上线，敬请期待～');
  }

  function onB2B() {
    track('b2b_contact_click');
  }

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1>选个适合你的计划</h1>
          <p className="text-gray-600 mt-2">随时取消，不满意 7 天全额退款。</p>
        </div>

        {/* Period toggle */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex bg-white rounded-2xl p-1 shadow-card">
            {(['monthly', 'yearly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-5 py-2 rounded-xl font-semibold transition',
                  period === p ? 'bg-cube-yellow text-cube-blue' : 'text-gray-600',
                )}
              >
                {p === 'monthly' ? '按月' : '按年 · 省 58%'}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing cards */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="card">
            <div className="text-sm text-gray-500">免费版</div>
            <div className="mt-1 text-3xl font-bold">¥0</div>
            <div className="text-sm text-gray-500">适合初学者体验</div>
            <ul className="mt-4 space-y-2">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="text-sm flex items-start gap-2">
                  <span className="text-cube-green mt-0.5">✓</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/learn" className="btn-ghost w-full mt-6 block text-center">开始免费学习</Link>
          </div>

          <div className="card border-2 border-cube-yellow relative">
            <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-cube-yellow text-cube-blue text-xs font-bold">推荐</div>
            <div className="text-sm text-cube-blue">Pro 版</div>
            <div className="mt-1 text-3xl font-bold">
              {period === 'monthly' ? '¥19.9' : '¥99'}
              <span className="text-base font-normal text-gray-500">/{period === 'monthly' ? '月' : '年'}</span>
            </div>
            <div className="text-sm text-gray-500">
              {period === 'monthly' ? '随时取消' : '平均每月 ¥8.25'}
            </div>
            <ul className="mt-4 space-y-2">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="text-sm flex items-start gap-2">
                  <span className="text-cube-green mt-0.5">✓</span>{f}
                </li>
              ))}
            </ul>
            <button onClick={onCta} className="btn-primary w-full mt-6">立即升级 Pro</button>
          </div>
        </div>

        {/* B 端 */}
        <section className="mt-12 card bg-cube-blue text-white">
          <div className="grid md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2">
              <div className="text-sm opacity-80">🏫 机构版 · 面向魔方课程与始学机构</div>
              <h2 className="!text-2xl mt-1">班级进度查看、多账号管理、品牌定制</h2>
              <p className="opacity-90 mt-2 text-sm">仅对课程机构、少年宫、社团开放。按班级、学期计费，以实际报价为准。</p>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:contact@magiccube.app?subject=%E5%B0%8F%E9%AD%94%E6%96%B9%E5%A4%A7%E5%B8%88%E6%9C%BA%E6%9E%84%E7%89%88%E5%92%A8%E8%AF%A2"
                onClick={onB2B}
                className="btn bg-cube-yellow text-cube-blue text-center"
              >
                📧 邮件咨询
              </a>
              <a
                href="#wechat-qr"
                onClick={onB2B}
                className="btn bg-white/15 text-white border border-white/30 text-center"
              >
                💬 加微信治谈
              </a>
            </div>
          </div>
          <div id="wechat-qr" className="mt-6 flex items-center gap-3">
            <div className="w-24 h-24 bg-white/15 rounded-xl flex items-center justify-center text-xs opacity-70">微信二维码<br/>（占位）</div>
            <div className="text-sm opacity-90">扫码联系机构合作人，备注“机构名 + 班级规模”优先响应。</div>
          </div>
        </section>

        {/* FAQ 占位 */}
        <section className="mt-12">
          <h3>常见问题</h3>
          <div className="mt-3 grid md:grid-cols-2 gap-3">
            {[
              ['付费后不满意怎么办？', '7 天无理由退款。'],
              ['孩子多大适合用？', '推荐 9–15 岁已会复魔方三阶的孩子。'],
              ['支持平板吗？', '支持。推荐 iPad / 安卓平板。'],
              ['个人账号可以多设备同步吗？', '即将上线账号系统，v1 进度保存在本地。'],
            ].map(([q, a]) => (
              <div key={q} className="card">
                <div className="font-semibold">{q}</div>
                <div className="text-gray-600 mt-1 text-sm">{a}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
