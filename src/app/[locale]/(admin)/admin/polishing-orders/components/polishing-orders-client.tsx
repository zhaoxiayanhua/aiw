"use client";

import { useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Download, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PolishingDocument {
  uuid: string;
  user_uuid: string;
  title?: string;
  form_data: any;
  created_at?: string;
  payment_status?: string;
  order_no?: string | null;
  paid_at?: string | null;
  paid_amount?: number | null;
}

const PAGE_SIZE = 10;

function isCompleted(status?: string) {
  return status === "completed";
}

function isPaidOrCompleted(status?: string) {
  return status === "paid" || status === "completed";
}

function renderStatusBadge(status?: string) {
  if (status === "completed") {
    return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Completed</Badge>;
  }

  if (status === "paid") {
    return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>;
  }

  if (status === "created") {
    return (
      <Badge variant="outline" className="border-yellow-300 text-yellow-600">
        Pending Payment
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-gray-400">
      Unpaid
    </Badge>
  );
}

export default function PolishingOrdersClient({
  documents,
}: {
  documents: PolishingDocument[];
}) {
  const [rows, setRows] = useState(documents);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PolishingDocument | null>(null);
  const [updatingUuid, setUpdatingUuid] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pagedData = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const fd = (doc: PolishingDocument) => doc.form_data || {};

  const updateDocumentStatus = (uuid: string, status: string) => {
    setRows((current) =>
      current.map((item) => (item.uuid === uuid ? { ...item, payment_status: status } : item))
    );
    setSelected((current) =>
      current && current.uuid === uuid ? { ...current, payment_status: status } : current
    );
  };

  const handleMarkCompleted = async (doc: PolishingDocument) => {
    if (!doc.order_no || isCompleted(doc.payment_status)) {
      return;
    }

    try {
      setUpdatingUuid(doc.uuid);

      const response = await fetch(`/api/admin/polishing-orders/${doc.order_no}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "completed" }),
      });
      const result = await response.json();

      if (!response.ok || result.code !== 0) {
        throw new Error(result.message || "Failed to update order status");
      }

      updateDocumentStatus(doc.uuid, "completed");
      toast.success("Order marked as completed");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update order status");
    } finally {
      setUpdatingUuid(null);
    }
  };

  return (
    <>
      <div className="w-full space-y-6 px-4 py-8 md:px-8">
        <div>
          <h1 className="text-2xl font-bold">Polishing Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} records</p>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Requirements</TableHead>
                <TableHead>Return Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex w-full items-center justify-center py-8 text-muted-foreground">
                      No polishing orders
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pagedData.map((doc) => {
                  const basic = fd(doc).basicInfo || {};
                  const details = fd(doc).polishingDetails || {};

                  return (
                    <TableRow key={doc.uuid}>
                      <TableCell>{basic.full_name || "-"}</TableCell>
                      <TableCell>
                        <div className="space-y-0.5 text-sm">
                          {basic.email && <div>{basic.email}</div>}
                          {basic.wechat && <div>WeChat: {basic.wechat}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {details.uploaded_document_url ? (
                          <a
                            href={details.uploaded_document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary underline"
                          >
                            <Download className="h-3 w-3" />
                            {details.uploaded_document_name || "Download"}
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <div
                          className="max-w-[160px] truncate text-sm"
                          title={details.polishing_requirements || ""}
                        >
                          {details.polishing_requirements || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {details.return_method === "email" ? (
                          <Badge variant="outline">Email</Badge>
                        ) : details.return_method === "wechat" ? (
                          <Badge variant="outline">WeChat</Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{renderStatusBadge(doc.payment_status)}</TableCell>
                      <TableCell className="text-sm">
                        {moment.utc(doc.created_at).utcOffset(8).format("YYYY-MM-DD HH:mm")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setSelected(doc)}>
                            <Eye className="mr-1 h-4 w-4" />
                            Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={
                              !isPaidOrCompleted(doc.payment_status) ||
                              isCompleted(doc.payment_status) ||
                              updatingUuid === doc.uuid
                            }
                            onClick={() => handleMarkCompleted(doc)}
                          >
                            {updatingUuid === doc.uuid ? (
                              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            ) : null}
                            Mark Completed
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} / {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
          }
        }}
      >
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Polishing Order Details</DialogTitle>
          </DialogHeader>
          {selected ? (
            <OrderDetail
              doc={selected}
              updating={updatingUuid === selected.uuid}
              onMarkCompleted={() => handleMarkCompleted(selected)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function OrderDetail({
  doc,
  updating,
  onMarkCompleted,
}: {
  doc: PolishingDocument;
  updating: boolean;
  onMarkCompleted: () => void;
}) {
  const basic = doc.form_data?.basicInfo || {};
  const details = doc.form_data?.polishingDetails || {};
  const academic = doc.form_data?.academicBackground || {};
  const target = doc.form_data?.targetProgram || {};
  const background = doc.form_data?.backgroundExperience || {};
  const needs = doc.form_data?.consultationNeeds || {};

  return (
    <div className="space-y-6">
      <Section title="Basic Info">
        <Row label="Name" value={basic.full_name} />
        <Row label="Email" value={basic.email} />
        <Row label="Phone" value={basic.phone} />
        <Row label="WeChat" value={basic.wechat} />
      </Section>

      <Section title="Polishing Details">
        <Row label="Requirements" value={details.polishing_requirements} />
        <Row
          label="Uploaded File"
          value={
            details.uploaded_document_url ? (
              <a
                href={details.uploaded_document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary underline"
              >
                <Download className="h-3 w-3" />
                {details.uploaded_document_name || "Download file"}
              </a>
            ) : (
              "-"
            )
          }
        />
        <Row
          label="Return Method"
          value={
            details.return_method === "email"
              ? `Email: ${details.return_email || "-"}`
              : details.return_method === "wechat"
                ? `WeChat: ${details.return_wechat || "-"}`
                : "-"
          }
        />
      </Section>

      {(academic.current_school || academic.major) && (
        <Section title="Academic Background">
          <Row label="Current School" value={academic.current_school} />
          <Row label="Major" value={academic.major} />
          <Row label="Degree" value={academic.degree} />
          <Row label="GPA" value={academic.gpa} />
          <Row label="Graduation Date" value={academic.graduation_date} />
        </Section>
      )}

      {(target.target_school || target.target_program) && (
        <Section title="Target Program">
          <Row label="Target School" value={target.target_school} />
          <Row label="Target Program" value={target.target_program} />
          <Row label="Degree Type" value={target.degree_type} />
          <Row label="Application Time" value={target.application_year} />
        </Section>
      )}

      {(background.research_experience || background.work_experience) && (
        <Section title="Background Experience">
          <Row label="Research Experience" value={background.research_experience} />
          <Row label="Work / Internship" value={background.work_experience} />
          <Row label="Activities" value={background.extracurricular} />
          <Row label="Awards" value={background.awards} />
        </Section>
      )}

      {(needs.consultation_type || needs.additional_notes) && (
        <Section title="Consultation Needs">
          <Row label="Type" value={needs.consultation_type} />
          <Row label="Notes" value={needs.additional_notes} />
        </Section>
      )}

      <Section title="Order Info">
        <Row label="Status" value={renderStatusBadge(doc.payment_status)} />
        {doc.order_no && <Row label="Order No." value={doc.order_no} />}
        {doc.paid_at && (
          <Row
            label="Paid At"
            value={moment.utc(doc.paid_at).utcOffset(8).format("YYYY-MM-DD HH:mm:ss")}
          />
        )}
        {doc.paid_amount != null && (
          <Row label="Amount" value={`¥${(doc.paid_amount / 100).toFixed(2)}`} />
        )}
      </Section>

      {doc.order_no ? (
        <div className="flex justify-end">
          <Button
            variant="outline"
            disabled={
              !isPaidOrCompleted(doc.payment_status) ||
              isCompleted(doc.payment_status) ||
              updating
            }
            onClick={onMarkCompleted}
          >
            {updating ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
            Mark as Completed
          </Button>
        </div>
      ) : null}

      <div className="border-t pt-2 text-xs text-muted-foreground">
        Submitted At: {moment.utc(doc.created_at).utcOffset(8).format("YYYY-MM-DD HH:mm:ss")} |
        {" "}Document ID: {doc.uuid}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="col-span-2 sm:col-span-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-0.5 text-sm">{value}</div>
    </div>
  );
}
