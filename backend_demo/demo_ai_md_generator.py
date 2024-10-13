import functions_framework

@functions_framework.http
def generate_markdown(request):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    # 处理预检请求
    if request.method == 'OPTIONS':
        return ('', 204, headers)
    
    # 从请求体中解析 JSON 数据
    request_json = request.get_json()
    
    # 确保请求体包含正确的字段
    if not all(key in request_json for key in ["template", "urls", "files"]):
        return {"error": "Invalid request format"}, 400
    
    # 解析模板、链接和文件名
    template = request_json["template"]
    urls = request_json["urls"]
    files = request_json["files"]
    
    # 生成 Markdown 内容
    markdown_content = "# Project Summary\n\n"
    for t in template:
        markdown_content += f"## {t}\n\n"
        markdown_content += f"{t} details are provided in this section.\n\n"  # 假设每个模板项对应的内容直接写入
    
    markdown_content += "### URLs\n\n"
    for url in urls:
        markdown_content += f"- [{url}](https://{url})\n"
    
    markdown_content += "\n### Files\n\n"
    for file in files:
        markdown_content += f"- {file}\n"
    
    # 返回 Markdown 响应
    return markdown_content, 200, headers