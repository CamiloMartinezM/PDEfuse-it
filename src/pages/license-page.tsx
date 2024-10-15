import React from 'react'

const LicensePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">License</h1>
      <p>
        This is a simple license page. Released under the{' '}
        <a href="https://opensource.org/license/MIT" target="_blank" rel="noopener noreferrer">
          MIT License
        </a>
        .
      </p>
    </div>
  )
}

export default LicensePage
