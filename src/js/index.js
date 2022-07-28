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
  console.log(lyrics)
  var playStatus = false

  drawLyric(lyrics)

  // 粒度间隔最大300毫秒
  let timer = null

  function fn() {
    const li = document.getElementsByTagName('li')

    timer = setInterval(() => {
      let target = Math.floor(audio.currentTime * 10000)

      // 每次查找到新的index，通过li[index]确定需要渲染哪一行，li是获取的所有li
      lyrics.find((item, index) => {
        let end = item.time.indexOf(',')
        let t = Math.floor(item.time.slice(1, end) * 10)
        let spanI = 0

        let t1 = target - t > 500 && target - t < 1000 //完
        let t2 = t - target > 500 && t - target < 1000 //早
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
                time = item.time2[spanI] / 10000
              }
            } else {
              time = item.time2[spanI] / 1000 - 90 / 1000
            }

            if (t1) {
              li[index].childNodes[spanI].style.animationDuration =
                time - res1 / 10000 + 's'
            }
            if (t2) {
              li[index].childNodes[spanI].style.animationDuration =
                time + res2 / 10000 + 's'
            }

            console.log(li[index].childNodes[spanI].style.animationDuration)

            spanI++
          }
        }

        async function addSleep() {
          if (t1 || t2) {
            addStyle()
            clearInterval(timer)
            if (spanI !== item.time2.length - 1) {
              if (t1) {
                console.log(item.time2[spanI] - res1 / 10000)
                await sleep(item.time2[spanI] - res1 / 10000)
              }
              if (t2) {
                console.log(item.time2[spanI] - res1 / 10000, spanI)

                await sleep(item.time2[spanI] + res2 / 10000)
              }
            }

            if (spanI < item.time2.length) {
              addSleep()
            } else {
              // fn()
            }
          }
        }
        addSleep()
      })
    }, 20)
  }
  audio.addEventListener('play', () => {
    fn()
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
