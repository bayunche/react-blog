import React from 'react';
import TagComponent from '../Tag'; // 导入原有的Tag组件
import './TagSelector.less';

/**
 * 标签选择器组件 - 封装原有的Tag组件
 * @param {object} props - 组件属性
 * @param {Array} props.tagList - 可选标签列表
 * @param {Array} props.selectedTags - 已选标签
 * @param {Function} props.onChange - 选择变更回调
 * @param {string} props.placeholder - 占位符文字
 * @param {string} props.className - 额外的CSS类名
 * @returns {JSX.Element} 标签选择器组件
 */
const TagSelector = ({
  tagList,
  selectedTags,
  onChange,
  placeholder = '选择标签',
  className = ''
}) => {
  return (
    <div className={`tag-selector ${className}`}>
      <TagComponent
        list={tagList}
        selectedList={selectedTags}
        onSelectedListChange={onChange}
      />
    </div>
  );
};

export default TagSelector;