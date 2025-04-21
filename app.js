const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

// Paths
const usersPath = path.join(__dirname, 'data', 'users.json');
const listingsPath = path.join(__dirname, 'data', 'listings.json');

// Helper to read JSON
const readJson = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    return [];
  }
};

// Helper to write JSON
const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// --- USER ROUTES ---
// Register
app.post('/api/register', (req, res) => {
  const { username, email, phone, role } = req.body;
  if (!username || !email || !phone || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const users = readJson(usersPath);
  if (users.find(user => user.email === email)) {
    return res.status(409).json({ success: false, message: 'Email already registered.' });
  }

  users.push({ username, email, phone, role });
  writeJson(usersPath, users);
  res.json({ success: true, message: 'Registration successful!' });
});

// Login
app.post('/api/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

  const users = readJson(usersPath);
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email. Please register first.' });
  }

  res.json({ success: true, message: 'Login successful!', data: user });
});

// --- LISTINGS ROUTES ---
// Get all listings
app.get('/api/listings', (req, res) => {
  const listings = readJson(listingsPath);
  res.json({ success: true, data: listings });
});

// Add listing
app.post('/api/listings', (req, res) => {
  const newListing = { id: Date.now(), ...req.body };
  const listings = readJson(listingsPath);

  listings.push(newListing);
  writeJson(listingsPath, listings);
  res.json({ success: true, message: 'Listing added successfully.', data: newListing });
});

// Update listing
app.put('/api/listings/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const listings = readJson(listingsPath);
  const index = listings.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Listing not found.' });
  }

  listings[index] = { ...listings[index], ...req.body };
  writeJson(listingsPath, listings);
  res.json({ success: true, message: 'Listing updated.', data: listings[index] });
});

// Delete listing
app.delete('/api/listings/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let listings = readJson(listingsPath);
  const beforeLength = listings.length;

  listings = listings.filter(item => item.id !== id);
  if (listings.length === beforeLength) {
    return res.status(404).json({ success: false, message: 'Listing not found.' });
  }

  writeJson(listingsPath, listings);
  res.json({ success: true, message: 'Listing deleted.' });
});

// Update profile
app.put('/api/profile/:email', (req, res) => {
    const oldEmail = req.params.email.trim().toLowerCase();
    const { username, phone, email: newEmail } = req.body;
  
    if (!username || !phone || !newEmail) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
  
    const users = readJson(usersPath);
    const userIndex = users.findIndex(u => u.email.toLowerCase() === oldEmail);
  
    if (userIndex === -1) {
      console.log("User not found:", oldEmail);
      return res.status(404).json({ success: false, message: "User not found." });
    }
  
    const updatedUser = {
      ...users[userIndex],
      username,
      phone,
      email: newEmail.trim().toLowerCase()
    };
    users[userIndex] = updatedUser;
    writeJson(usersPath, users);
    console.log("User updated:", updatedUser);
  
    if (updatedUser.role === "owner") {
      const listings = readJson(listingsPath);
      const updatedListings = listings.map(listing => {
        if (listing.ownerEmail.trim().toLowerCase() === oldEmail) {
          return {
            ...listing,
            ownerEmail: updatedUser.email,
            ownerPhone: updatedUser.phone
          };
        }
        return listing;
      });
      writeJson(listingsPath, updatedListings);
      console.log("Listings updated for owner:", updatedUser.email);
    }
  
    res.json({ success: true, message: "Profile and listings updated!", data: updatedUser });
  });
  
// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
