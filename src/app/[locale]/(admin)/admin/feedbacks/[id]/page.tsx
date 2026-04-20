import { findFeedbackById } from "@/models/feedback";
import { notFound } from "next/navigation";
import moment from "moment";

export default async function FeedbackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const feedbackId = Number(id);

  if (!Number.isFinite(feedbackId)) {
    notFound();
  }

  const feedback = await findFeedbackById(feedbackId);

  if (!feedback) {
    notFound();
  }

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Feedback Detail</p>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">
              反馈 #{feedback.id}
            </h1>
          </div>
          <a
            href="/admin/feedbacks"
            className="text-sm font-medium text-primary hover:underline"
          >
            Back to feedbacks
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Content</h2>
          <div className="mt-4 whitespace-pre-wrap break-words rounded-xl bg-muted/40 p-4 text-sm leading-7 text-foreground">
            {feedback.content}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Meta</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground">User</p>
              <p className="mt-1 font-medium text-foreground">
                {feedback.user?.nickname || "Unknown user"}
              </p>
              <p className="text-muted-foreground">
                {feedback.user?.email || feedback.user_uuid || "-"}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Rating</p>
              <p className="mt-1 font-medium text-foreground">
                {feedback.rating ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="mt-1 font-medium text-foreground">
                {feedback.status || "-"}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Created At</p>
              <p className="mt-1 font-medium text-foreground">
                {feedback.created_at
                  ? moment
                      .utc(feedback.created_at)
                      .utcOffset(8)
                      .format("YYYY-MM-DD HH:mm:ss")
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">User UUID</p>
              <p className="mt-1 break-all font-medium text-foreground">
                {feedback.user_uuid || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
