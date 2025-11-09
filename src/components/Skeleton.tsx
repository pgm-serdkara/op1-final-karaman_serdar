type Props = { className?: string };

export default function Skeleton({ className = "" }: Props) {
  return (
    <div
      className={`skeleton bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      aria-hidden="true"
    />
  );
}
