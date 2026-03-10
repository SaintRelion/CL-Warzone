import { toast } from "@saintrelion/notifications";
import { localCache } from "@saintrelion/cache";

interface AuthProof {
  access: string;
  refresh?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  payload?: T,
  options?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    auth?: boolean; // default true
    headers?: Record<string, string>;
  },
) {
  const method = options?.method || "POST";
  const auth = options?.auth ?? true;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers || {}),
  };

  if (auth) {
    const proof: AuthProof | null = await localCache.get(
      "auth_proof",
      "indexed",
    );

    if (proof) headers["Authorization"] = `Bearer ${proof.access}`;
  }

  try {
    const res = await (payload
      ? fetch(endpoint, {
          method,
          headers,
          body: JSON.stringify(payload),
        })
      : fetch(endpoint, {
          method,
          headers,
        }));

    let body;

    try {
      body = await res.json();
    } catch {
      body = await res.text(); // fallback to text if not JSON
    }

    if (!res.ok) {
      // Show error toast using body.detail if present
      let toastMessage = "Request Failed";
      if (
        body &&
        typeof body === "object" &&
        "detail" in body &&
        typeof body.detail === "string"
      ) {
        toastMessage = body.detail;
      }
      toast.error(toastMessage);

      // Throw for upstream handling
      throw new Error(`${"Request Failed"}: ${JSON.stringify(body)}`);
    }

    // Show success toast if body.detail exists
    if (
      body &&
      typeof body === "object" &&
      "detail" in body &&
      typeof body.detail === "string"
    ) {
      toast.success(body.detail);
    }

    return body;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(message);
    throw err;
  }
}
