"use client"

import { useState } from "react"

export default function ProductFilters({
  onFilter,
}: {
  onFilter: (keyword: string) => void
}) {
  const [keyword, setKeyword] = useState("")

  return (
    <div className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="Tìm sản phẩm..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <button
        onClick={() => onFilter(keyword)}
        className="bg-black text-white px-4 rounded"
      >
        Lọc
      </button>
    </div>
  )
}