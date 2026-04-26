"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  BookOpenText,
  FileText,
  TriangleAlert,
  Clock3,
  LifeBuoy,
  ShieldCheck,
  PencilLine,
  Lock,
  Info,
} from "lucide-react";

interface NoticeCard {
  title: string;
  description: string;
  icon: typeof Info;
}

const noticeCards: NoticeCard[] = [
  {
    title: "请先阅读使用教程",
    description: "首次使用前，建议先查看使用教程，了解下单流程、内容生成方式及修改说明。",
    icon: BookOpenText,
  },
  {
    title: "请完整填写文书资料",
    description: "填写文书和简历资料时，请尽量提供完整的个人经历、申请方向、项目背景等信息，内容越具体，生成结果越贴合需求。",
    icon: FileText,
  },
  {
    title: "生成后请仔细核对",
    description: "生成后请核对个人信息、经历细节与申请方向。如需调整表达或重点，可使用赠送的 1 次免费优化机会。",
    icon: PencilLine,
  },
  {
    title: "如遇异常请截图反馈",
    description: "如遇未发货、内容未显示、生成失败或链接异常，请务必截图保留问题页面，并将截图发送给客服协助处理。",
    icon: TriangleAlert,
  },
  {
    title: "人工润色建议提前安排",
    description: "如购买人工润色服务，通常需 5-7 个工作日完成。如有截止时间或加急需求，请尽量提前下单并预留修改时间。",
    icon: Clock3,
  },
  {
    title: "售后与补发说明",
    description: "购买后如遇使用疑问、订单异常或系统原因导致的问题，可联系客服协助处理或补发。",
    icon: ShieldCheck,
  },
];

interface PricingComparisonTableProps {
  className?: string;
}

export default function PricingComparisonTable({ className }: PricingComparisonTableProps) {
  return (
    <section className={`w-full bg-background py-8 sm:py-10 ${className || ""}`}> 
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8" >
        <div className="mx-auto mb-6 max-w-3xl text-center">
          <h2 className="mt-5 flex items-center justify-center gap-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            <Info className="h-10 w-10 text-emerald-600 mt-1" />
            使用须知
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            下单前请先阅读，帮助你更高效地使用文书服务
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 sm:px-5">
            <div
              className="ml-12 flex h-7 w-7 items-center justify-center rounded-full bg-muted"
            >
              <Bell className="h-6 w-6" style={{ color: "#c65239" }} />
            </div>
            <span className="text-sm font-medium mr-12" style={{ color: "#c65239" }}>
              温馨提示：首次使用前请先阅读使用教程；如遇系统异常，请截图并联系客服处理。
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-5xl rounded-[28px] border border-border bg-card/90 p-4 shadow-lg sm:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
            {noticeCards.map((card) => {
              const Icon = card.icon;

              return (
                <Card
                  key={card.title}
                  className="border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  <CardContent className="flex items-start gap-4 p-3">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted ring-1 ring-border">
                      <Icon className="h-10 w-10 text-emerald-600" />
                    </div>

                    <div className="min-w-0 pt-0.5">
                      <h3 className="text-[15px] font-semibold leading-6 text-foreground sm:text-base">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground sm:text-[15px]">
                        {card.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-muted px-5 py-2 text-center text-sm font-medium ring-1 ring-border">
            <ShieldCheck className="h-7 w-7 shrink-0" style={{ color: "#3eaf70" }} />
            <span style={{ color: "#3eaf70" }}>
              请放心使用：如遇生成异常或系统问题，我们会及时协助处理，并按情况补发。
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-center gap-2 text-center text-xs leading-6 text-muted-foreground">
          <Lock className="mt-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <p>
            所有文书内容仅供个人申请使用，请勿用于任何商业用途或违反申请机构要求的行为。
          </p>
        </div>
      </div>
    </section>
  );
}
