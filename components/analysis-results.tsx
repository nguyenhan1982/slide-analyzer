"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SlideAnalysis } from "@/types/slide-analysis"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, Lightbulb, Layout, FileText, Image } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnalysisResultsProps {
  results: SlideAnalysis[]
  files: File[]
}

export function AnalysisResults({ results, files }: AnalysisResultsProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const handlePreviousSlide = () => {
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => Math.min(results.length - 1, prev + 1))
  }

  if (results.length === 0) return null

  const currentResult = results[currentSlideIndex]
  const currentFile = files[currentSlideIndex]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Kết Quả Phân Tích</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handlePreviousSlide} disabled={currentSlideIndex === 0}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Slide {currentSlideIndex + 1} / {results.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextSlide}
                disabled={currentSlideIndex === results.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Xem Trước Slide</h3>
              <div className="border rounded-md overflow-hidden bg-gray-50 dark:bg-gray-900">
                {currentFile && (
                  <img
                    src={URL.createObjectURL(currentFile) || "/placeholder.svg"}
                    alt={`Slide ${currentSlideIndex + 1}`}
                    className="w-full h-auto object-contain"
                  />
                )}
              </div>
            </div>

            <div>
              <Tabs defaultValue="overview">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
                  <TabsTrigger value="content">Nội Dung</TabsTrigger>
                  <TabsTrigger value="layout">Bố Cục</TabsTrigger>
                  <TabsTrigger value="recommendations">Đề Xuất</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Tóm Tắt Slide</h3>
                    <p className="text-sm text-muted-foreground">{currentResult.summary}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">Các Thành Phần Phát Hiện</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentResult.elementsDetected.map((element, i) => (
                        <Badge key={i} variant="outline">
                          {element}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Nội Dung Văn Bản
                    </h3>
                    <div className="space-y-2">
                      {currentResult.textContent.map((text, i) => (
                        <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <p className="text-sm">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Image className="mr-2 h-4 w-4" />
                      Thành Phần Hình Ảnh
                    </h3>
                    <div className="space-y-2">
                      {currentResult.visualElements.map((element, i) => (
                        <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <p className="text-sm">{element}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="layout" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Layout className="mr-2 h-4 w-4" />
                      Phân Tích Bố Cục
                    </h3>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <p className="text-sm">{currentResult.layoutAnalysis}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Đề Xuất Cải Thiện
                    </h3>
                    <div className="space-y-2">
                      {currentResult.recommendations.map((recommendation, i) => (
                        <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <p className="text-sm">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

