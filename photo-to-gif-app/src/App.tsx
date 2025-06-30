import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import GIF from 'gif.js'
import './App.css'

interface ImageFile {
  file: File
  url: string
  id: string
}

function App() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [gifUrl, setGifUrl] = useState<string | null>(null)
  const [delay, setDelay] = useState(500)
  const [quality, setQuality] = useState(10)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/')
    )

    const newImages: ImageFile[] = imageFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }))

    setImages(prev => [...prev, ...newImages])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: true
  })

  const removeImage = (id: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url)
      }
      return prev.filter(img => img.id !== id)
    })
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    setImages(prev => {
      const newImages = [...prev]
      const [movedImage] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, movedImage)
      return newImages
    })
  }

  const generateGif = async () => {
    if (images.length === 0) return

    setIsGenerating(true)
    
    try {
      const gif = new GIF({
        workers: 2,
        quality: quality,
        width: 480,
        height: 360,
        workerScript: './gif.worker.js'
      })

      for (const imageFile of images) {
        const img = new Image()
        img.src = imageFile.url
        
        await new Promise<void>((resolve) => {
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = 480
            canvas.height = 360
            const ctx = canvas.getContext('2d')!
            
            // アスペクト比を維持しながらリサイズ
            const aspectRatio = img.width / img.height
            let drawWidth = 480
            let drawHeight = 360
            
            if (aspectRatio > 480 / 360) {
              drawHeight = 480 / aspectRatio
            } else {
              drawWidth = 360 * aspectRatio
            }
            
            const offsetX = (480 - drawWidth) / 2
            const offsetY = (360 - drawHeight) / 2
            
            // 背景を白で塗りつぶし
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, 480, 360)
            
            // 画像を描画
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
            
            gif.addFrame(canvas, { delay: delay })
            resolve()
          }
        })
      }

      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob)
        setGifUrl(url)
        setIsGenerating(false)
      })

      gif.render()
    } catch (error) {
      console.error('GIF生成エラー:', error)
      setIsGenerating(false)
    }
  }

  const downloadGif = () => {
    if (!gifUrl) return
    
    const a = document.createElement('a')
    a.href = gifUrl
    a.download = 'photo-to-gif.gif'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.url))
    setImages([])
    if (gifUrl) {
      URL.revokeObjectURL(gifUrl)
      setGifUrl(null)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📸 Photo to GIF</h1>
        <p>複数の画像を選んでGIFアニメーションを作成しましょう</p>
        <div className="security-badge">
          <span className="security-icon">🔒</span>
          <span className="security-text">100%セキュア - 画像は外部に送信されません</span>
        </div>
      </header>

      <div className="upload-section">
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <div className="upload-icon">📁</div>
            {isDragActive ? (
              <p>ここにファイルをドロップしてください</p>
            ) : (
              <div>
                <p>画像ファイルをここにドラッグ&ドロップ</p>
                <p>または<span className="click-text">クリックしてファイルを選択</span></p>
                <small>PNG, JPG, JPEG, GIF, BMP, WebP対応</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="images-section">
          <div className="section-header">
            <h2>選択された画像 ({images.length}枚)</h2>
            <button onClick={clearAll} className="clear-button">
              すべてクリア
            </button>
          </div>
          
          <div className="images-grid">
            {images.map((image, index) => (
              <div key={image.id} className="image-item">
                <img src={image.url} alt={`Image ${index + 1}`} />
                <div className="image-controls">
                  <button 
                    onClick={() => moveImage(index, Math.max(0, index - 1))}
                    disabled={index === 0}
                    className="move-button"
                  >
                    ←
                  </button>
                  <span className="image-number">{index + 1}</span>
                  <button 
                    onClick={() => moveImage(index, Math.min(images.length - 1, index + 1))}
                    disabled={index === images.length - 1}
                    className="move-button"
                  >
                    →
                  </button>
                  <button 
                    onClick={() => removeImage(image.id)}
                    className="remove-button"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="settings-section">
          <h2>GIF設定</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label htmlFor="delay">フレーム間隔 (ms)</label>
              <input
                type="range"
                id="delay"
                min="100"
                max="2000"
                step="100"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
              />
              <span>{delay}ms</span>
            </div>
            
            <div className="setting-item">
              <label htmlFor="quality">品質 (1-20)</label>
              <input
                type="range"
                id="quality"
                min="1"
                max="20"
                step="1"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
              />
              <span>{quality}</span>
            </div>
          </div>
          
          <button 
            onClick={generateGif}
            disabled={isGenerating}
            className="generate-button"
          >
            {isGenerating ? '生成中...' : 'GIFを生成'}
          </button>
        </div>
      )}

      {gifUrl && (
        <div className="result-section">
          <h2>生成されたGIF</h2>
          <div className="gif-preview">
            <img src={gifUrl} alt="Generated GIF" />
          </div>
          <button onClick={downloadGif} className="download-button">
            GIFをダウンロード
          </button>
        </div>
      )}

      <footer className="app-footer">
        <div className="security-info">
          <h3>🔒 プライバシーとセキュリティ</h3>
          <div className="security-features">
            <div className="security-item">
              <span className="check-icon">✅</span>
              <span>画像は外部サーバーに送信されません</span>
            </div>
            <div className="security-item">
              <span className="check-icon">✅</span>
              <span>すべての処理がブラウザ内で完結</span>
            </div>
            <div className="security-item">
              <span className="check-icon">✅</span>
              <span>個人情報の収集なし</span>
            </div>
            <div className="security-item">
              <span className="check-icon">✅</span>
              <span>企業環境での使用に適している</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
