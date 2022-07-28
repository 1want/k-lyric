//每个字渲染完之后需要sleep当前字的时间，然后判断递归渲染下一个字还是下一行

import parseLyric from './parseLyric.js'

function drawLyric(lyric) {
  const body = document.getElementsByTagName('body')[0]
  const Ul = document.createElement('ul')
  for (var i of lyric) {
    const li = document.createElement('li')
    for (var j of i.lyric) {
      const span = document.createElement('span')

      span.innerText = j
      li.append(span)
    }
    Ul.append(li)
  }

  body.append(Ul)
}

function createLyric(lyric, audio) {
  const lyrics = parseLyric(lyric)
  drawLyric(lyrics)

  const li = document.getElementsByTagName('li')
  audio.addEventListener('play', () => {
    let spanI = 0
    let index = 0
    let item = null
    function addStyle() {
      item = lyrics[index]
      li[index].childNodes[spanI].className = 'currentSpan'
      let time = null
      time = item.time2[spanI] / 1000
      li[index].childNodes[spanI].style.animationDuration = time + 's'
    }
    async function addSleep() {
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

    setTimeout(() => {
      addSleep()
    }, 16650)
  })
}

const sleep = delay => {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

export default createLyric
