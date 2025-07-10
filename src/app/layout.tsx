import './globals.css'
import Link from 'next/link'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <nav style={{ padding: '10px', background: '#333', marginBottom: '20px' }}>
          <Link href="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Home</Link>
          <Link href="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}