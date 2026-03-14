'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, Loader2, Mic, FileAudio, MessageSquare } from 'lucide-react';

export default function TranscriptsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const generateTranscript = async () => {
    if (!file) {
      setStatus('error');
      return;
    }

    setIsLoading(true);
    setStatus('uploading');
    setTranscript('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/api/v1/transcript/audio/spr-plan-2024', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      setTranscript(data.transcript);
      setStatus('success');
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-3 rounded-2xl mb-6">
            <MessageSquare className="w-6 h-6" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              MeetingMind Transcripts
            </h1>
          </div>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Upload your meeting audio files and get instant AI-powered transcripts.
          </p>
        </div>

        {/* Upload Card */}
        <Card className="border-0 bg-white/5 backdrop-blur-xl shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <Upload className="w-8 h-8 text-purple-400" />
              Upload Audio for Transcript
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-slate-300 block">
                Select Audio File (.mp3, .wav, .m4a)
              </label>
              <Input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="file:bg-gradient-to-r file:from-purple-600 file:to-indigo-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:cursor-pointer file:mr-4 hover:file:from-purple-700 hover:file:to-indigo-700"
              />
              {file && (
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="font-medium text-slate-300">{file.name}</p>
                  <p className="text-sm text-slate-500">Size: {(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateTranscript}
              disabled={!file || isLoading}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-xl"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Processing Audio...
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6 mr-3" />
                  Generate Transcript
                </>
              )}
            </Button>

            {/* Status */}
            {status !== 'idle' && (
              <Badge 
                variant={status === 'success' ? "default" : "destructive"}
                className="w-full justify-center py-3 text-lg px-6"
              >
                {status === 'success' ? '✅ Transcript generated successfully!' : 
                 status === 'error' ? '❌ Upload failed - check backend server' : 
                 '⏳ Processing...'}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Transcript Display */}
        {transcript && (
          <Card className="border-0 bg-white/5 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <MessageSquare className="w-7 h-7 text-emerald-400" />
                Transcript Ready
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96 p-8 border-t border-slate-700/50">
                <div className="prose prose-invert max-w-none text-lg leading-relaxed text-slate-200 bg-slate-900/30 rounded-xl p-6">
                  {transcript}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
