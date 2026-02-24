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
    credentials?: RequestCredentials;
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
    const res = await fetch(endpoint, {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
      credentials: options?.credentials,
    });

    if (!res.ok) {
      let errorBody;

      try {
        errorBody = await res.json();
      } catch {
        errorBody = await res.text();
      }

      console.error("API Error:", res.status, errorBody);

      const message =
        typeof errorBody === "string"
          ? errorBody
          : JSON.stringify(errorBody, null, 2);

      toast.error(`Error ${res.status}: ${message}`);

      throw new Error(message);
    }

    // Handle empty responses (204 etc.)
    if (res.status === 204) return {};

    return await res.json();
  } catch (err) {
    const error = err as Record<string, string>;
    toast.error(error.message || "Unknown error");
    throw err;
  }
}
