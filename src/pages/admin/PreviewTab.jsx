import React from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';

export default function PreviewTab() {
  const [key, setKey] = React.useState(0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold gold-gradient-text tracking-tight mb-1">
            Preview Public Website
          </h2>
          <p className="text-xs sm:text-sm text-[#fdfbf7]/70 font-light">
            Live preview dekhein jaisa visitor ko nazar aayega.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setKey((k) => k + 1)}
            className="p-2 rounded-full border border-[#d4af37]/30 text-[#fbe08e] hover:bg-[#064e3b] cursor-pointer"
            title="Reload Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>Open in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="islamic-card p-2 sm:p-4 border border-[#d4af37]/40 rounded-2xl overflow-hidden shadow-2xl">
        <div className="w-full h-[75vh] rounded-xl overflow-hidden bg-[#022c22]">
          <iframe
            key={key}
            src="/"
            title="Public Birthday Surprise Preview"
            className="w-full h-full border-0"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
