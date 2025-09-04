export const sleep = delay => {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

export const drawLyric = lyric => {
  const body = document.getElementsByTagName('body')[0]
  const ul = document.createElement('ul')
  const fragment = document.createDocumentFragment()

  for (const line of lyric) {
    const li = document.createElement('li')
    for (const word of line.words) {
      const span = document.createElement('span')
      span.innerText = word.text
      li.append(span)
    }
    fragment.append(li)
  }

  ul.append(fragment)
  body.append(ul)
}
