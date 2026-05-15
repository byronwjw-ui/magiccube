import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl">🧊</div>
      <h1 className="mt-4">页面走失了</h1>
      <p className="text-gray-600 mt-2">这个位置还没有东西。</p>
      <Link href="/" className="btn-primary mt-6">回到首页</Link>
    </main>
  );
}
