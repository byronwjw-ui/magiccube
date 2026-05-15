'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import Header from '@/components/ui/Header';
import CubeView from '@/components/cube/CubeView';
import { getLesson2x2ById, getAdjacent2x2Lesson, type LessonStep } from '@/lib/tutorial/lessons2x2';
import { storage } from '@/lib/storage';
import { speech } from '@/lib/speech';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export default function Lesson2x2Page() {
  const params = useParams<{ lessonId: string }>();
  const router = useRouter();
  const lesson = useMemo(() => getLesson2x2ById(params.lessonId), [params.lessonId]);

  const [stepIdx, setStepIdx] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [stars, setStars] = useState(3);

  useEffect(() => {
    if (!lesson) return;
    track('tutorial_lesson_start', { lessonId: lesson.id });
    speech.speak(lesson.steps[0]?.speech ?? '');
    return () => speech.cancel();
  }, [lesson]);

  if (!lesson) {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-10 text-center">
          <h2>没找到这节课</h2>
          <Link href="/tutorial-2x2" className="btn-primary mt-4 inline-block">返回目录</Link>
        </main>
      </>
    );
  }

  const step: LessonStep = lesson.steps[stepIdx];
  const isLast = stepIdx === lesson.steps.length - 1;
  const { prev, next } = getAdjacent2x2Lesson(lesson.id);
  const progressPct = ((stepIdx + 1) / lesson.steps.length) * 100;

  function goStep(i: number) {
    setStepIdx(i);
    setQuizAnswered(null);
    speech.speak(lesson.steps[i]?.speech ?? '');
  }

  function handleNext() {
    if (isLast) finishLesson();
    else goStep(stepIdx + 1);
  }

  function handleQuiz(idx: number) {
    if (!step.quiz) return;
    setQuizAnswered(idx);
    const opt = step.quiz.options[idx];
    if (opt.correct) {
      speech.speak('答对啦！' + (opt.explain ?? ''));
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setStars((s) => Math.max(1, s - 1));
      speech.speak('再想想。' + (opt.explain ?? ''));
    }
  }

  function finishLesson() {
    storage.completeTutorialLesson(lesson.id, stars);
    track('tutorial_lesson_complete', { lessonId: lesson.id, stars });
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    speech.speak(`太棒了！你完成了第 ${lesson.number} 课`);
    setTimeout(() => {
      if (next) router.push(`/tutorial-2x2/${next.id}`);
      else router.push('/tutorial-2x2');
    }, 2200);
  }

  // 二阶教程统一用 2x2x2
  const gridCols = (step.emojiVisual?.grid[0]?.length) ?? 1;
  const faceCols = step.goalImage?.face[0]?.length ?? 3;

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="text-sm text-cube-blue">
          <Link href="/tutorial-2x2">← 返回目录</Link>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="text-3xl md:text-4xl">{lesson.emoji}</div>
          <div>
            <div className="text-xs text-gray-500">二阶 · 第 {lesson.number} 课 · 共 {lesson.steps.length} 步</div>
            <h1 className="!text-2xl md:!text-3xl">{lesson.title}</h1>
            <div className="text-sm text-gray-600">{lesson.subtitle}</div>
          </div>
        </div>

        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-cube-yellow transition-all" style={{ width: `${progressPct}%` }} />
        </div>

        <section className="card mt-6">
          <div className="text-xs text-gray-500">步骤 {stepIdx + 1} / {lesson.steps.length}</div>
          <h2 className="mt-1 !text-xl md:!text-2xl">{step.title}</h2>

          {step.alg && (
            <div className="mt-4 flex justify-center bg-gray-50 rounded-2xl p-3">
              <CubeView
                alg={step.alg}
                setupAlg={step.setupAlg}
                visualization="3D"
                controlPanel="bottom-row"
                puzzle="2x2x2"
                size={260}
              />
            </div>
          )}

          {step.emojiVisual && (
            <div className="mt-4 rounded-2xl bg-gray-50 p-4">
              <div className="grid place-items-center">
                <div
                  className="grid gap-1"
                  style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, auto))` }}
                >
                  {step.emojiVisual.grid.flat().map((cell, i) => (
                    <div
                      key={i}
                      className="min-w-[2.2rem] min-h-[2.2rem] flex items-center justify-center text-2xl md:text-3xl px-1"
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center text-sm text-gray-600 mt-2">{step.emojiVisual.caption}</div>
            </div>
          )}

          {step.goalImage && (
            <div className="mt-4 rounded-2xl bg-cube-green/10 p-4">
              <div className="grid place-items-center">
                <div
                  className="inline-grid gap-1 p-2 bg-gray-900 rounded-xl"
                  style={{ gridTemplateColumns: `repeat(${faceCols}, minmax(0, auto))` }}
                >
                  {step.goalImage.face.flat().map((c, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center text-2xl md:text-3xl rounded bg-gray-800"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center text-sm text-cube-green font-semibold mt-2">{step.goalImage.caption}</div>
            </div>
          )}

          <p className="mt-4 text-base md:text-lg leading-relaxed">{step.speech}</p>

          {(step.arrowHint || step.wcaHint) && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              {step.arrowHint && (
                <div className="rounded-2xl bg-cube-yellow/30 p-3 text-center">
                  <div className="text-xs text-cube-blue mb-1">👶 箭头说法</div>
                  <div className="font-semibold text-lg">{step.arrowHint}</div>
                </div>
              )}
              {step.wcaHint && (
                <div className="rounded-2xl bg-cube-blue/10 p-3 text-center wca-hide-on-kid">
                  <div className="text-xs text-cube-blue mb-1">🧠 公式写法</div>
                  <div className="alg-text">{step.wcaHint}</div>
                </div>
              )}
            </div>
          )}

          {step.parentTip && (
            <div className="mt-3 rounded-2xl bg-cube-green/10 p-3 text-sm">
              <span className="font-semibold text-cube-green">👨‍👩‍👧 家长提示：</span>
              <span className="text-gray-700"> {step.parentTip}</span>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => speech.speak(step.speech, { force: true })}
              className="btn-ghost !py-2 !px-4 text-sm"
            >
              🔊 再听一遍
            </button>
          </div>

          {step.quiz && (
            <div className="mt-5 rounded-2xl bg-cube-yellow/10 p-4">
              <div className="font-bold">🎯 {step.quiz.question}</div>
              <div className="mt-3 grid gap-2">
                {step.quiz.options.map((opt, i) => {
                  const answered = quizAnswered !== null;
                  const isMine = quizAnswered === i;
                  return (
                    <button
                      key={i}
                      disabled={answered}
                      onClick={() => handleQuiz(i)}
                      className={cn(
                        'text-left rounded-xl px-4 py-3 border transition',
                        !answered && 'bg-white border-gray-200 hover:border-cube-blue',
                        answered && opt.correct && 'bg-cube-green/20 border-cube-green',
                        answered && !opt.correct && isMine && 'bg-cube-orange/20 border-cube-orange',
                        answered && !opt.correct && !isMine && 'bg-gray-50 border-gray-200 opacity-60',
                      )}
                    >
                      <div className="font-semibold">{opt.label}</div>
                      {answered && isMine && opt.explain && (
                        <div className="text-xs mt-1 text-gray-600">{opt.explain}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => stepIdx > 0 && goStep(stepIdx - 1)}
            disabled={stepIdx === 0}
            className={cn('btn-ghost', stepIdx === 0 && 'opacity-40 pointer-events-none')}
          >
            ← 上一步
          </button>
          <div className="text-sm text-gray-500">⭐ x {stars}</div>
          <button
            onClick={handleNext}
            disabled={!!step.quiz && quizAnswered === null}
            className={cn(
              'btn-primary',
              !!step.quiz && quizAnswered === null && 'opacity-40 pointer-events-none',
            )}
          >
            {isLast ? '完成 🎉' : '下一步 →'}
          </button>
        </div>

        <div className="mt-6 flex justify-between text-sm">
          {prev ? (
            <Link href={`/tutorial-2x2/${prev.id}`} className="text-cube-blue">← 第 {prev.number} 课</Link>
          ) : <div />}
          {next ? (
            <Link href={`/tutorial-2x2/${next.id}`} className="text-cube-blue">第 {next.number} 课 →</Link>
          ) : <div />}
        </div>
      </main>
    </>
  );
}
