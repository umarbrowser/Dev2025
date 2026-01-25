import { useEffect, useRef, useState } from 'react'
import './App.css'

const IMGFLIP_ENDPOINT = 'https://api.imgflip.com/get_memes'
const DEFAULT_IMAGE = 'http://i.imgflip.com/1bij.jpg'

function loadFavorites() {
  const raw = localStorage.getItem('emg:favorites')
  if (!raw) return []
  const parsed = JSON.parse(raw)
  if (!Array.isArray(parsed)) return []
  return parsed.filter((id) => typeof id === 'string')
}

function saveFavorites(next) {
  localStorage.setItem('emg:favorites', JSON.stringify(next))
}

function App() {
  const [templates, setTemplates] = useState(null)
  const [error, setError] = useState('')

  const [query, setQuery] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useState(() => loadFavorites())

  const [meme, setMeme] = useState({
    templateId: '',
    imageUrl: DEFAULT_IMAGE,
    topText: '',
    bottomText: '',
  })

  const [style, setStyle] = useState({
    fontSize: 46,
    textColor: '#ffffff',
    strokeColor: '#000000',
    strokeWidth: 6,
  })

  const [exporting, setExporting] = useState(false)
  const canvasRef = useRef(null)

  const isLoading = templates === null
  const templatesList = templates || []

  const q = query.trim().toLowerCase()
  const favoritesSet = new Set(favorites)
  const filteredTemplates = templatesList
    .filter((t) => (showFavoritesOnly ? favoritesSet.has(t.id) : true))
    .filter((t) => (!q ? true : (t?.name || '').toLowerCase().includes(q)))

  const activeTemplate = meme.templateId
    ? templatesList.find((t) => t.id === meme.templateId) || null
    : null

  const isFavorited = meme.templateId ? favorites.includes(meme.templateId) : false

  useEffect(() => {
    fetch(IMGFLIP_ENDPOINT)
      .then((res) => res.json())
      .then((data) => {
        const list = data?.data?.memes
        if (!Array.isArray(list)) {
          setError('Could not load templates.')
          setTemplates([])
          return
        }
        setError('')
        setTemplates(list)
        if (list.length) {
          const first = list[0]
          setMeme((prev) => {
            if (prev.templateId) return prev
            return { ...prev, templateId: first.id, imageUrl: first.url }
          })
        }
      })
      .catch(() => {
        setError('Network error while loading templates.')
        setTemplates([])
      })
  }, [])

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  function updateMemeField(e) {
    const { name, value } = e.target
    setMeme((prev) => ({ ...prev, [name]: value }))
  }

  function updateStyleField(e) {
    const { name, value } = e.target
    setStyle((prev) => ({
      ...prev,
      [name]: name === 'fontSize' || name === 'strokeWidth' ? Number(value) : value,
    }))
  }

  function pickTemplate(id) {
    const t = templatesList.find((x) => x.id === id)
    if (!t) return
    setMeme((prev) => ({ ...prev, templateId: t.id, imageUrl: t.url }))
  }

  function randomizeTemplate() {
    if (!templatesList.length) return
    const idx = Math.floor(Math.random() * templatesList.length)
    const t = templatesList[idx]
    setMeme((prev) => ({ ...prev, templateId: t.id, imageUrl: t.url }))
  }

  function toggleFavorite() {
    if (!meme.templateId) return
    setFavorites((prev) => {
      if (prev.includes(meme.templateId)) return prev.filter((id) => id !== meme.templateId)
      return [meme.templateId, ...prev]
    })
  }

  function wrapText(ctx, text, maxWidth) {
    const words = String(text || '').split(/\s+/).filter(Boolean)
    if (!words.length) return []
    const lines = []
    let line = words[0]
    for (let i = 1; i < words.length; i++) {
      const test = `${line} ${words[i]}`
      if (ctx.measureText(test).width <= maxWidth) {
        line = test
      } else {
        lines.push(line)
        line = words[i]
      }
    }
    lines.push(line)
    return lines
  }

  function drawCaption(ctx, { text, x, y, maxWidth, lineHeight, align, baseline }) {
    if (!text?.trim()) return
    ctx.textAlign = align
    ctx.textBaseline = baseline

    const lines = wrapText(ctx, text, maxWidth)
    const startY = baseline === 'top' ? y : y - lineHeight * (lines.length - 1)

    for (let i = 0; i < lines.length; i++) {
      const ly = startY + i * lineHeight
      ctx.strokeText(lines[i], x, ly)
      ctx.fillText(lines[i], x, ly)
    }
  }

  function exportPng() {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!meme.imageUrl) return

    setExporting(true)
    setError('')

    fetch(meme.imageUrl)
      .then((r) => r.blob())
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob)
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          const ctx = canvas.getContext('2d')
          const w = img.naturalWidth || 800
          const h = img.naturalHeight || 800
          canvas.width = w
          canvas.height = h

          ctx.clearRect(0, 0, w, h)
          ctx.drawImage(img, 0, 0, w, h)

          const pad = Math.max(20, Math.floor(w * 0.04))
          const lineHeight = Math.round(style.fontSize * 1.12)

          ctx.font = `900 ${style.fontSize}px Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif`
          ctx.fillStyle = style.textColor
          ctx.lineWidth = style.strokeWidth
          ctx.strokeStyle = style.strokeColor
          ctx.lineJoin = 'round'

          drawCaption(ctx, {
            text: meme.topText,
            x: w / 2,
            y: pad,
            maxWidth: w - pad * 2,
            lineHeight,
            align: 'center',
            baseline: 'top',
          })

          drawCaption(ctx, {
            text: meme.bottomText,
            x: w / 2,
            y: h - pad,
            maxWidth: w - pad * 2,
            lineHeight,
            align: 'center',
            baseline: 'bottom',
          })

          URL.revokeObjectURL(objectUrl)

          const link = document.createElement('a')
          link.download = `meme-${meme.templateId || 'export'}.png`
          link.href = canvas.toDataURL('image/png')
          link.click()
          setExporting(false)
        }
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl)
          setExporting(false)
          setError('Could not render this image for download.')
        }
        img.src = objectUrl
      })
      .catch(() => {
        setExporting(false)
        setError('Could not download the image for export.')
      })
  }

  return (
    <div className="page">
      <header className="header">
        <div className="brand">
          <div className="brandTitle">Esther Meme Generator</div>
          <div className="brandSubtitle">Pick a template. Type text. Download.</div>
        </div>
        <div className="headerActions">
          <button className="btn" onClick={randomizeTemplate} disabled={!templatesList.length}>
            Random
          </button>
          <button className="btn" onClick={toggleFavorite} disabled={!meme.templateId}>
            {isFavorited ? 'Unfavorite' : 'Favorite'}
          </button>
          <button className="btnPrimary" onClick={exportPng} disabled={!meme.imageUrl || exporting}>
            {exporting ? 'Preparing…' : 'Download PNG'}
          </button>
        </div>
      </header>

      <main className="layout">
        <section className="panel">
          <div className="panelHeader">
            <div className="panelTitle">Editor</div>
            <div className="panelMeta">
              {activeTemplate ? activeTemplate.name : isLoading ? 'Loading…' : 'No template'}
            </div>
          </div>

          {error ? <div className="banner">{error}</div> : null}

          <div className="formGrid">
            <label className="field">
              <div className="fieldLabel">Top text</div>
              <input
                className="input"
                type="text"
                name="topText"
                value={meme.topText}
                onChange={updateMemeField}
                placeholder="Type something dramatic"
              />
            </label>

            <label className="field">
              <div className="fieldLabel">Bottom text</div>
              <input
                className="input"
                type="text"
                name="bottomText"
                value={meme.bottomText}
                onChange={updateMemeField}
                placeholder="And the punchline"
              />
            </label>

            <label className="field">
              <div className="fieldLabel">Font size</div>
              <input
                className="range"
                type="range"
                min="26"
                max="84"
                step="1"
                name="fontSize"
                value={style.fontSize}
                onChange={updateStyleField}
              />
              <div className="rangeMeta">{style.fontSize}px</div>
            </label>

            <label className="field">
              <div className="fieldLabel">Text color</div>
              <input
                className="color"
                type="color"
                name="textColor"
                value={style.textColor}
                onChange={updateStyleField}
              />
            </label>

            <label className="field">
              <div className="fieldLabel">Outline</div>
              <input
                className="range"
                type="range"
                min="0"
                max="14"
                step="1"
                name="strokeWidth"
                value={style.strokeWidth}
                onChange={updateStyleField}
              />
              <div className="rangeMeta">{style.strokeWidth}px</div>
            </label>

            <label className="field">
              <div className="fieldLabel">Outline color</div>
              <input
                className="color"
                type="color"
                name="strokeColor"
                value={style.strokeColor}
                onChange={updateStyleField}
              />
            </label>
          </div>

          <div className="preview">
            <div className="previewFrame">
              <img className="previewImg" src={meme.imageUrl} alt="Selected meme" />
              <div
                className="caption captionTop"
                style={{
                  fontSize: `${style.fontSize}px`,
                  color: style.textColor,
                  WebkitTextStroke: `${style.strokeWidth}px ${style.strokeColor}`,
                }}
              >
                {meme.topText}
              </div>
              <div
                className="caption captionBottom"
                style={{
                  fontSize: `${style.fontSize}px`,
                  color: style.textColor,
                  WebkitTextStroke: `${style.strokeWidth}px ${style.strokeColor}`,
                }}
              >
                {meme.bottomText}
              </div>
            </div>
            <canvas ref={canvasRef} className="hiddenCanvas" />
          </div>
        </section>

        <aside className="panel panelSide">
          <div className="panelHeader">
            <div className="panelTitle">Templates</div>
            <div className="panelMeta">{filteredTemplates.length}</div>
          </div>

          <div className="templateControls">
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates"
              aria-label="Search templates"
            />
            <label className="check">
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              />
              Favorites only
            </label>
          </div>

          <div className="templateList" role="list">
            {filteredTemplates.map((t) => {
              const active = t.id === meme.templateId
              const fav = favorites.includes(t.id)
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`templateItem ${active ? 'active' : ''}`}
                  onClick={() => pickTemplate(t.id)}
                >
                  <img className="templateThumb" src={t.url} alt={t.name} loading="lazy" />
                  <div className="templateInfo">
                    <div className="templateName">{t.name}</div>
                    <div className="templateMeta">{fav ? 'Favorited' : `Boxes: ${t.box_count}`}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
