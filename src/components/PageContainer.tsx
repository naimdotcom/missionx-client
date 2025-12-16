"use client";

import Navigation from "@/components/Navigation";

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
}

export default function PageContainer({ children, title }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#667eea] to-[#764ba2] p-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-center mb-8 text-4xl font-bold">
          🔐 {title}
        </h1>

        <div className="text-center mb-5">
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white mx-4 font-medium hover:underline"
          >
            📚 Swagger Docs
          </a>
          <a
            href="http://localhost:8000/redoc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white mx-4 font-medium hover:underline"
          >
            📖 ReDoc
          </a>
          <a
            href="http://localhost:8000/health"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white mx-4 font-medium hover:underline"
          >
            💚 Health Check
          </a>
        </div>

        <Navigation />

        <div className="bg-card text-card-foreground rounded-xl p-8 shadow-2xl border border-border">
          {children}
        </div>
      </div>
    </div>
  );
}
