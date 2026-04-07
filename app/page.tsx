import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/store/ProductCard"

export default async function Home() {
  const products = await prisma.product.findMany()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}