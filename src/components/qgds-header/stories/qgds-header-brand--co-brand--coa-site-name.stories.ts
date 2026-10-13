import type { Meta, StoryObj } from "@storybook/web-components";

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
};

export default {
  title: "Components/Header/Co-brand/Coat of Arms and Site Name",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
