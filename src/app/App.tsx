import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Providers } from './providers';
import { LoadingBrandScreen } from '../components/layout/LoadingBrandScreen';

export function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <Providers>
      {!loaded && (
        <LoadingBrandScreen
          duration={1200}
          message="スリランカ人材と日本企業をつなぐ準備をしています"
          onComplete={() => setLoaded(true)}
        />
      )}
      <RouterProvider router={router} />
    </Providers>
  );
}
