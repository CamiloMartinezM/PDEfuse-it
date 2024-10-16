import AlgorithmSettings from '../components/forms/algorithm-settings'
import FileSettings from '../components/forms/file-settings'
import ImageViewer from '../components/forms/image-viewer'

export default function HomePage() {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 h-full min-h-screen">
      <div className="md:w-1/6">
        <FileSettings />
      </div>
      <div className="md:w-2/3 bg-gray-200 dark:bg-gray-800">
        <ImageViewer />
      </div>
      <div className="md:w-1/6">
        <AlgorithmSettings />
      </div>
    </div>
  )
}
