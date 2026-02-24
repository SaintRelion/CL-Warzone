import type { CreateActivityLog } from "@/models/ActivityLog";
import type { User } from "@/models/user";
import { useCurrentUser } from "@saintrelion/auth-lib";
import { useResourceLocked } from "@saintrelion/data-access-layer";

export interface ActivityLogInput {
  action: "create" | "update" | "delete" | "login" | "logout" | "other";
  category:
    | "user_management"
    | "billing"
    | "subscription"
    | "support"
    | "reports";
  description: string;
  status?: "success" | "failure" | "pending";
  additional_info?: Record<string, string>;
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
      user: user.id,
      full_name: `${user.first_name} ${user.last_name}`,
      role: user.roles && user.roles.length > 0 ? user.roles[0] : "",

      action: input.action,
      category: input.category,
      description: input.description,

      ip_address: "0.0.0.0", // or injected
      status: input.status ?? "success",

      additional_info: input.additional_info ?? {},
    });
  };

  return { log, isLocked };
}
