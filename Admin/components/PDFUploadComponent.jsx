
import React from 'react'
import { BasePropertyProps } from 'adminjs'
import { Label, Box, DropZone } from '@adminjs/design-system'

const PDFUploadComponent = (props) => {
  const { onChange, property, record } = props
  const uploadedFile = record.params?.[property.name]

  const handleUpload = async (files) => {
    const formData = new FormData()
    formData.append('pdf', files[0]) // très important

    try {
      const response = await fetch('http://localhost:3033/admin/upload/pdf', {  // URL complète et correcte
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.filename) {
        console.log('PDF upload success:', data.filename)
        onChange(property.name, data.filename) // très important : on met à jour le champ avec le nom du fichier
      } else {
        console.error('PDF upload failed:', data)
      }
    } catch (error) {
      console.error('Upload error:', error)
    }
  }

  return (
    <Box>
      <Label>{property.label}</Label>
      <DropZone
        onChange={(files) => handleUpload(files)}
        accept=".pdf"
      />
      {uploadedFile && (
        <p style={{ marginTop: '10px' }}>
          Fichier actuel : <strong>{uploadedFile}</strong>
        </p>
      )}
    </Box>
  )
}

export default PDFUploadComponent
