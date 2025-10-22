// File Upload Component for Wheeler Knight Portfolio
import React, { useState, useRef } from 'react';
import {
  Button,
  Group,
  Text,
  Paper,
  Stack,
  Progress,
  Alert,
  Image,
  ActionIcon,
  FileInput,
  Box,
  Center,
  Loader,
} from '@mantine/core';
import {
  IconUpload,
  IconX,
  IconPhoto,
  IconFile,
  IconCheck,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useUploadImage, useUploadDocument, validateFile, formatFileSize, getFileCategory } from '../../hooks/useFileUpload';
import { notifications } from '@mantine/notifications';

interface FileUploadProps {
  type: 'image' | 'document';
  onUploadSuccess?: (fileUrl: string, filename: string) => void;
  onUploadError?: (error: string) => void;
  maxSize?: number;
  accept?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  type,
  onUploadSuccess,
  onUploadError,
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept,
  label,
  description,
  disabled = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = useUploadImage();
  const uploadDocument = useUploadDocument();

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file
    const validationError = validateFile(file, maxSize);
    if (validationError) {
      notifications.show({
        title: 'Invalid File',
        message: validationError,
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
      onUploadError?.(validationError);
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (type === 'image' && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      let result;
      if (type === 'image') {
        result = await uploadImage.mutateAsync(selectedFile);
      } else {
        result = await uploadDocument.mutateAsync(selectedFile);
      }

      notifications.show({
        title: 'Upload Successful',
        message: `${selectedFile.name} uploaded successfully`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });

      onUploadSuccess?.(result.file_url, result.filename);
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || 'Upload failed';
      notifications.show({
        title: 'Upload Failed',
        message: errorMessage,
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
      onUploadError?.(errorMessage);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const isLoading = uploadImage.isPending || uploadDocument.isPending;

  return (
    <Paper p="md" withBorder>
      <Stack gap="md">
        {label && (
          <Text fw={500} size="sm">
            {label}
          </Text>
        )}
        
        {description && (
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        )}

        {/* File Input */}
        <FileInput
          ref={fileInputRef}
          placeholder={`Choose ${type} file or drag and drop`}
          accept={accept || (type === 'image' ? 'image/*' : '.pdf,.doc,.docx')}
          onChange={handleFileSelect}
          disabled={disabled || isLoading}
          size="md"
        />

        {/* Drag and Drop Area */}
        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-gray-4)'}`,
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: dragActive ? 'var(--mantine-color-blue-0)' : 'transparent',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
          }}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <Stack gap="sm" align="center">
            {type === 'image' ? (
              <IconPhoto size={48} color="var(--mantine-color-gray-6)" />
            ) : (
              <IconFile size={48} color="var(--mantine-color-gray-6)" />
            )}
            <Text size="sm" c="dimmed">
              Drag and drop your {type} here, or click to select
            </Text>
            <Text size="xs" c="dimmed">
              Max size: {formatFileSize(maxSize)}
            </Text>
          </Stack>
        </Box>

        {/* File Preview */}
        {selectedFile && (
          <Paper p="md" withBorder>
            <Stack gap="md">
              <Group justify="space-between">
                <Group gap="sm">
                  {type === 'image' && previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={60}
                      height={60}
                      radius="sm"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box
                      style={{
                        width: 60,
                        height: 60,
                        backgroundColor: 'var(--mantine-color-gray-1)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {type === 'image' ? (
                        <IconPhoto size={24} color="var(--mantine-color-gray-6)" />
                      ) : (
                        <IconFile size={24} color="var(--mantine-color-gray-6)" />
                      )}
                    </Box>
                  )}
                  <Stack gap={2}>
                    <Text size="sm" fw={500}>
                      {selectedFile.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {formatFileSize(selectedFile.size)} • {getFileCategory(selectedFile.name)}
                    </Text>
                  </Stack>
                </Group>
                <ActionIcon
                  color="red"
                  variant="light"
                  onClick={() => handleFileSelect(null)}
                  disabled={isLoading}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Group>

              {/* Upload Progress */}
              {isLoading && (
                <Stack gap="sm">
                  <Progress value={100} animated />
                  <Text size="xs" c="dimmed" ta="center">
                    Uploading...
                  </Text>
                </Stack>
              )}

              {/* Upload Button */}
              {!isLoading && (
                <Button
                  onClick={handleUpload}
                  leftSection={<IconUpload size={16} />}
                  disabled={disabled}
                  fullWidth
                >
                  Upload {type === 'image' ? 'Image' : 'Document'}
                </Button>
              )}
            </Stack>
          </Paper>
        )}

        {/* Error Display */}
        {(uploadImage.error || uploadDocument.error) && (
          <Alert color="red" icon={<IconAlertCircle size={16} />}>
            <Text size="sm">
              {uploadImage.error?.message || uploadDocument.error?.message}
            </Text>
          </Alert>
        )}
      </Stack>
    </Paper>
  );
};

export default FileUpload;
