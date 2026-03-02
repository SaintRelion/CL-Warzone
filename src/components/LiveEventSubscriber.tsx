import { subscribeToLiveEvents } from "@/lib/live-notification";
import { localCache } from "@saintrelion/cache";
import { useEffect } from "react";

export function LiveEventSubscriber() {
  useEffect(() => {
    let source: EventSource | null = null;

    async function init() {
      const proof = await localCache.get<{ access: string }>(
        "auth_proof",
        "indexed",
      );
      if (!proof?.access) return;

      source = subscribeToLiveEvents(proof.access);
    }
    init();

    return () => {
      if (source) source.close();
    };
  }, []);

  return null; // no UI needed
}
