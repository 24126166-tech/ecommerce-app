import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/store/ProductCard"

export default async function Home() {
  // Lấy dữ liệu sản phẩm
  const products = await prisma.product.findMany({
    orderBy: {
      id: "desc" // Sắp xếp theo ID để tránh lỗi thiếu createdAt
    }
  })

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sản phẩm của chúng tôi</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard 
            key={p.id} 
            product={{
              ...p,
              price: Number(p.price) 
            }} 
          />
        ))}
      </div>
    </main>
  )
}