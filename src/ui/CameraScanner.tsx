import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import type { IScannerControls } from '@zxing/browser';
import { Button } from './Button';

export function CameraScanner({ onResult, onClose, label = 'Scan', facingMode = 'environment' }: {
  onResult: (text: string) => void;
  onClose: () => void;
  label?: string;
  facingMode?: 'environment' | 'user';
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [controls, setControls] = useState<IScannerControls | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  // keep controls to stop stream on unmount

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let stopped = false;
    const start = async () => {
      try {
        const ctrl = await codeReader.decodeFromConstraints(
          { video: { facingMode } },
          videoRef.current!,
          (result, _err, ctrl) => {
            if (!stopped && ctrl && !controls) setControls(ctrl);
            if (result) {
              onResult(result.getText());
              onClose();
            }
          },
        );
        setControls(ctrl);

        // Detect torch capability from the active track attached to the video element
        const stream = (videoRef.current?.srcObject as MediaStream) || null;
        const track = stream?.getVideoTracks()?.[0] || null;
        trackRef.current = track;
        try {
          const caps: any = track && typeof track.getCapabilities === 'function' ? track.getCapabilities() : {};
          setTorchSupported(!!caps?.torch);
        } catch {
          setTorchSupported(false);
        }
      } catch (e: any) {
        setError(e?.message || 'Camera error');
      }
    };
    start();
    return () => {
      stopped = true;
      try { controls?.stop(); } catch {}
    };
  }, [onResult, onClose, facingMode]);

  async function toggleTorch() {
    const track = trackRef.current;
    if (!track) return;
    try {
      // Some browsers require advanced constraints for torch toggle
      await (track as any).applyConstraints?.({ advanced: [{ torch: !torchOn }] });
      setTorchOn((v) => !v);
    } catch (e: any) {
      // If it fails, disable support to hide the button
      setTorchSupported(false);
      setError(e?.message || 'Torch not available on this device/browser');
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex flex-col">
      <div className="flex justify-between items-center p-3 text-white">
        <div className="font-semibold">{label}</div>
        <div className="flex gap-2">
          {torchSupported && (
            <Button variant={torchOn ? 'warn' : 'outline'} onClick={toggleTorch}>{torchOn ? 'Torch On' : 'Torch'}</Button>
          )}
          <Button variant="danger" onClick={onClose}>Close</Button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <video ref={videoRef} className="w-full h-full object-contain" muted playsInline />
      </div>
      {error && <div className="p-3 text-center text-red-300 text-sm">{error}</div>}
    </div>
  );
}
