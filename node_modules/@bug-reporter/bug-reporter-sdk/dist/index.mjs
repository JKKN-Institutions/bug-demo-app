// src/components/BugReporterProvider.tsx
import { createContext, useState as useState2, useEffect } from "react";

// src/api/client.ts
var BugReporterApiClient = class {
  constructor(config) {
    this.config = config;
  }
  async request(endpoint, options = {}) {
    const url = `${this.config.apiUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      "X-API-Key": this.config.apiKey,
      ...options.headers
    };
    if (this.config.debug) {
      console.log("[BugReporter SDK] Request:", { url, method: options.method || "GET" });
    }
    const response = await fetch(url, {
      ...options,
      headers
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      const errorMessage = data.error?.message || `HTTP ${response.status}`;
      const error = new Error(errorMessage);
      if (this.config.debug) {
        console.error("[BugReporter SDK] Error:", data.error);
      }
      throw error;
    }
    if (this.config.debug) {
      console.log("[BugReporter SDK] Response:", data.data);
    }
    return data.data;
  }
  /**
   * Submit a new bug report
   */
  async createBugReport(payload) {
    const response = await this.request(
      "/api/v1/public/bug-reports",
      {
        method: "POST",
        body: JSON.stringify(payload)
      }
    );
    return response.bug_report;
  }
  /**
   * Get all bug reports for this application
   */
  async getMyBugReports(options) {
    const params = new URLSearchParams();
    if (options?.page) params.append("page", options.page.toString());
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.status) params.append("status", options.status);
    if (options?.category) params.append("category", options.category);
    if (options?.search) params.append("search", options.search);
    const queryString = params.toString();
    const endpoint = queryString ? `/api/v1/public/bug-reports/me?${queryString}` : "/api/v1/public/bug-reports/me";
    return this.request(endpoint);
  }
  /**
   * Get details of a specific bug report
   */
  async getBugReportById(id, includeMessages = true) {
    const params = new URLSearchParams();
    if (!includeMessages) params.append("include_messages", "false");
    const queryString = params.toString();
    const endpoint = queryString ? `/api/v1/public/bug-reports/${id}?${queryString}` : `/api/v1/public/bug-reports/${id}`;
    return this.request(endpoint);
  }
  /**
   * Send a message on a bug report
   */
  async sendMessage(bugReportId, messageText, attachments) {
    const payload = {
      bug_report_id: bugReportId,
      message: messageText,
      attachments
    };
    return this.request(
      `/api/v1/public/bug-reports/${bugReportId}/messages`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      }
    );
  }
};

// src/components/BugReporterWidget.tsx
import { useState } from "react";

// src/utils/screenshot.ts
import html2canvas from "html2canvas";
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768 && "ontouchstart" in window;
}
async function captureScreenshot() {
  console.log("[BugReporter SDK] Starting screenshot capture...");
  const isMobile = isMobileDevice();
  const originalScrollX = window.scrollX;
  const originalScrollY = window.scrollY;
  try {
    void document.body.offsetHeight;
    const options = {
      scale: Math.max(window.devicePixelRatio || 1, 2),
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: false,
      removeContainer: true,
      logging: false,
      imageTimeout: isMobile ? 15e3 : 3e4,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: originalScrollX,
      scrollY: originalScrollY,
      foreignObjectRendering: true,
      ignoreElements: (element) => {
        if (element.classList.contains("bug-reporter-widget")) return true;
        if (element.classList.contains("bug-reporter-sdk")) return true;
        const className = element.className || "";
        if (typeof className === "string") {
          const overlayClasses = [
            "radix-portal",
            "toast",
            "modal",
            "overlay",
            "popup",
            "dropdown",
            "tooltip",
            "popover",
            "dialog",
            "notification"
          ];
          if (overlayClasses.some((cls) => className.includes(cls))) {
            return true;
          }
        }
        const role = element.getAttribute("role");
        if (role && ["dialog", "alertdialog", "tooltip", "menu"].includes(role)) {
          return true;
        }
        if (element.hasAttribute("data-radix-portal") || element.hasAttribute("data-sonner-toaster") || element.hasAttribute("data-html2canvas-ignore")) {
          return true;
        }
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.display === "none" || computedStyle.visibility === "hidden" || computedStyle.opacity === "0") {
          return true;
        }
        return false;
      }
    };
    await new Promise((resolve) => setTimeout(resolve, 800));
    const targetElement = document.querySelector("body");
    if (!targetElement) {
      throw new Error("Could not find body element");
    }
    const canvas = await html2canvas(targetElement, options);
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Canvas creation failed");
    }
    const dataUrl = canvas.toDataURL("image/png", 1);
    console.log("[BugReporter SDK] Screenshot captured successfully");
    return dataUrl;
  } catch (error) {
    console.error("[BugReporter SDK] Screenshot capture failed:", error);
    throw error;
  }
}

// src/hooks/useBugReporter.ts
import { useContext } from "react";
function useBugReporter() {
  const context = useContext(BugReporterContext);
  if (!context) {
    throw new Error("useBugReporter must be used within BugReporterProvider");
  }
  return context;
}

// src/components/BugReporterWidget.tsx
import toast from "react-hot-toast";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var styles = {
  floatingButton: {
    position: "fixed",
    bottom: "1rem",
    right: "1rem",
    zIndex: 9999,
    width: "3.5rem",
    height: "3.5rem",
    borderRadius: "50%",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    transition: "transform 0.2s"
  },
  modal: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1e4,
    padding: "1rem"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    maxWidth: "28rem",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem"
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    margin: 0
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    padding: "0.25rem",
    color: "#6b7280"
  },
  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    marginBottom: "0.5rem",
    color: "#374151"
  },
  textarea: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    resize: "vertical",
    fontFamily: "inherit"
  },
  submitButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    width: "100%"
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed"
  }
};
function BugReporterWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [screenshot, setScreenshot] = useState("");
  const { apiClient, config } = useBugReporter();
  const handleOpenWidget = async () => {
    setIsCapturing(true);
    try {
      const captured = await captureScreenshot();
      setScreenshot(captured);
      setIsOpen(true);
      toast.success("Screenshot captured!");
    } catch (error) {
      console.error("[BugReporter SDK] Screenshot failed:", error);
      setIsOpen(true);
      toast.error("Screenshot capture failed, but you can still report the bug");
    } finally {
      setIsCapturing(false);
    }
  };
  const handleSubmit = async () => {
    if (!apiClient) {
      toast.error("Bug Reporter not initialized");
      return;
    }
    if (!description || description.trim().length < 10) {
      toast.error("Please provide at least 10 characters description");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        page_url: window.location.href,
        description: description.trim(),
        screenshot_data_url: screenshot,
        console_logs: [],
        metadata: {
          userAgent: navigator.userAgent,
          screenResolution: `${screen.width}x${screen.height}`,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        },
        // Include user context if provided
        user_email: config.userContext?.email,
        user_name: config.userContext?.name,
        user_id: config.userContext?.userId
      };
      await apiClient.createBugReport(payload);
      toast.success("Bug report submitted successfully!");
      setDescription("");
      setScreenshot("");
      setIsOpen(false);
    } catch (error) {
      console.error("[BugReporter SDK] Submit failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit bug report");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!config.enabled) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleOpenWidget,
        disabled: isCapturing,
        style: {
          ...styles.floatingButton,
          ...isCapturing ? { transform: "scale(0.9)" } : {}
        },
        className: "bug-reporter-sdk bug-reporter-widget",
        title: "Report a Bug",
        children: isCapturing ? "\u{1F4F8}" : "\u{1F41B}"
      }
    ),
    isOpen && /* @__PURE__ */ jsx("div", { style: styles.modal, className: "bug-reporter-sdk", onClick: () => setIsOpen(false), children: /* @__PURE__ */ jsxs("div", { style: styles.card, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { style: styles.header, children: [
        /* @__PURE__ */ jsx("h2", { style: styles.title, children: "\u{1F41B} Report a Bug" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setIsOpen(false);
              setDescription("");
              setScreenshot("");
            },
            style: styles.closeButton,
            "aria-label": "Close",
            children: "\xD7"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginBottom: "1rem" }, children: [
        /* @__PURE__ */ jsxs("label", { style: styles.label, children: [
          "Describe the issue ",
          /* @__PURE__ */ jsx("span", { style: { color: "#dc2626" }, children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: description,
            onChange: (e) => setDescription(e.target.value),
            placeholder: "What went wrong? Please provide details...",
            style: styles.textarea,
            rows: 4
          }
        ),
        /* @__PURE__ */ jsxs("p", { style: { fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem", margin: "0.25rem 0 0 0" }, children: [
          "Minimum 10 characters required (",
          description.length,
          "/10)"
        ] })
      ] }),
      screenshot && /* @__PURE__ */ jsxs("div", { style: { marginBottom: "1rem" }, children: [
        /* @__PURE__ */ jsx("label", { style: styles.label, children: "\u2713 Screenshot captured" }),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: screenshot,
            alt: "Screenshot",
            style: {
              width: "100%",
              height: "120px",
              objectFit: "cover",
              borderRadius: "0.375rem",
              border: "1px solid #d1d5db"
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleSubmit,
          disabled: isSubmitting || description.trim().length < 10,
          style: {
            ...styles.submitButton,
            ...isSubmitting || description.trim().length < 10 ? styles.buttonDisabled : {}
          },
          children: isSubmitting ? "Submitting..." : "Submit Bug Report"
        }
      )
    ] }) })
  ] });
}

// src/components/BugReporterProvider.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var BugReporterContext = createContext(null);
function BugReporterProvider({
  children,
  apiKey,
  apiUrl,
  enabled = true,
  debug = false,
  userContext
}) {
  const [apiClient, setApiClient] = useState2(null);
  const config = {
    apiKey,
    apiUrl,
    enabled,
    debug,
    userContext
  };
  useEffect(() => {
    if (enabled && apiKey && apiUrl) {
      const client = new BugReporterApiClient({
        apiUrl,
        apiKey,
        debug
      });
      setApiClient(client);
      if (debug) {
        console.log("[BugReporter SDK] Initialized with config:", {
          apiUrl,
          enabled,
          hasUserContext: !!userContext
        });
      }
    }
  }, [apiKey, apiUrl, enabled, debug, userContext]);
  return /* @__PURE__ */ jsxs2(BugReporterContext.Provider, { value: { apiClient, config, isEnabled: enabled }, children: [
    children,
    enabled && apiClient && /* @__PURE__ */ jsx2(BugReporterWidget, {})
  ] });
}

// src/components/MyBugsPanel.tsx
import { useState as useState3, useEffect as useEffect2 } from "react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var styles2 = {
  container: {
    padding: "1.5rem"
  },
  header: {
    marginBottom: "1.5rem"
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    margin: "0 0 0.5rem 0"
  },
  description: {
    color: "#6b7280",
    fontSize: "0.875rem",
    margin: 0
  },
  loading: {
    textAlign: "center",
    padding: "2rem",
    color: "#6b7280"
  },
  error: {
    textAlign: "center",
    padding: "2rem",
    color: "#dc2626"
  },
  empty: {
    textAlign: "center",
    padding: "3rem",
    color: "#6b7280"
  },
  bugCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    padding: "1rem",
    marginBottom: "0.75rem"
  },
  bugHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem"
  },
  bugId: {
    fontFamily: "monospace",
    fontSize: "0.875rem",
    fontWeight: "500"
  },
  badgeBase: {
    display: "inline-block",
    padding: "0.25rem 0.5rem",
    borderRadius: "0.25rem",
    fontSize: "0.75rem",
    fontWeight: "500"
  },
  bugDescription: {
    fontSize: "0.875rem",
    color: "#374151",
    marginBottom: "0.5rem",
    margin: "0 0 0.5rem 0"
  },
  bugFooter: {
    fontSize: "0.75rem",
    color: "#6b7280",
    margin: 0
  }
};
var getBadgeStyle = (status) => ({
  ...styles2.badgeBase,
  backgroundColor: status === "resolved" ? "#d1fae5" : status === "in_progress" ? "#fef3c7" : status === "new" ? "#dbeafe" : "#f3f4f6",
  color: status === "resolved" ? "#065f46" : status === "in_progress" ? "#92400e" : status === "new" ? "#1e40af" : "#374151"
});
function MyBugsPanel() {
  const { apiClient, config } = useBugReporter();
  const [bugs, setBugs] = useState3([]);
  const [isLoading, setIsLoading] = useState3(true);
  const [error, setError] = useState3(null);
  useEffect2(() => {
    async function fetchBugs() {
      if (!apiClient) {
        setError("Bug Reporter not initialized");
        setIsLoading(false);
        return;
      }
      try {
        const data = await apiClient.getMyBugReports();
        setBugs(data.bug_reports);
        setError(null);
      } catch (err) {
        console.error("[BugReporter SDK] Failed to fetch bugs:", err);
        setError(err instanceof Error ? err.message : "Failed to load bug reports");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBugs();
  }, [apiClient]);
  if (!config.enabled) return null;
  return /* @__PURE__ */ jsxs3("div", { style: styles2.container, children: [
    /* @__PURE__ */ jsxs3("div", { style: styles2.header, children: [
      /* @__PURE__ */ jsx3("h1", { style: styles2.title, children: "My Bug Reports" }),
      /* @__PURE__ */ jsx3("p", { style: styles2.description, children: "Track your submitted bug reports and their status" })
    ] }),
    isLoading && /* @__PURE__ */ jsx3("div", { style: styles2.loading, children: "Loading your bug reports..." }),
    error && /* @__PURE__ */ jsxs3("div", { style: styles2.error, children: [
      "Error: ",
      error
    ] }),
    !isLoading && !error && bugs.length === 0 && /* @__PURE__ */ jsxs3("div", { style: styles2.empty, children: [
      /* @__PURE__ */ jsx3("p", { style: { fontSize: "2rem", marginBottom: "0.5rem", margin: "0 0 0.5rem 0" }, children: "\u{1F41B}" }),
      /* @__PURE__ */ jsx3("p", { style: { margin: "0 0 0.25rem 0" }, children: "No bug reports yet" }),
      /* @__PURE__ */ jsx3("p", { style: { fontSize: "0.875rem", margin: "0.25rem 0 0 0" }, children: "Found a bug? Click the bug button to report it!" })
    ] }),
    !isLoading && !error && bugs.length > 0 && /* @__PURE__ */ jsx3("div", { children: bugs.map((bug) => /* @__PURE__ */ jsxs3("div", { style: styles2.bugCard, children: [
      /* @__PURE__ */ jsxs3("div", { style: styles2.bugHeader, children: [
        /* @__PURE__ */ jsxs3("span", { style: styles2.bugId, children: [
          "#",
          bug.id.substring(0, 8)
        ] }),
        /* @__PURE__ */ jsx3("span", { style: getBadgeStyle(bug.status), children: bug.status.replace("_", " ") })
      ] }),
      /* @__PURE__ */ jsx3("p", { style: styles2.bugDescription, children: bug.description.length > 150 ? `${bug.description.substring(0, 150)}...` : bug.description }),
      /* @__PURE__ */ jsxs3("div", { style: styles2.bugFooter, children: [
        "Reported ",
        new Date(bug.created_at).toLocaleDateString(),
        " \u2022",
        " ",
        bug.page_url
      ] })
    ] }, bug.id)) })
  ] });
}
export {
  BugReporterProvider,
  BugReporterWidget,
  MyBugsPanel,
  useBugReporter
};
