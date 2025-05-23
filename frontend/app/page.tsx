import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950">
        <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)]"></div>
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
        <section className="space-y-8 pb-12 pt-8 md:pb-16 md:pt-12 lg:py-40 relative">
          <div className="container flex max-w-[80rem] flex-col items-center gap-6 text-center">
            <h1 className="text-4xl font-bold sm:text-6xl md:text-7xl lg:text-8xl">Manage your tasks with ease</h1>
            <p className="max-w-[56rem] leading-normal text-muted-foreground sm:text-2xl sm:leading-9">
              A modern and minimalistic task management application inspired by Trello. Organize your projects,
              collaborate with your team, and boost productivity.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button asChild size="lg" className="text-lg">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="container py-16 md:py-28 lg:py-40">
          <div className="mx-auto grid max-w-7xl items-center gap-8 py-16 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <div className="inline-block rounded-lg bg-primary/10 px-4 py-2 text-base text-primary">Key Features</div>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Everything you need to manage your tasks
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-2xl/relaxed lg:text-xl/relaxed xl:text-2xl/relaxed">
                EasyTrello provides a simple yet powerful way to organize your work and collaborate with your team.
              </p>
            </div>
            <div className="grid gap-8">
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
                <div key={feature.title} className="rounded-lg border bg-card p-6 shadow-sm">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-base text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-28 md:flex-row">
          <p className="text-center text-base leading-loose text-muted-foreground md:text-left">
            © 2024 EasyTrello. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
