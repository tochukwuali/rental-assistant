import { ThemeToggle } from "@/components/theme-toggle"
import { Building2 } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold leading-tight text-foreground">
            Nigeria Rental Assistant
          </h1>
          <p className="text-sm text-muted-foreground">
            Powered by Algolia Agent Studio
          </p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  )
}
