export interface SupportScript {
  id: number;
  category: string;
  title: string;
  keywords: string;
  script_text: string;
  created_at: string;
}

export interface CallMessage {
  id: number;
  call_id: number;
  role: "customer" | "ai" | "agent";
  content: string;
  timestamp: string;
  is_unresolved: boolean;
  matched_script_id: number | null;
}

export interface Call {
  id: number;
  phone_number: string;
  status: "active" | "completed" | "missed";
  started_at: string;
  ended_at: string | null;
  is_resolved: boolean;
  summary: string | null;
}

export interface CallDetail extends Call {
  messages: CallMessage[];
}

export interface DashboardStats {
  total_calls_today: number;
  active_calls: number;
  completed_calls: number;
  avg_duration_seconds: number;
  unresolved_count: number;
}

export interface AIResponse {
  response: string;
  matched_script_id: number | null;
  matched_script_title: string | null;
  confidence: number;
  is_unresolved: boolean;
}

export interface WSMessage {
  text: string;
}
