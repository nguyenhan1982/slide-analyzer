import { SlideAnalyzer } from "@/components/slide-analyzer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Phân Tích Slide</h1>
          <p className="text-muted-foreground text-lg">
            Tải lên các slide bài thuyết trình của bạn để nhận phân tích và đề xuất chuyên nghiệp
          </p>
        </div>
        <SlideAnalyzer />
      </div>
    </main>
  )
}

