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
        <CardTitle>Enter URL</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea 
          placeholder="Enter multiple URLs, one per line" 
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          className="min-h-[100px]"
        />
      </CardContent>
    </Card>
  )
}