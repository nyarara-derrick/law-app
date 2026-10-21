// Device Hardware & Native Phone Permissions Manager

export interface PermissionStatusMap {
  camera: "granted" | "denied" | "prompt" | "unsupported";
  microphone: "granted" | "denied" | "prompt" | "unsupported";
  storage: "granted" | "denied" | "prompt" | "unsupported";
  notifications: "granted" | "denied" | "prompt" | "unsupported";
}

export interface StorageEstimateInfo {
  usageMB: number;
  quotaMB: number;
  usagePercent: number;
  isPersistent: boolean;
}

/**
 * Checks current browser/phone device permission states
 */
export async function checkDevicePermissions(): Promise<PermissionStatusMap> {
  const status: PermissionStatusMap = {
    camera: "prompt",
    microphone: "prompt",
    storage: "prompt",
    notifications: "prompt",
  };

  // 1. Notification Permission
  if ("Notification" in window) {
    status.notifications = Notification.permission as "granted" | "denied" | "prompt";
  } else {
    status.notifications = "unsupported";
  }

  // 2. Storage Persistence Permission
  if (navigator.storage && navigator.storage.persisted) {
    try {
      const isPersisted = await navigator.storage.persisted();
      status.storage = isPersisted ? "granted" : "prompt";
    } catch {
      status.storage = "prompt";
    }
  } else {
    status.storage = "granted"; // standard localStorage is always available
  }

  // 3. Camera & Microphone permissions query via Permissions API if available
  if (navigator.permissions && navigator.permissions.query) {
    try {
      const camPermission = await navigator.permissions.query({ name: "camera" as any });
      status.camera = camPermission.state;
      camPermission.onchange = () => {
        status.camera = camPermission.state;
      };
    } catch {
      // Browser doesn't allow querying camera directly without mediaDevices
    }

    try {
      const micPermission = await navigator.permissions.query({ name: "microphone" as any });
      status.microphone = micPermission.state;
      micPermission.onchange = () => {
        status.microphone = micPermission.state;
      };
    } catch {
      // Browser doesn't allow querying microphone directly
    }
  }

  return status;
}

/**
 * Explicitly request Camera permission from the phone OS
 */
export async function requestCameraPermission(): Promise<{ granted: boolean; stream?: MediaStream; error?: string }> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return { granted: false, error: "Camera hardware is not supported on this browser or platform." };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" }, // Default to phone's rear camera for documents/exams
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    });
    return { granted: true, stream };
  } catch (err: any) {
    console.error("Camera permission request failed:", err);
    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
      return { granted: false, error: "Camera permission was denied in phone settings. Please enable camera access in your device settings." };
    }
    return { granted: false, error: err.message || "Failed to access phone camera." };
  }
}

/**
 * Explicitly request Microphone permission from the phone OS
 */
export async function requestMicrophonePermission(): Promise<{ granted: boolean; stream?: MediaStream; error?: string }> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return { granted: false, error: "Microphone hardware is not supported on this browser or platform." };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    return { granted: true, stream };
  } catch (err: any) {
    console.error("Microphone permission request failed:", err);
    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
      return { granted: false, error: "Microphone permission was denied in phone settings. Please enable microphone access in your device settings." };
    }
    return { granted: false, error: err.message || "Failed to access phone microphone." };
  }
}

/**
 * Request Phone Persistent Storage to prevent device OS from purging offline Vault
 */
export async function requestPersistentPhoneStorage(): Promise<boolean> {
  if (navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persist();
      return isPersisted;
    } catch (err) {
      console.error("Storage persist error:", err);
      return false;
    }
  }
  return true;
}

/**
 * Get Phone Storage Usage Estimate in Megabytes
 */
export async function getPhoneStorageEstimate(): Promise<StorageEstimateInfo> {
  let usageMB = 0;
  let quotaMB = 1024; // Default fallback 1GB
  let isPersistent = false;

  if (navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      if (estimate.usage !== undefined) {
        usageMB = Number((estimate.usage / (1024 * 1024)).toFixed(2));
      }
      if (estimate.quota !== undefined) {
        quotaMB = Number((estimate.quota / (1024 * 1024)).toFixed(0));
      }
      if (navigator.storage.persisted) {
        isPersistent = await navigator.storage.persisted();
      }
    } catch (e) {
      console.warn("Storage estimate unavailable:", e);
    }
  } else {
    // Rough calculation from localStorage
    let totalChars = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalChars += (localStorage[key] || "").length + key.length;
      }
    }
    usageMB = Number(((totalChars * 2) / (1024 * 1024)).toFixed(3));
  }

  const usagePercent = quotaMB > 0 ? Number(((usageMB / quotaMB) * 100).toFixed(1)) : 0;

  return {
    usageMB,
    quotaMB,
    usagePercent,
    isPersistent,
  };
}

/**
 * Request Notification Permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  try {
    const perm = await Notification.requestPermission();
    return perm === "granted";
  } catch (err) {
    console.error("Notification permission error:", err);
    return false;
  }
}
