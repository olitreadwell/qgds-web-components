import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";
import breakpoint from "../../styles/qgds-tokens/qgds-breakpoint";
import "../qgds-attribution-bar/qgds-attribution-bar";
import "../qgds-link/qgds-link";
import "../qgds-search-input/qgds-search-input";
import "../qgds-navigation/qgds-navigation";
import "./qgds-header";
import type { QGDSHeader } from "./qgds-header";

const MOBILE_VIEWPORT = { width: breakpoint.SM, height: 670 };
const DESKTOP_VIEWPORT = { width: breakpoint.XL, height: 720 };

// Example slot content, mirroring the usage in qgds-header.stories.ts
const SLOT_EXAMPLES = `
  <qgds-attribution-bar slot="pre-header" palette="deep" url="https://www.qld.gov.au" label="qld.gov.au">
    <qgds-link icon-name="phone" href="https://www.qld.gov.au/contact-us" label="Contact us"></qgds-link>
  </qgds-attribution-bar>
  <qgds-search-input slot="search"></qgds-search-input>
  <qgds-navigation slot="navigation" id="mynav">
    <qgds-navigation-item label="Home" href="#" icon-name="home" only-icon is-current></qgds-navigation-item>
    <qgds-navigation-item label="Services" href="#services"></qgds-navigation-item>
    <qgds-navigation-item label="About" href="#about"></qgds-navigation-item>
  </qgds-navigation>
`;

const SEARCH_BUTTON = '.header-action[aria-controls="header-search-panel"]';

describe("qgds-header", () => {
  let element: QGDSHeader;

  const query = (selector: string) => element.shadowRoot?.querySelector<HTMLElement>(selector);
  const getSlot = (name: string) => element.shadowRoot?.querySelector<HTMLSlotElement>(`slot[name="${name}"]`);

  const triggerSlotChange = async (name: string) => {
    getSlot(name)?.dispatchEvent(new Event("slotchange"));
    await element.updateComplete;
  };

  const displayOf = (el?: Element | null) => {
    if (!el) throw new Error("Element not found");
    return getComputedStyle(el).display;
  };

  const whenUpdated = async (el?: Element | null) => {
    await (el as unknown as { updateComplete?: Promise<boolean> } | null | undefined)?.updateComplete;
  };

  // Sets the viewport for every test in the enclosing describe, and restores it afterwards.
  const useViewport = ({ width, height }: { width: number; height: number }) => {
    beforeEach(() => page.viewport(width, height));
    afterEach(() => page.viewport(DESKTOP_VIEWPORT.width, DESKTOP_VIEWPORT.height));
  };

  beforeEach(() => {
    element = document.createElement("qgds-header");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  describe("defaults", () => {
    it("registers the custom element", () => {
      expect(customElements.get("qgds-header")).toBeDefined();
    });

    it("renders with default properties", async () => {
      await element.updateComplete;

      expect(element.palette).toBe("default");
      expect(element.siteUrl).toBe("https://www.qld.gov.au");
      expect(element.hideCoaLogo).toBe(false);
      expect(element.hideMobileBottomRow).toBe(false);
      expect(element.mobileTopContent).toBe("coa-logo");
      expect(element.searchOpen).toBe(false);
    });

    it("renders default slots which include the pre-header, logo, search, and navigation slots", async () => {
      await element.updateComplete;

      for (const name of ["pre-header", "logo", "search", "navigation"]) {
        expect(getSlot(name), `slot "${name}"`).not.toBeNull();
      }
    });
  });

  describe("logos and site name", () => {
    it("renders the default COA logo when no custom logo is provided", async () => {
      await element.updateComplete;

      const defaultLogo = getSlot("logo")?.querySelector("qgds-logo");

      expect(defaultLogo?.getAttribute("logo")).toBe("coa-delivering-for-qld");
      expect(defaultLogo?.getAttribute("alt")).toBe("Queensland Government");
      expect(query(".coa-logo-mobile-default")).toBeNull();
    });

    it("renders a custom COA logo and site name", async () => {
      element.siteName = "Site Name here";
      element.innerHTML = `<qgds-logo slot="logo" logo="coa-stacked" alt="Queensland Government"></qgds-logo>`;
      await element.updateComplete;

      const customLogo = getSlot("logo")?.assignedElements()[0];

      expect(customLogo?.getAttribute("logo")).toBe("coa-stacked");
      expect(customLogo?.getAttribute("alt")).toBe("Queensland Government");
      expect(query(".header-site-name a")?.textContent?.trim()).toBe("Site Name here");
    });

    it("renders both the COA and a custom brand logo", async () => {
      element.innerHTML = `
        <qgds-logo slot="logo" logo="coa-stacked" alt="Queensland Government"></qgds-logo>
        <qgds-logo slot="brand-logo" custom-logo="brand.svg"></qgds-logo>
      `;
      await element.updateComplete;
      await triggerSlotChange("logo");
      await triggerSlotChange("brand-logo");

      const coaLogo = getSlot("logo")?.assignedElements()[0];
      const brandLogo = getSlot("brand-logo")?.assignedElements()[0];

      expect(coaLogo?.getAttribute("logo")).toBe("coa-stacked");
      expect(coaLogo?.getAttribute("alt")).toBe("Queensland Government");
      expect(brandLogo?.getAttribute("custom-logo")).toBe("brand.svg");
    });

    it("does not render a COA logo when it is hidden", async () => {
      element.hideCoaLogo = true;
      await element.updateComplete;

      expect(query(".header-coa-logo")).toBeNull();
      expect(getSlot("logo")).toBeNull();
    });

    it("renders only site name with no logos provided", async () => {
      element.siteName = "Example Queensland Department";
      element.hideCoaLogo = true;
      await element.updateComplete;

      expect(query(".header-site-name")).not.toBeNull();
      expect(getSlot("logo")).toBeNull();
    });

    it("renders the brand logo and COA logo", async () => {
      element.innerHTML = `
        <qgds-logo slot="logo" logo="coa-stacked"></qgds-logo>
        <qgds-logo slot="brand-logo" custom-logo="brand.svg"></qgds-logo>
      `;
      await element.updateComplete;
      await triggerSlotChange("logo");
      await triggerSlotChange("brand-logo");

      expect(getSlot("brand-logo")?.assignedElements().length).toBe(1);
      expect(getSlot("logo")?.assignedElements().length).toBe(1);
      expect(query(".header-site-name")).toBeNull();
    });

    it("uses the site URL for the site name and slotted logos", async () => {
      element.siteName = "Example Queensland Department";
      element.siteUrl = "https://exampledepartment.qld.gov.au";
      element.innerHTML = `
        <qgds-logo slot="logo" logo="coa-stacked"></qgds-logo>
        <qgds-logo slot="brand-logo" custom-logo="brand.svg"></qgds-logo>
      `;
      await element.updateComplete;
      await triggerSlotChange("logo");
      await triggerSlotChange("brand-logo");

      const logos = element.querySelectorAll("qgds-logo");

      expect(query(".header-site-name a")?.getAttribute("href")).toBe("https://exampledepartment.qld.gov.au");
      expect(Array.from(logos, (logo) => logo.getAttribute("href"))).toEqual([
        "https://exampledepartment.qld.gov.au",
        "https://exampledepartment.qld.gov.au",
      ]);
    });
  });

  describe("pre-header slot", () => {
    beforeEach(async () => {
      element.innerHTML = SLOT_EXAMPLES;
      await element.updateComplete;
      await triggerSlotChange("pre-header");
    });

    it("assigns the attribution bar to the pre-header slot", () => {
      expect(getSlot("pre-header")?.assignedElements()[0].tagName).toBe("QGDS-ATTRIBUTION-BAR");
    });

    describe("on desktop", () => {
      useViewport(DESKTOP_VIEWPORT);

      it("shows the pre-header", () => {
        expect(displayOf(getSlot("pre-header")?.parentElement)).not.toBe("none");
      });
    });

    describe("on mobile", () => {
      useViewport(MOBILE_VIEWPORT);

      it("hides the pre-header", () => {
        expect(displayOf(getSlot("pre-header")?.parentElement)).toBe("none");
      });

      it("shows the attribution bar link as the top row when it is the preferred mobile content", async () => {
        element.hideCoaLogo = true;
        element.mobileTopContent = "preheader-url";
        await element.updateComplete;

        const preHeaderUrl = query(".header-preheader-url");
        const link = preHeaderUrl?.querySelector("a");

        expect(preHeaderUrl?.classList.contains("is-mobile-main")).toBe(true);
        expect(displayOf(preHeaderUrl)).not.toBe("none");
        expect(link?.getAttribute("href")).toBe("https://www.qld.gov.au");
        expect(link?.textContent?.trim()).toBe("qld.gov.au");
      });
    });

    it("applies the attribution bar palette to the mobile top row", () => {
      expect(query(".header-coa-logo")?.classList.contains("qgds-palette-deep")).toBe(true);
    });

    it("falls back to the bold palette and drops the link when the attribution bar is removed", async () => {
      element.querySelector("qgds-attribution-bar")?.remove();
      await triggerSlotChange("pre-header");

      expect(query(".header-coa-logo")?.classList.contains("qgds-palette-bold")).toBe(true);
      expect(query(".header-preheader-url")).toBeNull();
    });
  });

  describe("search slot and mobile search button", () => {
    useViewport(MOBILE_VIEWPORT);

    const addSearch = async () => {
      const search = document.createElement("qgds-search-input");
      search.slot = "search";
      element.appendChild(search);
      await triggerSlotChange("search");
      return search;
    };

    const toggleSearch = async () => {
      query(SEARCH_BUTTON)?.click();
      await element.updateComplete;
    };

    it("does not render the search button when nothing is slotted", () => {
      expect(query(SEARCH_BUTTON)).toBeNull();
    });

    it("keeps the search panel hidden until the search button is toggled", async () => {
      await addSearch();

      expect(displayOf(query("#header-search-panel"))).toBe("none");

      await toggleSearch();

      expect(displayOf(query("#header-search-panel"))).toBe("block");
    });

    it("toggles the search state and dispatches the toggle event each time", async () => {
      await addSearch();

      const listener = vi.fn();
      element.addEventListener("qgds-toggle-search-mobile", listener);

      expect(query(SEARCH_BUTTON)?.getAttribute("aria-expanded")).toBe("false");
      expect(query(SEARCH_BUTTON)?.getAttribute("label")).toBe("Search");

      await toggleSearch();

      expect(element.searchOpen).toBe(true);
      expect(query(SEARCH_BUTTON)?.getAttribute("aria-expanded")).toBe("true");
      expect(query(SEARCH_BUTTON)?.getAttribute("label")).toBe("Close");
      expect(listener).toHaveBeenCalledTimes(1);

      await toggleSearch();

      expect(element.searchOpen).toBe(false);
      expect(query(SEARCH_BUTTON)?.getAttribute("label")).toBe("Search");
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it("closes the search panel when clicking outside, without dispatching the toggle event", async () => {
      await addSearch();
      await toggleSearch();

      const listener = vi.fn();
      element.addEventListener("qgds-toggle-search-mobile", listener);
      document.body.click();
      await element.updateComplete;

      expect(element.searchOpen).toBe(false);
      expect(listener).not.toHaveBeenCalled();
    });

    it("keeps the search panel open when clicking inside it", async () => {
      await addSearch();
      await toggleSearch();

      query("#header-search-panel")?.click();
      await element.updateComplete;

      expect(element.searchOpen).toBe(true);
    });

    it("focuses the slotted search input when the search panel opens", async () => {
      const search = await addSearch();
      await whenUpdated(search);

      await toggleSearch();

      expect(document.activeElement).toBe(search);
      expect(search.shadowRoot?.activeElement?.classList.contains("search-input")).toBe(true);
    });
  });

  describe("navigation slot and mobile menu button", () => {
    useViewport(MOBILE_VIEWPORT);

    const menuButton = (id: string) => query(`.header-action[aria-controls="${id}"]`);

    const addNavigation = async (id = "primary-navigation") => {
      const navigation = document.createElement("qgds-navigation");
      navigation.slot = "navigation";
      if (id) navigation.id = id;
      element.appendChild(navigation);
      await triggerSlotChange("navigation");
      return navigation;
    };

    it("does not render the menu button when nothing is slotted", () => {
      expect(query(".header-action")).toBeNull();
    });

    it("links the menu button to the slotted navigation", async () => {
      await addNavigation();

      expect(menuButton("primary-navigation")?.getAttribute("label")).toBe("Menu");
      expect(menuButton("primary-navigation")?.getAttribute("aria-expanded")).toBe("false");
    });

    it("assigns an id to the navigation when it has none and links the menu button to it", async () => {
      const navigation = await addNavigation("");

      expect(navigation.id).not.toBe("");
      expect(menuButton(navigation.id)).not.toBeNull();
    });

    it("dispatches the open event when the menu button is pressed", async () => {
      await addNavigation();

      const listener = vi.fn();
      element.addEventListener("qgds-navigation-open", listener);
      menuButton("primary-navigation")?.click();

      expect(listener).toHaveBeenCalledOnce();
    });

    it("reflects the navigation opened and closed state on the menu button", async () => {
      await addNavigation();

      document.dispatchEvent(new Event("qgds-navigation-opened"));
      await element.updateComplete;
      expect(menuButton("primary-navigation")?.getAttribute("aria-expanded")).toBe("true");

      document.dispatchEvent(new Event("qgds-navigation-closed"));
      await element.updateComplete;
      expect(menuButton("primary-navigation")?.getAttribute("aria-expanded")).toBe("false");
    });

    it("keeps only a single qgds-navigation in the navigation slot", async () => {
      await addNavigation();

      const extraNavigation = document.createElement("qgds-navigation");
      extraNavigation.slot = "navigation";
      const stray = document.createElement("div");
      stray.slot = "navigation";
      element.append(extraNavigation, stray);
      await triggerSlotChange("navigation");

      expect(element.querySelectorAll('[slot="navigation"]').length).toBe(1);
      expect(stray.isConnected).toBe(false);
    });
  });

  describe("full example (pre-header, search, and navigation)", () => {
    useViewport(MOBILE_VIEWPORT);

    beforeEach(async () => {
      element.siteName = "Site Name";
      element.innerHTML = SLOT_EXAMPLES;
      await element.updateComplete;
      await triggerSlotChange("pre-header");
      await triggerSlotChange("search");
      await triggerSlotChange("navigation");
    });

    it("assigns each example element to its slot", () => {
      expect(getSlot("pre-header")?.assignedElements()[0].tagName).toBe("QGDS-ATTRIBUTION-BAR");
      expect(getSlot("search")?.assignedElements()[0].tagName).toBe("QGDS-SEARCH-INPUT");
      expect(getSlot("navigation")?.assignedElements()[0].tagName).toBe("QGDS-NAVIGATION");
    });

    it("renders both the search and menu buttons", () => {
      expect(query(SEARCH_BUTTON)).not.toBeNull();
      expect(query(".header-action[aria-controls='mynav']")).not.toBeNull();
    });

    it("opens the real navigation drawer from the menu button and reflects its state", async () => {
      await whenUpdated(element.querySelector("qgds-navigation"));

      query(".header-action[aria-controls='mynav']")?.click();

      await vi.waitFor(() => {
        expect(query(".header-action[aria-controls='mynav']")?.getAttribute("aria-expanded")).toBe("true");
      });
    });
  });

  describe("mobile layout", () => {
    useViewport(MOBILE_VIEWPORT);

    beforeEach(async () => {
      element.siteName = "Example Queensland Department";
      await element.updateComplete;
    });

    describe("top row (mobile-top-content)", () => {
      beforeEach(async () => {
        element.innerHTML = `
          <qgds-logo slot="brand-logo" custom-logo="brand.svg"></qgds-logo>
        `;
        await triggerSlotChange("brand-logo");
      });
      it("defaults to the COA logo", () => {
        expect(query(".header-coa-logo")?.classList.contains("is-mobile-main")).toBe(true);
        expect(query(".header-brand-logo")?.classList.contains("is-mobile-main")).toBe(false);
        expect(query(".header-site-name")?.classList.contains("is-mobile-main")).toBe(false);
      });

      it("keeps the COA logo on top when another content is preferred but the COA logo is shown", async () => {
        element.mobileTopContent = "brand-logo";
        await element.updateComplete;

        expect(query(".header-coa-logo")?.classList.contains("is-mobile-main")).toBe(true);
        expect(query(".header-brand-logo")?.classList.contains("is-mobile-main")).toBe(false);
      });

      it("shows the brand logo on top and the site name in the bottom row", async () => {
        element.hideCoaLogo = true;
        element.mobileTopContent = "brand-logo";
        await element.updateComplete;

        const brandLogo = query(".header-brand-logo");
        const siteName = query(".header-site-name");

        expect(query(".header-coa-logo")).toBeNull();
        expect(brandLogo?.classList.contains("is-mobile-main")).toBe(true);
        expect(displayOf(brandLogo)).not.toBe("none");
        expect(siteName?.classList.contains("is-mobile-sub")).toBe(true);
        expect(displayOf(siteName)).not.toBe("none");
      });

      it("shows the site name on top and the brand logo in the bottom row", async () => {
        element.hideCoaLogo = true;
        element.mobileTopContent = "site-name";
        await element.updateComplete;

        const brandLogo = query(".header-brand-logo");
        const siteName = query(".header-site-name");

        expect(query(".header-coa-logo")).toBeNull();
        expect(siteName?.classList.contains("is-mobile-main")).toBe(true);
        expect(displayOf(siteName)).not.toBe("none");
        expect(brandLogo?.classList.contains("is-mobile-sub")).toBe(true);
        expect(displayOf(brandLogo)).not.toBe("none");
      });
    });

    describe("bottom row (hide-mobile-bottom-row)", () => {
      it("shows the site name in the bottom row by default", () => {
        const siteName = query(".header-site-name");

        expect(siteName?.classList.contains("is-mobile-sub")).toBe(true);
        expect(displayOf(siteName)).not.toBe("none");
      });

      it("hides the bottom row when hideMobileBottomRow is true", async () => {
        element.hideMobileBottomRow = true;
        await element.updateComplete;

        const siteName = query(".header-site-name");

        expect(siteName?.classList.contains("is-mobile-sub")).toBe(false);
        expect(displayOf(siteName)).toBe("none");
      });
    });
  });
});
