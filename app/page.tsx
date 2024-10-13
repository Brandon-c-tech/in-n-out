"use client";

import { FileUploadComponent } from "@/components/FileUploadComponent";
import { TemplateComponent } from "@/components/TemplateComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlInputComponent } from "@/components/UrlInputComponent";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

// 定义 FileData 接口类型
interface FileData {
  original_file_name: string;
  upload_url: string;
  unique_file_name: string;
}

export default function Page() {
  const [urls, setUrls] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [markdown, setMarkdown] = useState("");
  const [template, setTemplate] = useState(
    "市场规模\n创始团队\n产品亮点\n竞争对手"
  ); // 定义 template 状态

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 获取文件名列表
    const fileNames = files.map((file) => file.name);

    try {
      // 请求生成上传 URL
      const response = await fetch(
        "http://34.31.54.253:5000/process",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file_names: fileNames }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get upload URLs");
      }

      const uploadData: FileData[] = await response.json();

      // 上传文件到对应的 URL
      await Promise.all(
        uploadData.map(async (fileData: FileData) => {
          const file = files.find(
            (f) => f.name === fileData.original_file_name
          );
          if (file) {
            await fetch(fileData.upload_url, {
              method: "PUT",
              headers: {
                "Content-Type": file.type,
              },
              body: file,
            });
          }
        })
      );

      // 收集 unique 文件名
      const uniqueFileNames = uploadData.map(
        (fileData: FileData) => fileData.unique_file_name
      );

      // 准备请求体
      const requestBody = {
        template: template.split("\n"),
        urls: urls.split("\n"),
        files: uniqueFileNames,
      };

      // 发送请求到特定的 API
      const finalResponse = await fetch(
        "http://34.31.54.253:5000/process",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!finalResponse.ok) {
        throw new Error("Failed to submit data");
      }

      setMarkdown("文件上传并提交成功！");

      // 获取返回的 Markdown 内容
      const markdownContent = await finalResponse.text();
      setMarkdown(markdownContent);
    } catch (error) {
      console.error("Error:", error);
      setMarkdown("文件上传或提交失败，请重试。");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">in-n-out</h1>

      <TemplateComponent setTemplate={setTemplate} template={template} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <UrlInputComponent urls={urls} setUrls={setUrls} />
        <FileUploadComponent files={files} setFiles={setFiles} />
        <Button type="submit" className="w-full">
          提交
        </Button>
      </form>

      {/* 显示 markdown 内容 */}
      {markdown && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
