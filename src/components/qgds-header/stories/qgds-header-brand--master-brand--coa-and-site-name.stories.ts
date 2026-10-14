import type { Meta, StoryObj } from "@storybook/web-components";
import { allModes } from "../../../../.storybook/modes";

import {
  CoatOfArmsAndSiteName as CoatOfArmsAndSiteNameStory,
  headerBrandParameters,
} from "./qgds-header-story-definitions";

export const Desktop: StoryObj = {
  ...CoatOfArmsAndSiteNameStory,
  globals: {
    viewport: "LG",
  },
};

export const Mobile: StoryObj = {
  ...CoatOfArmsAndSiteNameStory,
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
  title: "Components/Header/Master brand/Coat of Arms and Site Name",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
