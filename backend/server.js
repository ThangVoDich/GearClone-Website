const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // 👈 Thêm dòng này
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:8889", credentials: true })); // 👈 Sửa ở đây
app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(5050, () => console.log("Backend running on port 5050"));
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);
const guestOrderRoutes = require("./routes/guestOrderRoutes");
app.use("/api/guest-orders", guestOrderRoutes);
const discountRoutes = require("./routes/discountRoutes");
app.use("/api/discounts", discountRoutes);
const commentRoutes = require('./routes/commentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);
