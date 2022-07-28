import parseLyric from './parseLyric.js'

//每句歌词的最后一句完了之后下一句有可能并不是马上开始，中间会有间隔，需要处理这个间隔
// 1. 可以重新添加一个setTimeout
// 2. 可以通过下一句的开始时间减去上一句的结束时间的差值来sleep
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
  console.log(lyrics)
  drawLyric(lyrics)

  const li = document.getElementsByTagName('li')
  audio.addEventListener('play', () => {
    let spanI = 0
    let index = 0
    let item = null
    let oldTime = index =>
      new Function('return ' + lyrics[index - 1].time)().reduce(
        (a, b) => a + b,
        0
      )

    let startTime = index => new Function('return ' + lyrics[index].time)()[0]
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
        console.log('ok')
        addSleep()
      } else {
        index++
        spanI = 0
        // await sleep(startTime(index))
        addSleep()
        // console.log(startTime(index) - oldTime(index), oldTime(index))
      }
    }

    setTimeout(() => {
      addSleep()
    }, 16650)
  })
}

const sleep = delay => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay)
  })
}

export default createLyric
