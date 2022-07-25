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

  audio.addEventListener('timeupdate', function (e) {
    playStatus = true

    let target = Math.floor(e.target.currentTime * 100000)
    const s = document.getElementsByTagName('span')
    const li = document.getElementsByTagName('li')

    function startPlay() {
      lyrics.find((item, index) => {
        let end = item.time.indexOf(',')
        let t = Math.floor(item.time.slice(1, end) * 100)
        // console.log(target, t)
        let spanI = 0

        let t1 = target - t > 500 && target - t < 25000 //完
        let t2 = t - target > 500 && t - target < 25000 //早
        let res1 = target - t
        let res2 = t - target
        if (t1 || t2) {
          function addStyle() {
            if (playStatus) {
              li[index].childNodes[spanI].className = 'currentSpan'
              let time = null
              if (spanI === item.time2.length - 1) {
                if (item.time2[spanI + 1] / 1000 > 1) {
                  time = 1
                } else {
                  time = item.time2[spanI] / 1000
                }
              } else {
                time = item.time2[spanI] / 1000
              }

              if (t1) {
                li[index].childNodes[spanI].style.animationDuration =
                  time - res1 / 100000 + 's'
              } else {
                li[index].childNodes[spanI].style.animationDuration =
                  time + res2 / 100000 + 's'
              }
              spanI++
            }
          }

          async function addSleep() {
            addStyle()
            if (t1) {
              await sleep(item.time2[spanI] - res1 / 100000)
            } else {
              await sleep(item.time2[spanI] + res2 / 100000)
            }

            if (spanI < item.time2.length) {
              addSleep()
            } else {
              startPlay()
            }
          }
          addSleep()
        }
      })
    }
    startPlay()
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
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay)
  })
}

export default createLyric
