import { Wallet } from "lucide-react"
import List01 from "../kokonutui/list-01"
import TrendVisualization from "./trend-visualization"
import TransactionList from "./transaction-list"

export default function Content() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-4 border border-gray-200 dark:border-[#1F1F23] h-full">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 text-left flex items-center gap-2">
            <Wallet className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50" />
            Accounts
          </h2>
          <div className="h-[400px] overflow-auto">
            <List01 className="h-full" />
          </div>
        </div>

        <div className="h-full">
          <TransactionList className="h-full" />
        </div>
      </div>

      <TrendVisualization />
    </div>
  )
}
