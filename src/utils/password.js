import CryptoJS from 'crypto-js'

const key = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_ENCRYPTION_KEY || '1234567890000000') // 16位
const iv = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_ENCRYPTION_IV || '1234567890000000')

export default {
  // aes加密
  encrypt(word) {
    let encrypted = ''
    if (typeof word === 'string') {
      const srcs = CryptoJS.enc.Utf8.parse(word)
      encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
    } else if (typeof word === 'object') {
      // 对象格式的转成json字符串
      const data = JSON.stringify(word)
      const srcs = CryptoJS.enc.Utf8.parse(data)
      encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
    }
    return encrypted.ciphertext.toString()
  },
  // aes解密
  decrypt(word) {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    const decrypt = CryptoJS.AES.decrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
  }
}

/**
 * 生成随机密码
 * @param {number} length - 密码长度，默认12位
 * @returns {string} 随机密码
 */
export const generateRandomPassword = (length = 12) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

/**
 * 验证密码强度
 * @param {string} password - 待验证的密码
 * @returns {Object} 验证结果 { isValid: boolean, message: string, score: number }
 */
export const validatePassword = (password) => {
  const result = {
    isValid: false,
    message: '',
    score: 0
  }

  if (!password) {
    result.message = '密码不能为空'
    return result
  }

  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  // 计算密码强度分数
  let score = 0
  if (password.length >= minLength) score += 20
  if (password.length >= 12) score += 10
  if (hasUpperCase) score += 20
  if (hasLowerCase) score += 20
  if (hasNumbers) score += 20
  if (hasSpecialChar) score += 20

  result.score = score

  // 基本验证
  if (password.length < minLength) {
    result.message = `密码长度至少需要${minLength}位`
    return result
  }

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    result.message = '密码必须包含大写字母、小写字母和数字'
    return result
  }

  // 检查常见弱密码
  const commonPasswords = [
    '12345678', '123456789', 'password', 'qwerty123', 
    'abc123456', '11111111', '00000000'
  ]
  
  if (commonPasswords.includes(password.toLowerCase())) {
    result.message = '不能使用常见的弱密码'  
    return result
  }

  // 检查重复字符
  const repeatedChar = /(.)\1{2,}/.test(password)
  if (repeatedChar) {
    result.message = '密码不能包含连续重复的字符'
    return result
  }

  result.isValid = true
  
  if (score >= 80) {
    result.message = '密码强度：强'
  } else if (score >= 60) {
    result.message = '密码强度：中等'
  } else {
    result.message = '密码强度：弱，建议添加特殊字符'
  }

  return result
}

/**
 * 获取密码强度等级
 * @param {string} password - 密码
 * @returns {string} 强度等级：weak, medium, strong
 */
export const getPasswordStrength = (password) => {
  const { score } = validatePassword(password)
  
  if (score >= 80) return 'strong'
  if (score >= 60) return 'medium'
  return 'weak'
}
