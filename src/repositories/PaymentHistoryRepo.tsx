import { registerResource } from "@saintrelion/data-access-layer";

registerResource({
  name: "paymenthistory",
  endpoint: "paymenthistory/",
  store: "PaymentHistory",
});
