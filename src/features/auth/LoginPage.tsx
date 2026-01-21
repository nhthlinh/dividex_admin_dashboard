import { useState } from 'react'
import { Button, Input, message } from 'antd'
import dividexLogo from '../../assets/dividex-logo.png'
import { useNavigate } from 'react-router-dom'
import { AuthAPI } from './auth.api'
import { authStore } from './auth.store'
import type { ApiError } from './auth.types'

const PRIMARY_COLOR = '#BB2649'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      message.warning('Vui lòng nhập email và mật khẩu')
      return
    }

    try {
      setLoading(true)

      const res = await AuthAPI.login({ email, password })

      authStore.setToken(res.access_token)

      message.success('Đăng nhập thành công')
      navigate('/', { replace: true })
    } catch (err) {
      const error = err as ApiError
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      {/* LEFT */}
      <div
        style={{
          flex: 1,
          background: `linear-gradient(135deg,#BB2649,#7c182f)`,
          color: '#fff',
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <img src={dividexLogo} alt="Dividex" style={{ width: 140 }} />
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700 }}>
            Dividex Admin Dashboard
          </h1>
          <p style={{ opacity: 0.9 }}>
            Secure platform to manage users and system settings
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div
        style={{
          flex: 1,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: 400 }}>
          <h2 style={{ color: PRIMARY_COLOR }}>Welcome Back</h2>

          <Input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ marginBottom: 16 }}
          />

          <Input.Password
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ marginBottom: 24 }}
          />

          <Button
            type="primary"
            block
            size="large"
            loading={loading}
            style={{ backgroundColor: PRIMARY_COLOR }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  )
}
