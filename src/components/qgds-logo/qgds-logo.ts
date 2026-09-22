import DOMPurify from "dompurify";
import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-logo.styles.scss?inline";

// Preset logos
import coaStackedSVG from "./assets/coa-stacked.svg?raw";
import coaDeliveringSVG from "./assets/coa-delivering-for-qld.svg?raw";

export const tagName = "qgds-logo";
export type LogoVariant = "masterbrand" | "subbrand" | "cobrand" | "endorsed" | "standalone";
export type LogoPreset = "coa-stacked" | "coa-delivering-for-qld";

const presetLogos: Record<LogoPreset, string> = {
  "coa-stacked": coaStackedSVG,
  "coa-delivering-for-qld": coaDeliveringSVG,
};

/**
 * QGDS Logo Component
 *
 * Renders the Queensland Government logo lockup according to QGDS brand guidelines.
 * The `variant` attribute drives the rendering structure — and helps pair this component with the qgds-site-name element.
 *
 * @website "https://www.designsystem.qld.gov.au/brand-foundations/site-names-and-logos"
 * @uikit   "https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=6182-30988&m=dev"
 * @tagname "qgds-logo"
 *
 * @prop {LogoPreset}  logo                 - Preset COA logo: "coa-stacked" | "coa-delivering-for-qld"
 * @prop {string}      alt                  - Accessible label for the preset COA SVG
 * @prop {string}      href                 - Optional URL. Wraps the COA image in a link
 * @prop {string}      aria-label           - Accessible label for the href link. Falls back to site-name
 * @prop {string}      custom-logo         - URL for a custom logo image (cobrand, endorsed, standalone). SVG files are rendered inline.
 * @prop {string}      custom-logo-alt     - Accessible label for the custom logo image
 *
 * @cssprop {color} --logo-divider-color  - Divider color used in cobrand variant
 * @cssprop {color} --logo-color - Color applied to the preset COA SVG
 */

@customElement(tagName)
export class QGDSLogo extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS)];

  // ─── Public API ─────────────────────────────────────────────────────────
  @property({ type: String }) logo: string = "coa-delivering-for-qld";
  @property({ type: String }) alt = "";
  @property({ type: String, attribute: "href" }) href = "";
  @property({ type: String, attribute: "aria-label" }) label = "";
  @property({ type: String, attribute: "custom-logo" }) customLogo = "";
  @property({ type: String, attribute: "custom-logo-alt" }) customLogoAlt = "";
  @state() private customLogoSvg = "";
  private customLogoRequest?: AbortController;

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  private isPreset(value: string): value is LogoPreset {
    return value in presetLogos;
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>) {
    if (changedProperties.has("customLogo")) void this.loadCustomLogoSvg();
  }

  disconnectedCallback() {
    this.customLogoRequest?.abort();
    super.disconnectedCallback();
  }

  private async loadCustomLogoSvg() {
    this.customLogoRequest?.abort();
    this.customLogoSvg = "";

    if (!/\.svg(?:[?#]|$)/i.test(this.customLogo)) return;

    const request = new AbortController();
    this.customLogoRequest = request;

    try {
      const response = await fetch(this.customLogo, { signal: request.signal });
      if (!response.ok) return;

      const source = await response.text();
      const sanitizedSource = DOMPurify.sanitize(source, {
        USE_PROFILES: { svg: true, svgFilters: true },
        FORBID_TAGS: ["foreignObject"],
      });
      const document = new DOMParser().parseFromString(sanitizedSource, "image/svg+xml");
      const svg = document.documentElement;

      if (svg.localName === "svg" && !request.signal.aborted) {
        this.customLogoSvg = new XMLSerializer().serializeToString(svg);
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) this.customLogoSvg = "";
    }
  }

  // ─── Render helpers ──────────────────────────────────────────────────────

  private renderPresetLogo() {
    if (!this.logo || !this.isPreset(this.logo)) return nothing;

    const svg = presetLogos[this.logo];
    const image = html`
      <div part="image" class="logo-image" role="img" aria-label="${ifDefined(this.alt || undefined)}">
        ${unsafeSVG(svg)}
      </div>
    `;

    return this.href
      ? html`<a href="${this.href}" class="logo-link" aria-label=${ifDefined(this.label || undefined)}>${image}</a>`
      : image;
  }

  private renderCustomLogo() {
    if (!this.customLogo) return nothing;

    const image = this.customLogoSvg
      ? html`<span class="custom-logo-svg" role="img" aria-label=${ifDefined(this.customLogoAlt || undefined)}
          >${unsafeSVG(this.customLogoSvg)}</span
        >`
      : html`<img
          src="${this.customLogo}"
          alt="${this.customLogoAlt}"
          aria-label=${ifDefined(this.customLogoAlt || undefined)}
        />`;

    return html`
      <div part="custom-logo" class="logo-image-custom">
        ${this.href
          ? html`<a href="${this.href}" class="logo-link" aria-label=${ifDefined(this.label || undefined)}>${image}</a>`
          : image}
      </div>
    `;
  }

  // ─── Root render ─────────────────────────────────────────────────────────

  render() {
    return html`
      <div
        part="base"
        class=${classMap({
          "qgds-logo": true,
          "is-delivering": this.logo === "coa-delivering-for-qld",
          "is-custom": this.customLogo,
        })}
      >
        ${this.renderPresetLogo()} ${this.renderCustomLogo()}
      </div>
    `;
  }
}

// ─── Global element registry ─────────────────────────────────────────────────

declare global {
  interface HTMLElementTagNameMap {
    "qgds-logo": QGDSLogo;
  }
}
