# Nozomi Business Card

## Overview

Web application built with **React**, **Vite**, and **Firebase** for creating and managing digital business cards for Nozomi Enterprise (Thailand) Co., Ltd. The app serves three roles: an admin interface for creating and editing cards, a storage page for browsing all employee cards, and a public view for clients who scan a QR code.

## Features

- **Authorization**: Cookie-based master password. Lock icon in the header unlocks create, update, and delete privileges. Authorization persists for 7 days.
- **Card Creation**: Form with real-time card preview. Validates phone number (10 digits) and email format. CREATE button appears only when all fields are valid.
- **Card Storage**: Searchable list of all cards with initials avatar. Authorized users can select and batch-delete multiple cards.
- **Card View**: Landscape-optimized view with full-size card on the left and QR code + card selector on the right.
- **Public View** (`/view/:id`): Auto-downloads the business card image when a client opens the link from a QR scan.
- **Image Download**: Generates a high-resolution PNG via canvas rendering. File named `Nozomi Business Card - [Name] ([Position]).png`.
- **Responsive**: Portrait and landscape layouts handled separately via CSS media queries.

## Setup

```bash
cp .env.example .env
# fill in Firebase credentials and master password
npm install
npm run dev
```

## Environment Variables

See `.env.example` for all required variables.

| Variable | Description |
|---|---|
| `VITE_FIREBASE_*` | Firebase project configuration |
| `VITE_MASTER_PASSWORD` | Password required to create, update, and delete cards |

## Usage

1. **Authorize**: Tap the lock icon (top right) and enter the master password.
2. **Create card**: Go to the New Card tab, fill in all fields, tap CREATE.
3. **Edit card**: Tap any card in Storage to open it in the editor, make changes, tap UPDATE.
4. **Delete cards**: In Storage, tap Edit, select one or more cards, tap Delete.
5. **View / Download**: Tap a card in edit mode to open the card view. The QR code links clients directly to the auto-download page.

## License

MIT
