import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBaseName } from '../../core/utils/hashing'
import { RootState } from '../../store'
import {
  addUploadedImage,
  deleteImage,
  setSelectedClassicCVImage,
  setSelectedImage
} from '../../store/fileSlice'
import { setEditedImage, setProcessedImage } from '../../store/imageSlice'
import loadImageOntoCanvas from './image-viewer'

const FileSettings: React.FC = () => {
  const dispatch = useDispatch()
  const { uploadedImages, selectedImage, selectedClassicCVImage } = useSelector(
    (state: RootState) => state.file
  )

  // Import this from your existing code
  const imagesContext = (require as any).context('../../../public/test_images', false, /\.png$/)
  const availableImages = imagesContext.keys().map(imagesContext)

  const handleImageSelection = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedFilename = e.target.value
      dispatch(setSelectedImage(selectedFilename))
      dispatch(setSelectedClassicCVImage(selectedFilename))
      dispatch(setProcessedImage(null))

      // Load the selected image onto the canvas
      // You'll need to implement this function or move it to a utility file
      loadImageOntoCanvas(selectedFilename)
    },
    [dispatch]
  )

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files)
        files.forEach((file) => {
          const reader = new FileReader()
          reader.onload = (event) => {
            if (event.target) {
              const newImage = {
                name: file.name,
                dataUrl: event.target.result as string
              }
              dispatch(addUploadedImage(newImage))

              if (!selectedImage) {
                dispatch(setSelectedImage(newImage.dataUrl))
                dispatch(setProcessedImage(null))
                dispatch(setSelectedClassicCVImage(null))
              }
            }
          }
          reader.readAsDataURL(file)
        })

        e.target.value = ''
      }
    },
    [dispatch, selectedImage]
  )

  const handleDeleteImage = useCallback(() => {
    if (selectedImage) {
      dispatch(deleteImage(selectedImage))
      dispatch(setProcessedImage(null))
      dispatch(setSelectedImage(null))
      dispatch(setEditedImage(null))
    }
  }, [dispatch, selectedImage])

  return (
    <div className="max-h-full pr-5 overflow-y-hidden shadow-md rounded-lg dark:bg-white dark:text-black bg-white p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">File Settings</h2>
      <div className="image-selector">
        <label htmlFor="image-selection">Use a classic Computer Vision test image:</label>
        <select
          id="image-selection"
          onChange={handleImageSelection}
          value={selectedClassicCVImage || ''}
        >
          <option value="">Select an image</option>
          {availableImages.map((filename: string, index: number) => (
            <option key={index} value={filename}>
              {getBaseName(filename, 'static\\/media\\/(.+?)\\.[a-f0-9]+\\.\\w+')}
            </option>
          ))}
        </select>
      </div>

      <div className="empty-space"></div>
      <label htmlFor="image-selection">Or upload your own:</label>

      <div className="h-24 border border-gray-300 mb-5 overflow-y-auto p-2.5 rounded-md">
        {uploadedImages.map((img, index) => (
          <div
            key={index}
            onClick={() => {
              dispatch(setSelectedImage(img.dataUrl))
              dispatch(setProcessedImage(null))
              dispatch(setSelectedClassicCVImage(null))
            }}
            style={{ cursor: 'pointer' }}
          >
            {img.name}
          </div>
        ))}
      </div>

      <div className="button-group">
        <input
          type="file"
          id="file-upload"
          accept="image/*"
          onChange={handleImageChange}
          multiple
        />
        <button onClick={handleDeleteImage}>Delete Image</button>
      </div>
    </div>
  )
}

export default FileSettings
