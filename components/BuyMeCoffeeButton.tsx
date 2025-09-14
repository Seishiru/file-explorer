/**
 * Buy Me a Coffee Button Component
 * 
 * TO CUSTOMIZE YOUR PAYMENT LINKS:
 * Replace the placeholder URLs in the paymentOptions array below with your actual account links:
 * - Buy Me a Coffee: https://buymeacoffee.com/yourusername
 * - Ko-fi: https://ko-fi.com/yourusername  
 * - PayPal: https://paypal.me/yourusername
 * - Patreon: https://patreon.com/yourusername
 * - Stripe: Create a payment link at https://dashboard.stripe.com/payment-links
 * - GCash: Use QR code link or maya.ph link
 * - Maya: Use QR code link or maya.ph link
 */

import React, { useState } from 'react';
import { Coffee, Heart, ExternalLink, CreditCard, Gift, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface PaymentOption {
  name: string;
  icon: React.ReactNode;
  color: string;
  url: string;
  description: string;
  category: 'International' | 'Philippines';
}

const paymentOptions: PaymentOption[] = [
  {
    name: 'Buy Me a Coffee',
    icon: <Coffee className="h-4 w-4" />,
    color: '#FFDD00',
    url: 'https://buymeacoffee.com/yourusername', // Replace with your actual username
    description: 'Support with a coffee',
    category: 'International'
  },
  {
    name: 'Ko-fi',
    icon: <Coffee className="h-4 w-4" />,
    color: '#FF5E5B',
    url: 'https://ko-fi.com/yourusername', // Replace with your actual username
    description: 'Buy me a coffee on Ko-fi',
    category: 'International'
  },
  {
    name: 'PayPal',
    icon: <CreditCard className="h-4 w-4" />,
    color: '#0070BA',
    url: 'https://paypal.me/yourusername', // Replace with your actual username
    description: 'Send via PayPal',
    category: 'International'
  },
  {
    name: 'Patreon',
    icon: <Heart className="h-4 w-4" />,
    color: '#FF424D',
    url: 'https://patreon.com/yourusername', // Replace with your actual username
    description: 'Monthly support on Patreon',
    category: 'International'
  },
  {
    name: 'Stripe',
    icon: <CreditCard className="h-4 w-4" />,
    color: '#635BFF',
    url: 'https://buy.stripe.com/your_stripe_link', // Replace with your actual Stripe payment link
    description: 'Credit/Debit card via Stripe',
    category: 'International'
  },
  {
    name: 'GCash',
    icon: <Smartphone className="h-4 w-4" />,
    color: '#007DFF',
    url: 'gcash://pay?phone=09XXXXXXXXX&amount=0', // Replace 09XXXXXXXXX with your GCash mobile number
    description: 'Philippine mobile wallet',
    category: 'Philippines'
  },
  {
    name: 'Maya (PayMaya)',
    icon: <Smartphone className="h-4 w-4" />,
    color: '#00D4AA',
    url: 'maya://pay?phone=09XXXXXXXXX&amount=0', // Replace 09XXXXXXXXX with your Maya mobile number
    description: 'Philippine digital wallet',
    category: 'Philippines'
  }
];

export const BuyMeCoffeeButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQRPayment, setSelectedQRPayment] = useState<PaymentOption | null>(null);

  const handlePaymentClick = (url: string, name: string, option: PaymentOption) => {
    // For Philippine payment methods, show QR code modal
    if (option.category === 'Philippines') {
      setSelectedQRPayment(option);
      setShowQRModal(true);
      setShowModal(false);
    } else {
      // For international payment methods, open URL
      window.open(url, '_blank', 'noopener,noreferrer');
      setShowModal(false);
    }
  };

  const internationalOptions = paymentOptions.filter(option => option.category === 'International');
  const philippineOptions = paymentOptions.filter(option => option.category === 'Philippines');

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setShowModal(true)}
            variant="outline"
            size="sm"
            className="coffee-button line-interactive hover:bg-[color-mix(in_srgb,var(--accent-color)_10%,transparent)] hover:border-[var(--accent-color)] transition-all duration-200 group"
          >
            <Coffee className="coffee-icon h-4 w-4 mr-2 transition-all duration-200" style={{ color: 'var(--accent-color)' }} />
            <span className="hidden sm:inline">Buy Me a Coffee</span>
            <span className="sm:hidden">Support</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Support the developer <kbd className="ml-1">Ctrl+Shift+C</kbd></p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                <Coffee className="h-4 w-4 text-white" />
              </div>
              Support the Developer
            </DialogTitle>
            <DialogDescription>
              If you find LINE File Explorer helpful, consider supporting its development! 
              Every contribution helps maintain and improve the app.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4 overflow-y-auto dialog-content-scroll flex-1">
            {/* International Payment Options */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <span className="text-[var(--accent-color)]">🌍</span>
                International Platforms
              </h3>
              <div className="space-y-2">
                {internationalOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => handlePaymentClick(option.url, option.name, option)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left group"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: option.color }}
                    >
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{option.name}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Philippine Payment Options */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <span className="text-[var(--accent-color)]">🇵🇭</span>
                Philippines
              </h3>
              <div className="space-y-2">
                {philippineOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => handlePaymentClick(option.url, option.name, option)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left group"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: option.color }}
                    >
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{option.name}</div>
                      <div className="text-xs text-muted-foreground">Show QR code for payment</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-muted-foreground rounded-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-muted-foreground rounded-sm"></div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Thank you for your support!</span>
                <Heart className="h-4 w-4 text-red-500" />
              </div>
              <p className="text-xs text-muted-foreground">
                Your contribution helps keep this project alive and growing.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal for Philippine Payment Methods */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: selectedQRPayment?.color || '#000' }}
              >
                {selectedQRPayment?.icon}
              </div>
              {selectedQRPayment?.name} Payment
            </DialogTitle>
            <DialogDescription>
              Scan the QR code below with your {selectedQRPayment?.name} app to send a payment.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="flex flex-col items-center space-y-4">
              {/* QR Code Image */}
              <div className="qr-code-container w-48 h-48 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center shadow-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    selectedQRPayment?.url || ''
                  )}&bgcolor=FFFFFF&color=000000&format=png&margin=10`}
                  alt={`${selectedQRPayment?.name} QR Code`}
                  className="w-44 h-44"
                  onError={(e) => {
                    // Fallback QR code if the service fails
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,' + btoa(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
                        <rect width="180" height="180" fill="white"/>
                        <rect x="20" y="20" width="20" height="20" fill="black"/>
                        <rect x="60" y="20" width="20" height="20" fill="black"/>
                        <rect x="100" y="20" width="20" height="20" fill="black"/>
                        <rect x="140" y="20" width="20" height="20" fill="black"/>
                        <rect x="20" y="60" width="20" height="20" fill="black"/>
                        <rect x="140" y="60" width="20" height="20" fill="black"/>
                        <rect x="20" y="100" width="20" height="20" fill="black"/>
                        <rect x="60" y="100" width="20" height="20" fill="black"/>
                        <rect x="100" y="100" width="20" height="20" fill="black"/>
                        <rect x="140" y="100" width="20" height="20" fill="black"/>
                        <rect x="20" y="140" width="20" height="20" fill="black"/>
                        <rect x="60" y="140" width="20" height="20" fill="black"/>
                        <rect x="100" y="140" width="20" height="20" fill="black"/>
                        <rect x="140" y="140" width="20" height="20" fill="black"/>
                        <text x="90" y="95" text-anchor="middle" fill="gray" font-size="12">QR Code</text>
                      </svg>
                    `);
                  }}
                />
              </div>

              {/* Payment Instructions */}
              <div className="text-center space-y-2">
                <p className="font-medium">How to pay:</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  {selectedQRPayment?.name === 'GCash' && (
                    <>
                      <p>1. Open your GCash app</p>
                      <p>2. Tap "Send Money" or "Pay QR"</p>
                      <p>3. Scan this QR code</p>
                      <p>4. Enter your desired amount</p>
                      <p>5. Complete the payment</p>
                    </>
                  )}
                  {selectedQRPayment?.name === 'Maya (PayMaya)' && (
                    <>
                      <p>1. Open your Maya app</p>
                      <p>2. Tap "Scan to Pay"</p>
                      <p>3. Scan this QR code</p>
                      <p>4. Enter your desired amount</p>
                      <p>5. Complete the payment</p>
                    </>
                  )}
                </div>
              </div>

              {/* Alternative Contact Info */}
              <div className="w-full p-3 bg-muted rounded-lg">
                <p className="text-sm text-center text-muted-foreground">
                  Having trouble? You can also send directly to:
                </p>
                <p className="text-sm text-center font-mono mt-1">
                  {selectedQRPayment?.name === 'GCash' && '+63 9XX XXX XXXX'}
                  {selectedQRPayment?.name === 'Maya (PayMaya)' && '+63 9XX XXX XXXX'}
                </p>
                <p className="text-xs text-center text-muted-foreground mt-1">
                  (Update your mobile number in the component settings)
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Salamat! Thank you!</span>
                <Heart className="h-4 w-4 text-red-500" />
              </div>
              <p className="text-xs text-muted-foreground">
                Your support means everything to us.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};
