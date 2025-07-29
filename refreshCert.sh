HOST_CERT_DIR="./cert"

# 证书文件名
PEM_FILE="hasunemiku.top.pem"
KEY_FILE="hasunemiku.top.key"

CONTAINER_NAME="blog"


echo "更新证书文件到容器 ${CONTAINER_NAME}..."

# 将证书复制到容器内指定目录
docker cp "${HOST_CERT_DIR}/${PEM_FILE}" ${CONTAINER_NAME}:/app/cert/${PEM_FILE}
docker cp "${HOST_CERT_DIR}/${KEY_FILE}" ${CONTAINER_NAME}:/app/cert/${KEY_FILE}


echo "证书文件已更新到容器 ${CONTAINER_NAME}."

echo "证书更新完毕，重载 nginx 配置..."

# 重载容器内 nginx 配置
docker exec ${CONTAINER_NAME} nginx -s reload

echo "nginx 重载成功！"