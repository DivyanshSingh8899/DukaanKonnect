import { useEffect, useRef, useState } from 'react';
import { Camera, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsStreaming(false);
  };

  useEffect(() => stopCamera, []);

  // Attach the stream to the video element once it's mounted and streaming.
  useEffect(() => {
    const video = videoRef.current;
    if (isStreaming && video && streamRef.current) {
      video.srcObject = streamRef.current;
      video.play().catch(() => {
        setError('Could not start the camera preview. Please try again.');
      });
    }
  }, [isStreaming]);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      setIsStreaming(true);
    } catch {
      setError('Could not access the camera. Please allow camera permission and try again.');
    }
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    if (!video.videoWidth || !video.videoHeight) {
      setError('Camera is still loading. Please wait a moment and try again.');
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCapturedUrl(URL.createObjectURL(blob));
          onCapture(blob);
        }
      },
      'image/jpeg',
      0.9,
    );
    stopCamera();
  };

  const retake = () => {
    setCapturedUrl(null);
    startCamera();
  };

  return (
    <div className="space-y-3">
      {capturedUrl ? (
        <>
          <img src={capturedUrl} alt="Captured ID document" className="w-full rounded-lg border" />
          <Button type="button" variant="outline" className="w-full" onClick={retake}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Photo
          </Button>
        </>
      ) : (
        <>
          <video
            ref={videoRef}
            className={`w-full rounded-lg border bg-black ${isStreaming ? '' : 'hidden'}`}
            muted
            playsInline
          />
          {isStreaming ? (
            <Button type="button" className="w-full" onClick={capture}>
              <Camera className="w-4 h-4 mr-2" />
              Capture Photo
            </Button>
          ) : (
            <Button type="button" variant="outline" className="w-full" onClick={startCamera}>
              <Camera className="w-4 h-4 mr-2" />
              Open Camera
            </Button>
          )}
        </>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}