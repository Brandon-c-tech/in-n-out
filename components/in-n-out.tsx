'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ReactMarkdown from 'react-markdown'

function TemplateComponent() {
  const [template, setTemplate] = useState(`市场规模
创始团队
产品亮点
竞争对手`)

  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>模板</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="请输入模板内容" 
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>
    </div>
  )
}

export function InNOutComponent() {
  const [urls, setUrls] = useState('')
  const [files, setFiles] = useState<File[]>([])
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
${files.map(file => `- ${file.name}`).join('\n')}
    `)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">in-n-out</h1>
      
      <TemplateComponent />

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
              onChange={(e) => {
                const newFiles = Array.from(e.target.files || []);
                setFiles(prevFiles => [...prevFiles, ...newFiles]);
              }}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setFiles([])} 
              className="mt-2 mb-2"
            >
              清除所有文件
            </Button>
            {files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">已选择的文件：</p>
                <ul className="list-disc list-inside">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm">{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
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
