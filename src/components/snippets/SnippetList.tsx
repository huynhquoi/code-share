"use client";

import { SnippetCard } from "./SnippetCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationInfo, SnippetListItem } from "@/types/snippet";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface SnippetListProps {
  snippets: SnippetListItem[];
  pagination: PaginationInfo;
}

export function SnippetList({ snippets, pagination }: SnippetListProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    router.push(createPageUrl(page));
  };

  if (snippets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No snippets found.</p>
      </div>
    );
  }

  // Calculate page range to display
  const getPageRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= pagination.totalPages; i++) {
      if (
        i === 1 ||
        i === pagination.totalPages ||
        (i >= pagination.page - delta && i <= pagination.page + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="space-y-6">
      {/* Snippets Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {snippets.map((snippet) => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href={
                    pagination.page > 1
                      ? createPageUrl(pagination.page - 1)
                      : "#"
                  }
                  onClick={(e) => {
                    if (pagination.page <= 1) {
                      e.preventDefault();
                    } else {
                      e.preventDefault();
                      handlePageChange(pagination.page - 1);
                    }
                  }}
                  className={
                    pagination.page <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* Page Numbers */}
              {getPageRange().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href={createPageUrl(page as number)}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page as number);
                      }}
                      isActive={page === pagination.page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  href={
                    pagination.hasMore
                      ? createPageUrl(pagination.page + 1)
                      : "#"
                  }
                  onClick={(e) => {
                    if (!pagination.hasMore) {
                      e.preventDefault();
                    } else {
                      e.preventDefault();
                      handlePageChange(pagination.page + 1);
                    }
                  }}
                  className={
                    !pagination.hasMore
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Results Info */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
        {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of{" "}
        {pagination.totalCount} snippets
      </div>
    </div>
  );
}
