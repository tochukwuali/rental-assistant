"use client"

import { useMemo } from "react"
import { InstantSearch, Chat } from "react-instantsearch"
import { liteClient as algoliasearch } from "algoliasearch/lite"
import { MessageSquare } from "lucide-react"

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? ""
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY ?? ""
const agentId = process.env.NEXT_PUBLIC_AGENT_ID ?? ""

function MissingConfigNotice() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
        <MessageSquare className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="max-w-sm">
        <h2 className="text-lg font-semibold text-foreground">
          Configuration Required
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Set the following environment variables to activate the chat assistant:
        </p>
        <ul className="mt-4 space-y-2 text-left text-sm">
          {[
            "NEXT_PUBLIC_ALGOLIA_APP_ID",
            "NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY",
            "NEXT_PUBLIC_AGENT_ID",
          ].map((v) => (
            <li
              key={v}
              className="rounded-md bg-secondary px-3 py-2 font-mono text-xs text-muted-foreground"
            >
              {v}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function AlgoliaChatWidget() {
  const searchClient = useMemo(() => algoliasearch(appId, apiKey), [])

  return (
    <InstantSearch indexName="rentals" searchClient={searchClient}>
      <Chat
        agentId={agentId}
        translations={{
          header: {
            title: "Rental Assistant",
          },
          prompt: {
            textareaPlaceholder:
              "Ask about rentals, e.g. '2-bedroom in Lekki under 1.5M'...",
          },
        }}
      />
    </InstantSearch>
  )
}

export function ChatSection() {
  const isConfigured = appId && apiKey && agentId

  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      {isConfigured ? <AlgoliaChatWidget /> : <MissingConfigNotice />}
    </section>
  )
}
