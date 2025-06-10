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

mkdir -p "$BACKUP_DIR"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log "开始数据库备份..."

# 添加 --no-tablespaces 参数避免权限问题
if mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" \
   --no-tablespaces \
   "$DB_NAME" > "$LATEST_BACKUP" && 
   cp "$LATEST_BACKUP" "$DATED_BACKUP"; then
    log "备份成功"
    
    gzip "$DATED_BACKUP"
    find "$BACKUP_DIR" -name "blog_*.sql.gz" -mtime +$KEEP_DAYS -delete
    chmod 644 "$LATEST_BACKUP"
else
    log "备份失败! 错误码: $?"
    log "尝试使用root用户备份..."
    
    # 备用方案: 使用root账户
    if mysqldump -h "$DB_HOST" -u root -p"root_password" \
       "$DB_NAME" > "$LATEST_BACKUP"; then
        log "使用root账户备份成功"
        cp "$LATEST_BACKUP" "$DATED_BACKUP"
        gzip "$DATED_BACKUP"
    else
        log "所有备份尝试均失败"
        exit 1
    fi
fi