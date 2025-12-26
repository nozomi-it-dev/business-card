# Nozomi Business Card

## Overview

This project is a web application developed with **React**, **Vite**, and **Firebase** to streamline the creation and management of business cards for Nozomi Enterprise. It serves three main purposes: an administrative interface for creating and editing cards, a centralized storage for all employee cards, and a public-facing view for clients. When clients scan a QR code or visit a specific link, they are presented with the name card which is automatically processed and loads automatically onto the device.

## Features

* **Master Password**: Secures the creation and editing functionalities via a cookie-based authentication system.
* **Card Creation**: A user-friendly interface to input employee details (Thai/English names, Position, Telephone, Email) with a real-time visual preview of the card.
* **Card Storage**: A dedicated page displaying a complete list of all created business cards, allowing users to easily browse and search for specific entries.
* **Image Generation**: Converts HTML layouts into high-quality images for downloading using canvas rendering technologies.
* **Public View**: A clean, dedicated interface (`/view/:id`) designed for external clients to view the specific name card and QR code.
* **Auto-Download**: Automatically triggers the download of the business card image when a client visits the viewing link.

## Usage

1. **Authentication**: Enter the Master Password to unlock administrative privileges (Create, Update, Save).
2. **Create Card**: Navigate to the "New Card" tab, fill in the required personnel information, and click "CREATE" to save to the database.
3. **Browse Cards**: Access the "Storage" tab to view the list of all existing cards. Click on a specific entry to view or edit the data.
4. **Manual Download**: Use the "DOWNLOAD" button within the editor to generate and save the card image manually for administrative use.
5. **Client Access**: Share the QR code with a client; when scanned, they are directed to the card's specific display page.
6. **Automatic Saving**: Upon accessing the viewing page, the name card image is automatically processed and downloaded to the client's device.

## License

This project is licensed under the **MIT License**.