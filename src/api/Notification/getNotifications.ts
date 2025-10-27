import api from "..";
import type { INotification } from "@/types/notification";
import type { PaginatedResponse } from "../types";

export const getNotifications = async (
  opts?: {
    pagination: { pageIndex: number; pageSize: number }
    sorting: Array<{ id: string; desc: boolean }>
  },
): Promise<PaginatedResponse<INotification>['data']> => {
  const { data } = await api.get<PaginatedResponse<INotification>>(
    `/notifications`,
    {
      params: {
        ...(opts && {
          per_page: opts.pagination.pageSize,
          page: opts.pagination.pageIndex + 1,
          sort: opts.sorting[0].id,
          direction: opts.sorting[0].desc ? 'desc' : 'asc',
        }),
      },
    },
  )

  return data.data
}
