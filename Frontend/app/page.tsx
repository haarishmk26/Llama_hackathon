import Link from "next/link";
import Image from "next/image";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import ProjectList from "@/components/project-list";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-20 items-center justify-between py-6 px-2">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Artifact Logo"
              width={32}
              height={32}
              className="h-9 w-9"
            />
            <span className="text-2xl font-bold tracking-tight">Artifact</span>
          </div>
          <Link href="/projects/new">
            <Button className="flex items-center gap-2 px-5 py-2 text-base font-medium">
              <PlusCircle className="mr-2 h-5 w-5" />
              New Project
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-background">
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4">
          <div className="mb-8 w-full max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-center">
              Recent Projects
            </h1>
            <p className="text-muted-foreground text-center">
              Analyze UI changes and their impact on user experience
            </p>
          </div>

          <div className="space-y-4 w-full max-w-2xl">
            <ProjectList />
          </div>
          <div className="flex justify-center w-full mt-8">
            <form action="/api/llama-generate" method="POST">
              <Button type="submit" className="w-full max-w-2xl">
                Submit
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
