'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { TemplateComponent } from "@/components/TemplateComponent"
import { UrlInputComponent } from "@/components/UrlInputComponent"
import { FileUploadComponent } from "@/components/FileUploadComponent"

// 定义 FileData 接口类型
interface FileData {
  original_file_name: string;
  upload_url: string;
}

export default function Page() {
  const [urls, setUrls] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [markdown, setMarkdown] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 获取文件名列表
    const fileNames = files.map(file => file.name)

    try {
      // 请求生成上传 URL
      const response = await fetch('https://us-central1-moobius-412016.cloudfunctions.net/generate_upload_urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_names: fileNames }),
      })

      if (!response.ok) {
        throw new Error('Failed to get upload URLs')
      }

      const uploadData = await response.json()

      // 上传文件到对应的 URL
      await Promise.all(uploadData.map(async (fileData: FileData) => {
        const file = files.find(f => f.name === fileData.original_file_name)
        if (file) {
          await fetch(fileData.upload_url, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type,
            },
            body: file,
          })
        }
      }))

      setMarkdown('文件上传成功！')
    } catch (error) {
      console.error('Error uploading files:', error)
      setMarkdown('文件上传失败，请重试。')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">in-n-out</h1>
      
      <TemplateComponent />

      <form onSubmit={handleSubmit} className="space-y-6">
        <UrlInputComponent urls={urls} setUrls={setUrls} />
        <FileUploadComponent files={files} setFiles={setFiles} />
        <Button type="submit" className="w-full">提交</Button>
      </form>

      {/* 显示 markdown 内容 */}
      {markdown && <div className="mt-4 p-4 bg-green-100 text-green-800">{markdown}</div>}
    </div>
  )
}