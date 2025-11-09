"use client";

import { Button, Flex } from "@radix-ui/themes";
import { useMemo } from "react";

export interface StarRatingProps {
  value?: number | null; // bereik 0-5
  max?: number;
  readOnly?: boolean;
  onChange?: (next: number) => void;
  size?: "1" | "2" | "3" | "4";
}

export default function StarRating({ value = 0, max = 5, readOnly = false, onChange, size = "2" }: StarRatingProps) {
  const stars = useMemo(() => Array.from({ length: max }, (_, i) => i + 1), [max]);

  return (
    <Flex gap="1" align="center">
      {stars.map((n) => {
        const filled = (value ?? 0) >= n;
        return (
          <Button
            style={{ borderRadius: '2rem' }}
            key={n}
            size={size}
            variant={filled ? "solid" : "outline"}
            color={filled ? "amber" : undefined}
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(n)}
            aria-label={`${n} ster${n > 1 ? 'ren' : ''}`}
          >
            {filled ? "★" : "☆"}
          </Button>
        );
      })}
    </Flex>
  );
}
