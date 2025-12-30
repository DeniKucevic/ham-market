"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

interface Props {
  id: string;
}

export function CopyIdButton({ id }: Props) {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <dd
      className="cursor-pointer font-mono text-xs text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
      onClick={handleCopy}
      title={t("clickToCopy")}
    >
      {copied ? t("copied") : `${id.slice(0, 8)}...`}
    </dd>
  );
}
