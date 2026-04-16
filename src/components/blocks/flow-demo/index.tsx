'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  BarChart3,
  Edit3,
  FileText,
  Grid3X3,
  Link,
  Sparkles,
} from 'lucide-react';

type FlowStep = {
  id: number;
  label: string;
  description: string;
  image: string;
  alt: string;
};

const flowSteps: FlowStep[] = [
  {
    id: 1,
    label: '新建材料',
    description: '选择文书类型，开始创建您的申请材料。',
    image: '/imgs/steps/step1.jpg',
    alt: '新建材料界面预览',
  },
  {
    id: 2,
    label: '填写信息',
    description: '输入基础背景信息，包括姓名、专业与目标院校等内容。',
    image: '/imgs/steps/step2.jpg',
    alt: '填写信息界面预览',
  },
  {
    id: 3,
    label: '智能生成',
    description: 'AI 根据您的输入快速生成高质量申请文书初稿。',
    image: '/imgs/steps/step3.jpg',
    alt: '智能生成界面预览',
  },
  {
    id: 4,
    label: '在线预览',
    description: '实时查看生成后的文书内容与整体排版效果。',
    image: '/imgs/steps/step4.jpg',
    alt: '在线预览界面预览',
  },
  {
    id: 5,
    label: '修改导出',
    description: '在编辑器中继续调整内容，确认后导出文书。',
    image: '/imgs/steps/step5.jpg',
    alt: '修改导出界面预览',
  },
  {
    id: 6,
    label: '提交润色',
    description: '将文书提交给专业团队进行进一步人工润色。',
    image: '/imgs/steps/step6.jpg',
    alt: '提交润色界面预览',
  },
];

const stepIcons = [FileText, Edit3, Sparkles, Link, BarChart3, Grid3X3];

function FlowDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }

    intervalRef.current = setTimeout(() => {
      setActiveStep((prev) => (prev + 1) % flowSteps.length);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [activeStep, isPlaying]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setIsPlaying(false);

    setTimeout(() => {
      setIsPlaying(true);
    }, 8000);
  };

  const currentStep = flowSteps[activeStep];

  return (
    <>
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes sparkle {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes stardust {
          0% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
          100% { opacity: 0; transform: scale(0) rotate(360deg); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-sparkle {
          animation: sparkle 3s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        .animate-stardust {
          animation: stardust 4s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <div className="relative overflow-hidden py-24">
        <div className="container">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-lg font-semibold text-primary">使用流程</span>
            </div>

            <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
              简单几步，轻松搞定申请文书
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              智能引导式创作流程，让文书写作变得更简单、更高效。
            </p>
          </div>

          <div className="mx-auto w-full max-w-[760px]">
            <div className="relative aspect-square w-full">
              <div className="absolute -inset-1">
                <div className="absolute -left-4 top-0 h-72 w-72 rounded-full bg-purple-500 opacity-20 blur-3xl mix-blend-multiply filter animate-blob" />
                <div className="absolute -right-4 top-0 h-72 w-72 rounded-full bg-yellow-500 opacity-20 blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 h-72 w-72 rounded-full bg-pink-500 opacity-20 blur-3xl mix-blend-multiply filter animate-blob animation-delay-4000" />
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-r from-[#86f096]/30 via-[#5dde88]/30 to-[#3dcd77]/30 opacity-80 blur-3xl animate-pulse-glow" />
                <div className="absolute -inset-2 rounded-[30px] bg-gradient-to-br from-[#86f096]/20 to-[#3dcd77]/20 blur-2xl" />

                <div className="absolute -inset-3 pointer-events-none">
                  <div className="absolute left-1/4 top-0 h-2 w-2 rounded-full bg-white/60 animate-stardust" />
                  <div className="absolute left-1/2 top-0 h-1.5 w-1.5 rounded-full bg-blue-400/60 animate-stardust animation-delay-1000" />
                  <div className="absolute left-3/4 top-0 h-2 w-2 rounded-full bg-purple-400/60 animate-stardust animation-delay-2000" />
                  <div className="absolute right-0 top-1/4 h-1.5 w-1.5 rounded-full bg-pink-400/60 animate-stardust animation-delay-3000" />
                  <div className="absolute right-0 top-1/2 h-2 w-2 rounded-full bg-white/60 animate-stardust animation-delay-4000" />
                  <div className="absolute right-0 top-3/4 h-1.5 w-1.5 rounded-full bg-yellow-400/60 animate-stardust" />
                  <div className="absolute bottom-0 left-1/4 h-2 w-2 rounded-full bg-blue-400/60 animate-stardust animation-delay-2000" />
                  <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 rounded-full bg-white/60 animate-stardust animation-delay-3000" />
                  <div className="absolute bottom-0 left-3/4 h-2 w-2 rounded-full bg-purple-400/60 animate-stardust animation-delay-1000" />
                  <div className="absolute left-0 top-1/4 h-1.5 w-1.5 rounded-full bg-yellow-400/60 animate-stardust animation-delay-4000" />
                  <div className="absolute left-0 top-1/2 h-2 w-2 rounded-full bg-pink-400/60 animate-stardust animation-delay-2000" />
                  <div className="absolute left-0 top-3/4 h-1.5 w-1.5 rounded-full bg-white/60 animate-stardust animation-delay-1000" />
                </div>

                <div className="pointer-events-none absolute -inset-px overflow-hidden rounded-[26px]">
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                </div>

                <div className="relative h-full w-full overflow-hidden rounded-[26px] bg-gradient-to-br from-gray-800/80 via-gray-800/85 to-gray-900/80 shadow-[0_25px_80px_-10px_rgba(134,240,150,0.3)] backdrop-blur-xl">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  <div className="w-full">
                    <div className="relative aspect-square w-full overflow-hidden">
                      <div className="absolute inset-0 overflow-hidden rounded-[24px]">
                        <div className="sparkle-1 absolute left-[20%] top-[10%] h-1 w-1 rounded-full bg-white animate-sparkle" />
                        <div className="sparkle-2 absolute left-[80%] top-[60%] h-1 w-1 rounded-full bg-blue-400 animate-sparkle animation-delay-1000" />
                        <div className="sparkle-3 absolute left-[50%] top-[30%] h-1 w-1 rounded-full bg-purple-400 animate-sparkle animation-delay-2000" />
                        <div className="sparkle-4 absolute left-[10%] top-[70%] h-1 w-1 rounded-full bg-pink-400 animate-sparkle animation-delay-3000" />
                        <div className="sparkle-5 absolute left-[90%] top-[40%] h-1 w-1 rounded-full bg-yellow-400 animate-sparkle animation-delay-4000" />
                      </div>

                      <img
                        src={currentStep.image}
                        alt={currentStep.alt}
                        className="absolute inset-0 h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex justify-center md:mt-6">
                  <div className="group relative">
                    <div className="absolute -inset-0.5 rounded-[22px] bg-gradient-to-r from-gray-600/20 to-gray-400/20 opacity-75 blur transition duration-300 group-hover:opacity-100" />

                    <div className="relative overflow-visible rounded-[20px] border border-white/10 bg-black/40 backdrop-blur-2xl">
                      <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-b from-white/5 to-transparent" />

                      <div className="relative flex h-[76px] items-end gap-1 px-3 pb-2 pt-6">
                        {stepIcons.map((Icon, step) => (
                          <div
                            key={step}
                            className={`relative transition-all duration-500 ${
                              activeStep === step ? 'z-20' : 'z-10'
                            }`}
                            style={{ alignSelf: 'flex-end' }}
                          >
                            <button
                              onClick={() => handleStepClick(step)}
                              className="group/btn relative block"
                              type="button"
                            >
                              <div
                                className={`relative origin-bottom transition-all duration-500 ${
                                  activeStep === step ? '-mt-10' : 'mt-0'
                                }`}
                              >
                                {activeStep === step && (
                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/80 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300">
                                    {flowSteps[step].label}
                                  </div>
                                )}

                                <div
                                  className={`relative overflow-hidden transition-all duration-300 ${
                                    activeStep === step
                                      ? 'rounded-[28px] bg-gray-800/90 shadow-2xl ring-[2px] ring-inset ring-white/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]'
                                      : 'rounded-[14px] bg-white/5 ring-[2px] ring-inset ring-white/15 hover:bg-white/10'
                                  }`}
                                >
                                  {activeStep === step && (
                                    <>
                                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20" />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 via-white/10 to-transparent" />
                                    </>
                                  )}

                                  <div
                                    className={`relative transition-all duration-300 ${
                                      activeStep === step
                                        ? 'px-6 pb-4 pt-8'
                                        : 'px-5 py-5 group-hover/btn:py-[18px]'
                                    }`}
                                  >
                                    {activeStep === step ? (
                                      <>
                                        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/30 via-white/10 to-transparent blur-sm" />
                                        <div className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                                      </>
                                    ) : (
                                      <div className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
                                    )}

                                    <div className="flex items-center justify-center">
                                      <Icon
                                        className={`relative z-10 transition-all duration-300 ${
                                          activeStep === step
                                            ? 'h-7 w-7 -translate-y-1 transform text-white'
                                            : 'h-6 w-6 text-gray-400 group-hover/btn:text-white'
                                        }`}
                                      />
                                    </div>

                                    {activeStep === step && (
                                      <div className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white/80" />
                                    )}
                                  </div>
                                </div>

                                {activeStep === step && (
                                  <div className="absolute inset-0 -z-10 rounded-[28px] bg-white/20 blur-xl" />
                                )}
                              </div>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-lg text-gray-500 transition-all duration-300">
                {currentStep.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FlowDemo;
