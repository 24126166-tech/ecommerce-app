"use server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const ProductSchema = z.object({
  name: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
  price: z.coerce.number().positive("Giá phải lớn hơn 0"),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string(), // Bỏ .cuid() nếu id category của bạn không phải dạng cuid để tránh lỗi vặt
})

// Hàm hỗ trợ tạo slug tiếng Việt không dấu
function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "")
    .replace(/(\s+)/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProduct(formData: FormData) {
  const result = ProductSchema.safeParse(Object.fromEntries(formData))
  
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { name, price, stock, categoryId } = result.data;

  try {
    await prisma.product.create({ 
      data: { 
        name,
        price, // Prisma sẽ tự hiểu number -> Decimal nếu cấu hình đúng
        stock,
        categoryId,
        slug: `${slugify(name)}-${Date.now()}`, // Tạo slug duy nhất bằng cách thêm timestamp
        featured: false, // Thêm giá trị mặc định nếu schema yêu cầu
        images: [],      // Thêm mảng trống nếu schema yêu cầu
      } 
    })
  } catch (error) {
    console.error("Lỗi tạo sản phẩm:", error)
    return { error: { name: ["Không thể tạo sản phẩm, vui lòng thử lại"] } }
  }

  revalidatePath("/products") 
  revalidatePath("/admin/products") 
  redirect("/admin/products")
}