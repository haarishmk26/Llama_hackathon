"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  ShoppingCart,
  CreditCard,
  type LucideIcon,
  ArrowRight,
  X,
  Tag,
  Filter,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Transaction {
  id: string
  title: string
  amount: string
  type: "incoming" | "outgoing"
  category: string
  icon: LucideIcon
  timestamp: string
  status: "completed" | "pending" | "failed"
  tags: string[]
}

interface TransactionListProps {
  className?: string
}

// Dummy transactions data with tags
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "Apple Store Purchase",
    amount: "$999.00",
    type: "outgoing",
    category: "shopping",
    icon: ShoppingCart,
    timestamp: "Today, 2:45 PM",
    status: "completed",
    tags: ["electronics", "work"],
  },
  {
    id: "2",
    title: "Salary Deposit",
    amount: "$4,500.00",
    type: "incoming",
    category: "transport",
    icon: Wallet,
    timestamp: "Today, 9:00 AM",
    status: "completed",
    tags: ["income", "salary"],
  },
  {
    id: "3",
    title: "Netflix Subscription",
    amount: "$15.99",
    type: "outgoing",
    category: "entertainment",
    icon: CreditCard,
    timestamp: "Yesterday",
    status: "pending",
    tags: ["subscription", "entertainment"],
  },
  {
    id: "4",
    title: "Grocery Shopping",
    amount: "$87.50",
    type: "outgoing",
    category: "shopping",
    icon: ShoppingCart,
    timestamp: "Yesterday, 5:30 PM",
    status: "completed",
    tags: ["food", "essentials"],
  },
  {
    id: "5",
    title: "Freelance Payment",
    amount: "$850.00",
    type: "incoming",
    category: "work",
    icon: Wallet,
    timestamp: "Jun 15, 2023",
    status: "completed",
    tags: ["income", "freelance"],
  },
  {
    id: "6",
    title: "Rent Payment",
    amount: "$1,200.00",
    type: "outgoing",
    category: "housing",
    icon: CreditCard,
    timestamp: "Jun 1, 2023",
    status: "completed",
    tags: ["housing", "rent"],
  },
]

export default function TransactionList({ className }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS)
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState<string>("")
  const [tagInputId, setTagInputId] = useState<string | null>(null)
  const [allTags, setAllTags] = useState<string[]>([])

  // Extract all unique tags from transactions
  useEffect(() => {
    const tags = transactions.flatMap((t) => t.tags)
    setAllTags([...new Set(tags)])
  }, [transactions])

  // Filter transactions based on selected tags
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredTransactions(transactions)
    } else {
      setFilteredTransactions(
        transactions.filter((transaction) => selectedTags.some((tag) => transaction.tags.includes(tag))),
      )
    }
  }, [selectedTags, transactions])

  const handleAddTag = (transactionId: string) => {
    if (!newTag.trim()) return

    setTransactions(
      transactions.map((transaction) => {
        if (transaction.id === transactionId && !transaction.tags.includes(newTag.trim())) {
          return {
            ...transaction,
            tags: [...transaction.tags, newTag.trim()],
          }
        }
        return transaction
      }),
    )

    setNewTag("")
    setTagInputId(null)
  }

  const handleRemoveTag = (transactionId: string, tagToRemove: string) => {
    setTransactions(
      transactions.map((transaction) => {
        if (transaction.id === transactionId) {
          return {
            ...transaction,
            tags: transaction.tags.filter((tag) => tag !== tagToRemove),
          }
        }
        return transaction
      }),
    )
  }

  const handleTagKeyDown = (e: React.KeyboardEvent, transactionId: string) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag(transactionId)
    }
  }

  const toggleTagSelection = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSelectedTags([])
  }

  return (
    <Card
      className={cn("bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23] rounded-xl", className)}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-zinc-900 dark:text-zinc-50" />
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Transactions</CardTitle>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Filter by Tag</span>
                    {selectedTags.length > 0 && (
                      <Badge variant="secondary" className="ml-1 rounded-full">
                        {selectedTags.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Select Tags</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allTags.map((tag) => (
                    <DropdownMenuCheckboxItem
                      key={tag}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => toggleTagSelection(tag)}
                    >
                      #{tag}
                    </DropdownMenuCheckboxItem>
                  ))}
                  {allTags.length === 0 && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">No tags available</div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {selectedTags.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                #{tag}
                <button onClick={() => toggleTagSelection(tag)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tag} filter</span>
                </button>
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-2">
        <div className="space-y-0.5 max-h-[350px] overflow-y-auto">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={cn(
                "group flex items-start gap-2",
                "p-2 rounded-lg",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                "transition-all duration-200",
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-lg mt-0.5",
                  "bg-zinc-100 dark:bg-zinc-800",
                  "border border-zinc-200 dark:border-zinc-700",
                )}
              >
                <transaction.icon className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
              </div>

              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between min-w-0 gap-1">
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-1">
                    <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{transaction.title}</h3>
                    <div className="flex flex-wrap gap-1">
                      {transaction.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px] py-0 px-1">
                          #{tag}
                          <button
                            onClick={() => handleRemoveTag(transaction.id, tag)}
                            className="ml-1 rounded-full hover:bg-muted p-0.5"
                          >
                            <X className="h-2 w-2" />
                            <span className="sr-only">Remove {tag}</span>
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-600 dark:text-zinc-400">{transaction.timestamp}</p>
                </div>

                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      transaction.type === "incoming"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400",
                    )}
                  >
                    {transaction.type === "incoming" ? "+" : "-"}
                    {transaction.amount}
                  </span>
                  {transaction.type === "incoming" ? (
                    <ArrowDownLeft className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowUpRight className="w-3 h-3 text-red-600 dark:text-red-400" />
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                {tagInputId === transaction.id ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => handleTagKeyDown(e, transaction.id)}
                      placeholder="Add tag..."
                      className="h-6 text-xs w-20"
                      autoFocus
                      onBlur={() => {
                        if (newTag.trim()) {
                          handleAddTag(transaction.id)
                        } else {
                          setTagInputId(null)
                        }
                      }}
                    />
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTagInputId(transaction.id)}
                    className="h-6 px-1.5 text-[10px]"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    Add Tag
                  </Button>
                )}
              </div>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="py-4 text-center">
              <p className="text-xs text-muted-foreground">No transactions match your filters</p>
              <Button variant="link" onClick={clearFilters} className="mt-1 text-xs h-6">
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        <div className="mt-3">
          <Button variant="outline" className="w-full flex items-center justify-center gap-1 py-1.5 text-xs h-7">
            <span>View All Transactions</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
