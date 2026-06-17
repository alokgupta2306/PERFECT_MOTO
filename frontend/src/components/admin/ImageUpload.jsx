import React, { useState } from "react";
import { UploadCloud, Image, X, CheckCircle } from "lucide-react";

const ImageUpload = ({ onUploadComplete, initialUrl = "" }) => {
  const [previewUrl, setPreviewUrl] = useState(initialUrl);
  const [isDragging, setIsDragging] = useState(false);

  const mockUploadSequence = (e) => {
    e.preventDefault();
    // Simulation pipeline transforming client streams to global server CDN URLs
    const dummyCdnLink = "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80";
    setPreviewUrl(dummyCdnLink);
    if (onUploadComplete) onUploadComplete(dummyCdnLink);
  };

  return (
    <div className="space-y-2 w-full">
      <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray">
        Catalogue Core Graphic Vector Target
      </label>

      {previewUrl ? (
        <div className="relative border border-border-dark bg-deep-black rounded-xl p-3 flex items-center gap-4 group animate-fade-in">
          <img src={previewUrl} alt="Payload preview" className="w-16 h-16 rounded-lg object-cover border border-border-dark" />
          <div className="text-[11px] leading-tight flex-1">
            <span className="text-success-green font-heading font-bold uppercase tracking-wide flex items-center gap-1">
              <CheckCircle size={12} /> Image Matrix Uploaded
            </span>
            <p className="text-muted-gray mt-1 truncate max-w-xs font-mono text-[10px]">{previewUrl}</p>
          </div>
          <button
            onClick={() => {
              setPreviewUrl("");
              if (onUploadComplete) onUploadComplete("");
            }}
            className="text-muted-gray hover:text-error-red p-1.5 transition-colors bg-card-dark rounded-md border border-border-dark"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={mockUploadSequence}
          onClick={mockUploadSequence}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging ? "border-primary-gold bg-primary-gold/5" : "border-border-dark hover:border-muted-gray bg-deep-black/20"
          }`}
        >
          <UploadCloud size={28} className="text-muted-gray mx-auto mb-2 group-hover:scale-105 transition-transform" />
          <h4 className="font-heading font-bold uppercase text-[11px] text-pure-white tracking-wide">
            Upload Hardware Representation
          </h4>
          <p className="text-[10px] text-muted-gray mt-0.5">Drag drop or click to simulate remote asset pairing pipeline.</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;