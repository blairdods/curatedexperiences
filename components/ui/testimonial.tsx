interface TestimonialProps {
  quote: string;
  author: string;
  location?: string;
  journey?: string;
}

export function Testimonial({ quote, author, location, journey }: TestimonialProps) {
  return (
    <blockquote className="max-w-2xl mx-auto text-center">
      {/* Gold quote mark */}
      <p className="font-serif text-5xl leading-none text-gold mb-4 select-none">&ldquo;</p>
      <p className="font-serif font-medium text-2xl sm:text-3xl leading-relaxed text-navy tracking-tight">
        {quote}
      </p>
      {/* Gold rule */}
      <div className="mt-8 mb-6 h-px w-10 bg-gold mx-auto" />
      <footer>
        <cite className="not-italic text-sm font-medium tracking-[0.1em] uppercase text-navy/70">
          {author}
          {location && <span className="font-normal normal-case tracking-normal text-foreground-muted"> — {location}</span>}
        </cite>
        {journey && (
          <p className="mt-1.5 text-xs tracking-[0.2em] uppercase text-gold">
            {journey}
          </p>
        )}
      </footer>
    </blockquote>
  );
}
