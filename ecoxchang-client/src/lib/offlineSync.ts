import { api } from "./api";
import toast from "react-hot-toast";

export interface QueuedAction {
  id: string; // client-generated idempotency key
  type: "status_change" | "proof_upload" | "location_ping";
  url: string;
  method: "POST" | "DELETE" | "PATCH";
  payload: Record<string, unknown>;
  timestamp: number;
}

const OFFLINE_QUEUE_KEY = "ecoxchange_offline_queue";

export function getOfflineQueue(): QueuedAction[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(OFFLINE_QUEUE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveOfflineQueue(queue: QueuedAction[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

export function queueAction(action: Omit<QueuedAction, "id" | "timestamp">) {
  const queue = getOfflineQueue();
  const newAction: QueuedAction = {
    ...action,
    id: `idemp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  };
  queue.push(newAction);
  saveOfflineQueue(queue);

  toast.success("Action saved offline. Will sync when connection is restored.");
  
  // Try immediate sync in case we are actually online
  if (navigator.onLine) {
    void syncOfflineQueue();
  }
}

export async function syncOfflineQueue() {
  const queue = getOfflineQueue();
  if (queue.length === 0) return;

  console.log(`[OfflineSync] Syncing ${queue.length} pending actions...`);
  const remaining: QueuedAction[] = [];

  for (const action of queue) {
    try {
      // If it's a proof upload and payload contains base64 image
      if (action.type === "proof_upload") {
        const payload = action.payload as {
          imageBase64?: string;
          taskId?: string;
          deviceType?: string;
          captureTime?: string;
          latitude?: number;
          longitude?: number;
        };
        if (payload.imageBase64 && payload.taskId) {
          // Convert base64 to file blob and upload
          const response = await fetch(payload.imageBase64);
          const blob = await response.blob();
          const formData = new FormData();
          formData.append("image", blob, "proof.jpg");
          formData.append("taskId", payload.taskId);
          if (payload.deviceType) formData.append("deviceType", payload.deviceType);
          if (payload.captureTime) formData.append("captureTime", payload.captureTime);
          if (payload.latitude) formData.append("latitude", String(payload.latitude));
          if (payload.longitude) formData.append("longitude", String(payload.longitude));

          await api.post("/api/delivery/proofs", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      } else {
        // Regular JSON request
        if (action.method === "POST") {
          await api.post(action.url, { ...action.payload, idempotencyKey: action.id });
        } else if (action.method === "PATCH") {
          await api.patch(action.url, { ...action.payload, idempotencyKey: action.id });
        }
      }
      console.log(`[OfflineSync] Action ${action.id} synced successfully.`);
    } catch (error: unknown) {
      console.error(`[OfflineSync] Failed to sync action ${action.id}:`, error);
      const err = error as { response?: { data?: { message?: string } } };
      // Keep action in queue if it was a network error (not a validation/bad request error)
      const isNetworkError = !err.response;
      if (isNetworkError) {
        remaining.push(action);
      } else {
        toast.error(`Offline sync error: ${err.response?.data?.message || "Invalid action discarded"}`);
      }
    }
  }

  saveOfflineQueue(remaining);
  if (remaining.length === 0 && queue.length > 0) {
    toast.success("All offline actions synced successfully!");
  }
}

// Automatically sync when browser goes online
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    void syncOfflineQueue();
  });
}
