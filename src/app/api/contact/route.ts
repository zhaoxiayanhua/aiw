import { NextResponse } from "next/server";
import { getIsoTimestr } from "@/lib/time";
import { insertFeedback } from "@/models/feedback";
import { getUserUuid } from "@/services/user";
import { Feedback } from "@/types/feedback";

const FEISHU_WEBHOOK =
  process.env.FEISHU_WEBHOOK_URL ||
  "https://open.feishu.cn/open-apis/bot/v2/hook/bfa50670-06a3-4e58-865a-d7c3d55eeb8d";

interface ContactForm {
  name: string;
  email: string;
  feedbackType: string;
  documentType?: string;
  satisfaction: string;
  message: string;
}

const satisfactionInfo = {
  very_satisfied: { text: "非常满意", color: "green", rating: 5 },
  satisfied: { text: "满意", color: "green", rating: 4 },
  neutral: { text: "一般", color: "yellow", rating: 3 },
  dissatisfied: { text: "不满意", color: "orange", rating: 2 },
  very_dissatisfied: { text: "非常不满意", color: "red", rating: 1 },
} as const;

const feedbackTypeMap: Record<string, string> = {
  document_quality: "文书质量问题",
  feature_request: "功能建议",
  bug_report: "错误报告",
  ai_generation: "AI生成问题",
  template_issue: "模板问题",
  account_payment: "账户/支付问题",
  other: "其他反馈",
};

const documentTypeMap: Record<string, string> = {
  recommendation_letter: "推荐信",
  cover_letter: "求职信",
  personal_statement: "个人陈述",
  sop: "SOP",
  resume: "简历",
  study_abroad_consultation: "留学咨询",
  not_applicable: "不适用",
};

function buildFeedbackContent(data: ContactForm) {
  const feedbackTypeText = feedbackTypeMap[data.feedbackType] || data.feedbackType;
  const documentTypeText = data.documentType
    ? documentTypeMap[data.documentType] || data.documentType
    : "未指定";
  const satisfaction =
    satisfactionInfo[data.satisfaction as keyof typeof satisfactionInfo];

  return [
    `反馈类型：${feedbackTypeText}`,
    `相关文档：${documentTypeText}`,
    `满意度：${satisfaction?.text || data.satisfaction}`,
    `姓名：${data.name}`,
    `联系方式：${data.email}`,
    `反馈内容：${data.message}`,
  ].join("\n");
}

function buildFeishuMessage(data: ContactForm) {
  const satisfaction =
    satisfactionInfo[data.satisfaction as keyof typeof satisfactionInfo] || {
      text: data.satisfaction,
      color: "grey",
    };
  const feedbackTypeText = feedbackTypeMap[data.feedbackType] || data.feedbackType;
  const documentTypeText = data.documentType
    ? documentTypeMap[data.documentType] || data.documentType
    : "未指定";

  return {
    msg_type: "interactive",
    card: {
      header: {
        title: {
          tag: "plain_text",
          content: "新的产品反馈",
        },
        template: satisfaction.color,
      },
      elements: [
        {
          tag: "div",
          text: {
            tag: "lark_md",
            content: `**反馈类型**: ${feedbackTypeText}`,
          },
        },
        {
          tag: "div",
          text: {
            tag: "lark_md",
            content: `**满意度**: ${satisfaction.text}`,
          },
        },
        {
          tag: "div",
          text: {
            tag: "lark_md",
            content: `**相关文档**: ${documentTypeText}`,
          },
        },
        {
          tag: "hr",
        },
        {
          tag: "div",
          text: {
            tag: "lark_md",
            content: `**客户信息**\n姓名: ${data.name}\n联系方式: ${data.email}`,
          },
        },
        {
          tag: "hr",
        },
        {
          tag: "div",
          text: {
            tag: "lark_md",
            content: `**反馈内容**:\n${data.message}`,
          },
        },
        {
          tag: "hr",
        },
        {
          tag: "note",
          elements: [
            {
              tag: "plain_text",
              content: `提交时间: ${new Date().toLocaleString("zh-CN", {
                timeZone: "Asia/Shanghai",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}`,
            },
          ],
        },
      ],
    },
  };
}

export async function POST(request: Request) {
  try {
    const data: ContactForm = await request.json();

    if (
      !data.name ||
      !data.email ||
      !data.feedbackType ||
      !data.satisfaction ||
      !data.message
    ) {
      return NextResponse.json(
        { success: false, error: "缺少必要字段" },
        { status: 400 }
      );
    }

    const userUuid = (await getUserUuid()) || "";
    const satisfaction =
      satisfactionInfo[data.satisfaction as keyof typeof satisfactionInfo];

    const feedback: Feedback = {
      user_uuid: userUuid,
      content: buildFeedbackContent(data),
      rating: satisfaction?.rating || 0,
      created_at: getIsoTimestr(),
      status: "created",
    };

    await insertFeedback(feedback);

    const response = await fetch(FEISHU_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildFeishuMessage(data)),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Feishu webhook error:", errorText);
    } else {
      const result = await response.json();
      if (result.code !== 0) {
        console.error("Feishu API error:", result);
      }
    }

    return NextResponse.json({
      success: true,
      message: "反馈已成功提交",
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "提交失败，请稍后重试",
      },
      { status: 500 }
    );
  }
}
