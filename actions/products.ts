"use server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
const ProductSchema = z.object({
 name: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
 price: z.coerce.number().positive("Giá phải lớn hơn 0"),
 stock: z.coerce.number().int().min(0),
 categoryId: z.string().cuid(),
})
export async function createProduct(formData: FormData) {
 const result = ProductSchema.safeParse(Object.fromEntries(formData))
 if (!result.success) {
 return { error: result.error.flatten().fieldErrors }
 }
 await prisma.product.create({ data: result.data })
 revalidatePath("/products") // Xóa cache trang danh sách
 revalidatePath("/admin/products") // Xóa cache trang admin
 redirect("/admin/products")
}