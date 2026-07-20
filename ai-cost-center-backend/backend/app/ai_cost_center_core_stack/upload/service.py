from app.ai_cost_center_full_stack.storage.r2 import generate_presigned_url


def get_upload_url(key: str) -> str:
    return generate_presigned_url(key)


def extract_text(file_path: str) -> str:
    return ""
