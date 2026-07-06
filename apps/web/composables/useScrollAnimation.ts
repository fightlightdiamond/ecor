export function useScrollAnimation() {
  onMounted(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            intersectionObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )

    const observeWithin = (root: ParentNode) => {
      root.querySelectorAll('.animate-on-scroll').forEach(el => intersectionObserver.observe(el))
    }

    observeWithin(document)

    // Elements gated behind an async v-if (a loading skeleton swapped for
    // real content once data resolves, a tab switch, etc.) don't exist yet
    // at mount time, so the querySelectorAll pass above misses them — they'd
    // stay stuck at opacity:0 forever. Watch the DOM for anything added
    // later and observe it too.
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.classList.contains('animate-on-scroll')) intersectionObserver.observe(node)
          observeWithin(node)
        })
      }
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    onUnmounted(() => {
      intersectionObserver.disconnect()
      mutationObserver.disconnect()
    })
  })
}
