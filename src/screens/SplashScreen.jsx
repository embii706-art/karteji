import React from 'react'

export default function SplashScreen() {
  return (
    <div className="bg-gradient-to-b from-primary to-primary-light min-h-screen flex flex-col items-center justify-center p-6">
      {/* Logo Circle */}
      <div className="mb-12 relative">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
          <span className="text-4xl font-bold text-primary">K</span>
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-sm font-bold text-primary">
          5
        </div>
      </div>

      {/* App Title */}
      <h1 className="text-4xl font-bold text-white text-center mb-2">KARTEJI</h1>
      <p className="text-lg text-blue-100 text-center mb-2">Karang Taruna RT 05</p>

      {/* Slogan */}
      <p className="text-center text-blue-200 text-sm font-medium mb-16 max-w-xs">
        Pemuda Aktif, RT Produktif
      </p>

      {/* Buttons */}
      <div className="w-full space-y-3 max-w-xs">
        <button className="w-full bg-accent text-primary font-bold py-3 rounded-lg shadow-lg hover:bg-accent-dark transition">
          Masuk
        </button>
        <button className="w-full bg-white bg-opacity-20 text-white font-bold py-3 rounded-lg border border-white border-opacity-30 hover:bg-opacity-30 transition">
          Daftar Anggota Baru
        </button>
      </div>

      {/* Footer */}
      <p className="text-blue-100 text-xs mt-16 text-center">
        Membangun komunitas yang transparan dan produktif
      </p>
    </div>
  )
}
