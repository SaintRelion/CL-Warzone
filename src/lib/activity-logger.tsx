import type { CreateActivityLog } from "@/models/ActivityLog";
import type { User } from "@/models/user";
import { useCurrentUser } from "@saintrelion/auth-lib";
import { useResourceLocked } from "@saintrelion/data-access-layer";

type ActivityCategory =
  | "all"
  | "user_management"
  | "billing"
  | "subscription"
  | "support"
  | "security"
  | "system"
  | "marketing"
  | "reports";

export interface ActivityLogInput {
  action: string;
  category: ActivityCategory;
  description: string;
  status?: "success" | "warning" | "failed";
  additionalInfo?: Record<string, string>;
}

export function useActivityLogger() {
  const user = useCurrentUser<User>();
  const { useInsert: insertActivityLog } = useResourceLocked<
    never,
    CreateActivityLog
  >("activitylog");

  const isLocked = insertActivityLog.isLocked;
  const log = (input: ActivityLogInput) => {
    return insertActivityLog.run({
      userId: user.id,
      fullName: `${user.firstName} ${user.lastName}`,
      role: user.roles && user.roles.length > 0 ? user.roles[0] : "",

      action: input.action,
      category: input.category,
      description: input.description,

      ipAddress: "0.0.0.0", // or injected
      status: input.status ?? "success",

      additionalInfo: input.additionalInfo ?? {},
    });
  };

  return { log, isLocked };
}
