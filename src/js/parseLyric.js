const reg = /\[(.+)\]/g
const reg1 = /\((.+?)\)/gi
const reg2 = /[\u4e00-\u9fa5]+/g

function analyzeLyrics(lyric) {
  const lrcArr = []
  const times = []
  const lyrics = lyric.split('\n')
  for (var i = 0; i < lyrics.length; i++) {
    var timeRegExpArr = lyrics[i].match(reg)
    const content = lyrics[i].replace(timeRegExpArr, '')
    const lyric = content.match(reg2)
    const time1 = content.match(reg1)
    if (content) {
      lrcArr.push({
        time: timeRegExpArr[0],
        lyric,
        time1
      })
    }
  }

  let index = 0
  for (var i of lrcArr) {
    let arr = []
    // console.log(i.time1)
    for (var j of i.time1) {
      arr.push(j.slice(3, -1))
      lrcArr[index]['time2'] = arr
      delete lrcArr[index].time1
    }
    index++
  }

  return lrcArr
}

function parseLyric(lyric, type) {
  return analyzeLyrics(lyric)
  console.log(lyrics)
}

export default parseLyric
