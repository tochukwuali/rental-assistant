export function Footer() {
  return (
    <footer className="shrink-0 border-t border-border bg-card px-5 py-3 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-1 sm:flex-row">
        <p className="text-[11px] text-muted-foreground">
          Built with{" "}
          <a
            href="https://www.algolia.com/products/agent-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Algolia Agent Studio
          </a>
        </p>
        <p className="text-[11px] text-muted-foreground">
          Try: &quot;2-bedroom in Lekki under 1.5M&quot;
        </p>
      </div>
    </footer>
  )
}
