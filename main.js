const GRE_VOCABULARY_ENDPOINT = 'dicts/gre-vocabulary.json'
const VIETNAMESE_DICTIONARY_ENDPOINT = 'dicts/anhviet109K.txt'

async function main() {
  const words = await (await fetch(GRE_VOCABULARY_ENDPOINT)).json()
  const dict = await (await fetch(VIETNAMESE_DICTIONARY_ENDPOINT)).text()
  let {
    word,
    definition,
    passage,
    partOfSpeech,
    sourceUrl,
    synonyms
  } = words[Math.floor(Math.random() * words.length)]

  // Some words contain newlines for some reason
  word = word.trim()

  // Remove whitespace and empasize current word
  passage = passage.trim().replace(RegExp(`(${word}[a-z]*)`, 'gi'), '<b>$1</b>')

  let meaning = (dict.match(RegExp(`@${word}[\\s\\S]*?\\n\\n`, 'i')) || [])[0]
  if (meaning) {
    let level = 0
    meaning = meaning.replace(RegExp(`@(${word})`, 'i'), '<span>$1</span>')
    meaning = meaning.replace(/^\*  (.*)|^=(.*?)\+|^[!-]/gm, (match, p1, p2) => {
      if (match[0] === '*') return level = 0, `<strong>[${p1}]</strong>`
      if (match[0] === '!') return level = 1, '- (idiom) '
      if (match[0] === '-') return level ? `&#8193;&bull;` : '-'
      return level ? `&#8193;&#8193;&#9702; ${p2}:` : `&#8193;&bull; ${p2}:`
    })
    meaning = meaning.replace(/\n/g, '<br>')
  }

  document.body.innerHTML = `
    <div class='vocab'>
      <h1 class='vocab-word'>${word}</h1><hr>
      <blockquote class='vocab-passage'>
        &ldquo;${passage}&rdquo;<br>
        <a class='vocab-source' href='${sourceUrl}'>${sourceUrl}</a>
      </blockquote>
      <p class='vocab-definition'>
        <strong>[${partOfSpeech}]:</strong> ${definition}
        ${synonyms ? '<br><strong>Synonym:</strong> ' + synonyms : '' }
      </p>
  ` + (meaning ? `
      <hr><p class='vocab-definition'>${meaning}</p>
    </div>
  ` : '')
}

main()