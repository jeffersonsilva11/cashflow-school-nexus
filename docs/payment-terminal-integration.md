
# Payment Terminal Integration Guide

This guide provides information on integrating payment terminals (like Stone, Mercado Pago, PagSeguro) with the Cashflow School Nexus platform.

## Overview

The integration allows physical payment terminals in cafeterias to communicate with the central platform to:

1. Process payment transactions
2. Synchronize transaction data
3. Update terminal status
4. Retrieve configuration settings

## Android App Integration

### Required SDKs

For Stone integration:
- Stone SDK ([GitHub link](https://github.com/stone-payments/sdk-android-V2))
- Follow the official [Stone Integration Guide](https://sdkandroid.stone.com.br/docs/setup)

For Mercado Pago:
- [Mercado Pago Mobile Checkout SDK](https://github.com/mercadopago/sdk-android)

For PagSeguro:
- [PagSeguro Modular SDK](https://dev.pagseguro.uol.com.br/docs/checkout-mobile-android)

### Integration Steps

1. Create an Android app with the payment terminal SDK
2. Configure the terminal with credentials from our platform
3. Set up the communication with the server API

### API Endpoints

The platform provides the following endpoints:

```
POST /terminal-api/process - Process a new transaction
POST /terminal-api/sync - Synchronize pending transactions
POST /terminal-api/status - Update terminal status
GET /terminal-api/config - Get terminal configuration
```

## Authentication

All requests to the API must include an API key in the `Authorization` header:

```
Authorization: Bearer YOUR_TERMINAL_API_KEY
```

## Processing Transactions

To process a transaction, send a POST request to `/terminal-api/process` with:

```json
{
  "terminal_id": "STN12345",
  "transaction_id": "UNIQUE_TRANSACTION_ID",
  "amount": 1250, // in cents
  "payment_method": "debit",
  "card_brand": "Visa",
  "installments": 1,
  "authorization_code": "123456",
  "nsu": "987654321",
  "student_id": "STUDENT_ID", // optional
  "vendor_id": "VENDOR_ID",
  "school_id": "SCHOOL_ID",
  "timestamp": "2025-05-03T14:30:00Z"
}
```

## Transaction Types

The system supports the following transaction types:
- `purchase`: Regular purchase transaction
- `refund`: Refund of a previous transaction
- `cancellation`: Cancellation of a transaction

## Payment Methods

Supported payment methods:
- `credit`: Credit card
- `debit`: Debit card
- `pix`: PIX payment
- `voucher`: Voucher/meal tickets
- `other`: Other methods

## Sync Mechanism

The terminal should synchronize transactions periodically and when connectivity is restored after being offline:

```json
{
  "terminal_id": "STN12345",
  "transactions": [
    {
      "transaction_id": "TRANS123",
      "amount": 1000,
      "status": "completed",
      "type": "purchase",
      "payment_method": "debit",
      "vendor_id": "VENDOR_ID",
      "school_id": "SCHOOL_ID",
      "timestamp": "2025-05-03T12:30:00Z"
    },
    {
      "transaction_id": "TRANS124",
      "amount": 1500,
      "status": "completed",
      "type": "purchase",
      "payment_method": "credit",
      "vendor_id": "VENDOR_ID",
      "school_id": "SCHOOL_ID",
      "timestamp": "2025-05-03T12:35:00Z"
    }
  ]
}
```

## Terminal Status Updates

The terminal should regularly update its status:

```json
{
  "terminal_id": "STN12345",
  "status": "active",
  "battery_level": 85,
  "firmware_version": "2.5.1",
  "connection_status": "online"
}
```

## Student Identification

For cafeteria purchases, students can be identified via:
- Student card with barcode/QR code
- RFID wristband
- Biometric identification

The Android app should be able to read these identification methods and include the student ID in the transaction data.

## Demo App

A demo Android app will be provided to showcase:
- SDK Integration
- Transaction Processing
- Offline Operation
- Sync Mechanism
- Error Handling

## Testing

For testing, we provide:
- Test API keys
- Sandbox endpoints
- Terminal simulator for development
