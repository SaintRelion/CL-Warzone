import { BASE_API } from "@/sr-config";
import { toast } from "@saintrelion/notifications";

export function subscribeToLiveEvents(jwt: string) {
  const source = new EventSource(`${BASE_API}api/events_dynamic/?token=${jwt}`);

  source.addEventListener("subscription_waiting_approval", (e) => {
    const data = JSON.parse(e.data);

    // Show a toast notification
    toast.info(`Subscription ${data.plan} is waiting for approval!`);
  });

  return source; // in case you want to close it later
}
