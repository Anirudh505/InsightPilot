import * as React from "react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef(({ className, options = [], error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          "flex h-10 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        ref={ref}
        {...props}
      >
        <option value="" disabled className="text-muted-foreground">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-foreground bg-background">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      {error && <span className="text-xs text-destructive mt-1 absolute -bottom-5 left-0">{error}</span>}
    </div>
  )
})
Select.displayName = "Select"

export { Select }
