const jwt = require('jsonwebtoken');

// 1. Kiểm tra xem người dùng có Thẻ JWT hợp lệ không
const verifyToken = (req, res, next) => {
    // Lấy token từ header của request (thường có dạng "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Từ chối truy cập: Không tìm thấy Token!" });
    }

    try {
        // Giải mã token bằng Khóa bí mật
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Gắn thông tin người dùng (userId, role) vào req để các bước sau sử dụng
        req.user = decoded; 
        
        next(); // Mời đi tiếp vào hệ thống
    } catch (error) {
        return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};

// 2. Kiểm tra quyền hạn (Đặc quyền tối thiểu)
const requireRole = (roleRequired) => {
    return (req, res, next) => {
        // req.user đã được tạo ra từ hàm verifyToken ở trên
        if (!req.user || req.user.role !== roleRequired) {
            return res.status(403).json({ message: `Từ chối truy cập: Yêu cầu quyền ${roleRequired}` });
        }
        next(); // Đủ thẩm quyền, cho phép thao tác
    };
};

module.exports = { verifyToken, requireRole };