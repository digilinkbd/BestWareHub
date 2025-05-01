"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { File, FileText, Eye, X } from 'lucide-react'
import Image from 'next/image'

interface DocumentPreviewProps {
    fileUrl: string
    fileName: string
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ fileUrl, fileName }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const isPdf = fileUrl.toLowerCase().endsWith('.pdf')
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2" 
        onClick={() => setIsOpen(true)}
      >
        {isPdf ? <FileText size={16} /> : <File size={16} />}
        <Eye size={16} />
        <span>View</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>{fileName}</DialogTitle>
            <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </Button>
          </DialogHeader>
          
          <div className="relative h-full w-full overflow-hidden rounded-lg">
            {isPdf ? (
              <iframe 
                src={`${fileUrl}#toolbar=0`} 
                className="w-full h-full"
                title={fileName}
              />
            ) : (
              <div className="relative h-full w-full">
                <Image 
                  src={fileUrl} 
                  alt={fileName} 
                  fill 
                  className="object-contain" 
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DocumentPreview