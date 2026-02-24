import { registerResource } from "@saintrelion/data-access-layer";

registerResource({
  name: "supportticket",
  endpoint: "supportticket/",
  store: "SupportTicket",
});
