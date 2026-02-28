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

    let body = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }

    if (!res.ok) {
      // Priority 1: Your standard { error: "..." }
      if (body?.error) {
        throw new Error(body.error);
      }

      // Priority 2: If backend returns random format
      if (typeof body === "object" && body !== null) {
        throw new Error(JSON.stringify(body));
      }

      // Priority 3: If plain text
      if (typeof body === "string") {
        throw new Error(body);
      }

      // Priority 4: Fallback generic
      throw new Error(
        "body was null for some reason, failed to read response.json",
      );
    }

    // 204 No Content
    if (res.status === 204) return {};

    return body;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    toast.error(message || "Unknown error");
    throw err;
  }
}
