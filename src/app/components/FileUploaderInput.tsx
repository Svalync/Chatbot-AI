import { Button } from "@/components/ui/button";
import {
  FileUploader,
  FileInput,
  FileUploaderContent,
} from "@/components/ui/file-upload";
import { handleMultipleFileUploadAsync } from "@/features/slices/chatbotSlice";

import { AppDispatch } from "@/store";
import { PayloadAction } from "@reduxjs/toolkit";
import { FileInputIcon } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface FileUploaderInputProps {
  callback: any;
}

export interface FileGlobal {
  file?: string;
  filename: string;
  filePath?: string;
  url?: string;
  type?: string;
}

export default function FileUploaderInput(props: FileUploaderInputProps) {
  const [files, setFiles] = useState<File[] | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 50,
    multiple: true,
  };

  async function onFileUpload(files: File[] | null) {
    if (files) {
      await setFiles(files);
      const filesArrayBuffer: FileGlobal[] = await Promise.all(
        files.map(async (file) => {
          const buffer = await file.arrayBuffer();
          const base64String = Buffer.from(buffer).toString("base64");
          return { file: base64String, filename: file.name };
        })
      );
      const response: any = await dispatch(
        handleMultipleFileUploadAsync({ files: filesArrayBuffer })
      );
      props.callback(response.payload.files);
    }
  }

  return (
    <FileUploader
      value={files}
      onValueChange={onFileUpload}
      dropzoneOptions={dropZoneConfig}
      className="relative rounded-sm border border-dashed border-[#908B7D] px-[23px] py-[31px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.3)_-4px_-4px_20px_0px_rgba(0,0,0,0.3)_inset]"
    >
      <FileInput id="fileInput" className="">
        <div className="flex items-center h-full w-full flex-col gap-4">
          <FileInputIcon />
          <p className="text-sm font-normal font-inter">
            Add a source to get started
          </p>
        </div>
      </FileInput>
      <FileUploaderContent>
        {files?.map((item) => (
          <p className="font-inter text-xs text-foreground/65">{item.name}</p>
        ))}
      </FileUploaderContent>
    </FileUploader>
  );
}
