/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Debug middleware
app.use((req, res, next) => {
  console.log('Request:', req.method, req.originalUrl);
  next();
});

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10kb" }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api/", limiter);

// Prevent direct access to .html files
app.use((req, res, next) => {
  if (req.path.endsWith('.html')) {
    return res.redirect(req.path.replace('.html', ''));
  }
  next();
});

// Serve static files with proper MIME types
const staticOptions = {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    } else if (path.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.set('Content-Type', 'image/jpeg');
    }
  }
};

// Serve static files (CSS, JS, images) from Client/public
app.use("/public", express.static(path.join(__dirname, "../Client/public"), staticOptions));

// Serve admin static files
app.use("/publicAdmin", express.static(path.join(__dirname, "../Client/publicAdmin"), staticOptions));

// Admin Routes - harus didefinisikan sebelum route lainnya
const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

// API Routes
const apiRoutes = require("./routes/api");
const bookingRoutes = require("./routes/bookingRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");

app.use("/api", apiRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/schedules", scheduleRoutes);

// Route untuk halaman admin
app.get("/admin/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../Client/views/admin/login.html"));
});

// Route untuk halaman utama dan lainnya
const pages = ['', 'pesan', 'kode', 'pembayaran', 'selesai', 'jadwal'];
pages.forEach(page => {
  const routePath = page === '' ? '/' : `/${page}`;
  app.get(routePath, (req, res) => {
    const file = page === '' ? 'index.html' : `${page}.html`;
    res.sendFile(path.join(__dirname, "../Client/views", file));
  });
});

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Static Files with Security
app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/uploads"), {
    setHeaders: (res) => {
      res.set("X-Content-Type-Options", "nosniff");
    },
  })
);

// Error Handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// 404 Handler - harus di akhir
app.use((req, res) => {
  console.log('404 Not Found:', req.originalUrl);
  res.status(404).sendFile(path.join(__dirname, "../Client/views/404.html"));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Admin routes mounted at /admin');
  console.log('Static files served from:');
  console.log('- /public ->', path.join(__dirname, "../Client/public"));
});
