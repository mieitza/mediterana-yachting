"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils/cn";

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  interestType: z.enum(["yacht", "destination", "general"]),
  dates: z.string().optional(),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  prefilledYacht?: {
    slug: string;
    name: string;
  };
  prefilledDestination?: {
    slug: string;
    name: string;
  };
  variant?: "default" | "compact";
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

export function InquiryForm({
  prefilledYacht,
  prefilledDestination,
  variant = "default",
  className,
}: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>("");
  const { toast } = useToast();

  const defaultInterestType = prefilledYacht
    ? "yacht"
    : prefilledDestination
    ? "destination"
    : "general";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      interestType: defaultInterestType,
      message: prefilledYacht
        ? `I'm interested in chartering ${prefilledYacht.name}.`
        : prefilledDestination
        ? `I'm interested in exploring ${prefilledDestination.name}.`
        : "",
    },
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

    // Check if script already exists
    if (!document.querySelector('script[src*="turnstile"]')) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        renderTurnstile();
      };
    } else if (window.turnstile) {
      renderTurnstile();
    }

    function renderTurnstile() {
      if (window.turnstile && turnstileRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            setTurnstileToken(token);
          },
          "error-callback": () => {
            setTurnstileToken("");
          },
        });
      }
    }
  }, []);

  const onSubmit = async (data: InquiryFormData) => {
    // Only require Turnstile token if it's configured
    if (turnstileConfigured && !turnstileToken) {
      toast({
        title: "Verification required",
        description: "Please complete the security verification.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          turnstileToken,
          yachtSlug: prefilledYacht?.slug,
          yachtName: prefilledYacht?.name,
          destinationSlug: prefilledDestination?.slug,
          destinationName: prefilledDestination?.name,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send inquiry");
      }

      setIsSuccess(true);
      reset();
      toast({
        title: "Inquiry sent!",
        description: "We'll get back to you within 24 hours.",
      });

      // Reset Turnstile
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={cn("text-center py-12", className)}>
        <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
        <h3 className="font-serif text-2xl text-text-primary">Thank you!</h3>
        <p className="mt-2 text-text-secondary">
          Your inquiry has been sent. We&apos;ll be in touch within 24 hours.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setIsSuccess(false)}
        >
          Send another inquiry
        </Button>
      </div>
    );
  }

  const isCompact = variant === "compact";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-6", className)}
    >
      <div className={cn("grid gap-6", isCompact ? "grid-cols-1" : "md:grid-cols-2")}>
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            placeholder="Your full name"
            {...register("name")}
            className={errors.name ? "border-error" : ""}
          />
          {errors.name && (
            <p className="text-error text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            {...register("email")}
            className={errors.email ? "border-error" : ""}
          />
          {errors.email && (
            <p className="text-error text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 234 567 890"
            {...register("phone")}
          />
        </div>

        {/* Interest Type */}
        <div className="space-y-2">
          <Label htmlFor="interestType">I&apos;m interested in *</Label>
          <Select
            defaultValue={defaultInterestType}
            onValueChange={(value) =>
              setValue("interestType", value as "yacht" | "destination" | "general")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select interest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yacht">Chartering a Yacht</SelectItem>
              <SelectItem value="destination">Exploring a Destination</SelectItem>
              <SelectItem value="general">General Inquiry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dates */}
        {!isCompact && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="dates">Preferred dates (optional)</Label>
            <Input
              id="dates"
              placeholder="e.g., July 15-22, 2024 or flexible"
              {...register("dates")}
            />
          </div>
        )}

        {/* Message */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            placeholder="Tell us about your dream charter..."
            rows={isCompact ? 3 : 5}
            {...register("message")}
            className={errors.message ? "border-error" : ""}
          />
          {errors.message && (
            <p className="text-error text-sm">{errors.message.message}</p>
          )}
        </div>
      </div>

      {/* Turnstile - only show if configured */}
      {turnstileConfigured && (
        <div ref={turnstileRef} className="flex justify-center" />
      )}

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Inquiry
          </>
        )}
      </Button>

      <p className="text-text-muted text-xs text-center">
        By submitting this form, you agree to our privacy policy. We&apos;ll respond within 24 hours.
      </p>
    </form>
  );
}
