"use client";

import { useState } from "react";
import StarRating from "./StarRating";
import { Flex, Text } from "@radix-ui/themes";

interface RatingBoxProps {
  bookId: number;
  initialValue: number | null;
  initialAvg: number | null;
  initialCount: number;
}

export default function RatingBox({ bookId, initialValue, initialAvg, initialCount }: RatingBoxProps) {
  const [value, setValue] = useState<number | null>(initialValue);
  const [avg, setAvg] = useState<number | null>(initialAvg);
  const [count, setCount] = useState<number>(initialCount);
  const [saving, setSaving] = useState(false);

  async function submit(next: number) {
    setSaving(true);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, value: next }),
      });
      if (!res.ok) throw new Error("Kan rating niet opslaan");
      const data = await res.json();
      setValue(next);
      setAvg(data.avg ?? next);
      setCount(data.count ?? count);
    } catch (e) {
      // Geen actie: in echte app tonen we een toast
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Flex direction="column" gap="2">
      <StarRating value={value ?? 0} onChange={submit} readOnly={saving} />
      <Text size="2" color="gray">
        Gemiddelde: {avg ? avg.toFixed(1) : "-"} ({count})
      </Text>
    </Flex>
  );
}
