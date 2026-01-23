'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '1rem',
            }}>
              Something went wrong
            </h2>
            <p style={{
              color: '#475569',
              marginBottom: '1.5rem',
            }}>
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={() => reset()}
              style={{
                backgroundColor: '#0f172a',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
