import { Flex, Text } from "@radix-ui/themes";

export default function StarDisplay({ value, max = 5, size = "2" }: { value: number; max?: number; size?: "1"|"2"|"3"|"4" }) {
  const rounded = Math.round(value ?? 0);
  const stars = Array.from({ length: max }, (_, i) => i < rounded);
  return (
    <Flex gap="1" align="center">
      {stars.map((filled, i) => (
        <Text key={i} size={size} color={filled ? "amber" : undefined}>
          {filled ? "★" : "☆"}
        </Text>
      ))}
    </Flex>
  );
}
