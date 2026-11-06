import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { loadDatabase } from './services/db'

const root = ReactDOM.createRoot(document.getElementById('root'))

const Screen = ({ children }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 text-slate-700 font-semibold p-6 text-center">
    {children}
  </div>
)

const start = async () => {
  root.render(
    <Screen>
      <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-[#149B8B] animate-spin" />
      <p>Loading KaamSetu…</p>
    </Screen>
  )
  try {
    // The site runs entirely on Supabase data: wait for it before showing anything.
    await loadDatabase()
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  } catch (e) {
    console.error('[KaamSetu] Could not load data from Supabase:', e)
    root.render(
      <Screen>
        <p className="text-lg text-[#0A2540]">Could not connect to the KaamSetu database.</p>
        <p className="text-sm text-slate-500">Please check your internet connection and try again.</p>
        <button
          onClick={start}
          className="px-5 py-2 rounded-xl bg-[#149B8B] text-white font-bold"
        >
          Try again
        </button>
      </Screen>
    )
  }
}

start()
