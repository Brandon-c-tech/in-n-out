'use client'

import { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TemplateComponent() {
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

