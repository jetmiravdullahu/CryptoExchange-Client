import api from "..";
import type { IUnreadNotificationCountResponse } from "@/types/notification";
import type { SuccessResponse } from "../types";

export const getUnreadNotificationsCount = async (): Promise<SuccessResponse<IUnreadNotificationCountResponse>['data']> => {
  const { data } = await api.get<SuccessResponse<IUnreadNotificationCountResponse>>(
    `/notifications/unread`,
  )

  return data.data
}