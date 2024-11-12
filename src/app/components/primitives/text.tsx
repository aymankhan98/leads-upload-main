import React, { HTMLAttributes } from "react";
import { type VariantProps, tv } from "tailwind-variants";
import { cn } from "@/lib/utils";

const TextVariants = tv({
  base: "",
  variants: {
    variant: {
      default: "",
      tablecell: "text-[min(0.82vw,14px)] font-normal",
      Heading: "text-[min(0.8vw,15px)] font-bold", // Hero section center text
      SubHeading: "text-[min(0.72vw,14px)] font-normal",
      body: "text-[min(0.8vw,16px)] font-semibold",
      updateFormtitle: "text-[min(0.8vw,16px)] font-normal",
      updatesubtitle: "text-[min(0.72vw,14px)] font-normal text-[#A1A1A1]",
      searchCandidate: "text-[14px] font-normal text-[#455AA8]",

      caption: "text-[min(0.62vw,12px)] font-medium",
      smallText: "text-[min(0.6vw,10px)]",
      Description: "text-md ", // Footer variants
      smallHeading: "text-md text-",
      profile:
        " text-sm py-[6px] px-1  rounded-md bgguidegridclass border-[1px] border-gray-700 border-opacity-80",
      inputDescription: "text-sm text-light-doccolor",
      theme: "",
      formSecondaryTitle:
        "text-[min(0.9vw,15px)] text-secondaryblue leading-5 font-semibold py-2",
      formblackTitle:
        "text-[min(0.9vw,15px)] text-black leading-5 font-semibold py-2",
      comment: "text-[min(0.8vw,12px)] font-semibold",
      px18: "text-[min(0.9vw,18px)] font-semibold",
      steps: "text-[15px] text-[#777777] font-semibold",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface TextProps
  extends HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof TextVariants> {
  children: React.ReactNode;
}

const Text = ({ children, className, variant, ...props }: TextProps) => {
  return (
    <p className={cn(TextVariants({ variant }), className)} {...props}>
      {children}
    </p>
  );
};

export default Text;
