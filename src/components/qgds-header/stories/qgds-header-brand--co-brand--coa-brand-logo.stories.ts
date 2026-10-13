import type { Meta, StoryObj } from "@storybook/web-components";

import {
  CoatOfArmsAndBrandLogo as CoatOfArmsAndBrandLogoStory,
  headerBrandParameters,
} from "./qgds-header-story-definitions";

export const Desktop: StoryObj = {
  ...CoatOfArmsAndBrandLogoStory,
  globals: {
    viewport: "LG",
  },
};

export const Mobile: StoryObj = {
  ...CoatOfArmsAndBrandLogoStory,
  globals: {
    viewport: "MD",
  },
};

export default {
  title: "Components/Header/Co-brand/Coat of Arms and Brand Logo",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
