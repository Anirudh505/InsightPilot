import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function Tabs({ tabs, activeTab, onTabChange, className }) {
  return (
    <div className={cn("flex space-x-1 border-b border-border mb-4", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative px-4 py-2 text-sm font-medium transition-colors hover:text-foreground",
            activeTab === tab.id ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
