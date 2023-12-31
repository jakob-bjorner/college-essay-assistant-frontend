"use client";
import { useRouter } from "next/navigation";
import { toggleScheme } from "@/utils/colorScheme";

export default function ThemeButtons() {
  const router = useRouter();
  const toggle = async () => {
    await toggleScheme();
    router.refresh();
  };
  return (
    <>
      <button
        type="button"
        aria-label="Toggle dark mode"
        onClick={toggle}
        className="px-2 py-1.5 rounded-sm bg-zinc-900 dark:bg-zinc-100"
      >
        <span className="inline-block text-sm dark:hidden text-zinc-100">
          Dark Mode
        </span>
        <span className="hidden text-sm dark:inline-block text-zinc-800">
          Light Mode
        </span>
      </button>
    </>
  );
}
