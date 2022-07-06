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
  var playStatus = false

  drawLyric(lyrics)

  audio.addEventListener('timeupdate', function (e) {
    playStatus = true

    let target = Math.floor(e.target.currentTime)
    const s = document.getElementsByTagName('span')
    const li = document.getElementsByTagName('li')

    function startPlay() {
      lyric.find((item, index) => {
        let end = item.time.indexOf(',')
        let t = Math.floor(item.time.slice(1, end) / 1000)
        let spanI = 0

        if (t == target) {
          function addStyle() {
            if (playStatus) {
              li[index].childNodes[spanI].className = 'currentSpan'
              li[index].childNodes[spanI].style.animationDuration =
                item.time2[spanI] / 1000 + 's'
              spanI++
            }
          }

          async function addSleep() {
            addStyle()
            await sleep(item.time2[spanI])

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
    setTimeout(() => {
      return resolve()
    }, delay)
  })
}

export default createLyric
