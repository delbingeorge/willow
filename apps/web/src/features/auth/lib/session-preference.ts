const STORAGE_KEY = "willow.remember-session";

export function hasRememberedSession() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function rememberSession() {
  try {
    window.localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    return;
  }
}

export function forgetSession() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}
