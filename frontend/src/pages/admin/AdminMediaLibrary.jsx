import React, { useState } from "react";
import { Image, Upload, FileImage, Link2, Copy, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import api from "../../utils/api";

const AdminMediaLibrary = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMessage("");
      setUploadedUrl("");
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage("");
    const dataFormPayload = new FormData();
    dataFormPayload.append("image", selectedFile);

    try {
      const res = await api.post("/uploads", dataFormPayload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUploadedUrl(res.data?.url || res.data?.secure_url);
      setSelectedFile(null);
    } catch (err) {
      setErrorMessage("Asset stream upload boundary breakdown. Verify file size restrictions (<5MB).");
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboardUrl = () => {
    if (!uploadedUrl) return;
    navigator.clipboard.writeText(uploadedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in font-body text-xs text-muted-gray select-none">
      <div className="border-b border-border-dark pb-4">
        <h1 className="text-2xl font-heading font-bold text-pure-white uppercase tracking-wide">
          Media Asset <span className="text-primary-gold">Library</span>
        </h1>
        <p className="text-xs text-muted-gray mt-1">Upload component assets to generate absolute content distribution network (CDN) links.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Upload Form Slot */}
        <div className="bg-card-dark border border-border-dark rounded-xl p-5 shadow-md md:col-span-1">
          <h3 className="font-heading font-bold uppercase tracking-wider text-xs text-pure-white border-b border-border-dark pb-3 mb-4 flex items-center gap-2">
            <Upload size={14} className="text-primary-gold" /> Upload New Resource
          </h3>

          {errorMessage && (
            <div className="mb-4 p-3 bg-error-red/10 border border-error-red text-error-red text-[11px] rounded-lg flex items-center gap-2 font-medium">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <label className="border border-dashed border-border-dark hover:border-primary-gold/40 bg-deep-black/40 rounded-xl p-6 text-center flex flex-col items-center justify-center cursor-pointer transition-all aspect-square relative group">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              {selectedFile ? (
                <>
                  <FileImage size={32} className="text-primary-gold mb-2" />
                  <span className="text-[11px] text-pure-white font-mono truncate max-w-full px-2">{selectedFile.name}</span>
                  <span className="text-[9px] text-muted-gray mt-1">Click to substitute resource file</span>
                </>
              ) : (
                <>
                  <Image size={32} className="text-muted-gray/40 mb-2 group-hover:scale-105 transition-transform" />
                  <span className="font-heading font-bold text-pure-white uppercase text-[10px] tracking-wider">Select Local Image</span>
                  <span className="text-[9px] text-muted-gray/50 mt-0.5">JPEG, PNG, WEBP up to 5MB</span>
                </>
              )}
            </label>

            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="w-full h-10 bg-primary-gold hover:bg-gold-hover disabled:bg-primary-gold/20 text-deep-black font-heading font-bold uppercase tracking-wider rounded-lg transition-all text-xs flex items-center justify-center gap-2 shadow-md disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Streaming to CDN...</span>
                </>
              ) : (
                <span>Initialize Transmission</span>
              )}
            </button>
          </form>
        </div>

        {/* Results Processing Display Bracket */}
        <div className="md:col-span-2 space-y-4">
          {uploadedUrl ? (
            <div className="bg-card-dark border border-primary-gold/30 rounded-xl p-5 shadow-gold-glow/5 space-y-4 animate-scale-up">
              <div className="p-3 bg-success-green/10 border border-success-green/20 text-success-green rounded-lg flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-[10px]">
                <CheckCircle2 size={14} /> Asset Upload and CDN Generation Complete
              </div>

              <div className="border border-border-dark rounded-lg overflow-hidden bg-deep-black max-h-72 flex items-center justify-center p-2">
                <img src={uploadedUrl} alt="CDN Asset Resource render" className="max-h-64 max-w-full object-contain rounded" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray flex items-center gap-1">
                  <Link2 size={12} /> Absolute Production Path Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={uploadedUrl}
                    className="w-full h-9 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono select-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={copyToClipboardUrl}
                    className="h-9 px-4 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase text-[10px] tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Copy size={12} /> {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-border-dark rounded-xl p-12 text-center bg-card-dark/10 h-full min-h-[300px] flex flex-col items-center justify-center">
              <FileImage size={36} className="text-muted-gray/30 mb-2 animate-pulse" />
              <h4 className="font-heading font-bold uppercase text-pure-white tracking-wide">Awaiting Media Content</h4>
              <p className="text-[11px] text-muted-gray max-w-xs mx-auto mt-0.5 leading-normal normal-case font-medium">
                Uploaded strings compile directly on this dashboard. Secure URL generation tracks instantly across local clipboard buffers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMediaLibrary;