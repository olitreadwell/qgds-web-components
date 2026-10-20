import type { Meta, StoryObj } from "@storybook/web-components";
import { allModes } from "../../../../.storybook/modes";

import {
  BrandLogoOnlyDesktop as BrandLogoOnlyDesktopStory,
  BrandLogoOnlyMobile as BrandLogoOnlyMobileStory,
  headerBrandParameters,
} from "./qgds-header-story-definitions";

export const Desktop: StoryObj = {
  ...BrandLogoOnlyDesktopStory,
  globals: {
    viewport: "LG",
  },
};

export const Mobile: StoryObj = {
  ...BrandLogoOnlyMobileStory,
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
  title: "Components/Header/Endorsed and Standalone brands/Brand Logo Only",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
