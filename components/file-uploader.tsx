"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, FileImage } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void
  acceptedFileTypes?: string[]
  maxFiles?: number
}

export function FileUploader({
  onFilesSelected,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/jpg"],
  maxFiles = 10,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    // Filter for accepted file types
    const validFiles = files.filter((file) => acceptedFileTypes.includes(file.type)).slice(0, maxFiles)

    setSelectedFiles(validFiles)
    onFilesSelected(validFiles)
  }

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)
    onFilesSelected(newFiles)
  }

  const openFileDialog = () => {
    inputRef.current?.click()
  }

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900/30",
          selectedFiles.length > 0 ? "pb-2" : "pb-6",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedFileTypes.join(",")}
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-10 h-10 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Nhấp để tải lên</span> hoặc kéo và thả
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG hoặc JPEG (Tối đa {maxFiles} slide)</p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Tệp đã chọn:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded border"
              >
                <div className="flex items-center space-x-2 truncate">
                  <FileImage className="h-4 w-4 text-blue-500" />
                  <span className="text-sm truncate">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

