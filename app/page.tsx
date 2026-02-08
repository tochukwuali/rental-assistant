import { Header } from "@/components/header"
import { ChatSection } from "@/components/chat-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <ChatSection />
      <Footer />
    </div>
  )
}
