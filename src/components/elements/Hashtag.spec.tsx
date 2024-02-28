import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Hashtag } from ".";

test("loads and displays the <Hashtag /> component", async () => {
  const component = (
    <Hashtag
      className="test-hashtag"
      attributes={{
        role: "button"
      }}
      element={{
        value: {
          key: "test-hashtag",
          label: "Hashtag Test"
        },
      }}
    />
  );
  // ARRANGE
  render(component);
  expect(screen.getByRole("button")).toHaveTextContent("#Hashtag Test");
});

test("loads and displays the <Hashtag /> component without className", async () => {
  const component = (
    <Hashtag
      attributes={{
        role: "button"
      }}
      element={{
        value: {
          key: "test-hashtag",
          label: "Hashtag Test"
        },
      }}
    />
  );
  // ARRANGE
  render(component);
  expect(screen.getByRole("button")).toHaveTextContent("#Hashtag Test");
});
