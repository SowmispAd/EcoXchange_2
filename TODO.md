# TODO - EcoXchange Phase 4

## Wallet + Ledger + Settlement (Production Module)

- [ ] Create/extend models
  - [ ] Wallet is already present (`server/src/models/Wallet.js`)
  - [ ] LedgerTransaction: reuse `LedgerEntry` (verify it matches required fields; extend if needed)
  - [ ] Create `MarketplaceOrder` model (commission/settlement fields)
  - [ ] Create `RevenueRecord` model
  - [ ] Create `RecyclerInvoice` model

- [ ] Implement services (transactional/atomic)
  - [ ] LedgerService (centralized ledger posting)
  - [ ] WalletService upgrade (atomic balance movements w/ Mongo sessions)
  - [ ] RevenueService (create revenue record + credit admin wallet)
  - [ ] SettlementService (marketplace settlement after 3 days)
  - [ ] WithdrawalService (approval + payout + ledger)
  - [ ] PaymentService extensions (razorpay flows for marketplace/recycler/upgrade)

- [ ] Implement controllers + routes
  - [ ] Wallet endpoints
    - [ ] `GET /api/wallet/me`
    - [ ] `GET /api/wallet/transactions` (map to existing `/ledger` or rename)
    - [ ] `POST /api/wallet/convert-rewards` (missing)
  - [ ] Withdrawals endpoints
    - [ ] `POST /api/withdrawals/request`
    - [ ] `GET /api/withdrawals/me`
    - [ ] `GET /api/admin/withdrawals`
    - [ ] `PATCH /api/admin/withdrawals/:id`
  - [ ] Marketplace settlement endpoint
    - [ ] `POST /api/marketplace/orders/:id/complete`
  - [ ] Payment endpoints (Razorpay)
    - [ ] `POST /api/payments/create-upgrade-order`
    - [ ] `POST /api/payments/verify-upgrade`
    - [ ] `POST /api/payments/create-recycler-order`
    - [ ] `POST /api/payments/verify-recycler`
    - [ ] `POST /api/payments/create-marketplace-order`
    - [ ] `POST /api/payments/verify-marketplace`
  - [ ] Admin revenue APIs
    - [ ] `GET /api/admin/revenue/summary`
    - [ ] `GET /api/admin/revenue/charts`
    - [ ] `GET /api/admin/revenue/transactions`
  - [ ] Recycler endpoints
    - [ ] `GET /api/recycler/invoices`
    - [ ] `POST /api/recycler/invoices/:id/pay`

- [ ] Seed realistic demo financial data
  - [ ] Update `server/src/seeds/seedEcoXchangeDemo.js`
    - [ ] Wallet balances for demo users
    - [ ] Marketplace sales + settlementDate in past/future
    - [ ] Pending withdrawals + approved/processing sample
    - [ ] Recycler invoices paid/unpaid
    - [ ] Revenue records and ledger variety

- [ ] Quality
  - [ ] `npm run build`/start smoke test
  - [ ] `npm run seed` produces consistent financial dataset
  - [ ] Ensure centralized error handling + consistent API responses
  - [ ] Add/verify mongoose indexes

## Phase 4 History

- [x] Add Notification system
- [x] Add Rewards system
- [x] Add Membership Plans + Razorpay integration (membership only)
- [x] Add Analytics dashboard APIs
- [x] Update app.js to mount new routes
