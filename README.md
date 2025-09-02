# Telefly

A cross-platform third-party desktop client for Telegram built with Electron, React, TypeScript, and Vite.

## About

Telefly is a modern, feature-rich desktop application that provides an alternative to the official Telegram desktop client. Built with Electron for cross-platform compatibility, it offers a native desktop experience while maintaining the familiar Telegram interface and functionality.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Desktop**: Electron
- **Package Manager**: Compatible with npm, pnpm, and Bun

## Screenshots

![Screenshot](screenshots/1.png)
![Screenshot](screenshots/2.png)
![Screenshot](screenshots/3.png)
![Screenshot](screenshots/4.png)

## Roadmap

### v0.1 - In Development

- 🔄 Login (phone, QR code)
- 🔄 Logout
- 🔄 Messaging (text, photo, video, documents)

### v0.2

- 🔄 Voice messages
- 🔄 Video messages
- 🔄 Search functionality
- 🔄 Code highlighting
- 🔄 Call alternatives - meeting creation (Google Meet, Zoom, etc.)
- 🔄 Multiple accounts support

## Prerequisites

- Node.js 18+ or Bun 1.0+
- Git
- Telegram API credentials (see [Setup](#setup) section)

## Setup

### Getting Telegram API Credentials

Before running the application, you need to obtain Telegram API credentials:

1. **Go to [my.telegram.org](https://my.telegram.org)**
2. **Log in with your phone number**
3. **Go to "API development tools"**
4. **Create a new application:**
   - App title: `Telefly` (or any name you prefer)
   - Short name: `telefly` (or any short name)
   - Platform: `Desktop`
   - Description: `A cross-platform Telegram desktop client`
5. **Copy your `api_id` and `api_hash`**

### Environment Configuration

1. **Copy the example environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file and add your credentials:**

   ```env
   TELEGRAM_API_ID=your_api_id_here
   TELEGRAM_API_HASH=your_api_hash_here
   ```

   Replace `your_api_id_here` with your actual API ID (number) and `your_api_hash_here` with your actual API hash (string).

3. **Never commit the `.env` file** - it's already in `.gitignore` to prevent accidental commits.

## Installation

Choose your preferred package manager:

### Using npm

```bash
npm install
```

### Using pnpm

```bash
pnpm install
```

### Using Bun (recommended for faster installs)

```bash
bun install
```

## Development

### Using npm

```bash
npm run dev
```

### Using pnpm

```bash
pnpm dev
```

### Using Bun

```bash
bun run dev
```

## Build

### Using npm

```bash
npm run build
```

### Using pnpm

```bash
pnpm build
```

### Using Bun

```bash
bun run build
```

## Available Scripts

- `dev` - Start development mode (builds both renderer and main process, then starts Electron)
- `build` - Build for production
- `build:renderer` - Build React app only
- `build:electron` - Build Electron main process only
- `electron` - Run the built Electron app
- `preview` - Preview the built React app

## Project Structure

```
telefly/
├── src/                 # React app source code
├── electron/            # Electron main process and preload scripts
├── dist/                # Built React app
├── dist-electron/       # Built Electron main process
├── vite.config.ts       # Vite configuration
└── package.json         # Project configuration
```

## Development Workflow

1. The `dev` script runs three processes concurrently:
   - Vite dev server for React (port 3000)
   - TypeScript compilation for Electron
   - Electron app that connects to the dev server

2. Changes to React code will hot-reload in the Electron window
3. Changes to Electron code require restarting the dev process

## Contributing

### Getting Started

1. **Fork the repository** and clone your fork
2. **Set up your environment** following the [Setup](#setup) section above
3. **Install dependencies** using your preferred package manager
4. **Start development** with `npm run dev`, `pnpm dev`, or `bun run dev`

### Development Guidelines

- This project is compatible with npm, pnpm, and Bun
- Choose your preferred package manager:
  - **npm**: Standard Node.js package manager
  - **pnpm**: Fast, disk space efficient
  - **Bun**: Fastest installs and runtime
- All package managers will work identically for development and building

### Important Notes

- **Never commit your `.env` file** - it contains sensitive API credentials
- **Use the `.env.example` file** as a template for setting up your environment
- **API credentials are required** for the application to function - the app will show an error if they're missing or invalid
- **Each developer needs their own API credentials** - don't share your credentials with others

### Troubleshooting

If you encounter issues:

1. **Check your `.env` file** - ensure it exists and contains valid credentials
2. **Verify API credentials** - make sure they're correct and active
3. **Check the console** - look for error messages in the Electron console
4. **Restart the development server** - sometimes required after environment changes
