"use client";

import { Check, Tag } from "lucide-react";
import { Pricing as PricingType } from "@/types/blocks/pricing";
import { PricingItem } from "@/types/blocks/pricing";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import DiscountCheckoutModal from "@/components/checkout/discount-checkout-modal";

function parseTitle(title: string): { cleanTitle: string; countTag: string | null } {
  const match = title.match(/[（(](\d+次)[）)]/);
  if (match) {
    return {
      cleanTitle: title.replace(match[0], "").trim(),
      countTag: match[1],
    };
  }
  return { cleanTitle: title, countTag: null };
}

function PricingCard({ item, groupKey, index }: { item: PricingItem; groupKey: string; index: number }) {
  const { cleanTitle, countTag } = item.title ? parseTitle(item.title) : { cleanTitle: "", countTag: null };
  const hasLabel = item.label || countTag;

  return (
    <div
      key={`${groupKey}-${index}`}
      className={`relative rounded-lg p-6 row-span-6 grid grid-rows-subgrid gap-0 ${
        item.is_featured
          ? "border-primary border-2 bg-card text-card-foreground"
          : "border-muted border"
      }`}
    >
      {hasLabel && (
        <div className="absolute -top-2.5 right-3 z-10 flex gap-1.5">
          {countTag && (
            <Badge
              variant="outline"
              className="border-primary bg-primary px-1.5 text-primary-foreground shadow-sm"
            >
              {countTag}
            </Badge>
          )}
          {item.label && (
            <Badge
              variant="outline"
              className="border-primary bg-primary px-1.5 text-primary-foreground shadow-sm"
            >
              {item.label}
            </Badge>
          )}
        </div>
      )}

      {/* Row 1: Title */}
      <div className="mb-4">
        {cleanTitle && (
          <h3 className="text-xl font-semibold">{cleanTitle}</h3>
        )}
      </div>

      {/* Row 2: Price */}
      <div className="mb-4 flex flex-col gap-1">
        {item.original_price && (
          <div className="text-lg font-semibold text-muted-foreground line-through">
            {item.original_price}
          </div>
        )}
        {item.price && (
          <div className="text-5xl font-semibold">{item.price}</div>
        )}
        {item.unit && (
          <div className="text-sm font-medium text-muted-foreground">
            {item.unit}
          </div>
        )}
      </div>

      {/* Row 3: Description */}
      <div className="mb-4">
        {item.description && (
          <p className="text-muted-foreground">{item.description}</p>
        )}
      </div>

      {/* Row 4: Features title */}
      <div>
        {item.features_title && (
          <p className="mb-3 text-base font-bold text-foreground">
            {item.features_title}
          </p>
        )}
      </div>

      {/* Row 5: Features list (flex-grow) */}
      <div className="mb-5">
        {item.features && (
          <ul className="flex flex-col gap-2.5">
            {item.features.map((feature: string, featureIndex: number) => (
              <li className="flex gap-2 text-sm" key={`feature-${featureIndex}`}>
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-foreground/90">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Row 6: Buttons */}
      <div className="flex flex-col gap-3 self-end">
        <div className="flex items-center justify-center gap-2 rounded-lg border border-amber-200/80 bg-amber-50/50 px-3 py-2.5 dark:border-amber-800/30 dark:bg-amber-950/20">
          <Tag className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-500" />
          <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
            Have a discount code? Enter it at checkout.
          </span>
        </div>

        {item.button && (
          <DiscountCheckoutModal item={item} cnPay={true}>
            <Button className="flex w-full items-center justify-center gap-2 font-semibold shadow-sm transition-all hover:shadow-md">
              {item.button.icon && (
                <Icon name={item.button.icon} className="size-4" />
              )}
              <span>{item.button.title}</span>
            </Button>
          </DiscountCheckoutModal>
        )}

        {item.tip && (
          <p className="text-center text-xs text-muted-foreground">
            {item.tip}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Pricing({ pricing }: { pricing: PricingType }) {
  if (pricing.disabled) {
    return null;
  }

  const pricingItems = (pricing.items ?? []).filter(
    (item) => item.group !== "hidden"
  );

  const groupsWithItems = useMemo(() => {
    if (pricing.groups && pricing.groups.length > 0) {
      const grouped = pricing.groups
        .map((group, index) => {
          const items = pricingItems.filter(
            (item) => item.group && item.group === group.name
          );

          return {
            key: group.name ?? `group-${index}`,
            title: group.title ?? group.label,
            items,
          };
        })
        .filter(({ items }) => items.length > 0);

      const ungrouped = pricingItems.filter((item) => {
        if (!item.group) {
          return true;
        }

        return !pricing.groups?.some((group) => group.name === item.group);
      });

      if (ungrouped.length > 0) {
        grouped.push({
          key: "ungrouped",
          title: undefined,
          items: ungrouped,
        });
      }

      if (grouped.length > 0) {
        return grouped;
      }
    }

    return [
      {
        key: "all",
        title: undefined,
        items: pricingItems,
      },
    ];
  }, [pricing.groups, pricingItems]);

  return (
    <section id={pricing.name} className="py-16">
      <div className="container max-w-[2200px] px-8">
        <div className="mx-auto mb-12 text-center">
          <h2 className="mb-4 text-4xl font-semibold lg:text-5xl">
            {pricing.title}
          </h2>
          <p className="text-muted-foreground lg:text-lg">
            {pricing.description}
          </p>
        </div>

        <div className="flex w-full flex-col gap-10">
          {groupsWithItems.map(({ key, title, items }) => (
            <div key={key} className="flex w-full flex-col gap-4">
              {title ? (
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-bold text-foreground">
                    {title}
                  </p>
                </div>
              ) : null}

              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-5 lg:gap-8 grid-rows-[repeat(6,auto)]">
                {items.map((item, index) => (
                  <PricingCard key={`${key}-${index}`} item={item} groupKey={key} index={index} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
