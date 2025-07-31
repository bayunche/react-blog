import React from 'react';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

/**
 * 文件拖拽上传组件
 * @param {Object} props - 组件属性
 * @param {Object} props.uploadConfig - 上传配置
 * @returns {JSX.Element} 拖拽上传组件
 */
const UploadDragger = ({ uploadConfig }) => {
  return (
    <Dragger {...uploadConfig} className="upload-dragger">
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        点击或拖拽文件到此区域上传
      </p>
      <p className="ant-upload-hint">
        支持单个或批量上传，仅支持 Markdown (.md) 格式文件，单个文件不超过 10MB
      </p>
    </Dragger>
  );
};

export default UploadDragger;