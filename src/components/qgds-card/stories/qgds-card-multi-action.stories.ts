import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { exampleImages, palettes } from "../../../utils";
import { chromaticModes } from "../../../../.storybook/modes";
import { withEventActions } from "../../../../.storybook/storybook-helpers";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import type { ImagePosition, QGDSCard } from "../qgds-card";
import "../qgds-card";

const { args, argTypes, template } = getStorybookHelpers<QGDSCard>("qgds-card");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Card/Multiple Action Links",
  component: "qgds-card",
  tags: ["!autodocs"],
  args: {
    ...args,
    action: "multiple",
    heading: "Card Heading",
    "default-slot": "Card content goes here. This is an example of a card with multiple actions.",
    href: "https://example.com",
  },
  argTypes,
  decorators: [
    withEventActions("qgds-click"),
    // Story-level `parameters.gridClass` overrides this wrapper's class; set it to `false` to suppress the wrapper entirely.
    (Story, context) => {
      const gridClass = context.parameters.gridClass as string | false | undefined;
      if (gridClass === false) return html`${Story()}`;
      return html` <div class="${gridClass ?? "qgds-cols qgds-cols-1 qgds-cols-2:md qgds-cols-4:lg"}">${Story()}</div>`;
    },
  ],

  parameters: {
    eventAction: { name: "qgds-click" },
  },
};
export default meta;

const multiActionArgs: Story["args"] = {
  ...args,
  action: "multiple",
  heading: "Card Heading",
  "default-slot": "Card content goes here. This is an example of a card with multiple actions.",
  href: "https://example.com",
};

const footerLinksHTML = html`
  <qgds-link slot="footer-links" href="#" icon-name="arrow-right" icon-size="md" label="Label"></qgds-link>
  <qgds-link slot="footer-links" href="#" icon-name="arrow-right" icon-size="md" label="Label"></qgds-link>
  <qgds-link slot="footer-links" href="#" icon-name="arrow-right" icon-size="md" label="Label"></qgds-link>
`;

const footerTagsActionHTML = html`
  <qgds-tag slot="footer-tags" label="Action" variant="action"></qgds-tag>
  <qgds-tag slot="footer-tags" label="Action" variant="action"></qgds-tag>
  <qgds-tag slot="footer-tags" label="Action" variant="action"></qgds-tag>
`;

const defaultSlotContent = (args: Args) => html`${unsafeHTML(String(args["default-slot"] ?? ""))}`;

const renderPaletteCards = (
  args: Args,
  overrides: Partial<Args> = {},
  slotContent: ReturnType<typeof html> = defaultSlotContent(args)
) => html` ${Object.entries(palettes).map(([palette]) => template({ ...args, ...overrides, palette }, slotContent))} `;

export const MultipleAction: Story = {
  name: "With Footer Tags",
  args: {
    ...multiActionArgs,
  },
  render: (args) =>
    renderPaletteCards(
      args,
      { action: "multiple", target: "_blank" },
      html`${defaultSlotContent(args)} ${footerTagsActionHTML}`
    ),
};

export const MultipleAction_WithFooterLinks: Story = {
  name: "With Footer Links",
  args: {
    ...multiActionArgs,
  },
  render: (args) =>
    renderPaletteCards(
      args,
      { action: "multiple", target: "_blank" },
      html`${defaultSlotContent(args)} ${footerLinksHTML}`
    ),
};

export const MultipleAction_WithImage: Story = {
  name: "With Image",
  args: {
    ...multiActionArgs,
  },
  render: (args) =>
    renderPaletteCards(
      args,
      {
        action: "multiple",
        target: "_blank",
        "image-src": exampleImages[4],
        "image-alt": "Placeholder image",
      },
      html`${defaultSlotContent(args)} ${footerTagsActionHTML}`
    ),
};

export const MultipleAction_FeatureCard: Story = {
  name: "Feature Card (Palettes)",
  parameters: { ...chromaticModes, gridClass: false },
  args: {
    ...multiActionArgs,
    "image-position": "start",
  },
  argTypes: {
    "image-position": {
      control: { type: "select" },
      options: ["start", "end"],
    },
  },
  render: (args) => {
    const imagePosition = args["image-position"] as ImagePosition | undefined;

    return html`
      ${renderPaletteCards(
        args,
        {
          action: "multiple",
          target: "_blank",
          layout: "feature",
          "image-position": imagePosition,
          "image-src": exampleImages[5],
          "image-alt": "Placeholder image",
        },
        html`${defaultSlotContent(args)} ${footerTagsActionHTML}`
      )}
      ${renderPaletteCards(
        args,
        {
          action: "multiple",
          target: "_blank",
          layout: "feature",
          "image-position": imagePosition,
          "image-src": exampleImages[6],
          "image-alt": "Placeholder image",
        },
        html`${defaultSlotContent(args)} ${footerLinksHTML}`
      )}
    `;
  },
};

export const MultipleAction_FeatureCard_AllPositions: Story = {
  name: "Feature Card (Layouts)",
  args: {
    ...multiActionArgs,
  },
  parameters: { gridClass: "qgds-cols qgds-cols-1" },
  render: (args) => html`
    ${template(
      {
        ...args,
        action: "multiple",
        target: "_blank",
        layout: "feature",
        "image-position": "start",
        "image-src": exampleImages[7],
        "image-alt": "Placeholder image",
      },
      html`${defaultSlotContent(args)} ${footerTagsActionHTML}`
    )}
    ${template(
      {
        ...args,
        action: "multiple",
        target: "_blank",
        layout: "feature",
        "image-position": "end",
        "image-src": exampleImages[8],
        "image-alt": "Placeholder image",
      },
      html`${defaultSlotContent(args)} ${footerTagsActionHTML}`
    )}
    ${template(
      {
        ...args,
        action: "multiple",
        target: "_blank",
        layout: "feature",
        "image-position": "start",
        "image-src": exampleImages[4],
        "image-alt": "Placeholder image",
      },
      html`${defaultSlotContent(args)} ${footerLinksHTML}`
    )}
    ${template(
      {
        ...args,
        action: "multiple",
        target: "_blank",
        layout: "feature",
        "image-position": "end",
        "image-src": exampleImages[5],
        "image-alt": "Placeholder image",
      },
      html`${defaultSlotContent(args)} ${footerLinksHTML}`
    )}
  `,
};
