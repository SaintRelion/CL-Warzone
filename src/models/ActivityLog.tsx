export interface ActivityLog {
  id: string;
  createdAt: string;

  userId: string;
  fullName: string;
  role: string;

  action: string;
  category: string;

  description: string;

  ipAddress: string;
  status: string;

  additionalInfo: Record<string, string>;
}

export interface CreateActivityLog {
  userId: string;
  fullName: string;
  role: string;

  action: string;
  category: string;

  description: string;

  ipAddress: string;
  status: string;

  additionalInfo: Record<string, string>;
}
