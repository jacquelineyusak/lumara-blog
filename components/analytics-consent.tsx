"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type Consent = "unknown" | "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

const storageKey = "lumara-analytics-consent";
const preferenceEvent = "lumara:open-consent";
const changedEvent = "lumara:analytics-consent-changed";
const tagId = "lumara-google-analytics";
const serviceAnchors = new Set(["#bookkeeping", "#tax-reporting", "#compliance"]);
let inMemoryConsent: Consent = "unknown";

function getConsent(): Consent {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored === "granted" || stored === "denied" ? stored : "unknown";
  } catch {
    return inMemoryConsent;
  }
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(changedEvent, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(changedEvent, onChange);
  };
}

function saveConsent(consent: Exclude<Consent, "unknown">) {
  inMemoryConsent = consent;
  try {
    window.localStorage.setItem(storageKey, consent);
  } catch {
    // The choice still applies to the current page when local storage is unavailable.
  }
  window.dispatchEvent(new Event(changedEvent));
}

function googleConsent(analyticsStorage: "granted" | "denied") {
  return {
    analytics_storage: analyticsStorage,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
}

function turnOnAnalytics(measurementId: string) {
  window[`ga-disable-${measurementId}`] = false;
  if (document.getElementById(tagId) && window.gtag) {
    window.gtag("consent", "update", googleConsent("granted"));
    return;
  }

  const dataLayer = (window.dataLayer ??= []);
  const gtag: (...args: unknown[]) => void = function () {
    // Google's tag bootstrap queues arguments objects in the data layer.
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };
  window.gtag = gtag;
  gtag("consent", "default", googleConsent("granted"));
  gtag("js", new Date());
  gtag("config", measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const tag = document.createElement("script");
  tag.id = tagId;
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.append(tag);
}

function turnOffAnalytics(measurementId: string) {
  const disableKey = `ga-disable-${measurementId}` as const;
  if (window[disableKey]) return;
  window[disableKey] = true;
  window.gtag?.("consent", "update", googleConsent("denied"));
}

function clearAnalyticsCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (name !== "_ga" && !name?.startsWith("_ga_")) continue;
    const expired = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    document.cookie = expired;
    if (window.location.hostname === "lumara.id" || window.location.hostname === "www.lumara.id") {
      document.cookie = `${expired}; Domain=lumara.id`;
    }
  }
}

function trackArticleClick(event: MouseEvent) {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>("a[href]");
  const placement = link?.closest(".article-content, .article-cta");
  if (!link || !placement) return;

  const url = new URL(link.href);
  if (url.hostname !== "lumara.id" && url.hostname !== "www.lumara.id") return;
  const path = url.pathname.replace(/\/$/, "");
  if ((path !== "/contact" && path !== "/services") || getConsent() !== "granted") return;

  window.gtag?.("event", "article_cta_click", {
    article_path: window.location.pathname,
    destination: path + (path === "/services" && serviceAnchors.has(url.hash) ? url.hash : ""),
    placement: placement.classList.contains("article-cta") ? "article_footer" : "article_body",
  });
}

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      className="cursor-pointer border-0 bg-transparent p-0 text-[.82rem] text-[#d7c8d5] hover:text-white"
      onClick={() => window.dispatchEvent(new Event(preferenceEvent))}
    >
      Cookie preferences
    </button>
  );
}

export function AnalyticsConsent({ measurementId }: { measurementId?: string }) {
  const id = measurementId?.trim().match(/^G-[A-Z0-9]+$/)?.[0];
  const consent = useSyncExternalStore(subscribe, getConsent, () => "loading" as const);
  const [show, setShow] = useState<boolean>();
  const open = show ?? (consent === "unknown" && id !== undefined);

  useEffect(() => {
    const openPreferences = () => setShow(true);
    window.addEventListener(preferenceEvent, openPreferences);
    return () => window.removeEventListener(preferenceEvent, openPreferences);
  }, []);

  useEffect(() => {
    if (!id || consent === "loading") return;
    if (consent !== "granted") {
      turnOffAnalytics(id);
      if (consent === "denied") clearAnalyticsCookies();
      return;
    }
    turnOnAnalytics(id);
    document.addEventListener("click", trackArticleClick);
    return () => document.removeEventListener("click", trackArticleClick);
  }, [consent, id]);

  function choose(next: Exclude<Consent, "unknown">) {
    if (next === "denied" && id) turnOffAnalytics(id);
    saveConsent(next);
    setShow(false);
    if (next === "denied") clearAnalyticsCookies();
  }

  if (!open) return null;
  return (
    <section
      role="dialog"
      aria-labelledby="analytics-preferences-title"
      className="fixed right-4 bottom-4 z-[200] w-[min(420px,calc(100%-2rem))] rounded border border-white/15 bg-(--ink) p-6 text-(--cream) shadow-2xl"
    >
      <button
        type="button"
        className="absolute top-4 right-4 size-8 cursor-pointer rounded border border-white/25 bg-transparent leading-none"
        aria-label="Close cookie preferences"
        onClick={() => setShow(false)}
      >
        ×
      </button>
      <h2 className="pr-8 text-2xl" id="analytics-preferences-title">Analytics preferences</h2>
      <p className="mt-3 mb-5 text-sm text-[#d7c8d5]">
        {id
          ? "Allow Google Analytics to help Lumara understand which guides readers use. Advertising features stay off."
          : "Analytics is currently off."}
        {" "}<a className="underline" href="https://lumara.id/privacy">Privacy policy</a>
      </p>
      <div className="flex flex-wrap gap-2">
        {id && <button type="button" className="button cursor-pointer" onClick={() => choose("granted")}>Allow analytics</button>}
        <button
          type="button"
          className="button cursor-pointer border-white/25 bg-transparent"
          onClick={() => choose("denied")}
        >
          Keep analytics off
        </button>
      </div>
    </section>
  );
}
