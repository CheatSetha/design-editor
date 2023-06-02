import React from "react"
import { Block } from "baseui/block"

interface Props {
  children: React.ReactNode
  // fetchData: () => void
  hasMore: boolean
}

// infinite scroll is a technique used to load more content as the user scrolls down the page . user don't have to click on the next page button to load more content
// it's provide a better user experience
function InfiniteScrolling({ children,  hasMore }: Props) {

  const lastElementRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    let observer: IntersectionObserver
    if (hasMore) {
      if (lastElementRef.current) {
        observer = new IntersectionObserver((entries) => {
          const first = entries[0]
          // if (first.isIntersecting) {
          //   if (hasMore) {
          //     fetchData()
          //   }
          // }
        })

        observer.observe(lastElementRef.current)
      }
    }

    return () => {
      if (observer && lastElementRef.current) {
        observer.unobserve(lastElementRef.current)
      }
    }
  }, [lastElementRef,  hasMore])

  return (
    <Block>
      
      {children}
      <h1>it's in InfiniteScrolling component</h1>
      <Block ref={lastElementRef}></Block>
    </Block>
  )
}

export default InfiniteScrolling
