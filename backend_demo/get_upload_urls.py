import functions_framework
from google.cloud import storage
from datetime import timedelta
import time
import json

# 初始化 GCS 客户端
client = storage.Client.from_service_account_json('moobius-412016-240c870485ee.json')
bucket_name = 'in-n-out-ai'

@functions_framework.http
def generate_upload_urls(request):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if request.method == 'OPTIONS':
        return ('', 204, headers)

    try:
        request_json = request.get_json()
        file_names = request_json.get("file_names", [])

        # 检查请求中的文件名列表是否为空
        if not file_names:
            return (json.dumps({"error": "No file names provided."}), 400, headers)

        response_data = []
        
        for base_file_name in file_names:
            file_extension = '.' + base_file_name.split('.')[-1] if '.' in base_file_name else '.txt'
            timestamp = int(time.time())
            unique_file_name = f"{base_file_name.rsplit('.', 1)[0]}_{timestamp}{file_extension}"
            
            bucket = client.bucket(bucket_name)
            blob = bucket.blob(unique_file_name)
            
            upload_url = blob.generate_signed_url(
                version="v4",
                expiration=timedelta(minutes=60),
                method="PUT"
            )
            
            response_data.append({
                "original_file_name": base_file_name,
                "unique_file_name": unique_file_name,
                "upload_url": upload_url
            })

        return (json.dumps(response_data), 200, headers)

    except Exception as e:
        return (json.dumps({"error": str(e)}), 500, headers)