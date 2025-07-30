import React, { useMemo } from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { FileTextOutlined, PlusOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

/**
 * 上传文件统计摘要组件
 * @param {Object} props - 组件属性
 * @param {Array} props.fileList - 文件列表
 * @param {Function} props.getParsedFile - 获取文件解析结果
 * @returns {JSX.Element} 统计摘要组件
 */
const UploadSummary = ({ fileList, getParsedFile }) => {
  /**
   * 计算统计数据
   */
  const statistics = useMemo(() => {
    const stats = {
      total: fileList.length,
      success: 0,
      failed: 0,
      newFiles: 0,
      updateFiles: 0
    };

    fileList.forEach(file => {
      if (file.status === 'done') {
        stats.success++;
        const parsed = getParsedFile(file.name);
        if (parsed.exist) {
          stats.updateFiles++;
        } else if (parsed.title) {
          stats.newFiles++;
        }
      } else if (file.status === 'error') {
        stats.failed++;
      }
    });

    return stats;
  }, [fileList, getParsedFile]);

  // 如果没有文件，不显示统计
  if (fileList.length === 0) {
    return null;
  }

  return (
    <Card className="upload-summary" size="small">
      <Row gutter={16} justify="center">
        <Col span={6}>
          <Statistic
            title="总文件"
            value={statistics.total}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="新增"
            value={statistics.newFiles}
            prefix={<PlusOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="更新"
            value={statistics.updateFiles}
            prefix={<EditOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="失败"
            value={statistics.failed}
            prefix={<ExclamationCircleOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default UploadSummary;