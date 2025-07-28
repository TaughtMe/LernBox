import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Card } from '../../components/Card/Card'
import { Input } from '../../components/Input/Input'
import { Button } from '../../components/Button/Button'
import './LoginPage.css'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    login()
    navigate('/dashboard')
  }

  return (
    <div className="login-page-container">
      <Card>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="E-Mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Passwort"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="primary" fullWidth aria-label="Anmelden">
            Anmelden
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default LoginPage
