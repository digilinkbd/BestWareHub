"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { ProductSuggestion } from "@/types/search"
import { getSuggestions } from "@/actions/search"

interface SearchInputProps {
  className?: string;
  initialQuery?: string;
}

export default function SearchInput({ className = "", initialQuery = "" }: SearchInputProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery || "")
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
    }
  }, [initialQuery])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const results = await getSuggestions(query)
        setSuggestions(results.slice(0, 4)) // Limit to 4 suggestions
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsFocused(false)
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="What are you looking for?"
            className="w-full rounded-lg border-0 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
            aria-label="Search"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-gray-400" />
          </motion.button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
          >
            <div className="py-1 max-h-60 overflow-auto">
              {suggestions.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.slug}`}
                  className="flex items-center px-4 py-2 hover:bg-yellow-50 transition-colors"
                  onClick={() => setIsFocused(false)}
                >
                  {item.image && (
                    <div className="flex-shrink-0 h-10 w-10 mr-3">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="h-10 w-10 object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                    {item.category && <p className="text-xs text-gray-500 truncate">{item.category}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

