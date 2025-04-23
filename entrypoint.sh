MYSQL_HOST=${DATABASE_HOST:-mysql}
echo "等待外部 MySQL ($MYSQL_HOST) 启动..."

# 等待外部 MySQL 启动完成
until mysqladmin ping -h "$MYSQL_HOST" --silent; do
    sleep 2
done
echo "MySQL 已启动."

# 创建数据库 test 及用户 testuser（请确保在外部 MySQL 中 root 密码正确）
echo "创建数据库 test 及用户 testuser..."
mysql -h "$MYSQL_HOST" -u root -proot_password <<-SQL
  CREATE DATABASE IF NOT EXISTS test;
  CREATE USER IF NOT EXISTS 'testuser'@'%' IDENTIFIED BY '12345678';
  GRANT ALL PRIVILEGES ON test.* TO 'testuser'@'%';
  FLUSH PRIVILEGES;
SQL

# 初始化项目
chmod +x ./initProject.sh
./initProject.sh

# 启动 nginx
echo "启动 nginx..."
nginx -g 'daemon off;'