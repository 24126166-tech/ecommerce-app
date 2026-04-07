"use client"

type Product = {
  id: string
  name: string
  price: number
  image?: string
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover rounded"
        />
      )}

      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>

      <p className="text-gray-600">
        {product.price.toLocaleString()} VND
      </p>

      <button className="mt-3 w-full bg-black text-white py-2 rounded">
        Thêm vào giỏ
      </button>
    </div>
  )
}