import { sleep, drawLyric } from '../utils/index.js'
import parseLyric from './parseLyric.js'

function createLyric(lyric, audio) {
  const lyrics = parseLyric(lyric)
  let spanI = 0
  let index = 0
  let playState = false
  let playTime = 0
  let item = null
  let setTimer = null
  const li = document.getElementsByTagName('li')

  drawLyric(lyrics)

  function addStyle() {
    item = lyrics[index]
    li[index].childNodes[spanI].className = 'currentSpan'
    let time = null
    time = item.time2[spanI] / 1000
    li[index].childNodes[spanI].style.animationDuration = time + 's'
  }
  async function addSleep() {
    if (!playState) return
    addStyle()
    await sleep(item.time2[spanI])
    spanI++
    if (spanI < item.time2.length) {
      addSleep()
    } else {
      index++
      spanI = 0
      addSleep()
    }
  }

  const play = () => {
    //  暂停音乐时,spanI可能已经到了下一个字体，导致即将要渲染的字无法正确渲染
    // 所以需要给当前字和上一个字都加上running
    audio.play()
    playState = true

    if (spanI >= 0) {
      li[index].childNodes[spanI - 1 < 0 && 0].style.animationPlayState =
        'running'
      li[index].childNodes[spanI].style.animationPlayState = 'running'
    }

    if (16650 - playTime * 1000 > 0) {
      setTimer = setTimeout(() => {
        addSleep()
      }, 16650 - playTime * 1000)
    } else {
      addSleep()
    }
  }
  const pause = () => {
    // 频繁点击暂停时，会导致字体渲染偏移量增加
    audio.pause()
    clearTimeout(setTimer)
    playTime = audio.currentTime
    playState = false
    li[index].childNodes[spanI].style.animationPlayState = 'paused'
  }

  return {
    play,
    pause
  }
}

export default createLyric
