#!/bin/bash
# 保存为 /usr/local/bin/backup_db.sh
# 记得 chmod +x /usr/local/bin/backup_db.sh

# 配置参数
DB_HOST="mysql"  # Docker容器名称
DB_USER="testuser"
DB_PASS="12345678" 
DB_NAME="test"
BACKUP_DIR="/backups"
LATEST_BACKUP="./server/db/test.sql"  # 始终覆盖这个文件
DATED_BACKUP="$BACKUP_DIR/blog_$(date +%Y%m%d_%H%M%S).sql"  # 带时间戳的备份
LOG_FILE="/var/log/blog_backup.log"
KEEP_DAYS=14  # 保留最近14天备份

# 在宿主机上创建备份目录(会自动映射到容器内)
mkdir -p "$BACKUP_DIR"

# 记录日志
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log "开始数据库备份..."

# 直接使用mysql客户端执行备份（不再通过docker exec）
if mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$LATEST_BACKUP" && 
   cp "$LATEST_BACKUP" "$DATED_BACKUP"; then
    log "备份成功: 已更新$LATEST_BACKUP 并创建$DATED_BACKUP"
    
    gzip "$DATED_BACKUP"
    log "带日期备份已压缩: ${DATED_BACKUP}.gz"
    
    find "$BACKUP_DIR" -name "blog_*.sql.gz" -mtime +$KEEP_DAYS -delete
    log "已清理超过${KEEP_DAYS}天的旧备份"
    
    chmod 644 "$LATEST_BACKUP"
else
    log "备份失败!"
    exit 1
fi