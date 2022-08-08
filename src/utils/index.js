export const sleep = delay => {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

export const drawLyric = lyric => {
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
