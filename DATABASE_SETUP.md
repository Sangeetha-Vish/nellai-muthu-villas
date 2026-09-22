# Database Setup Guide - Nella Muthu Vilas

This guide provides step-by-step instructions for setting up the database and adding product/branch data to your Nella Muthu Vilas application.

## Prerequisites

- Node.js and npm installed
- Project dependencies installed (`npm install`)
- Terminal/Command Prompt open in the project directory

---

## Option A: Using Prisma Studio (Recommended)

Prisma Studio is a visual database editor that makes it easy to add and manage data.

### Step 1: Open Prisma Studio

```bash
npx prisma studio
```

This will:
- Start Prisma Studio on http://localhost:5555
- Automatically open it in your default browser

### Step 2: Add Products

1. In Prisma Studio, click on the **Product** model in the left sidebar
2. Click the **"Add record"** button (green plus icon)
3. Fill in the following fields for each product:

#### Product 1: Mysore Pak
- **id**: Leave blank (auto-generated)
- **name**: `Mysore Pak`
- **description**: `Traditional ghee-based sweet with a melt-in-mouth texture`
- **image**: `/images/mysore-pak.jpg`
- **price**: `450`
- **weight**: `500g`
- **tradition**: `Prepared using the authentic recipe passed down through generations`
- **available**: ✓ (checked)
- **createdAt**: Leave blank (auto-generated)
- **updatedAt**: Leave blank (auto-generated)

4. Click **"Save 1 change"**

#### Product 2: Badam Halwa
- **name**: `Badam Halwa`
- **description**: `Rich almond halwa made with pure ghee and premium almonds`
- **image**: `/images/badam-halwa.jpg`
- **price**: `650`
- **weight**: `500g`
- **tradition**: `Slow-cooked for hours to achieve the perfect consistency`
- **available**: ✓ (checked)

Click **"Save 1 change"**

#### Product 3: Kaju Katli
- **name**: `Kaju Katli`
- **description**: `Diamond-shaped cashew fudge with a delicate sweetness`
- **image**: `/images/kaju-katli.jpg`
- **price**: `750`
- **weight**: `500g`
- **tradition**: `Made with the finest cashews and traditional methods`
- **available**: ✓ (checked)

Click **"Save 1 change"**

#### Product 4: Gulab Jamun
- **name**: `Gulab Jamun`
- **description**: `Soft milk-solid dumplings soaked in rose-flavored syrup`
- **image**: `/images/gulab-jamun.jpg`
- **price**: `350`
- **weight**: `500g`
- **tradition**: `Served warm for the best experience`
- **available**: ✓ (checked)

Click **"Save 1 change"**

#### Product 5: Jangiri
- **name**: `Jangiri`
- **description**: `Crispy, coiled sweet with a vibrant orange color`
- **image**: `/images/jangiri.jpg`
- **price**: `400`
- **weight**: `500g`
- **tradition**: `A festival favorite, prepared fresh daily`
- **available**: ✓ (checked)

Click **"Save 1 change"**

#### Product 6: Milk Peda
- **name**: `Milk Peda`
- **description**: `Soft, creamy milk sweet with cardamom flavor`
- **image**: `/images/milk-peda.jpg`
- **price**: `380`
- **weight**: `500g`
- **tradition**: `Made from pure milk and traditional recipes`
- **available**: ✓ (checked)

Click **"Save 1 change"**

### Step 3: Add Branches

1. In Prisma Studio, click on the **Branch** model in the left sidebar
2. Click the **"Add record"** button

#### Branch 1: RS Puram
- **id**: Leave blank (auto-generated)
- **name**: `RS Puram`
- **location**: `123 Avinashi Road, RS Puram`
- **area**: `RS Puram`
- **timings**: `8:00 AM - 9:00 PM`
- **distance**: `2.5 km`
- **createdAt**: Leave blank (auto-generated)
- **updatedAt**: Leave blank (auto-generated)

Click **"Save 1 change"**

#### Branch 2: Gandhipuram
- **name**: `Gandhipuram`
- **location**: `456 Cross Cut Road, Gandhipuram`
- **area**: `Gandhipuram`
- **timings**: `8:00 AM - 9:30 PM`
- **distance**: `3.8 km`

Click **"Save 1 change"**

#### Branch 3: Saibaba Colony
- **name**: `Saibaba Colony`
- **location**: `789 Trichy Road, Saibaba Colony`
- **area**: `Saibaba Colony`
- **timings**: `7:30 AM - 9:00 PM`
- **distance**: `4.2 km`

Click **"Save 1 change"**

### Step 4: Verify Data

1. Click on **Product** model - you should see 6 products
2. Click on **Branch** model - you should see 3 branches
3. Close Prisma Studio (Ctrl+C in terminal or close the browser tab)

### Step 5: Test the Application

1. Start the development server (if not already running):
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000 in your browser

3. You should see:
   - Welcome screen for 3 seconds
   - Homepage with 6 products displayed
   - Branch selector with 3 branches

---

## Option B: Using Database Browser (Alternative)

If you prefer a different SQLite browser:

### Step 1: Install DB Browser for SQLite

Download from: https://sqlitebrowser.org/

### Step 2: Open Database

1. Open DB Browser for SQLite
2. Click **"Open Database"**
3. This legacy SQLite browser workflow is no longer supported. The application uses PostgreSQL configured in `server/.env`.
4. Click **"Open"**

### Step 3: Add Data

1. Click the **"Browse Data"** tab
2. Select **"Product"** table from dropdown
3. Click **"New Record"** button
4. Fill in the data (same as Option A above)
5. Repeat for all 6 products

6. Select **"Branch"** table from dropdown
7. Click **"New Record"** button
8. Fill in the data (same as Option A above)
9. Repeat for all 3 branches

### Step 4: Save Changes

1. Click **"Write Changes"** button
2. Close DB Browser for SQLite

---

## Troubleshooting

### Issue: Prisma Studio won't start

**Solution**:
```bash
# Regenerate Prisma Client from the backend
cd server
npm run prisma:generate

# Try again
npx prisma studio
```

### Issue: Database file not found

**Solution**:
```bash
# Apply PostgreSQL migrations
cd server
npm run prisma:migrate

# Then open Prisma Studio
npx prisma studio
```

### Issue: Products not showing on website

**Solution**:
1. Check that data was saved in Prisma Studio
2. Restart the dev server:
   ```bash
   # Press Ctrl+C to stop
   # Then restart:
   npm run dev
   ```
3. Hard refresh the browser (Ctrl+Shift+R or Ctrl+F5)

### Issue: Images not displaying

**Solution**:
- The images are already in `client/public/images/` and `admin/public/images/` folders
- Make sure the image paths in the database match exactly:
  - `/images/mysore-pak.jpg`
  - `/images/badam-halwa.jpg`
  - `/images/kaju-katli.jpg`
  - `/images/gulab-jamun.jpg`
  - `/images/jangiri.jpg`
  - `/images/milk-peda.jpg`

---

## Quick Reference: All Product Data

Copy-paste friendly format for quick entry:

### Products

| Name | Description | Image | Price | Weight | Tradition |
|------|-------------|-------|-------|--------|-----------|
| Mysore Pak | Traditional ghee-based sweet with a melt-in-mouth texture | /images/mysore-pak.jpg | 450 | 500g | Prepared using the authentic recipe passed down through generations |
| Badam Halwa | Rich almond halwa made with pure ghee and premium almonds | /images/badam-halwa.jpg | 650 | 500g | Slow-cooked for hours to achieve the perfect consistency |
| Kaju Katli | Diamond-shaped cashew fudge with a delicate sweetness | /images/kaju-katli.jpg | 750 | 500g | Made with the finest cashews and traditional methods |
| Gulab Jamun | Soft milk-solid dumplings soaked in rose-flavored syrup | /images/gulab-jamun.jpg | 350 | 500g | Served warm for the best experience |
| Jangiri | Crispy, coiled sweet with a vibrant orange color | /images/jangiri.jpg | 400 | 500g | A festival favorite, prepared fresh daily |
| Milk Peda | Soft, creamy milk sweet with cardamom flavor | /images/milk-peda.jpg | 380 | 500g | Made from pure milk and traditional recipes |

### Branches

| Name | Location | Area | Timings | Distance |
|------|----------|------|---------|----------|
| RS Puram | 123 Avinashi Road, RS Puram | RS Puram | 8:00 AM - 9:00 PM | 2.5 km |
| Gandhipuram | 456 Cross Cut Road, Gandhipuram | Gandhipuram | 8:00 AM - 9:30 PM | 3.8 km |
| Saibaba Colony | 789 Trichy Road, Saibaba Colony | Saibaba Colony | 7:30 AM - 9:00 PM | 4.2 km |

---

## Summary

✅ **Recommended**: Use Prisma Studio (Option A) - it's visual, easy, and built specifically for Prisma databases.

✅ **Alternative**: Use DB Browser for SQLite if you prefer a traditional database tool.

✅ **Time Required**: Approximately 10-15 minutes to add all data.

✅ **Verification**: After adding data, refresh your application to see products and branches displayed.

---

## Need Help?

If you encounter any issues:
1. Check the main [README.md](file:///c:/Users/sange/MyProjecct/nellamuthuvilas/README.md) for general setup
2. Ensure the dev server is running (`npm run dev`)
3. Check browser console for any errors (F12 → Console tab)
