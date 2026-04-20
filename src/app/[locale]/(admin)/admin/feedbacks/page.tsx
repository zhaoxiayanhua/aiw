import { TableColumn } from "@/types/blocks/table";
import TableSlot from "@/components/dashboard/slots/table";
import { Table as TableSlotType } from "@/types/slots/table";
import { getFeedbacks } from "@/models/feedback";
import moment from "moment";
import Dropdown from "@/components/blocks/table/dropdown";
import { NavItem } from "@/types/blocks/base";

export default async function () {
  const feedbacks = await getFeedbacks(1, 50);

  const columns: TableColumn[] = [
    {
      title: "User",
      name: "user",
      callback: (row) => {
        if (!row.user) {
          return row.user_uuid || "-";
        }

        const displayName =
          row.user.nickname || row.user.email || row.user.uuid || row.user_uuid;
        const subText = row.user.email || row.user.uuid || row.user_uuid;

        return (
          <div className="flex items-center gap-2">
            {row.user.avatar_url ? (
              <img
                src={row.user.avatar_url}
                className="h-8 w-8 rounded-full"
                alt={displayName || "User avatar"}
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {(displayName || "?").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="truncate font-medium">{displayName || "-"}</div>
              <div className="truncate text-xs text-muted-foreground">
                {subText || "-"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      name: "content",
      title: "Content",
      callback: (row) => row.content,
    },
    {
      name: "rating",
      title: "Rating",
      callback: (row) => row.rating,
    },
    {
      name: "created_at",
      title: "Created At",
      callback: (row) => moment.utc(row.created_at).utcOffset(8).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      name: "actions",
      title: "Actions",
      callback: (row) => {
        const items: NavItem[] = [
          {
            title: "View details",
            icon: "RiEyeLine",
            url: `/admin/feedbacks/${row.id}`,
          },
        ];

        return <Dropdown items={items} />;
      },
    },
  ];

  const table: TableSlotType = {
    title: "Feedbacks",
    columns,
    data: feedbacks,
  };

  return <TableSlot {...table} />;
}
