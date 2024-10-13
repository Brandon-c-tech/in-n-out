import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UrlInputComponentProps {
  urls: string
  setUrls: (urls: string) => void
}

export function UrlInputComponent({ urls, setUrls }: UrlInputComponentProps) {
  return (
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
  )
}