
import { useEffect, useState } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if viewport width is mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // Typical mobile breakpoint
    }

    // Check on initial render
    checkIsMobile()

    // Set up event listener for window resizing
    window.addEventListener("resize", checkIsMobile)

    // Clean up event listener
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}
