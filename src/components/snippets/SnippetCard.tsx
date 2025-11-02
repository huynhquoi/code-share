"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, MessageSquare, Lock } from "lucide-react";
import { truncateText, getLanguageDisplayName } from "@/lib/snippets";
import { SnippetListItem } from "@/types/snippet";

interface SnippetCardProps {
  snippet: SnippetListItem;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  const codePreview = truncateText(snippet.code, 150);
  const languageDisplay = getLanguageDisplayName(snippet.language);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">
              <Link
                href={`/snippets/${snippet.slug}`}
                className="hover:underline"
              >
                {snippet.title}
              </Link>
            </CardTitle>
            {snippet.description && (
              <CardDescription className="line-clamp-2 mt-1">
                {snippet.description}
              </CardDescription>
            )}
          </div>
          {!snippet.isPublic && (
            <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Code Preview */}
        <div className="bg-muted rounded-md p-3 mb-3 overflow-hidden">
          <pre className="text-xs whitespace-pre-wrap break-all">
            <code>{codePreview}</code>
          </pre>
        </div>

        {/* Tags */}
        {snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {snippet.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {snippet.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{snippet.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
        {/* Author Info */}
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={snippet.author.image || undefined} />
            <AvatarFallback>
              {snippet.author.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs truncate max-w-[100px]">
            {snippet.author.name || "Anonymous"}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            {languageDisplay}
          </Badge>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span className="text-xs">{snippet.viewCount}</span>
          </div>
          {snippet.commentCount && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span className="text-xs">{snippet.commentCount}</span>
            </div>
          )}
          <span className="text-xs">
            {formatDistanceToNow(new Date(snippet.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
