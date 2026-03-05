import { localCache } from "@saintrelion/cache";
import { useEffect } from "react";

import { BASE_API } from "@/sr-config";
import { toast } from "@saintrelion/notifications";
import { useCurrentUser } from "@saintrelion/auth-lib";
import { useQueryClient } from "@tanstack/react-query";

export function LiveEventSubscriber() {
  const currentUser = useCurrentUser();

  const queryClient = useQueryClient();

  async function subscribeToLiveEvents() {
    const proof = await localCache.get<{ access: string }>(
      "auth_proof",
      "indexed",
    );

    if (!proof?.access || !currentUser.id) return;

    const response = await fetch(
      `${BASE_API}api/events/?channels=user-${currentUser.id}`,
      {
        headers: {
          Authorization: `Bearer ${proof.access}`,
          Accept: "text/event-stream",
        },
      },
    );

    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        const lines = part.split("\n");
        const jsonLine = lines.find((l) => l.startsWith("data:"));
        if (!jsonLine) continue;

        const jsonString = jsonLine.replace(/^data:\s*/, "").trim();
        if (!jsonString || jsonString === "?") continue; // skip keep-alive

        try {
          const event = JSON.parse(jsonString);

          const resource = event.resource || "unknown";
          // setNotification({
          //   resource: resource,
          //   message: event.message || "New update",
          //   payload: event,
          // });

          toast.info(event.message || `Status updated: ${event.status}`);

          if (resource && typeof resource === "string") {
            queryClient.invalidateQueries({ queryKey: [resource] });
          }
        } catch (err) {
          const error = err as Record<string, string>;
          console.warn("Skipping non-JSON SSE event", jsonString);
          console.warn("Error: ", error);
        }
      }
    }
  }

  useEffect(() => {
    subscribeToLiveEvents();
  }, []);

  return null; // no UI needed
}
