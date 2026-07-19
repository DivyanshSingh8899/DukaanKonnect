import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, X, Loader2, Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useAction } from 'convex/react';
import { chatListMineRef, chatSendMessageRef, transcribeAudioRef } from '@/lib/convexRefs';
import { toast } from 'sonner';

const RECORDER_MIME_TYPE = [
  'audio/webm',
  'audio/ogg',
  'audio/mp4',
].find((type) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type));

export function ChatWidget() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const messages = useQuery(chatListMineRef, isAuthenticated ? {} : 'skip');
  const sendMessage = useAction(chatSendMessageRef);
  const transcribeAudio = useAction(transcribeAudioRef);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isSending]);

  if (!isAuthenticated) return null;

  const handleSend = async () => {
    const content = input.trim();
    if (!content || isSending) return;
    setInput('');
    setIsSending(true);
    try {
      await sendMessage({ content });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const startRecording = async () => {
    if (!RECORDER_MIME_TYPE) {
      toast.error('Voice input is not supported in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: RECORDER_MIME_TYPE });
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(audioChunksRef.current, { type: RECORDER_MIME_TYPE });
        if (blob.size === 0) return;
        setIsTranscribing(true);
        try {
          const audio = await blob.arrayBuffer();
          const { transcript } = await transcribeAudio({ audio, mimeType: RECORDER_MIME_TYPE });
          if (transcript) {
            setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          } else {
            toast.error("Couldn't understand that. Please try again.");
          }
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Failed to transcribe audio');
        } finally {
          setIsTranscribing(false);
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      toast.error('Microphone access was denied.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[340px] sm:w-[380px] h-[500px] max-h-[70vh] rounded-xl border bg-card shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b bg-primary text-primary-foreground">
              <div>
                <p className="font-semibold text-sm">Dukaan Konnect Support</p>
                <p className="text-xs opacity-80">Ask us anything</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                onClick={() => setOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages === undefined ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Loading...
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground text-sm gap-2">
                  <MessageCircle className="w-8 h-8" />
                  <p>Hi! Ask me anything about booking services, orders, or becoming a professional.</p>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                        m.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))
              )}
              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Typing...
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={isRecording ? 'Listening...' : isTranscribing ? 'Transcribing...' : 'Type your message...'}
                rows={1}
                className="min-h-9 max-h-24 resize-none text-sm"
                disabled={isSending || isTranscribing}
              />
              <Button
                type="button"
                size="icon"
                variant={isRecording ? 'destructive' : 'outline'}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isSending || isTranscribing}
                title={isRecording ? 'Stop recording' : 'Record a voice message'}
              >
                {isTranscribing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isRecording ? (
                  <Square className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
              <Button size="icon" onClick={handleSend} disabled={isSending || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={open ? {} : { scale: [1, 1.06, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg shadow-primary/30"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </motion.div>
    </div>
  );
}
