import axios from "axios";
import type {
  Call,
  CallDetail,
  DashboardStats,
  SupportScript,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({ baseURL: API_URL });

export const callsApi = {
  list: (status?: string) =>
    api.get<Call[]>("/api/calls/", { params: status ? { status } : {} }),
  create: (phone_number: string) =>
    api.post<Call>("/api/calls/", { phone_number }),
  get: (id: number) => api.get<CallDetail>(`/api/calls/${id}`),
  end: (id: number) => api.patch<Call>(`/api/calls/${id}/end`),
  dashboard: () => api.get<DashboardStats>("/api/calls/dashboard"),
  unresolved: () => api.get<CallDetail[]>("/api/calls/unresolved"),
};

export const scriptsApi = {
  list: () => api.get<SupportScript[]>("/api/scripts/"),
  get: (id: number) => api.get<SupportScript>(`/api/scripts/${id}`),
  create: (data: Omit<SupportScript, "id" | "created_at">) =>
    api.post<SupportScript>("/api/scripts/", data),
  update: (id: number, data: Partial<SupportScript>) =>
    api.put<SupportScript>(`/api/scripts/${id}`, data),
  delete: (id: number) => api.delete(`/api/scripts/${id}`),
};

export function getWsUrl(callId: number): string {
  const base = API_URL.replace(/^http/, "ws");
  return `${base}/ws/call/${callId}`;
}
