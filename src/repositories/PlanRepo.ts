import { registerResource } from "@saintrelion/data-access-layer";

registerResource({
  name: "plan",
  endpoint: "plan/",
  store: "Plan",
});
