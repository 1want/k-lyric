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
  // console.log(lyrics)
  var playStatus = false

  drawLyric(lyrics)

  // 粒度间隔最大300毫秒

  let timer = null
  audio.addEventListener('play', () => {
    const li = document.getElementsByTagName('li')

    timer = setInterval(() => {
      let target = Math.floor(audio.currentTime * 1000)

      // 每次查找到新的index，通过li[index]确定需要渲染哪一行，li是获取的所有li
      lyrics.find((item, index) => {
        let end = item.time.indexOf(',')
        let t = Math.floor(item.time.slice(1, end))
        let spanI = 0

        let t1 = target - t > 30 && target - t < 200 //完
        let t2 = t - target > 30 && t - target < 200 //早
        let res1 = target - t
        let res2 = t - target
        function addStyle() {
          if (t1 || t2) {
            li[index].childNodes[spanI].className = 'currentSpan'
            let time = null
            if (spanI === item.time2.length - 1) {
              if (item.time2[spanI] > 1) {
                time = 1
              } else {
                time = item.time2[spanI] / 1000
              }
            } else {
              time = item.time2[spanI] / 1000
            }

            if (t1) {
              li[index].childNodes[spanI].style.animationDuration =
                time - res1 / 1000 + 's'
            } else {
              li[index].childNodes[spanI].style.animationDuration =
                time + res2 / 1000 + 's'
            }
            spanI++
          }
        }

        async function addSleep() {
          if (t1 || t2) {
            addStyle()
            if (spanI !== item.time2.length - 1) {
              if (t1) {
                await sleep(item.time2[spanI] - res1 / 1000)
              }
              if (t2) {
                await sleep(item.time2[spanI] + res2 / 1000)
              }
            }

            if (spanI < item.time2.length) {
              addSleep()
            }
          }
        }
        addSleep()
      })
    }, 30)
  })
  audio.addEventListener('pause', () => {
    clearInterval(timer)
  })

  const play = () => {
    playStatus = true
    audio.play()
  }
  const pause = () => {
    playStatus = false
  }
  return {
    play,
    pause
  }
}

const sleep = delay => {
  // console.log(delay)
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay)
  })
}

export default createLyric
