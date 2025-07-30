import React from 'react';
import { Modal } from 'antd';

// 自定义Hooks
import { useUploadModal } from './hooks/useUploadModal';
import { useUploadFile } from './hooks/useUploadFile';
import { useUploadSubmit } from './hooks/useUploadSubmit';

// 子组件
import UploadDragger from './components/UploadDragger';
import UploadTable from './components/UploadTable';
import UploadSummary from './components/UploadSummary';

// 样式
import './styles/index.less';

/**
 * 文章上传弹窗组件 - 重构后的版本
 * 支持拖拽上传Markdown文件，批量导入文章
 */
const UploadModal = () => {
  // 文件上传管理
  const {
    fileList,
    parsedList,
    getParsedFile,
    removeFile,
    resetFiles,
    getUploadConfig,
    getUploadList
  } = useUploadFile();

  // 提交管理
  const {
    confirmLoading,
    handleSubmit,
    getSubmitButtonProps
  } = useUploadSubmit();

  // 弹窗管理
  const {
    visible,
    closeModal,
    getModalConfig
  } = useUploadModal({
    onOpen: resetFiles,
    onClose: resetFiles
  });

  /**
   * 处理确认提交
   */
  const handleConfirm = async () => {
    const uploadList = getUploadList();
    await handleSubmit(uploadList, closeModal);
  };

  // 获取上传配置
  const uploadConfig = getUploadConfig();
  const modalConfig = getModalConfig();
  const submitButtonProps = getSubmitButtonProps(fileList.length);

  return (
    <Modal
      {...modalConfig}
      onOk={handleConfirm}
      okButtonProps={submitButtonProps}
      okText="确认导入"
      cancelText="取消"
    >
      {/* 文件拖拽上传区域 */}
      <UploadDragger uploadConfig={uploadConfig} />

      {/* 文件统计摘要 */}
      <UploadSummary 
        fileList={fileList}
        getParsedFile={getParsedFile}
      />

      {/* 文件列表表格 */}
      {fileList.length > 0 && (
        <UploadTable
          fileList={fileList}
          getParsedFile={getParsedFile}
          onRemoveFile={removeFile}
        />
      )}
    </Modal>
  );
};

export default UploadModal;
