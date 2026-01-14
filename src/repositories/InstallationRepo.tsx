import { registerResource } from "@saintrelion/data-access-layer";

registerResource({
  name: "installation",
  endpoint: "installation/",
  store: "Installation",
});
