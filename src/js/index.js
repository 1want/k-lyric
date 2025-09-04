import { drawLyric } from '../utils/index.js'
import parseLyric from './parseLyric.js'

function createLyric(lyric, audio) {
  const lyrics = parseLyric(lyric)
  drawLyric(lyrics)

  const liElements = document.getElementsByTagName('li')
  let animationFrameId = null
  let currentLineIndex = -1

  function findCurrentLineIndex(time) {
    const msTime = time * 1000
    return lyrics.findIndex(line => msTime >= line.startTime && msTime <= line.endTime)
  }

  function update() {
    const currentTime = audio.currentTime
    const newIndex = findCurrentLineIndex(currentTime)

    if (newIndex !== currentLineIndex) {
      // 清除上一行的样式
      if (currentLineIndex !== -1 && liElements[currentLineIndex]) {
        liElements[currentLineIndex].classList.remove('current-line')
        liElements[currentLineIndex].childNodes.forEach(span => {
          span.className = ''
          span.style.animation = ''
        })
      }
      // 设置当前行
      if (newIndex !== -1) {
        liElements[newIndex].classList.add('current-line')
        currentLineIndex = newIndex
      } else {
        currentLineIndex = -1
      }
    }

    if (currentLineIndex !== -1) {
      const currentLine = lyrics[currentLineIndex]
      const timeIntoLine = currentTime * 1000 - currentLine.startTime

      let accumulatedTime = 0
      currentLine.words.forEach((word, wordIndex) => {
        const span = liElements[currentLineIndex].childNodes[wordIndex]
        if (timeIntoLine >= accumulatedTime && timeIntoLine < accumulatedTime + word.duration) {
          if (span.className !== 'current-span') {
            span.className = 'current-span'
            span.style.animation = `gradient ${word.duration / 1000}s linear forwards`
          }
        } else if (timeIntoLine >= accumulatedTime + word.duration) {
          span.className = 'past-span'
          span.style.animation = ''
        } else {
          span.className = ''
          span.style.animation = ''
        }
        accumulatedTime += word.duration
      })
    }

    animationFrameId = requestAnimationFrame(update)
  }

  const play = () => {
    audio.play()
    if (!animationFrameId) {
      update()
    }
  }

  const pause = () => {
    audio.pause()
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  return {
    play,
    pause
  }
}

export default createLyric
