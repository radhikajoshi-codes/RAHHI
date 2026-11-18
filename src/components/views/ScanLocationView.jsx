import React, { useState } from 'react';
import {
  QrCode,
  Zap,
  Radio,
  Volume2,
  Compass,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Layers,
  MapPin,
} from 'lucide-react';
import { SAMPLE_TAGS, LANDMARK_PHOTOS, GRAPH_NODES } from '../../data/campusData';
import { playBeaconPing, speakText } from '../../utils/audio';

export default function ScanLocationView({
  onConfirmLocation,
  soundEnabled = true,
}) {
  const [activeTab, setActiveTab] = useState('photo'); // 'photo' | 'qr' | 'manual'
  const [selectedTagIndex, setSelectedTagIndex] = useState(0);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [torchOn, setTorchOn] = useState(false);
  const [nfcScanning, setNfcScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customUploadedImage, setCustomUploadedImage] = useState(null);

  const currentTag = SAMPLE_TAGS[selectedTagIndex] || SAMPLE_TAGS[0];
  const currentPhoto = LANDMARK_PHOTOS[selectedPhotoIndex] || LANDMARK_PHOTOS[0];

  // Active detected location data based on active tab
  const activeLocation = activeTab === 'photo'
    ? {
        name: currentPhoto.name,
        building: currentPhoto.building,
        floor: currentPhoto.floor,
        confidence: currentPhoto.confidence,
        heading: currentPhoto.heading,
        tagId: currentPhoto.tag,
        nodeId: currentPhoto.nodeId,
        tts: currentPhoto.tts,
        beaconsNearby: 4,
        category: currentPhoto.category,
        features: currentPhoto.features,
      }
    : {
        name: currentTag.name,
        building: currentTag.building,
        floor: currentTag.floor,
        confidence: currentTag.confidence,
        heading: currentTag.heading,
        tagId: `Tag #${currentTag.id}`,
        nodeId: currentTag.nodeId,
        tts: currentTag.tts,
        beaconsNearby: currentTag.beaconsNearby,
        category: 'Physical QR/NFC Marker',
        features: ['QR Matrix Verified', 'Bluetooth BLE RTT Tag Match'],
      };

  const handleSelectPhoto = (idx) => {
    setIsAnalyzing(true);
    playBeaconPing();
    setCustomUploadedImage(null);
    setTimeout(() => {
      setSelectedPhotoIndex(idx);
      setIsAnalyzing(false);
      if (soundEnabled) {
        speakText(LANDMARK_PHOTOS[idx].tts);
      }
    }, 600);
  };

  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomUploadedImage(url);
      setIsAnalyzing(true);
      playBeaconPing();

      setTimeout(() => {
        // Automatically match to staircase if filename includes 'stair' or default to staircase for demo
        const isStair = file.name.toLowerCase().includes('stair') || file.name.toLowerCase().includes('step');
        setSelectedPhotoIndex(isStair ? 0 : 0);
        setIsAnalyzing(false);
        if (soundEnabled) {
          speakText('Photo uploaded. Visual feature match identified East Wing Staircase with 97% confidence.');
        }
      }, 900);
    }
  };

  const handleNfcTap = () => {
    setNfcScanning(true);
    playBeaconPing();
    setTimeout(() => {
      setNfcScanning(false);
      if (soundEnabled) {
        speakText('NFC tag verified at waist height.');
      }
    }, 1200);
  };

  const handleAudioCue = () => {
    playBeaconPing();
    if (soundEnabled) {
      speakText(activeLocation.tts);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-teal-600 tracking-wide uppercase">
            Step 2 · Multimodal Indoor Positioning
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Verify Your Location
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Choose how to position yourself: Upload a landmark photo (e.g. Staircase), scan a wall QR/NFC tag, or select manually.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-xs self-start md:self-auto">
          <button
            onClick={() => setActiveTab('photo')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'photo'
                ? 'bg-teal-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photo VPS</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'qr'
                ? 'bg-teal-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR &amp; NFC Tag</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Viewport (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-pink-100 p-6 md:p-8 shadow-sm flex flex-col items-center">
          {activeTab === 'photo' ? (
            /* PHOTO / VISUAL POSITIONING SYSTEM (VPS) INTERFACE */
            <div className="w-full space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>AI Visual Positioning System (VPS)</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">Neural Landmark Match</span>
              </div>

              {/* Landmark Image Viewfinder */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900 shadow-inner flex items-center justify-center">
                {customUploadedImage ? (
                  <img
                    src={customUploadedImage}
                    alt="Custom Landmark"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: currentPhoto.previewSvg }}
                  />
                )}

                {/* Holographic targeting overlay */}
                <div className="absolute inset-4 pointer-events-none border border-teal-400/40 rounded-xl">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-teal-400" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-teal-400" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-teal-400" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-teal-400" />
                </div>

                {/* Laser scan line if analyzing */}
                {isAnalyzing && (
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-400 shadow-lg shadow-teal-400 animate-scan pointer-events-none" />
                )}

                {/* Landmark Identified Pill */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold">{activeLocation.name}</span>
                  </div>
                  <span className="font-mono text-teal-300 font-bold">{activeLocation.confidence}% match</span>
                </div>
              </div>

              {/* Preset Landmark Photos Quick Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Select Demo Landmark Photo
                  </label>
                  <label className="text-xs text-teal-600 font-bold hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload your own photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Quick Cards for Demo photos */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {LANDMARK_PHOTOS.map((photo, idx) => (
                    <button
                      key={photo.id}
                      onClick={() => handleSelectPhoto(idx)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedPhotoIndex === idx && !customUploadedImage
                          ? 'bg-teal-50 border-teal-400 ring-2 ring-teal-200'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="text-[11px] font-bold text-slate-800 truncate">
                        {photo.name}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {photo.category}
                      </div>
                      <span className="inline-block mt-1 text-[9px] font-mono bg-white text-teal-700 px-1.5 py-0.2 rounded border border-teal-200">
                        {photo.confidence}% match
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Extracted Architectural Features */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-1.5">
                  Extracted Landmark Keypoints:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-600">
                  {activeLocation.features?.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* QR / NFC SCANNER INTERFACE */
            <div className="w-full flex flex-col items-center">
              <div
                className={`relative w-full max-w-md aspect-square rounded-3xl border-2 border-slate-100 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
                  torchOn ? 'bg-amber-50/30' : 'bg-[#FAFBFD]'
                }`}
              >
                {/* Viewfinder holographic brackets */}
                <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-teal-400 rounded-tl-xl" />
                <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-teal-400 rounded-tr-xl" />
                <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-teal-400 rounded-bl-xl" />
                <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-teal-400 rounded-br-xl" />

                {/* Laser scan line */}
                <div className="absolute left-10 right-10 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-lg shadow-teal-400 animate-scan pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl bg-white p-3 shadow-md border border-slate-100 flex items-center justify-center">
                    <QrCode className="w-full h-full text-slate-800" />
                  </div>

                  <div className="mt-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-teal-200 text-teal-800 text-xs font-semibold shadow-xs">
                    <RefreshCw className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                    <span>Optical Tag Verified</span>
                  </div>
                </div>

                {nfcScanning && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 rounded-full border-4 border-teal-400 animate-ping opacity-75" />
                  </div>
                )}
              </div>

              {/* Scanner action bar: Torch, NFC, Audio cues */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-6">
                <button
                  onClick={() => setTorchOn(!torchOn)}
                  className={`flex items-center justify-center gap-2 py-3 px-2 rounded-2xl text-xs font-bold border transition-all ${
                    torchOn
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-white hover:bg-slate-50 border-pink-100 text-rose-500'
                  }`}
                >
                  <Zap className="w-4 h-4 text-rose-500" />
                  <span>{torchOn ? 'Torch On' : 'Torch'}</span>
                </button>

                <button
                  onClick={handleNfcTap}
                  className={`flex items-center justify-center gap-2 py-3 px-2 rounded-2xl text-xs font-bold border transition-all ${
                    nfcScanning
                      ? 'bg-teal-100 border-teal-300 text-teal-900'
                      : 'bg-white hover:bg-slate-50 border-pink-100 text-rose-500'
                  }`}
                >
                  <Radio className="w-4 h-4 text-rose-500" />
                  <span>NFC Tap</span>
                </button>

                <button
                  onClick={handleAudioCue}
                  className="flex items-center justify-center gap-2 py-3 px-2 rounded-2xl text-xs font-bold bg-white hover:bg-slate-50 border border-pink-100 text-rose-500 transition-all"
                >
                  <Volume2 className="w-4 h-4 text-rose-500" />
                  <span>Audio cues</span>
                </button>
              </div>

              {/* Tag Switcher */}
              <div className="w-full max-w-md mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Switch simulated tag:</span>
                <div className="flex gap-1.5">
                  {SAMPLE_TAGS.map((tag, idx) => (
                    <button
                      key={tag.id}
                      onClick={() => {
                        setSelectedTagIndex(idx);
                        playBeaconPing();
                        if (soundEnabled) speakText(tag.tts);
                      }}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        selectedTagIndex === idx
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      #{tag.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Detected Location Info Card & Confirmation Button (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Main Location Found Card */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-[#99F6E4]/40 via-[#CCFBF1]/30 to-[#FCE7F3]/60 border border-teal-200/60 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 tracking-wider uppercase mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Location Recognized</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              {activeLocation.name}
            </h2>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              {activeLocation.building} · {activeLocation.floor} · {activeLocation.tagId}
            </p>

            {/* Confidence metric */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Positioning Confidence</span>
                <span className="text-base font-extrabold text-teal-800">
                  {activeLocation.confidence}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/80 overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 via-sky-400 to-pink-400 transition-all duration-500"
                  style={{ width: `${activeLocation.confidence}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Multimodal Signals Used */}
          <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs space-y-3.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Signals Triangulated
            </h3>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  {activeTab === 'photo' ? <Camera className="w-4 h-4 text-slate-400" /> : <QrCode className="w-4 h-4 text-slate-400" />}
                  <span>{activeTab === 'photo' ? 'Visual VPS Landmark' : 'QR tag marker'}</span>
                </span>
                <span className="text-teal-600 font-bold text-xs bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Verified Match
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Radio className="w-4 h-4 text-slate-400" />
                  <span>Bluetooth Beacons</span>
                </span>
                <span className="text-rose-500 font-bold text-xs">
                  {activeLocation.beaconsNearby} nearby
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Compass className="w-4 h-4 text-slate-400" />
                  <span>Orientation</span>
                </span>
                <span className="text-slate-800 font-bold text-xs">
                  {activeLocation.heading}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Audio TTS Readout Quote */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs flex items-start gap-3">
            <Volume2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
            <p className="text-xs font-semibold text-slate-700 italic">
              “{activeLocation.tts}”
            </p>
          </div>

          {/* Confirm & Start Navigation Action Button */}
          <button
            onClick={() => onConfirmLocation(activeLocation)}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-400 to-[#00BFA5] text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>Start Navigation from {activeLocation.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
