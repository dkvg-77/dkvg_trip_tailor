import './globals.css'; // Import global CSS here
import Header from './components/Header.js';
import { UserProvider } from '@/context/UserContext';
export const metadata = {
  title: 'Trip Tailor',
  description: 'Generate travel plans easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Header /> {/* Add the common Header component here */}
          <main>{children}</main>
        </UserProvider>
      </body>

    </html>
  );
}
