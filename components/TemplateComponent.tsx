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
          <CardTitle>Template</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Enter chapter template content, with a newline after each chapter title" 
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>
    </div>
  )
}