require('dotenv').config(); // Nạp biến môi trường từ file .env
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 80;
const SECRET_KEY = process.env.JWT_SECRET;

app.use(express.json());
app.use(express.static('my-website'));

// ==============================================================
// KẾT NỐI DATABASE (Dùng biến môi trường để bảo mật credentials)
// ==============================================================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Da ket noi thanh cong voi Database tren Cloud!'))
  .catch((err) => console.error('Loi ket noi Database:', err));

// Cập nhật Schema: Thêm trường role để phân quyền RBAC
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' } // Phân quyền mặc định
});
const User = mongoose.model('User', userSchema);

// =========================================================
// 1. API ĐĂNG KÝ (Nâng cấp: Lưu kèm vai trò người dùng)
// =========================================================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ msg: "Tên đăng nhập hoặc Email đã được sử dụng!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Chỉ cho phép set role nếu dữ liệu hợp lệ, mặc định là student
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword,
            role: role || 'student' 
        });
        await newUser.save();

        res.status(200).json({ msg: "Đăng ký thành công!" });
    } catch (error) {
        res.status(500).json({ msg: "Lỗi Server" });
    }
});

// =========================================================
// 2. API ĐĂNG NHẬP (Nâng cấp: Trả về token chứa Role thực tế)
// =========================================================
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ msg: "Tên đăng nhập không tồn tại!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ msg: "Mật khẩu không chính xác!" });

        // Payload giờ đây chứa Role thực tế từ Database thay vì gán cứng
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            SECRET_KEY, 
            { expiresIn: '1m' }
        );

        res.status(200).json({
            message: "Đăng nhập thành công",
            token: token,
            username: user.username,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ msg: "Lỗi Server" });
    }
});

// =========================================================
// 3. MIDDLEWARE KIỂM SOÁT QUYỀN TRUY CẬP (IAM)
// =========================================================

// Bước 1: Xác thực Token (Người dùng có thẻ hay không?)
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(403).json({ msg: "Truy cập bị từ chối! Không có token." });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(401).json({ msg: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};

// Bước 2: Kiểm tra vai trò (Thẻ này có quyền vào phòng này không?)
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: "Bạn không có quyền thực hiện hành động này!" });
        }
        next();
    };
};

// =========================================================
// 4. CÁC ĐIỂM CUỐI (ENDPOINTS) ĐÃ ĐƯỢC BẢO VỆ
// =========================================================

// Bài học VIP: Dành cho cả student và admin có token
app.get('/api/lessons/vip', verifyToken, (req, res) => {
    res.status(200).json({ msg: "Chào mừng bạn đến với bài học VIP!", user: req.user });
});

// Quản lý hệ thống: Chỉ duy nhất ADMIN mới được vào
app.post('/api/admin/add-lesson', verifyToken, checkRole(['admin']), (req, res) => {
    res.status(200).json({ msg: "Admin đã thêm bài giảng thành công!" });
});

app.listen(PORT, () => {
    console.log(`Web server MunLish dang chay tren port ${PORT}...`);
});