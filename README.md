# MiniTrace

Digital Product Passport — capture product photos, get AI-powered analysis, and anchor authenticity on the Polygon blockchain.

## Download

**v1.0.0** is available on the [GitHub Releases](https://github.com/clement1ne/minitrace/releases) page. Download the latest `minitrace.apk` to install directly on Android.

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | Expo SDK 56, React Native 0.85, TypeScript |
| Backend | Supabase (Postgres, Auth) |
| AI | Hugging Face Inference (`google/gemma-4-31B-it:novita`) |
| Blockchain | Polygon Amoy Testnet, Solidity 0.8.20, viem |
| Web Viewer | Next.js (Vercel) |
| State | Zustand |

## Getting Started

### Prerequisites

- Node.js 18+
- [Expo Go](https://expo.dev/go) on your Android/iOS device
- A [Supabase](https://supabase.com) project
- A [Hugging Face](https://huggingface.co) API token with Inference access

### Setup

```bash
git clone https://github.com/clement1ne/minitrace.git
cd minitrace
npm install
```

Create `.env.local` with the required environment variables (see below), then start the dev server:

```bash
npx expo start --tunnel
```

Scan the QR code with Expo Go to open the app on your device.

### Environment Variables

All client-accessible variables must use the `EXPO_PUBLIC_` prefix (Expo convention). Create `.env.local` in the project root:

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_KEY` | Supabase publishable (anon) key |
| `EXPO_PUBLIC_HF_TOKEN` | Hugging Face API token |
| `EXPO_PUBLIC_POLYGON_RPC_URL` | Polygon Amoy RPC endpoint |
| `EXPO_PUBLIC_CONTRACT_ADDRESS` | Deployed `ProductPassport` contract address |

### Scripts

| Command | Description |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run android` | Start with Android emulator |
| `npm run ios` | Start with iOS simulator |
| `npm run web` | Start web preview |
| `npm run lint` | Run ESLint |

There are no tests, CI, or pre-commit hooks. Lint is the only quality gate.

## Architecture

MiniTrace consists of five components:

```
Mobile App (Expo)  ──→  Supabase (Auth + Database)
     │                        │
     ├──→ Hugging Face AI     │
     │    (product analysis)  │
     │                        │
     └──→ Polygon Amoy        │
          (Smart Contract)    │
                              │
Public Web Viewer (Vercel) ───┘
```

- **Expo mobile app** handles user authentication, photo capture, AI product analysis, passport creation, QR code generation, and blockchain anchoring.
- **Supabase** provides Postgres database storage, user authentication, and Row Level Security.
- **Hugging Face** analyzes product photos and returns structured JSON (product name, category, materials, sustainability data).
- **Polygon smart contract** stores content hashes on-chain for immutable authenticity verification.
- **Vercel-hosted Next.js page** serves as a public passport viewer accessible via QR code.

## Project Structure

```
minitrace/
├── src/
│   ├── app/                  # Expo Router screens (file-based routing)
│   │   ├── auth/             # Login, signup
│   │   ├── tabs/             # Dashboard, my-passports, profile
│   │   ├── create-passport/  # Wizard: photos → AI processing → review
│   │   ├── passport/         # [id] detail view, qr/[id] QR display
│   │   └── constants/        # Design tokens (Colors, Typography, Spacing)
│   ├── lib/
│   │   ├── ai/               # Hugging Face inference client
│   │   ├── supabase/         # Auth service + DB helpers
│   │   └── blockchain/       # viem client + contract ABI
│   ├── store/                # Zustand stores (user, passport)
│   └── utils/                # Supabase client singleton
├── blockchain/               # Hardhat project (smart contract)
│   ├── contracts/            # ProductPassport.sol
│   ├── scripts/              # deploy.js
│   └── hardhat.config.js
├── immutable-web/            # Next.js public passport viewer
│   └── passport/
│       └── [id].tsx
├── assets/                   # Images, icons, fonts
├── app.json                  # Expo config (EAS project ID, plugins)
├── vercel.json               # Vercel SPA rewrite config
└── .env.local                # Environment variables (git-ignored)
```

## Features

- **User Authentication** — Email/password sign-up and sign-in via Supabase Auth
- **Photo Capture** — Take or select product photos using the device camera
- **AI Product Analysis** — Photos analyzed by Gemma 4B via Hugging Face, returning product name, category, materials, and sustainability data
- **Digital Passport Creation** — Structured product record saved to Supabase with linked photos
- **QR Code Generation** — Scannable QR code for each passport linking to the public web viewer
- **Blockchain Anchoring** — Content hash stored on Polygon Amoy via `ProductPassport.sol` smart contract
- **Public Passport Viewer** — Web-based detail page hosted on Vercel with blockchain proof links
- **Dashboard** — Overview of user's products with real passport counts

## Blockchain

The `ProductPassport` smart contract is deployed on Polygon Amoy (testnet).

**Contract functions:**
- `anchorHash(passportId, contentHash)` — Records a content hash on-chain with timestamp and recorder address
- `verifyHash(contentHash)` — Returns whether a hash exists and its associated metadata

**Deploy the contract:**

```bash
cd blockchain
cp .env.example .env    # fill in DEPLOYER_PRIVATE_KEY
npx hardhat run scripts/deploy.js --network amoy
```

The deploy script writes the contract address and ABI to `src/lib/blockchain/contract.json` for the mobile app to consume.

## Deployment

| Component | URL |
|---|---|
| Expo project | https://expo.dev/accounts/goyza/projects/minitrace |
| EAS build | https://expo.dev/accounts/goyza/projects/minitrace/builds/d3a8bbb8-486f-4192-8ef8-b6a61b44b85f |
| Vercel (web viewer) | https://minitrace-52pd.vercel.app |
| Supabase backend | https://pzkfveznmaqwycrdveva.supabase.co |
| Smart contract | https://amoy.polygonscan.com (Polygon Amoy) |
| Source code | https://github.com/clement1ne/minitrace |

