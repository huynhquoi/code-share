"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CreateSnippetInput, createSnippetSchema } from "@/lib/validations/snippet";
import { useTranslations } from "next-intl";

interface SnippetFormProps {
  initialData?: Partial<CreateSnippetInput> & {
    id?: string;
    slug?: string;
    tags?: { id: string; name: string; slug: string }[];
  };
  isEditing?: boolean;
}

const POPULAR_LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "csharp",
  "go",
  "rust",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "html",
  "css",
  "sql",
  "bash",
  "json",
  "yaml",
  "markdown",
];

export function SnippetForm({
  initialData,
  isEditing = false,
}: SnippetFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const v = useTranslations("snippet.validations")

  const snippetSchema = createSnippetSchema(v)

  const form = useForm<CreateSnippetInput>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      code: initialData?.code || "",
      language: initialData?.language || "javascript",
      isPublic: initialData?.isPublic ?? true,
    },
  });

  const onSubmit = async (data: CreateSnippetInput) => {
    setIsSubmitting(true);

    try {
      const url = isEditing
        ? `/api/snippets/${initialData?.id}`
        : "/api/snippets";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save snippet");
      }

      const snippet = await response.json();

      toast.success(
        isEditing
          ? "Snippet updated successfully"
          : "Snippet created successfully"
      );

      router.push(`/snippets/${snippet.slug}`);
      router.refresh();
    } catch (error) {
      console.error("Error saving snippet:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save snippet"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., React Custom Hook for API Calls"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of your snippet..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional description to help others understand your snippet
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Language */}
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {POPULAR_LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Code */}
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste your code here..."
                  rows={15}
                  className="font-mono text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Public/Private Toggle */}
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Public Snippet</FormLabel>
                <FormDescription>
                  Make this snippet visible to everyone
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Snippet" : "Create Snippet"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
