import { useRouteError } from "react-router-dom";

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  
  console.error("Route error:", error);
  
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Oops! Something went wrong</h1>
      <p>{error?.message || "Unknown error occurred"}</p>
      <button onClick={() => window.location.href = "/"}>
        Go Home
      </button>
    </div>
  );
}