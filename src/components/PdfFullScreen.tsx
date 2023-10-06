"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Document, Page, pdfjs } from "react-pdf";
import { Expand, Loader2 } from "lucide-react";
import React, { useState } from "react";

import { Button } from "./ui/button";
import SimpleBar from "simplebar-react";
import { useResizeDetector } from "react-resize-detector";
import { useToast } from "./ui/use-toast";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`; //PDF Render worker function
interface PdfFullscreenProps {
  file_url: string;
}

const PdfFullScreen = ({ file_url }: PdfFullscreenProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { width, ref } = useResizeDetector();
  const [numPages, setNumPages] = useState<number>();
  const [currPage, setCurrPage] = useState<number>(1);
  const { toast } = useToast();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button
          variant="ghost"
          className="gap-1.5"
          aria-label="open full-screen"
        >
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
          <div ref={ref}>
            <Document
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
              }}
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast({
                  title: "Error loading pdf",
                  description: "Please try again later",
                  variant: "destructive",
                });
              }}
              file={file_url}
              className="max-h-full"
            >
              {new Array(numPages).fill(0).map((_, i) => (
                <Page key={i} width={width ? width : 1} pageNumber={i + 1} />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullScreen;
