# Privacy Policy for Traceform: UI Mapping Browser Extension

**Last Updated:** April 13, 2025

This Privacy Policy describes how the Traceform: UI Mapping browser extension ("Extension"), developed by LucidLayer ("we", "us", or "our"), handles information.

## 1. Extension Purpose

The sole purpose of the Traceform: UI Mapping extension is to visually connect user interface (UI) elements displayed in your browser with their corresponding source code selected in your VS Code editor. It achieves this by highlighting the relevant UI element on the webpage based on instructions received locally from the Traceform VS Code extension.

## 2. Information Handling

**The Extension does NOT collect, store, transmit, or handle any personal data or sensitive user information.**

*   **No Personal Data:** We do not collect any Personally Identifiable Information (PII) such as names, addresses, email addresses, age, identification numbers, etc.
*   **No Sensitive Data:** We do not collect health information, financial/payment information, authentication information (passwords, credentials), personal communications, location data, web history, user activity (clicks, mouse position, keystrokes), or website content (text, images, etc.).
*   **Local Communication Only:** The Extension communicates *exclusively* with a local bridge server running on your own machine, which is part of the Traceform VS Code extension installation. It receives instructions (like CSS selectors or component identifiers) based on *your* actions within *your* local VS Code editor. It does not send any data from your browser or your activity to any remote server.
*   **No Remote Code:** The Extension does not download or execute any remote code. All its operational code is included within the extension package reviewed by the browser's extension store.

## 3. Permissions Justification

The Extension requires the following permissions solely to fulfill its single purpose:

*   **`scripting`:** This permission is necessary to inject the required scripts (`content.js`) and styles (`styles.css`) into the web pages you visit. These scripts are responsible for receiving local instructions and applying the visual highlighting effect to the designated UI elements on the page.
*   **Host Permission (`<all_urls>`):** Access to all URLs is required so the extension can function on any webpage you might be developing or debugging. This allows the highlighting feature to work consistently across different development environments and websites without requiring you to manually grant permission for each site. The extension only interacts with a page when instructed by your actions in the VS Code editor via the local bridge server; it does not monitor or collect data from these pages otherwise.

## 4. Data Usage Certification

We certify that:
*   We do not sell or transfer user data to third parties.
*   We do not use or transfer user data for purposes unrelated to the Extension's single purpose (visually connecting code to UI elements locally).
*   We do not use or transfer user data to determine creditworthiness or for lending purposes.

## 5. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy within the extension listing or on our website. You are advised to review this Privacy Policy periodically for any changes.

## 6. Contact Us

If you have any questions about this Privacy Policy, please contact us at: [Your Contact Email Address]
