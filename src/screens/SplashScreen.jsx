import React from 'react'

export default function SplashScreen() {
  return (
    <div className="bg-gradient-to-br from-primary via-blue-700 to-primary-light min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-accent opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-accent opacity-10 rounded-full blur-3xl"></div>
      
      {/* Logo Circle */}
      <div className="mb-12 relative animate-fadeIn">
        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white ring-opacity-30">
          <span className="text-5xl font-extrabold text-primary">K</span>
        </div>
        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-base font-bold text-primary shadow-lg ring-2 ring-white">
          5
        </div>
      </div>

      {/* App Title */}
      <h1 className="text-5xl font-extrabold text-white text-center mb-2 tracking-tight">KARTEJI</h1>
      <p className="text-xl text-blue-100 text-center mb-2 font-semibold">Karang Taruna RT 05</p>

      {/* Slogan */}
      <p className="text-center text-blue-200 text-base font-medium mb-16 max-w-xs">
        Pemuda Aktif, RT Produktif ✨
      </p>

      {/* Buttons */}
      <div className="w-full space-y-4 max-w-xs animate-slideUp">
        <button className="w-full bg-accent text-primary font-bold py-4 rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 text-lg">
          Masuk
        </button>
        <button className="w-full bg-white bg-opacity-20 text-white font-bold py-4 rounded-xl border-2 border-white border-opacity-40 hover:bg-opacity-30 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
          Daftar Anggota Baru
        </button>
      </div>

      {/* Footer */}
      <p className="text-blue-100 text-sm mt-16 text-center font-medium">
        Membangun komunitas yang transparan dan produktif 🚀
      </p>
    </div>
  )
}
