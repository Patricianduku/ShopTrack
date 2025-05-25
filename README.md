ShopTrack
# ShopTrack - Mobile Trading Income & Expense Tracker

## Overview
ShopTrack is a mobile-first web application designed for small traders to track their income and expenses in real-time. The app features voice input, OCR receipt scanning, and comprehensive analytics with an orange-themed modern UI.

## Tech Stack
- **Frontend**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS + Shadcn UI components
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Voice Input**: Web Speech API
- **OCR**: Tesseract.js or similar client-side OCR
- **Charts**: Recharts or Chart.js
- **Deployment**: Vercel (recommended for Next.js)

## Core Features

### Authentication & Security
- Email/password authentication via Supabase Auth
- Secure session management
- Password reset functionality
- Protected routes with middleware

### Voice & OCR Input
- Speech-to-text for quick expense/income entry
- Photo capture and OCR processing for receipts
- Fallback manual text input
- Data validation and confirmation screens

### Real-time Data Management
- Instant synchronization with Supabase
- Offline capability with sync when online
- Real-time updates across devices

### Analytics & Reporting
- Interactive charts and graphs
- Daily/weekly/monthly comparisons
- Profit/loss calculations
- Export functionality (CSV/PDF)

## App Structure & Pages

### 1. Authentication Pages
- **Landing Page** (`/`)
  - Hero section with app benefits
  - Call-to-action buttons
  - Feature highlights with orange accents
- **Sign Up** (`/signup`)
  - Email/password registration
  - Terms & conditions checkbox
  - Redirect to onboarding
- **Sign In** (`/signin`)
  - Email/password login
  - "Remember me" option
  - Password recovery link
- **Password Reset** (`/reset-password`)
  - Email input for reset link
  - Success confirmation

### 2. Onboarding Flow
- **Business Setup** (`/onboarding`)
  - Business name input
  - Currency selection (USD, EUR, GBP, etc.)
  - Trading category/type
  - Welcome tutorial overlay

### 3. Main Application Pages
- **Dashboard** (`/dashboard`)
  - Overview cards (Total Income, Expenses, Profit)
  - Quick action buttons (Add Income/Expense)
  - Recent transactions list
  - Weekly/monthly charts
- **Add Transaction** (`/add`)
  - Toggle between Income/Expense
  - Amount input with currency
  - Category selection
  - Description field
  - Voice input button
  - Camera/photo upload button
  - Date/time picker
- **Transactions History** (`/transactions`)
  - Filterable transaction list
  - Search functionality
  - Category filtering
  - Date range picker
  - Edit/delete options
- **Analytics** (`/analytics`)
  - Comprehensive charts and graphs
  - Income vs Expenses comparison
  - Profit trends over time
  - Category breakdowns
  - Export options
- **Settings** (`/settings`)
  - Profile management
  - Business details editing
  - Currency preferences
  - Notification settings
  - Data export/import
  - Account deletion

### 4. Additional Pages
- **Profile** (`/profile`)
  - User information display/edit
  - Business details
  - Subscription status (if applicable)

## Database Schema (Supabase PostgreSQL)

### Users Table (Extends Supabase Auth)
```sql
-- Extends auth.users
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  business_name VARCHAR(255),
  currency VARCHAR(3) DEFAULT 'USD',
  trading_category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Transactions Table
```sql
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type VARCHAR(10) CHECK (type IN ('income', 'expense')) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
  input_method VARCHAR(20) CHECK (input_method IN ('manual', 'voice', 'ocr')) DEFAULT 'manual',
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX idx_transactions_type ON public.transactions(type);
```

### Categories Table
```sql
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(10) CHECK (type IN ('income', 'expense', 'both')) NOT NULL,
  color VARCHAR(7), -- Hex color code
  icon VARCHAR(50), -- Icon name/class
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, name)
);
```

### Settings Table
```sql
CREATE TABLE public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  notifications_enabled BOOLEAN DEFAULT true,
  weekly_reports BOOLEAN DEFAULT true,
  default_currency VARCHAR(3) DEFAULT 'USD',
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON public.transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for categories and settings tables
```

## UI/UX Design Guidelines

### Color Scheme
- **Primary Orange**: #FF6B35 (main CTA buttons, highlights)
- **Secondary Orange**: #FF8C42 (secondary buttons, accents)
- **Light Orange**: #FFB366 (backgrounds, hover states)
- **Dark Orange**: #E55A2B (text on light backgrounds)
- **Neutral Colors**: 
  - Gray-900: #1A1A1A (primary text)
  - Gray-600: #6B7280 (secondary text)
  - Gray-100: #F5F5F5 (backgrounds)
  - White: #FFFFFF (cards, modals)

### Typography
- **Headings**: Inter or Poppins (bold, modern)
- **Body Text**: Inter (clean, readable)
- **Numbers**: JetBrains Mono (monospace for amounts)

### Components & Layout
- Card-based design with subtle shadows
- Rounded corners (8px-12px radius)
- Consistent spacing (4px grid system)
- Mobile-first responsive design
- Bottom navigation for mobile
- Floating action button for quick add
- Toast notifications for feedback

### Accessibility
- WCAG 2.1 AA compliance
- High contrast ratios
- Keyboard navigation
- Screen reader support
- Focus indicators

## Key Features Implementation

### Voice Input
- Use Web Speech API
- Visual feedback during recording
- Confidence threshold for accuracy
- Fallback to manual input

### OCR Receipt Processing
- Client-side processing with Tesseract.js
- Image preprocessing for better accuracy
- Manual correction interface
- Receipt image storage in Supabase Storage

### Real-time Analytics
- Recharts for interactive charts
- Real-time data updates via Supabase subscriptions
- Responsive chart designs
- Export functionality (PDF/CSV)

### Performance Optimization
- Next.js App Router with server components
- Image optimization
- Lazy loading for charts
- Efficient database queries
- Caching strategies

## Deployment & DevOps

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_app_url
```

### Deployment Steps
1. Set up Supabase project
2. Configure authentication providers
3. Run database migrations
4. Deploy to Vercel
5. Configure custom domain
6. Set up monitoring and analytics

## Success Metrics
- User registration and retention rates
- Daily/weekly active users
- Transaction entry frequency
- Feature adoption rates (voice, OCR)
- User feedback and ratings

## Future Enhancements
- Multi-currency support with exchange rates
- Team collaboration features
- Advanced reporting and insights
- Integration with accounting software
- Mobile app (React Native)
- AI-powered expense categorization
- Receipt data extraction improvements
## Setup
1. Clone: `git clone https://github.com/Paticianduku/ShopTrack.git`
2. Install: `npm install`
3. Add `.env.local` with Supabase credentials.
4. Run: `npm run dev`