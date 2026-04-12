export function detectMobile() {
  if (typeof window === "undefined") return true;
  return window.innerWidth < 768 || /iPhone|iPad|Android/i.test(navigator.userAgent);
}

export function navigateToApp(url: string) {
  if (detectMobile()) {
    window.location.href = url;
  } else {
    window.open(url, "_blank", "noopener");
  }
}
