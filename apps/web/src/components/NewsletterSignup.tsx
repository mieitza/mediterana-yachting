'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle, Anchor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  name: z.string().optional(),
});

type SubscribeFormData = z.infer<typeof subscribeSchema>;

interface NewsletterSignupProps {
  variant?: 'inline' | 'featured';
  source?: string;
  className?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      getResponse: (widgetId: string) => string | undefined;
    };
  }
}

export function NewsletterSignup({
  variant = 'inline',
  source = 'website',
  className,
}: NewsletterSignupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubscribeFormData>({
    resolver: zodResolver(subscribeSchema),
  });

  // Check if Turnstile is properly configured (not a placeholder value)
  const isTurnstileConfigured = () => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) return false;
    // Cloudflare Turnstile site keys start with '0x' and are 20+ chars
    // Skip placeholder values like 'your_turnstile_site_key'
    return siteKey.startsWith('0x') && siteKey.length >= 20;
  };

  const turnstileConfigured = isTurnstileConfigured();

  // Load Turnstile script
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!turnstileConfigured || !siteKey || !turnstileRef.current) return;

    function renderTurnstile() {
      if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: siteKey,
          theme: variant === 'inline' ? 'dark' : 'light',
          size: 'compact',
          callback: (token: string) => {
            setTurnstileToken(token);
          },
          'error-callback': () => {
            setTurnstileToken('');
          },
        });
      }
    }

    if (!document.querySelector('script[src*="turnstile"]')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        renderTurnstile();
      };
    } else if (window.turnstile) {
      renderTurnstile();
    }
  }, [variant]);

  const onSubmit = async (data: SubscribeFormData) => {
    if (turnstileConfigured && !turnstileToken) {
      setError('Please complete the security verification.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          source,
          turnstileToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to subscribe');
      }

      setIsSuccess(true);
      setSuccessMessage(result.message || 'Thank you for subscribing!');
      reset();

      // Reset Turnstile
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    if (variant === 'inline') {
      return (
        <div className={cn('text-center py-4', className)}>
          <CheckCircle className="h-8 w-8 text-sand mx-auto mb-2" />
          <p className="text-white/90 text-sm">{successMessage}</p>
        </div>
      );
    }

    return (
      <div className={cn('text-center py-12', className)}>
        <Anchor className="h-16 w-16 text-navy mx-auto mb-4 animate-bounce" />
        <h3 className="font-serif text-2xl text-text-primary">Welcome Aboard!</h3>
        <p className="mt-2 text-text-secondary">{successMessage}</p>
      </div>
    );
  }

  // Inline variant (for footer)
  if (variant === 'inline') {
    return (
      <div className={cn('', className)}>
        <h3 className="text-sand font-medium text-sm uppercase tracking-wider mb-4">
          The Captain&apos;s Log
        </h3>
        <p className="text-white/70 text-sm mb-4">
          Inspiration from the Mediterranean
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Input
              type="email"
              placeholder="your@email.com"
              {...register('email')}
              className={cn(
                'bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-sand',
                errors.email && 'border-red-400'
              )}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {turnstileConfigured && (
            <div ref={turnstileRef} className="flex justify-start" />
          )}

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <Button
            type="submit"
            size="sm"
            className="w-full bg-sand text-navy hover:bg-sand/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              'Subscribe'
            )}
          </Button>
        </form>
      </div>
    );
  }

  // Featured variant (for dedicated sections)
  return (
    <div className={cn('max-w-xl mx-auto text-center', className)}>
      <Anchor className="h-12 w-12 text-navy mx-auto mb-4" />
      <h2 className="font-serif text-3xl md:text-4xl text-text-primary">
        Join the Journey
      </h2>
      <p className="mt-4 text-text-secondary text-lg">
        Receive curated insights, destination guides, and exclusive charter opportunities delivered to your inbox. From hidden Mediterranean coves to the world&apos;s finest yachts—your next adventure begins here.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            placeholder="Your name (optional)"
            {...register('name')}
            className="flex-1"
          />
          <Input
            type="email"
            placeholder="your@email.com"
            {...register('email')}
            className={cn('flex-1', errors.email && 'border-error')}
          />
        </div>
        {errors.email && (
          <p className="text-error text-sm text-left">{errors.email.message}</p>
        )}

        {turnstileConfigured && (
          <div ref={turnstileRef} className="flex justify-center" />
        )}

        {error && <p className="text-error text-sm">{error}</p>}

        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto px-12"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting Sail...
            </>
          ) : (
            'Set Sail'
          )}
        </Button>
      </form>

      <p className="mt-4 text-text-muted text-xs">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
}
