-- 确保 testuser 存在
CREATE USER IF NOT EXISTS 'testuser'@'%' IDENTIFIED BY '12345678';

-- 赋予 testuser 对 blog 数据库的所有权限
GRANT ALL PRIVILEGES ON blog.* TO 'testuser'@'%';

-- 刷新权限，使更改生效
FLUSH PRIVILEGES;
