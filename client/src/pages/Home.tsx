import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom';

import { Button } from "@/components/ui/button"
import {
  FileText,
  ImageIcon,
  Video,
  Folder,
  ArrowRight,
} from "lucide-react"

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-bold text-xl">Noderive</span>
            </div>

            <SignedOut>
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="outline" asChild>
                  <SignInButton forceRedirectUrl={'/drive'} />
                </Button>
                <Button asChild>
                  <SignUpButton forceRedirectUrl={'/drive'} />
                </Button>
              </div>
            </SignedOut>

          </div>
        </div>
      </nav>

      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Your files, everywhere you are
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Store, sync, and share your files with Noderive. Access your documents, photos, and videos from any
              device, anywhere in the world.
            </p>

            <SignedOut>
              <SignInButton forceRedirectUrl={'/drive'}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button size="lg" className="text-lg px-8">
                    Go to drive
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="text-lg px-8" onClick={() => navigate("/drive")}>
                  Go to drive
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </SignedIn>

            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-1">
                <div className="bg-background rounded-lg p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center p-4 rounded-lg border">
                      <Folder className="w-8 h-8 text-blue-500 mb-2" />
                      <span className="text-sm font-medium">Documents</span>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg border">
                      <ImageIcon className="w-8 h-8 text-green-500 mb-2" />
                      <span className="text-sm font-medium">Photos</span>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg border">
                      <Video className="w-8 h-8 text-purple-500 mb-2" />
                      <span className="text-sm font-medium">Videos</span>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg border">
                      <FileText className="w-8 h-8 text-red-500 mb-2" />
                      <span className="text-sm font-medium">Files</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
