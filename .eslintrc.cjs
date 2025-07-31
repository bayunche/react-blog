module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "parser": "@babel/eslint-parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
    "requireConfigFile": false,
    "babelOptions": {
      "presets": ["@babel/preset-react"]
    }
  },
  "plugins": [
    "react"
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "globals": {
    "React": "readonly",
    "ReactDOM": "readonly",
    "process": "readonly"
  },
  "rules": {
    // React相关规则
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    
    // 基础规则
    'no-console': 'off', // 允许console，因为开发需要
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': ['error', { 
      "vars": "all", 
      "args": "after-used", 
      "ignoreRestSiblings": false,
      "varsIgnorePattern": "^_",
      "argsIgnorePattern": "^_"
    }],
    
    // 代码风格规则
    indent: ['error', 2], // 2格缩进
    'arrow-parens': ['error', 'as-needed'], // 箭头函数参数
    semi: ['error', 'never'], // 不使用分号
    'quotes': ['error', 'single', {
      'avoidEscape': true,
      'allowTemplateLiterals': true
    }], // 单引号
    'comma-dangle': ['error', 'never'], // 禁止拖尾逗号
    'object-curly-spacing': ['error', 'always'], // 对象花括号内部空格
    'array-bracket-spacing': ['error', 'never'], // 数组方括号内部不允许空格
    'space-before-blocks': ['error', 'always'], // 块前空格
    'keyword-spacing': ['error', {
      'before': true,
      'after': true
    }], // 关键字周围空格
    'comma-spacing': ['error', {
      'before': false,
      'after': true
    }], // 逗号后空格
    'key-spacing': ['error', {
      'beforeColon': false,
      'afterColon': true
    }], // 冒号周围空格
    'space-infix-ops': 'error', // 操作符周围空格
    'eol-last': 'error', // 文件末尾换行
    'no-trailing-spaces': 'error', // 行尾空格
    'no-multiple-empty-lines': ['error', { 'max': 1 }], // 最多一个空行
    'padded-blocks': ['error', 'never'], // 块内不需要空行
    
    // 最佳实践
    'eqeqeq': ['error', 'always', { 'null': 'ignore' }], // 严格相等
    'no-var': 'error', // 禁用var
    'prefer-const': 'error', // 优先使用const
    'no-undef': 'error', // 未定义变量
    'no-redeclare': 'error', // 重复声明
    'no-unreachable': 'error', // 不可达代码
    
    // JSX相关规则
    'jsx-quotes': ['error', 'prefer-single'], // JSX中使用单引号
    
    // 其他规则
    'camelcase': 'off', // 关闭驼峰命名检查，因为API可能使用下划线
    'no-useless-escape': 'off' // 关闭无用转义检查
  }
}