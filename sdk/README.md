# InsightPilot JavaScript SDK

The official JavaScript SDK for InsightPilot. Track user behavior, page views, and sessions effortlessly.

## Installation

You can install the SDK via npm or yarn.

```bash
npm install @insightpilot/sdk
```

## Quick Start

Initialize the SDK as early as possible in your application lifecycle (e.g., in `index.js` or `App.js`).

```javascript
import insightPilot from '@insightpilot/sdk';

// Initialize with your Project Public Key
insightPilot.init('pk_your_project_public_key', {
  apiHost: 'https://api.insightpilot.com/api/v1',
  debug: true, // Set to false in production
  autoTrackPage: true // Automatically tracks initial page load
});
```

## Core API

### 1. Identify a User
When a user logs in or signs up, link their anonymous session to their actual User ID.

```javascript
insightPilot.identify('user_12345', {
  name: 'Jane Doe',
  email: 'jane@example.com',
  plan: 'Pro'
});
```

### 2. Track Custom Events
Track specific actions users take in your application.

```javascript
insightPilot.track('Item Purchased', {
  item_name: 'Wireless Mouse',
  price: 29.99,
  currency: 'USD'
});
```

### 3. Track Page Views
If you are building a Single Page Application (SPA) like React or Next.js, call `page()` on route changes.

```javascript
insightPilot.page('Checkout Page', {
  cart_value: 120.00
});
```

### 4. Reset Session
Call this when a user logs out to clear their identified data and start a fresh anonymous session.

```javascript
insightPilot.reset();
```

## Advanced Configuration
When calling `init()`, you can pass the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiHost` | string | `http://localhost:5000/api/v1` | URL of the InsightPilot Ingestion API |
| `batchSize` | number | `10` | Number of events to queue before sending a batch |
| `flushInterval` | number | `5000` | Max milliseconds to wait before flushing the queue |
| `debug` | boolean | `false` | Enable console logging for debugging |
| `autoTrackPage` | boolean | `true` | Send a `page` event immediately upon initialization |
