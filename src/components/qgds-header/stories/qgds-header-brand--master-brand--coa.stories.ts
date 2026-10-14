import type { Meta, StoryObj } from "@storybook/web-components";
import { allModes } from "../../../../.storybook/modes";

import { CoatOfArms as CoatOfArmsStory, headerBrandParameters } from "./qgds-header-story-definitions";

export const Desktop: StoryObj = {
  ...CoatOfArmsStory,
  globals: {
    viewport: "LG",
  },
  parameters: {
    chromatic: {
      modes: {
        mobile: allModes.LG,
      },
    },
  },
};
export const Mobile: StoryObj = {
  ...CoatOfArmsStory,
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
  title: "Components/Header/Master brand/Coat of Arms",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
