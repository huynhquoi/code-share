"use client";

import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
}

export function CodeBlock({
  code,
  language,
  showLineNumbers = true,
  maxHeight = "500px",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  if (!mounted) {
    return (
      <div className="rounded-lg border p-4 text-sm text-muted-foreground bg-muted">
        Loading code...
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Copy Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-1" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </>
        )}
      </Button>

      {/* Code Block */}
      <div className="rounded-lg overflow-hidden border">
        <SyntaxHighlighter
          language={language}
          style={theme === "dark" ? vscDarkPlus : vs}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: "1rem",
            maxHeight,
            fontSize: "0.875rem",
          }}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
