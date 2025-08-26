import { Search } from "lucide-react"

export default function SearchBar() {
  return (
    <div className="py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="O que deseja buscar?"
            className="w-full px-4 py-3 pr-12 border border-[#d9d9d9] rounded-lg focus:outline-none focus:border-[#0a3299]"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-5 w-5 text-[#666666]" />
          </button>
        </div>
      </div>
    </div>
  )
}
