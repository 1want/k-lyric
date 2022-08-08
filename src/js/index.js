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
    if (playState === false) return
    item = lyrics[index]
    li[index].childNodes[spanI].className = 'currentSpan'
    let time = null
    time = item.time2[spanI] / 1000
    li[index].childNodes[spanI].style.animationDuration = time + 's'
  }
  async function addSleep() {
    if (playState === false) return
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
      // li[index].childNodes[
      //   spanI - 1 < 0 ? 0 : spanI - 1
      // ].style.animationPlayState = 'running'
      li[index].childNodes.forEach(item => {
        item.style.animationPlayState = 'running'
      })
      if (index > 1) {
        li[index - 1].childNodes.forEach(item => {
          item.style.animationPlayState = 'running'
        })
      }
      // li[index].childNodes[spanI].style.animationPlayState = 'running'
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
    playState = false
    audio.pause()
    li[index].childNodes[spanI].style.animationPlayState = 'paused'
    clearTimeout(setTimer)
    playTime = audio.currentTime
    lyrics.find((item, ind) => {
      let cTime = playTime * 1000
      let iTime = new Function('return ' + item.time)()
      let startTime = iTime[0]
      let endTime = iTime[0] + iTime[1]

      if (cTime >= startTime && cTime <= endTime) {
        index = ind
        console.log(cTime, item, index, spanI)
        for (var i = 0; i < item.time2.length; i++) {
          if (cTime - startTime - item.time2[i] > item.time2[i]) {
            cTime = cTime - item.time2[i]
          } else {
            // 可能因为时间太短导致判断时直接跳过了某一个字
            spanI = i + 1
            return
          }
        }
      }
    })
  }

  return {
    play,
    pause
  }
}

export default createLyric
