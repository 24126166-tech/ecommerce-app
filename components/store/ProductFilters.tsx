"use client"

import { useRouter, useSearchParams } from "next/navigation"

interface Category {
  id: string
  name: string
  slug: string
}

export default function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="w-full md:w-64 space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Danh mục</h3>
        <select 
          className="w-full border p-2 rounded"
          onChange={(e) => updateFilter("category", e.target.value)}
          defaultValue={searchParams.get("category") || ""}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Sắp xếp</h3>
        <select 
          className="w-full border p-2 rounded"
          onChange={(e) => updateFilter("sort", e.target.value)}
          defaultValue={searchParams.get("sort") || ""}
        >
          <option value="">Mặc định</option>
          <option value="price-asc">Giá: Thấp đến Cao</option>
          <option value="newest">Mới nhất</option>
        </select>
      </div>
    </div>
  )
}