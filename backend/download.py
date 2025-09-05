import os
import boto3
from dotenv import load_dotenv

# Load env variables
load_dotenv()

# --- Config ---
LOCAL_FOLDER = "/var/www/GPKnowledgeManagementAI/uploads"

# --- DO Spaces Setup ---
session = boto3.session.Session()
s3 = session.client(
    "s3",
    region_name=os.getenv("DO_SPACES_REGION"),
    endpoint_url=os.getenv("DO_SPACES_ENDPOINT"),
    aws_access_key_id=os.getenv("DO_SPACES_KEY"),
    aws_secret_access_key=os.getenv("DO_SPACES_SECRET"),
)
bucket = os.getenv("DO_SPACES_BUCKET")


def sync_local_to_space():
    uploaded, skipped = 0, 0
    results = []

    for root, _, files in os.walk(LOCAL_FOLDER):
        for filename in files:
            local_path = os.path.join(root, filename)

            # Keep the same relative path inside "uploads/"
            rel_path = os.path.relpath(local_path, LOCAL_FOLDER)
            key = f"uploads/{rel_path}"

            # Check if file already exists in Space
            try:
                s3.head_object(Bucket=bucket, Key=key)
                skipped += 1
                results.append({"file": rel_path, "status": "already_in_space"})
                continue
            except s3.exceptions.ClientError as e:
                if e.response["Error"]["Code"] != "404":
                    results.append({"file": rel_path, "status": f"error_checking: {e}"})
                    continue

            # Upload if missing
            try:
                s3.upload_file(local_path, bucket, key)
                uploaded += 1
                results.append({"file": rel_path, "status": "uploaded"})
                print(f"[upload] {rel_path} -> {bucket}/{key}")
            except Exception as e:
                results.append({"file": rel_path, "status": f"upload_failed: {e}"})
                print(f"[error] Failed to upload {rel_path}: {e}")

    print(f"\n[sync done] Uploaded {uploaded}, Skipped {skipped}")
    return {"uploaded": uploaded, "skipped": skipped, "details": results}


if __name__ == "__main__":
    summary = sync_local_to_space()
    print(summary)
