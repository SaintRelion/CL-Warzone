export interface AuditLog {
  id: number;
  user: number | null;
  source: string;
  category: string;
  action: string;
  object_id: string | null;
  new_data: Record<string, string> | null;
  ip_address: string | null;
  created_at: string;
}
