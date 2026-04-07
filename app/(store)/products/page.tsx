import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/store/ProductCard"
import ProductFilters from "@/components/store/ProductFilters"

type Props = {
  searchParams?: {
    category?: string
    minPrice?: string
    maxPrice?: string
    q?: string
    sort?: string
  }
}

export default async function ProductsPage({ searchParams }: Props) {
  // Đợi searchParams trước khi sử dụng để tránh lỗi Next.js 15+
  const params = await searchParams;
  const { category, minPrice, maxPrice, q, sort } = params || {}

  const categories = await prisma.category.findMany()

  const products = await prisma.product.findMany({
    where: {
      AND: [
        category ? { category: { slug: category } } : {},
        minPrice ? { price: { gte: Number(minPrice) } } : {},
        maxPrice ? { price: { lte: Number(maxPrice) } } : {},
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                // ✅ ĐÃ XÓA dòng description bị lỗi ở đây
              ],
            }
          : {},
      ],
    },
    include: { category: true },
    orderBy:
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "newest"
        ? { id: "desc" } 
        : { featured: "desc" },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <ProductFilters categories={categories} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {products.map((p) => (
            <ProductCard 
              key={p.id} 
              product={{
                ...p,
                price: Number(p.price) // ✅ Ép kiểu Decimal sang number ở đây
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}