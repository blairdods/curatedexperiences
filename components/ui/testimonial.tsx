interface TestimonialProps {
  quote: string;
  author: string;
  location?: string;
  journey?: string;
}

export function Testimonial({ quote, author, location, journey }: TestimonialProps) {
  return (
    <blockquote className="max-w-2xl mx-auto text-center">
      <p className="font-serif text-2xl sm:text-3xl leading-relaxed text-navy tracking-tight">
        &ldquo;{quote}&rdquo;
      </p>
      <footer className="mt-6">
        <cite className="not-italic text-sm text-foreground-muted">
          {author}
          {location && <span className="text-warm-400"> — {location}</span>}
        </cite>
        {journey && (
          <p className="mt-1 text-xs text-warm-400 tracking-wide uppercase">
            {journey}
          </p>
        )}
      </footer>
    </blockquote>
  );
}
