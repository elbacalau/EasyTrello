import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative">
      {/* Wave pattern background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950">
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
          fill="none"
          opacity="0.05"
        >
          <path
            d="M0 0L48 26.7C96 53.3 192 107 288 133.3C384 160 480 160 576 138.7C672 117.3 768 75 864 85.3C960 96 1056 160 1152 176C1248 192 1344 160 1392 144L1440 128V800H1392C1344 800 1248 800 1152 800C1056 800 960 800 864 800C768 800 672 800 576 800C480 800 384 800 288 800C192 800 96 800 48 800H0V0Z"
            fill="currentColor"
            className="text-primary"
          />
          <path
            d="M0 400L48 384C96 368 192 336 288 309.3C384 283 480 261 576 261.3C672 261 768 283 864 309.3C960 336 1056 368 1152 384C1248 400 1344 400 1392 400L1440 400V800H1392C1344 800 1248 800 1152 800C1056 800 960 800 864 800C768 800 672 800 576 800C480 800 384 800 288 800C192 800 96 800 48 800H0V400Z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
      </div>

      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">EasyTrello</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Register</Link>
              </Button>
              <ModeToggle />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 relative">
        {/* Hero section with backdrop blur */}
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 relative">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">Manage your tasks with ease</h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              A modern and minimalistic task management application inspired by Trello. Organize your projects,
              collaborate with your team, and boost productivity.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything you need to manage your tasks
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                EasyTrello provides a simple yet powerful way to organize your work and collaborate with your team.
              </p>
            </div>
            <div className="grid gap-6">
              {[
                {
                  title: "Kanban Boards",
                  description: "Visualize your workflow with customizable boards and columns.",
                },
                {
                  title: "Task Management",
                  description: "Create, assign, and track tasks with due dates and priorities.",
                },
                {
                  title: "Team Collaboration",
                  description: "Work together with your team in real-time with comments and notifications.",
                },
                {
                  title: "Progress Tracking",
                  description: "Monitor project progress with visual dashboards and reports.",
                },
              ].map((feature) => (
                <div key={feature.title} className="rounded-lg border bg-card p-4 shadow-sm">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 EasyTrello. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
