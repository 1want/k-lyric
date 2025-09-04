const lineRegex = /\[(\d+),(\d+)\](.*)/

function parseLyric(lyric) {
  const lines = lyric.split('\n')
  const parsedLines = []

  for (const line of lines) {
    const match = line.match(lineRegex)
    if (!match) continue

    const startTime = parseInt(match[1], 10)
    const duration = parseInt(match[2], 10)
    const content = match[3]

    const words = []
    let wordTime = 0
    const wordMatches = content.matchAll(/\((\d+),(\d+)\)(.)/g)

    for (const wordMatch of wordMatches) {
      words.push({
        text: wordMatch[3],
        startTime: wordTime,
        duration: parseInt(wordMatch[2], 10)
      })
      wordTime += parseInt(wordMatch[2], 10)
    }

    if (words.length > 0) {
      parsedLines.push({
        startTime,
        duration,
        endTime: startTime + duration,
        words
      })
    }
  }
  return parsedLines
}

export default parseLyric
