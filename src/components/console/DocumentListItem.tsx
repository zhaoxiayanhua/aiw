import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Document, DocumentType } from "@/models/document";
import { formatDocumentDate } from "@/services/document";

interface DocumentListItemProps {
  document: Document;
  onDelete?: (uuid: string) => void;
  onDownload?: (document: Document) => void;
  onClick?: (document: Document) => void;
  paymentStatus?: string;
}

function renderPaymentBadge(paymentStatus?: string) {
  if (!paymentStatus) {
    return null;
  }

  if (paymentStatus === "paid") {
    return <Badge className="shrink-0 text-xs bg-green-100 text-green-700 hover:bg-green-100">已支付</Badge>;
  }

  if (paymentStatus === "completed") {
    return <Badge className="shrink-0 text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">已完成</Badge>;
  }

  return (
    <Badge variant="outline" className="shrink-0 text-xs text-yellow-600 border-yellow-300">
      待支付
    </Badge>
  );
}

export const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  onDelete,
  onClick,
  paymentStatus,
}) => {
  const displayDate = formatDocumentDate(document.created_at || "");

  const getContentPreview = (content: string | undefined, maxLength: number = 200) => {
    if (document.document_type === DocumentType.StudyAbroadConsultation && document.form_data) {
      const formData = document.form_data;
      const parts = [];

      if (formData.basicInfo?.full_name) {
        parts.push(`姓名: ${formData.basicInfo.full_name}`);
      }
      if (formData.targetProgram?.target_country) {
        parts.push(`目标国家: ${formData.targetProgram.target_country}`);
      }
      if (formData.targetProgram?.target_degree) {
        parts.push(`申请学位: ${formData.targetProgram.target_degree}`);
      }
      if (formData.consultationNeeds?.main_concerns) {
        parts.push(`关注点: ${formData.consultationNeeds.main_concerns}`);
      }

      const preview = parts.join(" | ");
      return preview.length > maxLength ? `${preview.substring(0, maxLength)}...` : preview;
    }

    if (document.document_type === DocumentType.Resume && document.form_data) {
      const formData = document.form_data;
      const parts = [];
      const template = formData.template || formData.resumeData?.selectedTemplate;

      if (template) {
        const templateName =
          template === "kakuna" ? "Kakuna模板" :
          template === "ditto" ? "Ditto模板" :
          `${template}模板`;
        parts.push(templateName);
      }

      if (formData.resumeData?.header?.full_name) {
        parts.push(`姓名: ${formData.resumeData.header.full_name}`);
      }

      if (formData.resumeData?.education?.school_name) {
        let eduInfo = formData.resumeData.education.school_name;
        if (formData.resumeData.education.degree) {
          eduInfo = `${eduInfo} - ${formData.resumeData.education.degree.split(" ")[0]}`;
        }
        parts.push(eduInfo);
      }

      if (formData.resumeData?.header?.city || formData.resumeData?.header?.country) {
        const location = [];
        if (formData.resumeData.header.city) location.push(formData.resumeData.header.city);
        if (formData.resumeData.header.country) location.push(formData.resumeData.header.country);
        if (location.length > 0) parts.push(location.join(", "));
      }

      const preview = parts.join(" | ");
      return preview.length > maxLength ? `${preview.substring(0, maxLength)}...` : preview;
    }

    if (!content) return "";
    const cleanContent = content.replace(/[#*`\[\]()]/g, "").trim();
    return cleanContent.length > maxLength ? `${cleanContent.substring(0, maxLength)}...` : cleanContent;
  };

  return (
    <div
      className="group cursor-pointer rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
      onClick={() => onClick?.(document)}
    >
      <div className="flex items-start justify-between gap-4 p-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="mb-1 text-sm text-gray-400 dark:text-gray-500">{displayDate}</div>

              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {document.title || "未命名文档"}
                </h3>
                {document.document_type === DocumentType.StudyAbroadConsultation
                  ? renderPaymentBadge(paymentStatus)
                  : null}
              </div>

              <p className="text-sm leading-relaxed text-gray-400 dark:text-gray-500">
                {getContentPreview(document.content) || "暂无内容"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-4">
          {document.document_type !== DocumentType.StudyAbroadConsultation &&
          document.document_type !== DocumentType.Resume ? (
            <span className="text-sm text-gray-400 dark:text-gray-500">{document.word_count || 0} 字</span>
          ) : null}

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(document.uuid);
            }}
          >
            <Trash2 className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};
