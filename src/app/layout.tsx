import type { Metadata } from 'next'
import { Poppins, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'BRANDCORE™ — Plataforma de Comunicación de Marca',
  description: 'Sistema de gestión de comunicación de marca para agencias.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${poppins.variable} ${jakarta.variable} h-full antialiased`}>
        {children}
      </body>
    </html>
  )
}
