import { useState } from 'react'
import { Button, Input } from 'antd'
import dividexLogo from '../../assets/dividex-logo.png'
import { router } from '../../app/router'
import { authStore } from './auth.store'
import { useNavigate } from 'react-router-dom'

const PRIMARY_COLOR = '#BB2649'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const handleLogin = () => {
        authStore.setToken('dummy-token')
        navigate('/', { replace: true })
    }


  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
      }}
    >
      {/* LEFT: Gradient Branding */}
      <div
        style={{
          flex: 1,
          background: `
            linear-gradient(
              135deg,
              #BB2649 0%,
              #9f1f3f 50%,
              #7c182f 100%
            )
          `,
          color: '#fff',
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <img src={dividexLogo} alt="Dividex" style={{ width: 140 }} />

        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
            Dividex Admin Dashboard
          </h1>
          <p style={{ fontSize: 16, maxWidth: 400, opacity: 0.9 }}>
            Secure platform to manage users, transactions, and system settings.
          </p>
        </div>
      </div>

      {/* RIGHT: Login Form */}
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
          <h2 style={{ marginBottom: 8, color: PRIMARY_COLOR }}>
            Welcome Back
          </h2>
          <p style={{ marginBottom: 24, color: '#888' }}>
            Sign in to your admin account
          </p>

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
            style={{
              backgroundColor: PRIMARY_COLOR,
              borderColor: PRIMARY_COLOR,
            }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  )
}
