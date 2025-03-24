
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { FileText, Upload, X } from 'lucide-react';

interface FileUploadProps {
  onChange: (files: File[]) => void;
  value?: Array<{ name: string; url: string; type: string }>;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onChange,
  value = [],
  multiple = false,
  accept = '*',
  maxSize = 10,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate file size
    const oversizedFiles = selectedFiles.filter(
      file => file.size > maxSize * 1024 * 1024
    );
    
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the maximum size of ${maxSize}MB`);
      return;
    }
    
    setError(null);
    setUploadedFiles(selectedFiles);
    onChange(selectedFiles);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    // Validate file size
    const oversizedFiles = droppedFiles.filter(
      file => file.size > maxSize * 1024 * 1024
    );
    
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the maximum size of ${maxSize}MB`);
      return;
    }
    
    setError(null);
    setUploadedFiles(droppedFiles);
    onChange(droppedFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    onChange(newFiles);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-300',
          'hover:border-primary hover:bg-primary/5',
          'flex flex-col items-center justify-center text-center'
        )}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm font-medium">
          Drag and drop files here, or click to select files
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Maximum file size: {maxSize}MB
        </p>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple={multiple}
          accept={accept}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Display uploaded files */}
      {uploadedFiles.length > 0 && (
        <ul className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md border"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm truncate max-w-[200px]">
                  {file.name}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Display existing files */}
      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md border"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-500 mr-2" />
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline truncate max-w-[200px]"
                >
                  {file.name}
                </a>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle removal of existing files
                }}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUpload;
