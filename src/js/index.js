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

  let start = false

  // 粒度间隔最大300毫秒

  let timer = null
  audio.addEventListener('play', () => {
    timer = setInterval(() => {
      let target = audio.currentTime
      console.log(target)
    }, 50)
  })
  audio.addEventListener('pause', () => {
    clearInterval(timer)
  })

  // audio.addEventListener('timeupdate', function (e) {
  //   console.log(e.target.currentTime)
  //   playStatus = true

  //   let target = Math.floor(e.target.currentTime * 1000000)
  //   const s = document.getElementsByTagName('span')
  //   const li = document.getElementsByTagName('li')

  //   function startPlay() {
  //     start = true
  //     lyrics.find((item, index) => {
  //       let end = item.time.indexOf(',')
  //       let t = Math.floor(item.time.slice(1, end) * 1000)
  //       let spanI = 0

  //       let t1 = target - t > 3000 && target - t < 200000 //完
  //       let t2 = t - target > 3000 && t - target < 200000 //早
  //       let res1 = target - t
  //       let res2 = t - target
  //       function addStyle() {
  //         if (playStatus) {
  //           if (t1 || t2) {
  //             li[index].childNodes[spanI].className = 'currentSpan'
  //             let time = null
  //             if (spanI === item.time2.length - 1) {
  //               if (item.time2[spanI] / 1000 > 1) {
  //                 time = 1
  //               } else {
  //                 time = item.time2[spanI] / 1000
  //               }
  //             } else {
  //               time = item.time2[spanI] / 1000
  //             }

  //             if (t1) {
  //               li[index].childNodes[spanI].style.animationDuration =
  //                 time - res1 / 1000000 + 's'
  //             } else {
  //               li[index].childNodes[spanI].style.animationDuration =
  //                 time + res2 / 1000000 + 's'
  //             }
  //             spanI++
  //           } else {
  //             start = false
  //           }
  //         }
  //       }

  //       async function addSleep() {
  //         addStyle()
  //         if (spanI !== item.time2.length - 1) {
  //           if (t1) {
  //             await sleep(item.time2[spanI] - res1 / 100000)
  //           } else {
  //             await sleep(item.time2[spanI] + res2 / 100000)
  //           }
  //         }

  //         if (spanI < item.time2.length) {
  //           addSleep()
  //         } else {
  //           start = false
  //           startPlay()
  //         }
  //       }
  //       addSleep()
  //     })
  //   }
  //   if (!start) {
  //     startPlay()
  //   }
  // })

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
