"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Loader2 } from "lucide-react"
import { AnalysisResults } from "@/components/analysis-results"
import { analyzeSlide } from "@/lib/gemini-api"
import type { SlideAnalysis } from "@/types/slide-analysis"
import { FileUploader } from "@/components/file-uploader"

export function SlideAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [analysisResults, setAnalysisResults] = useState<SlideAnalysis[]>([])

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
    setAnalysisResults([])
  }

  const handleAnalyze = async () => {
    if (files.length === 0) return

    setIsAnalyzing(true)
    const results: SlideAnalysis[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setCurrentSlideIndex(i)

        // Convert file to base64
        const base64 = await fileToBase64(file)

        // Analyze with Gemini API
        const analysis = await analyzeSlide(base64, i + 1, files.length)
        results.push(analysis)
      }

      setAnalysisResults(results)
    } catch (error) {
      console.error("Lỗi khi phân tích slide:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64String = reader.result as string
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = base64String.split(",")[1]
        resolve(base64)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <FileUploader
            onFilesSelected={handleFileSelect}
            acceptedFileTypes={["image/jpeg", "image/png", "image/jpg"]}
            maxFiles={10}
          />

          {files.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">{files.length} slide đã chọn</p>
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full sm:w-auto">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang phân tích slide {currentSlideIndex + 1} / {files.length}...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Phân Tích Slide
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {analysisResults.length > 0 && <AnalysisResults results={analysisResults} files={files} />}
    </div>
  )
}

