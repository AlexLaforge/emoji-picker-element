import { MIN_SEARCH_TEXT_LENGTH } from '../shared/constants'

function extractTokens (annotation) {
  return annotation
    .split(/[\s_]+/)
    .map(word => {
      return word
        .replace(/[)(:,]/g, '')
        .replace(/’/g, "'")
    })
}

export function transformEmojiBaseData (emojiBaseData) {
  return emojiBaseData.map(({ annotation, emoticon, group, order, shortcodes, tags, emoji, version }) => {
    const tokens = [...new Set(
      [
        ...shortcodes.map(extractTokens).flat(),
        ...tags.map(extractTokens).flat(),
        ...extractTokens(annotation),
        emoticon
      ]
        .filter(Boolean)
        .filter(_ => _.length >= MIN_SEARCH_TEXT_LENGTH)
        .map(_ => _.toLowerCase())
    )].sort()
    const res = {
      annotation,
      group,
      order,
      shortcodes,
      tags,
      tokens,
      unicode: emoji,
      version
    }
    if (emoticon) {
      res.emoticon = emoticon
    }
    return res
  })
}
