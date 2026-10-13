import type { Meta, StoryObj } from "@storybook/web-components";
import { allModes } from "../../../../.storybook/modes";

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
  parameters: {
    chromatic: {
      modes: {
        mobile: allModes.MD,
      },
    },
  },
};

export default {
  title: "Components/Header/Co-brand/Coat of Arms and Brand Logo",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
