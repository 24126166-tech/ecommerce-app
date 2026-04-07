import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: {
      featured: true,
    },
    take: 4,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... các phần header giữ nguyên */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard 
            key={p.id} 
            product={{
              ...p,
              price: Number(p.price) // Ép kiểu Decimal về number ở đây
            }} 
          />
        ))}
      </div>
    </div>
  );
}