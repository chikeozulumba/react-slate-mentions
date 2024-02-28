import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Mention } from ".";

test("loads and displays the <Mention /> component", async () => {
  const component = (
    <Mention
      className="test"
      attributes={{
        role: "button",
      }}
      element={{
        value: {
          key: "test",
          label: "Test",
        },
      }}
    />
  );
  // ARRANGE
  render(component);
  expect(screen.getByRole("button")).toHaveTextContent("@Test");
});

test("loads and displays the <Mention /> component without className", async () => {
  const component = (
    <Mention
      attributes={{
        role: "button"
      }}
      element={{
        value: {
          key: "test-mention",
          label: "Mention Test"
        },
      }}
    />
  );
  // ARRANGE
  render(component);
  expect(screen.getByRole("button")).toHaveTextContent("@Mention Test");
});
