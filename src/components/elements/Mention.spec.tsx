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
