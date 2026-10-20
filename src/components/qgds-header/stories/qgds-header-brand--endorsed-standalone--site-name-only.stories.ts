import type { Meta, StoryObj } from "@storybook/web-components";
import { allModes } from "../../../../.storybook/modes";

import {
  SiteNameOnlyDesktop as SiteNameOnlyDesktopStory,
  SiteNameOnlyMobile as SiteNameOnlyMobileStory,
  headerBrandParameters,
} from "./qgds-header-story-definitions";

export const Desktop: StoryObj = {
  ...SiteNameOnlyDesktopStory,
  globals: {
    viewport: "LG",
  },
};

export const Mobile: StoryObj = {
  ...SiteNameOnlyMobileStory,
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
  title: "Components/Header/Endorsed and Standalone brands/Site Name Only",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
