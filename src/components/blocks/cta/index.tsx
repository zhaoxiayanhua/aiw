"use client";

import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { Section as SectionType } from "@/types/blocks/section";
import { useCustomSession } from "@/hooks/useCustomSession";
import { useAppContext } from "@/contexts/app";

export default function CTA({ section }: { section: SectionType }) {
  const { data: session, isPending } = useCustomSession();
  const { setShowSignModal } = useAppContext();

  if (section.disabled) {
    return null;
  }

  const handleButtonClick = (e: React.MouseEvent, url: string) => {
    const isAuthButton = url === "/auth/signin" || url === "/creation-center";
    if (!isAuthButton) return;

    e.preventDefault();
    e.stopPropagation();

    if (isPending || session) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowSignModal(true);
    }
  };

  return (
    <section id={section.name} className="py-16">
      <div className="px-8">
        <div className='flex items-center justify-center rounded-2xl  bg-[url("/imgs/masks/circle.svg")] bg-cover bg-center px-8 py-12 text-center md:p-16'>
          <div className="mx-auto max-w-(--breakpoint-md)">
            <h2 className="mb-4 text-balance text-3xl font-semibold md:text-5xl">
              {section.title}
            </h2>
            <p className="text-muted-foreground md:text-lg">
              {section.description}
            </p>
            {section.buttons && (
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                {section.buttons.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.url as any || ""}
                    target={item.target}
                    data-no-loading
                    onClick={(e) => handleButtonClick(e, item.url || "")}
                  >
                    <Button variant={item.variant || "default"}>
                      <span className="flex items-center justify-center gap-1">
                        {item.title}
                        {item.icon && (
                          <Icon name={item.icon as string} className="size-6" />
                        )}
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
