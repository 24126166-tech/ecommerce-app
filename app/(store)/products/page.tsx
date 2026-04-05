import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/store/ProductCard"
import ProductFilters from "@/components/store/ProductFilters"
import { Product } from "@prisma/client"
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
  const { category, minPrice, maxPrice, q, sort } = searchParams || {}

  // ❗ tạm thời để categories rỗng (fix lỗi trước)
  const categories = await prisma.category.findMany()

  const products: Product[] = await prisma.product.findMany({
    where: {
      AND: [
        category ? { category: { slug: category } } : {},
        minPrice ? { price: { gte: Number(minPrice) } } : {},
        maxPrice ? { price: { lte: Number(maxPrice) } } : {},
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
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
        ? { createdAt: "desc" }
        : { featured: "desc" },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <ProductFilters categories={categories} />

        <div className="grid grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}