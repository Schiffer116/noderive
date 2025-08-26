import { useEffect } from "react"
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react"

export default function ErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  useEffect(() => {
    console.error("Route error:", error)
  }, [error])

  let status = "Error"
  let message = "Sorry, an unexpected error has occurred."

  if (isRouteErrorResponse(error)) {
    status = error.status.toString()
    message = error.statusText || message

    if (error.status === 404) {
      message = "The item you requested could not be found."
    } else if (error.status === 403) {
      message = "You don't have permission to access this item."
    } else if (error.status === 500) {
      message = "Server error. Please try again later."
    }
  } else if (error instanceof Error) {
    message = error.message
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md w-full">

        <div className="mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-semibold text-lg">Noderive</span>
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">{status}</h1>
        {/*
        <p className="text-muted-foreground mb-8">{message}</p>
        */}

        <SignedIn>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={handleGoBack} className="gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button onClick={handleRetry} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </SignedIn>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>

      </div>
    </div>
  )
}
