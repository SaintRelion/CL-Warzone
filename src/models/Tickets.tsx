export interface ClientTicket {
  id: string;
  userId: string;
  customer: string;
  issue: string;
  description: string;
  priority: string;
  status: string;
  assignedTo: string;
}

export interface CreateTicket {
  userId: string;
  customer: string;
  issue: string;
  description: string;
  priority: string;
  status: string;
  assignedTo: string;
}
