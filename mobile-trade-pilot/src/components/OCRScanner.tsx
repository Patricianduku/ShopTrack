
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Camera, Upload, Scan, Check, AlertCircle } from 'lucide-react';

interface OCRScannerProps {
  onClose: () => void;
}

const OCRScanner: React.FC<OCRScannerProps> = ({ onClose }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    amount: string;
    merchant: string;
    date: string;
  } | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;

    setIsScanning(true);
    setError('');

    try {
      // Simulate OCR processing with Tesseract.js
      // In a real implementation, you would use:
      // import Tesseract from 'tesseract.js';
      // const { data: { text } } = await Tesseract.recognize(image);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock extracted data
      const mockData = {
        amount: '45.67',
        merchant: 'Trading Coffee Shop',
        date: new Date().toISOString().split('T')[0]
      };

      setExtractedData(mockData);
    } catch (err) {
      setError('Failed to process image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const saveTransaction = () => {
    if (!extractedData) return;
    
    console.log('Saving OCR transaction:', extractedData);
    // Here you would typically save to your data store
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Receipt Scanner</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!image ? (
            <>
              {/* Upload Options */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="h-6 w-6" />
                  <span className="text-sm">Camera</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-6 w-6" />
                  <span className="text-sm">Upload</span>
                </Button>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Instructions */}
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium">📋 For best results:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Ensure receipt is well-lit</li>
                  <li>Capture the entire receipt</li>
                  <li>Avoid shadows and glare</li>
                  <li>Keep text readable and straight</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Image Preview */}
              <div className="space-y-4">
                <img
                  src={image}
                  alt="Receipt"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setImage(null);
                      setExtractedData(null);
                      setError('');
                    }}
                  >
                    Retake
                  </Button>
                  
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={processImage}
                    disabled={isScanning}
                  >
                    {isScanning ? (
                      <>
                        <Scan className="h-4 w-4 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Scan className="h-4 w-4 mr-2" />
                        Scan
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Scanning Progress */}
              {isScanning && (
                <div className="text-center py-4">
                  <div className="animate-pulse text-sm text-muted-foreground">
                    Processing image with OCR...
                  </div>
                </div>
              )}

              {/* Extracted Data */}
              {extractedData && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-2">
                      ✅ Data extracted successfully!
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="extracted-amount">Amount</Label>
                      <Input
                        id="extracted-amount"
                        value={extractedData.amount}
                        onChange={(e) => setExtractedData({
                          ...extractedData,
                          amount: e.target.value
                        })}
                        className="font-mono"
                      />
                    </div>

                    <div>
                      <Label htmlFor="extracted-merchant">Merchant</Label>
                      <Input
                        id="extracted-merchant"
                        value={extractedData.merchant}
                        onChange={(e) => setExtractedData({
                          ...extractedData,
                          merchant: e.target.value
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="extracted-date">Date</Label>
                      <Input
                        id="extracted-date"
                        type="date"
                        value={extractedData.date}
                        onChange={(e) => setExtractedData({
                          ...extractedData,
                          date: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={saveTransaction}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Add Transaction
                  </Button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OCRScanner;
