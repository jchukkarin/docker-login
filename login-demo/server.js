const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true,
  })
);

// ข้อมูลผู้ใช้ (mock demo)
const userDemo = {
  username: "admin",
  password: "1234",
};

// หน้า login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// ตรวจสอบ login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === userDemo.username && password === userDemo.password) {
    req.session.user = username;
    res.redirect("/dashboard");
  } else {
    res.send("<h3>❌ Username หรือ Password ไม่ถูกต้อง</h3><a href='/'>กลับไปหน้า Login</a>");
  }
});

// หน้า dashboard
app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
  } else {
    res.redirect("/");
  }
});

// ออกจากระบบ
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

const PORT = 8080;
app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
