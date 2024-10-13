import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FileUploadComponentProps {
  files: File[]
  setFiles: (files: File[]) => void
}

export function FileUploadComponent({ files, setFiles }: FileUploadComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Files</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="file-upload" className="block mb-2">Select PDF or DOCX files</Label>
        <Input 
          id="file-upload" 
          type="file" 
          multiple 
          accept=".pdf,.docx"
          onChange={(e) => {
            const newFiles = Array.from(e.target.files || []) as File[];
            setFiles([...files, ...newFiles]);
          }}
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setFiles([])} 
          className="mt-2 mb-2"
        >
          Clear All Files
        </Button>
        {files.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium">Selected Files:</p>
            <ul className="list-disc list-inside">
              {files.map((file, index) => (
                <li key={index} className="text-sm">{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
