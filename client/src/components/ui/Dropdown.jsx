import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { scaleIn } from "@/animations/framer"

export function Dropdown({ trigger, items, align = "right", className }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef(null)

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={scaleIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              "absolute z-50 mt-2 w-56 origin-top-right rounded-md bg-popover border border-border shadow-elevated focus:outline-none",
              align === "right" ? "right-0" : "left-0",
              className
            )}
          >
            <div className="py-1">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick?.()
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full text-left block px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    item.danger && "text-destructive hover:bg-destructive/10 hover:text-destructive"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
