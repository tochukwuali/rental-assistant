export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-4">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <p className="text-xs text-muted-foreground">
          Built with{" "}
          <a
            href="https://www.algolia.com/products/agent-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Algolia Agent Studio
          </a>
        </p>
        <p className="text-xs text-muted-foreground">
          Type your location, budget, and number of bedrooms to get started.
        </p>
      </div>
    </footer>
  )
}
