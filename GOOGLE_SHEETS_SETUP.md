# Google Sheets Setup Guide

To sync your website data to Google Sheets, follow these 4 steps:

### 1. Create a Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new sheet.
2. Copy the **ID** from the URL. 
   - Example URL: `https://docs.google.com/spreadsheets/d/1abc12345/edit`
   - The ID is: `1abc12345`
3. Open `google-config.json` in your project and replace `YOUR_SPREADSHEET_ID_HERE` with your ID.

### 2. Get Google API Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., "EpnMove-Submissions").
3. Enable the **Google Sheets API**.
4. Go to **Credentials** -> **Create Credentials** -> **Service Account**.
5. Give it a name, click "Create and Continue", then "Done".
6. In the Service Account list, click on your new account -> **Keys** -> **Add Key** -> **Create New Key** (JSON).
7. A file will download. Rename it to `google-credentials.json` and move it into your `Eon move website` folder.

### 3. Share the Sheet
1. Open your `google-credentials.json` file.
2. Copy the `client_email` (e.g., `account-name@project-id.iam.gserviceaccount.com`).
3. Open your Google Sheet, click **Share**, and paste that email. Give it **Editor** access.
4. Also share the sheet with your senior's email!

### 4. Restart Server
Restart your Node.js server. Now, every submission will appear in the Google Sheet instantly!

---

**Note**: I have kept the local Excel backup as well. If the internet is down, the data is still saved on your computer!
