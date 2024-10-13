'use client'

import React from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 定义 Props 类型
interface TemplateComponentProps {
  template: string;
  setTemplate: React.Dispatch<React.SetStateAction<string>>;
}

export function TemplateComponent({ template, setTemplate }: TemplateComponentProps) {
  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>模板</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="请输入章节模板内容，每一个章节标题后换行一次" 
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>
    </div>
  )
}