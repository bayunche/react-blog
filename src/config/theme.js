import { theme } from 'antd'

export const themeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // 主色调 - 萌系粉色
    colorPrimary: '#ff69b4',
    colorPrimaryHover: '#ff1493',
    colorPrimaryActive: '#ff85c1',
    
    // 成功色 - 薄荷绿
    colorSuccess: '#00ff7f',
    colorSuccessHover: '#00e671',
    
    // 信息色 - 天空蓝
    colorInfo: '#87ceeb',
    colorInfoHover: '#4682b4',
    
    // 圆角
    borderRadius: 16,
    borderRadiusLG: 24,
    borderRadiusSM: 12,
    
    // 字体
    fontFamily: '"PingFang SC", "Hiragino Sans GB", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    
    // 毛玻璃效果
    colorBgContainer: 'rgba(255, 255, 255, 0.8)',
    colorBgElevated: 'rgba(255, 255, 255, 0.9)',
    
    // 阴影
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
    boxShadowSecondary: '0 4px 16px rgba(31, 38, 135, 0.2)',
  },
  components: {
    Button: {
      borderRadius: 50,
      controlHeight: 44,
      fontWeight: 500,
    },
    Card: {
      borderRadius: 20,
      paddingLG: 24,
    },
    Input: {
      borderRadius: 12,
      controlHeight: 44,
    },
    Modal: {
      borderRadius: 20,
    },
    Drawer: {
      borderRadius: 20,
    },
  },
}

// 暗黑主题配置
export const darkThemeConfig = {
  ...themeConfig,
  algorithm: theme.darkAlgorithm,
  token: {
    ...themeConfig.token,
    colorBgContainer: 'rgba(0, 0, 0, 0.8)',
    colorBgElevated: 'rgba(0, 0, 0, 0.9)',
  },
}