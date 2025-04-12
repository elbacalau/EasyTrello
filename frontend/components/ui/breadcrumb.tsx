"use client"

import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  segments: {
    name: string
    href: string
    current?: boolean
  }[]
  separator?: React.ReactNode
  homeHref?: string
  showHomeIcon?: boolean
}

export function Breadcrumb({
  segments,
  separator = <ChevronRight className="h-4 w-4 text-muted-foreground" />,
  homeHref = "/dashboard",
  showHomeIcon = true,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-sm text-muted-foreground", className)}
      {...props}
    >
      <ol className="flex items-center space-x-2">
        {showHomeIcon && (
          <li>
            <Link href={homeHref} className="flex items-center hover:text-foreground">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        )}
        {showHomeIcon && segments.length > 0 && <li className="flex items-center">{separator}</li>}

        {segments.map((segment, index) => (
          <React.Fragment key={segment.href}>
            <li>
              {segment.current ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {segment.name}
                </span>
              ) : (
                <Link href={segment.href} className="hover:text-foreground">
                  {segment.name}
                </Link>
              )}
            </li>
            {index < segments.length - 1 && <li className="flex items-center">{separator}</li>}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

export const BreadcrumbList = () => null
export const BreadcrumbItem = () => null
export const BreadcrumbLink = () => null
export const BreadcrumbPage = () => null
export const BreadcrumbSeparator = () => null
export const BreadcrumbEllipsis = () => null
