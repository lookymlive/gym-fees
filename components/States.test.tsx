import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "@/components/States";

describe("Spinner", () => {
  it("renders without crashing", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Spinner className="size-8" />);
    expect(screen.getByRole("status")).toHaveClass("size-8");
  });
});