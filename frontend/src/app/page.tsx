import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold">Home Loan Calculator</h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Frontend scaffold ready. Tailwind CSS and shadcn/ui are configured and working.
        </p>
        <div className="flex gap-4">
          <Button>Primary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="secondary">Secondary Button</Button>
        </div>
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            ✅ Next.js 14 App Router • ✅ TypeScript • ✅ Tailwind CSS • ✅ shadcn/ui
          </p>
        </div>
      </main>
    </div>
  );
}
