import React from "react";

export const Paragraph = ({ children }: { children: React.ReactNode }) => {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
};

export const H1 = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  );
};

export const LeadText = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xl text-muted-foreground">{children}</p>
);

export const SmallText = ({ children }: { children: React.ReactNode }) => (
  <small className="text-sm font-medium leading-none">{children}</small>
);
