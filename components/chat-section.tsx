"use client"

import React, { useMemo, useEffect, useRef, useState } from "react"
import { InstantSearch, Chat } from "react-instantsearch"
import type { SearchClient } from "algoliasearch"
import { liteClient as algoliasearch } from "algoliasearch/lite"
import { MessageSquare, WifiOff, RefreshCw } from "lucide-react"

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? ""
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY ?? ""
const agentId = process.env.NEXT_PUBLIC_AGENT_ID ?? ""

const chatClassNames = {
  root: "flex min-h-0 h-full flex-1 flex-col bg-card text-card-foreground",
  container:
    "flex flex-1 min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm h-full",
  header: {
    root: "flex h-8 max-h-8 shrink-0 items-center justify-between gap-1.5 border-b border-border bg-primary px-2.5 py-1 text-primary-foreground",
    title: "text-[11px] font-semibold leading-tight tracking-tight",
    titleIcon: "size-3 shrink-0 opacity-90",
    clear:
      "rounded px-1.5 py-0.5 text-[9px] font-medium opacity-90 transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-primary-foreground/20",
    maximize:
      "rounded p-1 opacity-80 transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-primary-foreground/20",
    close:
      "rounded p-1 opacity-80 transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-primary-foreground/20",
  },
  messages: {
    root: "flex flex-1 flex-col min-h-0 overflow-hidden",
    scroll: "flex-1 overflow-y-auto overflow-x-hidden overscroll-contain",
    content: "flex flex-col gap-6 p-4",
    scrollToBottom:
      "absolute bottom-16 right-4 rounded-full bg-primary p-2 text-primary-foreground shadow-md transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring",
    scrollToBottomHidden: "pointer-events-none opacity-0",
  },
  message: {
    root: "flex max-w-[85%] flex-col gap-1",
    container: "rounded-lg px-3 py-2",
    leading: "shrink-0",
    content: "text-sm leading-relaxed",
    message: "break-words",
    actions: "mt-1 flex gap-1",
    footer: "mt-1 text-xs text-muted-foreground",
  },
  prompt: {
    root: "shrink-0 border-t border-border bg-card pt-6 pb-4 px-4",
    header: "mb-2 text-xs font-medium text-muted-foreground",
    body: "flex items-end gap-2",
    textarea:
      "min-h-[44px] flex-1 resize-none rounded-lg border border-input bg-background py-2.5 pl-3 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    actions: "flex shrink-0 items-center",
    submit:
      "flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    footer: "mt-2 text-[10px] text-muted-foreground",
  },
  suggestions: {
    root: "flex flex-wrap gap-2",
    suggestion:
      "rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80",
  },
  toggleButton: {
    root: "hidden",
  },
}

function MissingConfigNotice() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <MessageSquare className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="max-w-md">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Configuration Required
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Set the following environment variables to activate the chat
          assistant:
        </p>
        <ul className="mt-5 space-y-2 text-left">
          {[
            "NEXT_PUBLIC_ALGOLIA_APP_ID",
            "NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY",
            "NEXT_PUBLIC_AGENT_ID",
          ].map((v) => (
            <li
              key={v}
              className="rounded-lg bg-muted px-4 py-2.5 font-mono text-xs text-muted-foreground"
            >
              {v}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function NetworkErrorFallback({
  onRetry,
  error,
}: {
  onRetry: () => void
  error: Error | null
}) {
  const isNetworkError =
    error?.message?.toLowerCase().includes("network") ||
    error?.message?.toLowerCase().includes("cors") ||
    error?.message?.toLowerCase().includes("chunked") ||
    error?.message?.toLowerCase().includes("fetch") ||
    error?.name === "TypeError"

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
        <WifiOff className="h-8 w-8 text-destructive" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {isNetworkError ? "Network error" : "Something went wrong"}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {isNetworkError
            ? "The chat couldn’t connect. Check your connection and that Algolia is reachable, then try again."
            : "The chat encountered an error. Try again or check your configuration."}
        </p>
        {error?.message && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            {error.message}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  )
}

class ChatErrorBoundary extends React.Component<
  {
    children: React.ReactNode
    fallback: (error: Error | null, onRetry: () => void) => React.ReactNode
  },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch() {
    // Optional: log to reporting service
  }

  reset = () => this.setState({ hasError: false, error: null })

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error, this.reset)
    }
    return this.props.children
  }
}

function AlgoliaChatWidget() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const openChat = () => {
      if (!containerRef.current) return
      const toggle = containerRef.current.querySelector(
        ".ais-Chat-toggleButtonWrapper button, .ais-Chat-toggleButton"
      ) as HTMLElement | null
      if (toggle && !containerRef.current.querySelector(".ais-Chat-container--open")) {
        toggle.click()
      }
    }
    const t = setTimeout(openChat, 100)
    return () => clearTimeout(t)
  }, [])

  const searchClient = useMemo(() => {
    const client = algoliasearch(appId, apiKey)

    // The Chat widget only uses the agentId to communicate with Agent Studio.
    // InstantSearch still fires a search request against the indexName,
    // which may not exist. We intercept and return an empty result so the
    // wrapper doesn't throw.
    return {
      ...client,
      search(requests: Parameters<typeof client.search>[0]) {
        // Return empty results for every request so InstantSearch is happy
        if (Array.isArray(requests)) {
          return Promise.resolve({
            results: (requests as Array<{ indexName: string }>).map((r) => ({
              hits: [],
              nbHits: 0,
              nbPages: 0,
              page: 0,
              processingTimeMS: 0,
              hitsPerPage: 0,
              exhaustiveNbHits: true,
              query: "",
              params: "",
              index: r.indexName,
            })),
          })
        }
        return client.search(requests)
      },
    }
  }, [])

  return (
    <div ref={containerRef} className="flex min-h-0 w-full flex-1 flex-col">
      <InstantSearch
        searchClient={searchClient as unknown as SearchClient}
        indexName="_chat_placeholder"
      >
        <Chat
          agentId={agentId}
          classNames={chatClassNames}
          translations={{
            header: {
              title: "Nigeria Rental Assistant",
            },
            prompt: {
              textareaPlaceholder:
                "Ask about rentals, e.g. '2-bedroom in Lekki under 1.5M'...",
            },
          }}
        />
      </InstantSearch>
    </div>
  )
}

export function ChatSection() {
  const [retryKey, setRetryKey] = useState(0)
  const isConfigured = appId && apiKey && agentId

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 sm:px-6 md:px-8">
        {isConfigured ? (
          <ChatErrorBoundary
            key={retryKey}
            fallback={(error, onRetry) => (
              <NetworkErrorFallback
                error={error}
                onRetry={() => {
                  setRetryKey((k) => k + 1)
                  onRetry()
                }}
              />
            )}
          >
            <AlgoliaChatWidget />
          </ChatErrorBoundary>
        ) : (
          <MissingConfigNotice />
        )}
      </div>
    </main>
  )
}
