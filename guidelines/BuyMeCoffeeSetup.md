# Buy Me a Coffee Button Setup Guide

This guide will help you configure your payment links for the Buy Me a Coffee button in LINE File Explorer.

## Quick Setup

1. Open `/components/BuyMeCoffeeButton.tsx`
2. Find the `paymentOptions` array
3. Replace the placeholder URLs with your actual account links

## Payment Platform Setup

### International Platforms

#### Buy Me a Coffee
1. Sign up at [buymeacoffee.com](https://buymeacoffee.com)
2. Choose your username
3. Replace: `https://buymeacoffee.com/yourusername`

#### Ko-fi
1. Create account at [ko-fi.com](https://ko-fi.com)
2. Set up your page
3. Replace: `https://ko-fi.com/yourusername`

#### PayPal
1. Use your existing PayPal account
2. Create a PayPal.me link
3. Replace: `https://paypal.me/yourusername`

#### Patreon
1. Create creator account at [patreon.com](https://patreon.com)
2. Set up subscription tiers
3. Replace: `https://patreon.com/yourusername`

#### Stripe
1. Create account at [stripe.com](https://stripe.com)
2. Go to Dashboard > Payment Links
3. Create a new payment link
4. Replace: `https://buy.stripe.com/your_stripe_link`

### Philippines Platforms

#### GCash
1. Get your GCash mobile number (11 digits, e.g., 09171234567)
2. Replace `09XXXXXXXXX` in the GCash URL with your actual mobile number
3. The QR code will be automatically generated when users click the GCash option
4. Example: `gcash://pay?phone=09171234567&amount=0`

#### Maya (PayMaya)
1. Get your Maya mobile number (11 digits, e.g., 09171234567)
2. Replace `09XXXXXXXXX` in the Maya URL with your actual mobile number
3. The QR code will be automatically generated when users click the Maya option
4. Example: `maya://pay?phone=09171234567&amount=0`

**Note:** Philippine payment methods (GCash and Maya) will show QR codes in a popup modal instead of opening external links. Users can scan these QR codes with their mobile apps to send payments.

## Customization Options

### Adding New Payment Methods
To add a new payment option, add an object to the `paymentOptions` array:

```typescript
{
  name: 'Platform Name',
  icon: <IconComponent className="h-4 w-4" />,
  color: '#HEX_COLOR',
  url: 'https://your-platform-link.com',
  description: 'Short description',
  category: 'International' // or 'Philippines'
}
```

### Removing Payment Methods
Simply delete or comment out the payment options you don't want to use.

### Changing Button Text
Modify the button text in the `BuyMeCoffeeButton` component:
- Desktop: "Buy Me a Coffee"
- Mobile: "Support"

## Testing

After setting up your links:
1. Click the "Buy Me a Coffee" button
2. Test each payment option to ensure links work correctly
3. Verify they open in new tabs/windows

## Security Notes

- Never commit sensitive payment information to version control
- Use environment variables for production deployments
- Test all payment flows before going live
- Consider using payment link generators for better security

## Support

If you need help setting up any payment platform, refer to their official documentation or contact their support teams.