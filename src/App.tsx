import { useState } from 'react'
import { MyBugsPanel } from '@boobalan_jkkn/bug-reporter-sdk'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [showBugs, setShowBugs] = useState(false)

  const triggerError = () => {
    throw new Error('This is a test error!')
  }

  const triggerConsoleLogs = () => {
    console.log('This is a test log message')
    console.info('This is an info message with useful information')
    console.warn('This is a warning message - something might be wrong!')
    console.error('This is an error message - something went wrong!')
    console.debug('This is a debug message for developers')
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>🐛 Bug Reporter Demo App</h1>

      <div className="card">
        <h2>Test Features</h2>
        <button onClick={() => setCount((count) => count + 1)}>
          Counter: {count}
        </button>
        <button onClick={triggerConsoleLogs} style={{ marginLeft: '10px', background: '#4444ff' }}>
          Test Console Logs
        </button>
        <button onClick={triggerError} style={{ marginLeft: '10px', background: '#ff4444' }}>
          Trigger Error
        </button>
        <button onClick={() => setShowBugs(!showBugs)} style={{ marginLeft: '10px' }}>
          {showBugs ? 'Hide' : 'Show'} My Bugs
        </button>

        <div style={{ marginTop: '20px', textAlign: 'left', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
          <h3>How to Report a Bug:</h3>
          <ol>
            <li>Click <strong>"Test Console Logs"</strong> to generate sample console messages</li>
            <li>Look for the floating 🐛 bug button in the bottom-right corner</li>
            <li>Click it to open the bug report form</li>
            <li>Fill in the bug title and description</li>
            <li>The screenshot and console logs are automatically captured!</li>
            <li>Submit the bug</li>
            <li>Check the platform dashboard at <code>http://localhost:3000</code></li>
          </ol>

          <h3 style={{ marginTop: '20px' }}>Configuration:</h3>
          <ul style={{ fontSize: '14px' }}>
            <li><strong>Organization:</strong> Test Organization</li>
            <li><strong>App:</strong> boobal</li>
            <li><strong>API Key:</strong> br_NuIf5ghx-kA...</li>
            <li><strong>User:</strong> Demo User (demo@example.com)</li>
          </ul>
        </div>
      </div>

      {showBugs && (
        <div style={{ marginTop: '40px', maxWidth: '800px', margin: '40px auto' }}>
          <MyBugsPanel />
        </div>
      )}
    </>
  )
}

export default App
