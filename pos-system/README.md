# POS Management System - Offline Browser-Based

A fully functional **offline Point of Sale system** built with vanilla JavaScript, Tailwind CSS, and IndexedDB (Dexie.js). All data is stored locally in the browser with no backend required.

## ✅ Features

- **Login System**: Default credentials (admin / admin123)
- **Dashboard**: Real-time metrics for products, customers, sales, and inventory
- **POS Checkout**: Quick sales entry with cart management and multiple payment methods
- **Products**: Add and manage product inventory with barcode tracking
- **Inventory**: Track stock movements (in/out) with full audit logs
- **Customers**: Manage customer contact information
- **Reports**: Sales analytics and financial summaries
- **Dark Mode UI**: Modern Tailwind CSS design with responsive layout
- **Offline-First**: All data persists in IndexedDB

## 📁 Project Structure

```
pos-system/
├── index.html              # Login page
├── dashboard.html          # Main dashboard
├── pos.html               # POS checkout page
├── products.html          # Product management
├── inventory.html         # Stock tracking
├── customers.html         # Customer management
├── reports.html           # Sales reports
├── css/
│   └── style.css          # Tailwind + custom styles
├── js/
│   ├── auth.js            # Authentication logic
│   ├── dashboard.js       # Dashboard page logic
│   ├── pos.js            # POS checkout logic
│   ├── products.js       # Products page logic
│   ├── inventory.js      # Inventory page logic
│   ├── customers.js      # Customers page logic
│   └── reports.js        # Reports page logic
├── database/
│   └── db.js             # Dexie.js database setup
└── components/
    ├── navbar.js         # Top navigation bar
    ├── sidebar.js        # Left sidebar navigation
    └── modal.js          # Dialog/modal helper
```

## 🚀 Getting Started

### Option 1: Local Development (Recommended)

```bash
# Navigate to the pos-system folder
cd pos-system

# Start a local HTTP server
python3 -m http.server 8000

# Open browser
http://localhost:8000
```

### Option 2: Direct File Access
Simply open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge).

## 🔐 Default Credentials

```
Username: admin
Password: admin123
```

## 📊 Database Schema (IndexedDB)

The system uses Dexie.js to manage IndexedDB with the following stores:

- **users**: Admin user credentials and roles
- **products**: Inventory items with barcode, name, category, stock, and price
- **customers**: Customer contact information
- **sales**: Transaction records with totals and payment methods
- **saleItems**: Line items for each sale
- **stockLogs**: Audit trail of all inventory movements

## 🎨 Tech Stack

- **UI Framework**: Tailwind CSS (CDN)
- **Database**: IndexedDB with Dexie.js
- **Language**: Vanilla JavaScript (ES Modules)
- **Architecture**: Client-side MVC pattern

## ✨ Key Pages

| Page | Purpose | Features |
|------|---------|----------|
| Login | Authentication | Default admin user, remember me option |
| Dashboard | Overview | Metrics for products, customers, sales, stock logs |
| POS | Sales Entry | Product search, cart, checkout, multiple payment methods |
| Products | Inventory | Add new products, view all items by category |
| Inventory | Stock Audit | Track stock in/out, view full history |
| Customers | CRM | Add customers, view contact details |
| Reports | Analytics | Sales summaries, revenue tracking, transaction history |

## 🔧 Troubleshooting

### Login not working?
- Check browser console for errors (F12)
- Ensure IndexedDB is enabled in browser
- Clear browser cache and reload
- Try a different browser if issues persist

### Data not persisting?
- Verify IndexedDB is not disabled in browser settings
- Check browser storage quota
- Clear old IndexedDB entries if storage is full

### Styling not loading?
- Ensure Tailwind CDN is accessible
- Check network tab in DevTools for CSS errors
- Verify internet connection

## 📝 Usage Tips

1. **Add Products First**: Stock the system with products before processing sales
2. **Manage Inventory**: Use the Inventory page to track stock movements
3. **Customer Profiles**: Add customers to track purchase history
4. **POS Checkout**: Use barcode or product name to quickly add items
5. **Check Reports**: Review sales data and financial metrics

## 🌟 Future Enhancements

- Multi-user support with different roles
- Barcode scanner integration
- Receipt printing
- Data export (CSV/PDF)
- Cloud sync option
- Mobile app version

## 📄 License

Open source - feel free to modify and distribute.

---

**Built for offline retail operations** ✓
