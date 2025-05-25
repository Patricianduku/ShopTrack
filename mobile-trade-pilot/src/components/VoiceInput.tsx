
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, X, Check, AlertCircle } from 'lucide-react';

interface VoiceInputProps {
  onClose: () => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Web Speech API is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
    } else {
      setError('Speech recognition is not supported in this browser');
    }
  }, []);

  const startListening = () => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      setTranscript(result[0].transcript);
      setConfidence(result[0].confidence);
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const processTransaction = () => {
    // Simple transaction parsing logic for business expenses/income
    const text = transcript.toLowerCase();
    let type = 'expense';
    let amount = 0;
    let description = transcript;

    // Detect income keywords for shops
    if (text.includes('sale') || text.includes('sold') || text.includes('income') || text.includes('revenue') || text.includes('payment received')) {
      type = 'income';
    }

    // Extract amount
    const amountMatch = text.match(/(\d+(?:\.\d{2})?)/);
    if (amountMatch) {
      amount = parseFloat(amountMatch[1]);
    }

    console.log('Processed business transaction:', { type, amount, description });
    // Here you would typically add the transaction to your data store
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Voice Input</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isSupported ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <>
              {/* Recording Button */}
              <div className="text-center">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  size="lg"
                  className={`rounded-full w-20 h-20 ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
                
                <p className="mt-4 text-sm text-gray-600">
                  {isListening 
                    ? 'Listening... Tap to stop' 
                    : 'Tap to start recording'}
                </p>
              </div>

              {/* Status Indicator */}
              {isListening && (
                <div className="flex justify-center">
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    Recording
                  </Badge>
                </div>
              )}

              {/* Transcript */}
              {transcript && (
                <div className="space-y-3">
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm font-medium mb-2">Transcript:</p>
                    <p className="text-gray-700">{transcript}</p>
                  </div>
                  
                  {confidence > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Confidence:</span>
                      <Badge variant={confidence > 0.8 ? 'default' : 'secondary'}>
                        {Math.round(confidence * 100)}%
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              {transcript && !isListening && (
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setTranscript('')}
                  >
                    Clear
                  </Button>
                  <Button 
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    onClick={processTransaction}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Process
                  </Button>
                </div>
              )}

              {/* Tips for Business Owners */}
              <div className="text-xs text-gray-600 space-y-1">
                <p>💡 Tips for better recognition:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Say "sale of [item] for [amount]" for income</li>
                  <li>Say "bought [item] for [amount]" for expenses</li>
                  <li>Speak clearly and include the amount</li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceInput;
