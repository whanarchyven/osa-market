import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="grid grid-cols-2 h-screen items-center justify-center container mx-auto">
      <div className="flex flex-col items-start justify-center gap-12">
        <h1 className="text-8xl font-bold">404</h1>
        <h2 className="text-4xl font-bold">Страница не найдена</h2>
        <p className="text-lg">Мы не смогли найти страницу, которую вы ищете ( <br/>Возможно, она была перемещена или удалена</p>
        <Button variant="default" asChild>
          <Link href="/">
            На главную
          </Link>
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Image src="/404.png" alt="404" width={500} height={500} />
      </div>
    </main>
  );
}
