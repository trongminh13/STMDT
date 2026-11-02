import requests
import json
import subprocess
import time

BASE_URL = "http://localhost:9000"

def run():
    print("=== BẮT ĐẦU KIỂM THỬ LUỒNG MERCUR 2.0 (POC HÀNG SỐ AI) ===")

    # 1. Admin login
    print("\n[Bước 1] Đăng nhập Admin...")
    admin_auth_resp = requests.post(f"{BASE_URL}/auth/user/emailpass", json={
        "email": "admin@daiviet.edu.vn",
        "password": "AdminPassword123!"
    })
    assert admin_auth_resp.status_code == 200, f"Admin login failed: {admin_auth_resp.text}"
    admin_token = admin_auth_resp.json()["token"]
    print(f"✓ Đăng nhập Admin thành công! (Token: {admin_token[:20]}...)")
    admin_headers = {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}

    # 2. Member/Creator login or register
    print("\n[Bước 2] Đăng ký / Đăng nhập Creator...")
    member_auth_resp = requests.post(f"{BASE_URL}/auth/member/emailpass", json={
        "email": "creator.ai@daiviet.edu.vn",
        "password": "CreatorPassword123!"
    })
    if member_auth_resp.status_code != 200:
        member_auth_resp = requests.post(f"{BASE_URL}/auth/member/emailpass/register", json={
            "email": "creator.ai@daiviet.edu.vn",
            "password": "CreatorPassword123!"
        })
    assert member_auth_resp.status_code == 200, f"Member auth failed: {member_auth_resp.text}"
    member_token = member_auth_resp.json()["token"]
    print(f"✓ Creator xác thực thành công! (Token: {member_token[:20]}...)")
    member_headers = {"Authorization": f"Bearer {member_token}", "Content-Type": "application/json"}

    # 3. Check existing seller or create new seller
    print("\n[Bước 3] Kiểm tra / Tạo hồ sơ Gian hàng Seller...")
    sellers_resp = requests.get(f"{BASE_URL}/vendor/sellers", headers=member_headers)
    seller_id = None
    if sellers_resp.status_code == 200 and sellers_resp.json().get("seller_members"):
        seller_member = sellers_resp.json()["seller_members"][0]
        seller_id = seller_member["seller_id"]
        seller_status = seller_member["seller"]["status"]
        print(f"✓ Đã tìm thấy Seller hiện có: ID={seller_id}, Name='{seller_member['seller']['name']}', Status='{seller_status}'")
    else:
        create_seller_resp = requests.post(f"{BASE_URL}/vendor/sellers", headers=member_headers, json={
            "name": "Đại Việt AI Studio",
            "handle": "daiviet-ai-studio",
            "email": "creator.ai@daiviet.edu.vn",
            "member_email": "creator.ai@daiviet.edu.vn",
            "currency_code": "usd",
            "first_name": "Minh",
            "last_name": "Đỗ Trọng",
            "description": "Studio chuyên sản xuất Workflow n8n & Trợ lý AI thực chiến cho doanh nghiệp"
        })
        assert create_seller_resp.status_code in [200, 201], f"Create seller failed: {create_seller_resp.text}"
        seller = create_seller_resp.json()["seller"]
        seller_id = seller["id"]
        seller_status = seller["status"]
        print(f"✓ Tạo mới Seller thành công: ID={seller_id}, Status='{seller_status}'")

    # Refresh member token to obtain updated actor_id
    refresh_resp = requests.post(f"{BASE_URL}/auth/member/emailpass", json={
        "email": "creator.ai@daiviet.edu.vn",
        "password": "CreatorPassword123!"
    })
    member_token = refresh_resp.json()["token"]

    # 4. Admin approves seller if pending
    if seller_status != "active":
        print(f"\n[Bước 4] Admin duyệt Seller '{seller_id}' (Status hiện tại: {seller_status})...")
        approve_resp = requests.post(f"{BASE_URL}/admin/sellers/{seller_id}/approve", headers=admin_headers, json={})
        if approve_resp.status_code in [200, 201]:
            print(f"✓ Admin đã duyệt Seller thành công! Trạng thái mới: {approve_resp.json()['seller']['status']}")
        else:
            print(f"Lưu ý khi duyệt seller: {approve_resp.status_code} {approve_resp.text}")

    # 5. Creator đăng bán sản phẩm số AI (AUT-BIZ-01)
    print("\n[Bước 5] Creator đăng tải sản phẩm số AI kèm Manifest JSONB...")
    vendor_headers = {
        "Authorization": f"Bearer {member_token}",
        "x-seller-id": seller_id,
        "Content-Type": "application/json"
    }

    manifest_metadata = {
        "sku": "AUT-BIZ-01",
        "category_code": "AUT",
        "runtime_env": "n8n >= 1.60.0",
        "ai_model_supported": "DeepSeek-V3 / GPT-4o-mini",
        "monthly_token_estimate": "50.000đ - 100.000đ / tháng",
        "prerequisites": "Tài khoản Zalo OA Tích Vàng, Máy chủ n8n tự host",
        "license_type": "LIC-COM-SINGLE",
        "refund_policy": "Bảo hành 30 ngày, tạm giữ T+3",
        "delivery_asset": "workflow_zalo_oa_v1.zip",
        "asset_hash_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }

    ts = int(time.time())
    product_payload = {
        "title": "Trợ lý CSKH & Chốt đơn Zalo OA tự động (AUT-BIZ-01)",
        "handle": f"tro-ly-cskh-zalo-oa-{ts}",
        "subtitle": "Quy trình n8n Automation tích hợp AI DeepSeek & Zalo Official Account",
        "description": "<p>Hệ thống tự động hóa đồng bộ tin nhắn khách hàng từ Zalo OA, sử dụng AI DeepSeek-V3 phân loại ý định mua hàng, tư vấn sản phẩm và gửi đơn hàng về CRM.</p>",
        "status": "proposed",
        "variants": [
            {
                "title": "Bản quyền Tiêu chuẩn (Single)",
                "sku": f"AUT-BIZ-01-{ts}"
            }
        ],
        "metadata": manifest_metadata
    }

    t0 = time.time()
    create_prod_resp = requests.post(f"{BASE_URL}/vendor/products", headers=vendor_headers, json=product_payload)
    latency_ms = (time.time() - t0) * 1000
    assert create_prod_resp.status_code in [200, 201], f"Create product failed: {create_prod_resp.text}"
    product_data = create_prod_resp.json()["product"]
    product_id = product_data["id"]
    print(f"✓ Đăng sản phẩm thành công trong {latency_ms:.1f}ms!")
    print(f"  • Product ID: {product_id}")
    print(f"  • Title: {product_data['title']}")
    print(f"  • Status: {product_data['status']} (Chờ Admin duyệt)")
    print(f"  • Metadata SKU: {product_data.get('metadata', {}).get('sku')}")

    # 6. Admin kiểm tra và duyệt sản phẩm sang PUBLISHED
    print(f"\n[Bước 6] Admin kiểm tra danh sách sản phẩm chờ duyệt và Approve sang PUBLISHED...")
    update_prod_resp = requests.post(f"{BASE_URL}/admin/products/{product_id}", headers=admin_headers, json={
        "status": "published"
    })
    assert update_prod_resp.status_code == 200, f"Admin update product failed: {update_prod_resp.text}"
    published_product = update_prod_resp.json()["product"]
    print(f"✓ Admin đã duyệt sản phẩm thành công! Trạng thái: {published_product['status']}")

    # 7. Đối soát trực tiếp trong PostgreSQL 16
    print("\n[Bước 7] Truy vấn trực tiếp PostgreSQL 16 (mercur_postgres) đối soát dữ liệu...")
    query_cmd = [
        "docker", "exec", "mercur_postgres",
        "psql", "-U", "postgres", "-d", "mercur_db", "-t", "-c",
        f"SELECT id, title, status, metadata FROM product WHERE id = '{product_id}';"
    ]
    res = subprocess.run(query_cmd, capture_output=True, text=True)
    print("Kết quả truy vấn PostgreSQL:")
    print(res.stdout.strip())

    # 8. Đo lường tài nguyên hệ thống
    print("\n[Bước 8] Đo lường mức chiếm dụng RAM/CPU của các dịch vụ...")
    stat_cmd = ["docker", "stats", "--no-stream", "--format", "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"]
    stats = subprocess.run(stat_cmd, capture_output=True, text=True)
    print(stats.stdout)

    print("=== KIỂM THỬ THỰC THI HOÀN TẤT THÀNH CÔNG 100% ===")

if __name__ == "__main__":
    run()
