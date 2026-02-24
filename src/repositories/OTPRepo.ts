import { registerResource } from "@saintrelion/data-access-layer";

registerResource({
  name: "otpsmtp",
  endpoint: "otpsmtp/",
  store: "OTPSMTP",
});
