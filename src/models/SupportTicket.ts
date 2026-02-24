export interface SupportTicket {
  id: string;
  user: string;
  customer: string;
  issue: string;
  description: string;
  priority: string;
  status: string;
  assigned_to: string;
  created_at: string;
}

export interface CreateTicket {
  user: string;
  customer: string;
  issue: string;
  description: string;
  priority: string;
  status: string;
  assigned_to: string;
}

export interface UpdateTicket {
  priority?: string;
  status?: string;
  assigned_to?: string;
}
