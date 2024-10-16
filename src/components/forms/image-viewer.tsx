import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import {
  setProcessedImage,
  setEditedImage,
  setIsPainting,
  setPaintedAreas,
  toggleDrawingMode,
  setComparisonMode,
  setSliderPosition,
  setZoom
} from '../../store/imageSlice'

const ImageViewer: React.FC = () => {
  const dispatch = useDispatch()
  const { selectedImage, selectedClassicCVImage } = useSelector((state: RootState) => state.file)
  const {
    processedImage,
    editedImage,
    isPainting,
    paintedAreas,
    paintSquareSize,
    isDrawingMode,
    comparisonMode,
    sliderPosition,
    zoom
  } = useSelector((state: RootState) => state.image)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (selectedImage || selectedClassicCVImage) {
      loadImageOntoCanvas(selectedImage || selectedClassicCVImage)
    }
  }, [selectedImage, selectedClassicCVImage])

  const loadImageOntoCanvas = (imageSrc: string | null) => {
    if (!imageSrc) return

    const img = new Image()
    img.onload = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0)
        dispatch(setEditedImage(canvas.toDataURL()))
        dispatch(
          setPaintedAreas(
            Array(img.height)
              .fill(null)
              .map(() => Array(img.width).fill(false))
          )
        )
      }
    }
    img.src = imageSrc
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawingMode) {
      dispatch(setIsPainting(true))
      const canvas = canvasRef.current
      if (canvas) {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        paintSquare(x, y)
      }
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPainting && isDrawingMode) {
      const canvas = canvasRef.current
      if (canvas) {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        paintSquare(x, y)
      }
    }
  }

  const handleCanvasMouseUp = () => {
    if (isPainting) {
      dispatch(setIsPainting(false))
      updateEditedImage()
    }
  }

  const paintSquare = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = 'black'
        const startX = Math.max(0, x - paintSquareSize / 2)
        const startY = Math.max(0, y - paintSquareSize / 2)
        const width = Math.min(paintSquareSize, canvas.width - startX)
        const height = Math.min(paintSquareSize, canvas.height - startY)
        ctx.fillRect(startX, startY, width, height)

        dispatch(
          setPaintedAreas(
            paintedAreas.map((row, i) =>
              row.map((cell, j) =>
                i >= Math.floor(startY) &&
                i < Math.floor(startY + height) &&
                j >= Math.floor(startX) &&
                j < Math.floor(startX + width)
                  ? true
                  : cell
              )
            )
          )
        )
      }
    }
  }

  const updateEditedImage = () => {
    if (canvasRef.current) {
      dispatch(setEditedImage(canvasRef.current.toDataURL()))
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (comparisonMode === 'juxtaposed' && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const newSliderPosition = (x / rect.width) * 100
      dispatch(setSliderPosition(newSliderPosition))
    }
  }

  const handleZoomIn = () => dispatch(setZoom(zoom * 1.2))
  const handleZoomOut = () => dispatch(setZoom(zoom / 1.2))
  const handleZoomReset = () => dispatch(setZoom(1))

  return (
    <div className="w-full h-4/5 max-h-4/5 min-h-4/5 flex flex-col items-center justify-center relative p-5 overflow-hidden">
      <div
        className="image-container relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => dispatch(setSliderPosition(50))}
      >
        <div className="image-wrapper" style={{ transform: `scale(${zoom})` }}>
          {(selectedImage || selectedClassicCVImage) && (
            <>
              <canvas
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                className={`${isDrawingMode ? 'cursor-crosshair' : 'cursor-default'} ${isDrawingMode ? 'block' : 'hidden'}`}
              />
              {!isDrawingMode && (
                <>
                  {comparisonMode === 'side-by-side' ? (
                    <div className="flex justify-center gap-4">
                      <img
                        src={editedImage || selectedImage || selectedClassicCVImage || ''}
                        alt="Edited Preview"
                        className="max-w-1/2 h-[300px]"
                      />
                      <img
                        src={
                          processedImage ||
                          editedImage ||
                          selectedImage ||
                          selectedClassicCVImage ||
                          ''
                        }
                        alt="Processed Upload"
                        className="max-w-1/2 h-[300px]"
                      />
                    </div>
                  ) : (
                    <div className="relative flex justify-center max-w-[600px] h-[300px] mx-auto">
                      <img
                        src={editedImage || selectedImage || selectedClassicCVImage || ''}
                        alt="Edited"
                        className="absolute w-full h-full"
                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                      />
                      <img
                        src={
                          processedImage ||
                          editedImage ||
                          selectedImage ||
                          selectedClassicCVImage ||
                          ''
                        }
                        alt="Processed"
                        className="relative w-full h-full"
                        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                      />
                      <div
                        className="slider-bar absolute top-0 w-0.5 bg-white cursor-col-resize h-full"
                        style={{ left: `${sliderPosition}%` }}
                      ></div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2.5">
        <button
          onClick={() => dispatch(setComparisonMode('side-by-side'))}
          className={`px-5 py-2.5 border-none cursor-pointer transition-colors rounded-lg duration-300 ${
            comparisonMode === 'side-by-side'
              ? 'bg-blue-600 text-blue-100'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          Side-by-side comparison
        </button>
        <button
          onClick={() => dispatch(setComparisonMode('juxtaposed'))}
          className={`px-5 py-2.5 border-none cursor-pointer transition-colors rounded-lg duration-300 ${
            comparisonMode === 'juxtaposed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
          }`}
        >
          Juxtaposed-comparison
        </button>
      </div>

      <div className="absolute top-5 right-5 flex gap-2.5">
        <button
          className="zoom-control-button bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleZoomIn}
        >
          +
        </button>
        <button
          className="zoom-control-button bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleZoomOut}
        >
          -
        </button>
        <button
          className="zoom-control-button bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleZoomReset}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default ImageViewer
