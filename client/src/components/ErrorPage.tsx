import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function MyErrorPage() {
  const error = useRouteError();

  console.error("Route error:", error); // <-- logs full object, often includes stack

  if (isRouteErrorResponse(error)) {
    return <h1>Error {error.status}: {error.statusText}</h1>;
  }

  // fallback
  const message = error instanceof Error ? error.message : JSON.stringify(error);

  return (
    <>
      <h1>Unexpected error: {message}</h1>
      <pre>{error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}</pre>
    </>
  );
}
