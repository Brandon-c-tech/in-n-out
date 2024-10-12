'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ReactMarkdown from 'react-markdown'

export function InNOutComponent() {
  const [urls, setUrls] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)
  const [markdown, setMarkdown] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // 这里应该是向后端发送请求的逻辑
    // 为了演示，我们只是设置一个模拟的 Markdown 内容
    setMarkdown(`
# 处理结果

## 输入的 URL:
${urls.split('\n').map(url => `- ${url}`).join('\n')}

## 上传的文件:
${files ? Array.from(files).map(file => `- ${file.name}`).join('\n') : '没有上传文件'}
    `)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">in-n-out</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>输入 URL</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="请输入多个网址，每行一个" 
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>上传文件</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="file-upload" className="block mb-2">选择 PDF 或 TXT 文件</Label>
            <Input 
              id="file-upload" 
              type="file" 
              multiple 
              accept=".pdf,.txt"
              onChange={(e) => setFiles(e.target.files)}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">提交</Button>
      </form>

      {markdown && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>处理结果</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </div>
  )
}