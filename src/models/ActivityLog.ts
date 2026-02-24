export interface ActivityLog {
  id: string;

  user: string;
  full_name: string;
  role: string;

  action: string;
  category: string;

  description: string;

  ip_address: string;
  status: string;

  additional_info: Record<string, string>;

  created_at: string;
}

export interface CreateActivityLog {
  user: string;
  full_name: string;
  role: string;

  action: string;
  category: string;

  description: string;

  ip_address: string;
  status: string;

  additional_info: Record<string, string>;
}
