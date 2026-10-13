import type { Meta, StoryObj } from "@storybook/web-components";
import { allModes } from "../../../../.storybook/modes";

import {
  BrandLogoAndSiteName as BrandLogoAndSiteNameStory,
  BrandLogoAndSiteNameDesktop as BrandLogoAndSiteNameDesktopStory,
  headerBrandParameters,
} from "./qgds-header-story-definitions";

export const Desktop: StoryObj = {
  ...BrandLogoAndSiteNameDesktopStory,
  globals: {
    viewport: "LG",
  },
};

export const Mobile: StoryObj = {
  ...BrandLogoAndSiteNameStory,
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
  title: "Components/Header/Endorsed and Standalone brands/Brand Logo And Site Name",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
