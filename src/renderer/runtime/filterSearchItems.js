;(function () {
  const { search } = window.app.utils

  function compareByScore(a, b) {
    if (a.score > b.score) {
      return -1
    } else if (a.score < b.score) {
      return 1
    }
    return 0
  }

  function filterSearchItems(items, needles) {
    const THROW_AWAY_LESS_USEFUL = true
    const getScore = (text) => search.getScore(text, needles)
    if (!needles || !needles.length) {
      return []
    }
    let filtered = items.filter((item) => {
      const score = getScore(item.searchableText)
      if (score) {
        item.score = score // yay, a mutant kitten died here
        return true
      }
    })
    filtered = filtered.sort(compareByScore)
    // try to throw away less useful items
    if (needles.length > 1 && THROW_AWAY_LESS_USEFUL) {
      const highest = (filtered[0] || {}).score || 0
      filtered = filtered.filter((item) => item.score === highest)
    }
    return filtered
  }

  window.app.runtime.filterSearchItems = filterSearchItems
})()
