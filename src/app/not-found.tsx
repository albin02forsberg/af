"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
      <div className="mx-auto w-full max-w-xl rounded-xl border bg-card p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
            404
          </span>
          <p className="text-sm text-muted-foreground">Page not found</p>
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          This page went missing
        </h1>
        <p className="mt-2 text-muted-foreground">
          The page you’re looking for doesn’t exist or may have been moved. Check the URL,
          or head back to a safe place.
        </p>

        <Separator className="my-6" />

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/">
              <Home className="size-4" />
              Go home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => history.back()}>
            <ArrowLeft className="size-4" />
            Go back
          </Button>
        </div>
      </div>
    </div>
  )
}
