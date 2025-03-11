import type { SlideAnalysis } from "@/types/slide-analysis"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

export async function analyzeSlide(
  base64Image: string,
  slideNumber: number,
  totalSlides: number,
): Promise<SlideAnalysis> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Bạn là một chuyên gia phân tích và thiết kế bài thuyết trình chuyên nghiệp. Hãy phân tích hình ảnh slide này (slide ${slideNumber} trong tổng số ${totalSlides}) và đưa ra phản hồi chi tiết bằng tiếng Việt.

                Vui lòng phân tích các khía cạnh sau:
                1. Nội dung và mục đích tổng thể của slide
                2. Nội dung văn bản (nhận diện và trích xuất văn bản)
                3. Các yếu tố hình ảnh (hình ảnh, biểu đồ, sơ đồ)
                4. Bố cục và thiết kế
                5. Các đề xuất cụ thể để cải thiện

                Định dạng phản hồi của bạn dưới dạng đối tượng JSON với cấu trúc sau:
                {
                  "summary": "Tóm tắt ngắn gọn về slide",
                  "elementsDetected": ["Tiêu đề", "Điểm đánh dấu", "Hình ảnh", v.v.],
                  "textContent": ["Văn bản tiêu đề", "Điểm đánh dấu 1", "Điểm đánh dấu 2", v.v.],
                  "visualElements": ["Mô tả hình ảnh 1", "Mô tả biểu đồ", v.v.],
                  "layoutAnalysis": "Phân tích bố cục và thiết kế của slide",
                  "recommendations": ["Đề xuất 1", "Đề xuất 2", v.v.]
                }

                Đảm bảo phản hồi của bạn CHỈ là đối tượng JSON mà không có văn bản bổ sung nào khác.`,
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Yêu cầu API thất bại với trạng thái ${response.status}`)
    }

    const data = await response.json()

    // Extract the JSON response from the text
    const textResponse = data.candidates[0].content.parts[0].text

    // Parse the JSON response
    try {
      // Find the JSON object in the response
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const jsonStr = jsonMatch[0]
        const analysis = JSON.parse(jsonStr) as SlideAnalysis
        return analysis
      } else {
        throw new Error("Không thể tìm thấy JSON trong phản hồi")
      }
    } catch (parseError) {
      console.error("Lỗi phân tích cú pháp phản hồi JSON:", parseError)
      console.log("Phản hồi thô:", textResponse)

      // Return a fallback analysis
      return {
        summary: "Không thể phân tích slide đúng cách. Phản hồi AI không đúng định dạng mong đợi.",
        elementsDetected: [],
        textContent: [],
        visualElements: [],
        layoutAnalysis: "Không có phân tích",
        recommendations: ["Thử lại với hình ảnh rõ ràng hơn"],
      }
    }
  } catch (error) {
    console.error("Lỗi khi gọi API Gemini:", error)
    throw error
  }
}

