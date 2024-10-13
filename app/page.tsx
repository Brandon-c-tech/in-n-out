"use client";

import Head from 'next/head';
import React, { useRef, useState, useEffect } from 'react'
import { FileUploadComponent } from "@/components/FileUploadComponent";
import { TemplateComponent } from "@/components/TemplateComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlInputComponent } from "@/components/UrlInputComponent";
import ReactMarkdown from "react-markdown";

// 定义 FileData 接口类型
interface FileData {
  original_file_name: string;
  upload_url: string;
  unique_file_name: string;
}

export default function Page() {
  const [urls, setUrls] = useState("www.group-ultra.com");
  const [files, setFiles] = useState<File[]>([]);
  const [markdown, setMarkdown] = useState("");
  const [template, setTemplate] = useState(
    "Market Size\nTeam Background\nProduct Highlight\nCompetitors"
  ); // 定义 template 状态
  const [buttonText, setButtonText] = useState("Submit"); // 新增状态变量

  // 创建 ref 以定位到 Result card
  const resultRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    // 检查是否有至少一个文件或一个 URL
    if (!urls && files.length === 0) {
      setMarkdown('Please provide at least one file or one URL')
      return
    }
  
    try {
      setButtonText("Uploading files"); // 更新按钮文本
      
      let uniqueFileNames: string[] = []
  
      // 只有当 files 不为空时才执行文件上传
      if (files.length > 0) {
        // 获取文件名列表
        const fileNames = files.map(file => file.name)
  
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
  
        const uploadData: FileData[] = await response.json()
  
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
  
        // 收集 unique 文件名
        uniqueFileNames = uploadData.map((fileData: FileData) => fileData.unique_file_name)
      }
  
      // 准备请求体，如果没有文件，则 files 字段为空列表
      const requestBody = {
        template: template.split('\n'),
        urls: urls.split('\n').filter(url => url.trim() !== ''), // 过滤掉空行
        files: uniqueFileNames, // 如果 files 为空，uniqueFileNames 就是空列表
      }

      setButtonText("Processing with AI, please wait"); // 更新按钮文本
  
      // 发送请求到特定的 API
      const finalResponse = await fetch('https://coursefinder.top/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
  
      if (!finalResponse.ok) {
        throw new Error('Failed to submit data')
      }
  
      setMarkdown('文Files uploaded and submitted successfully!')
      setButtonText("Try Again!"); // 更新按钮文本
  
      // 获取返回的 Markdown 内容
      const markdownContent = await finalResponse.text()
      setMarkdown(markdownContent)
  
    } catch (error) {
      console.error('Error:', error)
      setMarkdown('File upload or submission failed, please try again.')
    }
  }

  // 在 markdown 内容更新后滚动到 Result card
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [markdown])  // 添加 markdown 作为依赖
  

  return (
    <>
      <Head>
        <title>In-N-Out Writer: Template & Reference</title>
        <link rel="icon" href="/writer.ico" />
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">In-N-Out Writer: Template & Reference</h1>

        <TemplateComponent setTemplate={setTemplate} template={template} />
  
        <form onSubmit={handleSubmit} className="space-y-6">
          <UrlInputComponent urls={urls} setUrls={setUrls} />
          <FileUploadComponent files={files} setFiles={setFiles} />
          <Button type="submit" className="w-full">
            {buttonText}
          </Button>
        </form>
  
        {/* 显示 markdown 内容 */}
        {markdown && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent ref={resultRef}>
              <div className="prose">
                <ReactMarkdown>{markdown}</ReactMarkdown>
                <Button onClick={() => navigator.clipboard.writeText(markdown)} className="mt-2">
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
