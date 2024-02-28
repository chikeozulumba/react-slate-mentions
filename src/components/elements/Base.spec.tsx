import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BaseEditorElement as Base } from ".";
import { SlateBlockTypes } from "../../constants";

test("loads and displays the <Hashtag /> component based on element type", async () => {
  const component = (
    <Base
      className="test-hashtag"
      attributes={{
        role: "hashtag-button"
      }}
      element={{
        type: SlateBlockTypes.Hashtag,
        value: {
          key: "test-hashtag",
          label: "Hashtag Test"
        },
      }}
    />
  );
  // ARRANGE
  render(component);
  expect(screen.getByRole("hashtag-button")).toHaveTextContent("#Hashtag Test");
});

test("loads and displays the <Mention /> component based on element type", async () => {
  const component = (
    <Base
      className="test-mention"
      attributes={{
        role: "mention-button"
      }}
      element={{
        type: SlateBlockTypes.Mention,
        value: {
          key: "test-mention",
          label: "Mention Test"
        },
      }}
    />
  );
  // ARRANGE
  render(component);
  expect(screen.getByRole("mention-button")).toHaveTextContent("@Mention Test");
});

test("loads and displays the default component based on element type", async () => {
  const component = (
    <Base
      className="test-paragraph"
      attributes={{
        role: "paragraph-element",
      }}
      element={{
        type: SlateBlockTypes.Paragraph,
        value: {
          key: "test-paragraph",
          label: "Paragraph Test"
        },
      }}
    />
  );
  // ARRANGE
  render(component);

   const { tagName } = screen.getByRole("paragraph-element");
   expect(tagName.toLowerCase()).toBe('p');
});
