import { GET as getProductReviews } from "../api/store/products/[id]/reviews/route"
import { GET as getSellerReviews } from "../api/store/sellers/[id]/reviews/route"

async function runTestSuite() {
  console.log("========================================================================================")
  console.log("BỘ KIỂM ĐỊNH TỰ ĐỘNG CHUYÊN SÂU: PUBLIC STORE REVIEWS & RATINGS API")
  console.log("========================================================================================\n")

  let passedTests = 0
  const totalTests = 3

  // -------------------------------------------------------------------------------------
  // Test 1: Public Product Reviews API (Fallback & Cấu trúc dữ liệu)
  // -------------------------------------------------------------------------------------
  console.log("[Test 1] Kiểm tra endpoint GET /store/products/:id/reviews...")
  let productResponseData: any = null
  const mockReqProduct: any = {
    params: { id: "prod_test_ai_workflow" },
    scope: {
      resolve: () => ({
        graph: async () => ({ data: [] }),
      }),
    },
  }
  const mockResProduct: any = {
    json: (data: any) => {
      productResponseData = data
    },
  }

  await getProductReviews(mockReqProduct, mockResProduct)

  if (!productResponseData || !productResponseData.reviews || !productResponseData.stats) {
    throw new Error("Test 1 FAILED: Cấu trúc trả về của Product Reviews không hợp lệ!")
  }
  if (productResponseData.stats.averageRating !== 5.0 || productResponseData.reviews.length < 1) {
    throw new Error("Test 1 FAILED: Điểm đánh giá hoặc danh sách reviews rỗng!")
  }

  console.log(`  ✓ Số lượng reviews sản phẩm: ${productResponseData.reviews.length}`)
  console.log(`  ✓ Điểm đánh giá trung bình: ${productResponseData.stats.averageRating} ★`)
  console.log(`  ✓ Phân bổ 5 sao: ${productResponseData.stats.distribution[5]}`)
  console.log("  => Test 1 PASSED: Product Reviews API trả về cấu trúc chuẩn chỉ 100%.\n")
  passedTests++

  // -------------------------------------------------------------------------------------
  // Test 2: Public Seller Reviews API (Fallback & Cấu trúc dữ liệu)
  // -------------------------------------------------------------------------------------
  console.log("[Test 2] Kiểm tra endpoint GET /store/sellers/:id/reviews...")
  let sellerResponseData: any = null
  const mockReqSeller: any = {
    params: { id: "sel_test_creator_daiviet" },
    scope: {
      resolve: () => ({
        graph: async () => ({ data: [] }),
      }),
    },
  }
  const mockResSeller: any = {
    json: (data: any) => {
      sellerResponseData = data
    },
  }

  await getSellerReviews(mockReqSeller, mockResSeller)

  if (!sellerResponseData || !sellerResponseData.reviews || !sellerResponseData.stats) {
    throw new Error("Test 2 FAILED: Cấu trúc trả về của Seller Reviews không hợp lệ!")
  }
  if (sellerResponseData.stats.averageRating !== 5.0 || sellerResponseData.reviews.length < 1) {
    throw new Error("Test 2 FAILED: Dữ liệu seller reviews không đúng kỳ vọng!")
  }

  console.log(`  ✓ Số lượng reviews seller: ${sellerResponseData.reviews.length}`)
  console.log(`  ✓ Điểm uy tín seller: ${sellerResponseData.stats.averageRating} ★`)
  console.log(`  ✓ Nhận xét mẫu: "${sellerResponseData.reviews[0].customer_note.slice(0, 50)}..."`)
  console.log("  => Test 2 PASSED: Seller Reviews API trả về cấu trúc chuẩn chỉ 100%.\n")
  passedTests++

  // -------------------------------------------------------------------------------------
  // Test 3: Tính toán điểm trung bình & phân bổ sao khi có dữ liệu thực tế
  // -------------------------------------------------------------------------------------
  console.log("[Test 3] Kiểm tra thuật toán tính toán thống kê reviews động...")
  let dynamicResponse: any = null
  const mockDynamicReq: any = {
    params: { id: "prod_sample_real" },
    scope: {
      resolve: () => ({
        graph: async () => ({
          data: [
            {
              id: "prod_sample_real",
              reviews: [
                { id: "rev_1", rating: 5, status: "published", customer_note: "Tốt" },
                { id: "rev_2", rating: 4, status: "published", customer_note: "Khá ổn" },
                { id: "rev_3", rating: 5, status: "published", customer_note: "Xuất sắc" },
                { id: "rev_4", rating: 1, status: "rejected", customer_note: "Spam" }, // Không tính
              ],
            },
          ],
        }),
      }),
    },
  }
  const mockDynamicRes: any = {
    json: (data: any) => {
      dynamicResponse = data
    },
  }

  await getProductReviews(mockDynamicReq, mockDynamicRes)

  // Chỉ tính 3 reviews published: (5 + 4 + 5) / 3 = 4.666... -> 4.7
  if (dynamicResponse.stats.reviewCount !== 3) {
    throw new Error(`Test 3 FAILED: Kỳ vọng 3 reviews được duyệt, nhận được ${dynamicResponse.stats.reviewCount}`)
  }
  if (dynamicResponse.stats.averageRating !== 4.7) {
    throw new Error(`Test 3 FAILED: Kỳ vọng điểm TB 4.7, nhận được ${dynamicResponse.stats.averageRating}`)
  }
  if (dynamicResponse.stats.distribution[5] !== 2 || dynamicResponse.stats.distribution[4] !== 1) {
    throw new Error(`Test 3 FAILED: Phân bổ sao không đúng! ${JSON.stringify(dynamicResponse.stats.distribution)}`)
  }

  console.log(`  ✓ Số review đã duyệt: ${dynamicResponse.stats.reviewCount}`)
  console.log(`  ✓ Điểm TB tính toán chính xác: ${dynamicResponse.stats.averageRating} ★`)
  console.log(`  ✓ Phân bổ đúng: 5★ = ${dynamicResponse.stats.distribution[5]}, 4★ = ${dynamicResponse.stats.distribution[4]}`)
  console.log("  => Test 3 PASSED: Thuật toán tính toán và kiểm duyệt reviews chính xác 100%.\n")
  passedTests++

  console.log("========================================================================================")
  console.log(`TỔNG KẾT: ${passedTests}/${totalTests} BÀI TEST THÀNH CÔNG 100%!`)
  console.log("========================================================================================")
}

runTestSuite().catch((err) => {
  console.error("Test Suite thất bại:", err)
  process.exit(1)
})
