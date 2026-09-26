# VitaSense production deployment

## Cloudflare Pages project

1. In Cloudflare, create a **Pages** project using **Connect to Git** and authorize the GitHub repository `mohamed-imam/vita-sense`.
2. Choose production branch `main`, framework preset **None**, build command `npm run build`, and build output directory `dist/client`. Cloudflare reads `.node-version` to use the same Node.js version as the successful GitHub build. No environment variables or server functions are required for this static export.
3. Deploy and review the generated `*.pages.dev` URL on desktop and mobile. Check `/`, `/connect/`, images, navigation, metadata, and 404 behavior. The site should load with root-based asset URLs.
4. Test an appointment request end to end with VitaSense's own address: the form should show success only after the Google Apps Script responds, and both the clinic and requester should receive the expected email. Also confirm a failed request shows an error. Avoid putting real patient details in test submissions.

The current GitHub Pages workflow still builds from `main` as a preview. Its `/vita-sense` asset prefix applies only when `GITHUB_ACTIONS=true`; the Cloudflare build uses root paths.

## Privacy decision before launch

The appointment form requests contact information and a description of symptoms. VitaSense LLC needs to approve a public privacy notice covering what is collected, the Google Workspace/Apps Script email flow, who can access submissions, and a specific retention/deletion schedule. Retention is currently undecided, so no retention claim has been added to the website. Review the form wording and notice with appropriate privacy counsel before accepting live enquiries. The website makes no HIPAA compliance claim.

## Move `vita-sense.com` from Squarespace

1. Export or record **every** current DNS record from Squarespace, including Google Workspace MX, SPF, DKIM, DMARC, domain verification, and any other mail or service records. Public DNS currently shows Squarespace nameservers, a Google MX record and SPF record, but that snapshot is not a complete record inventory.
2. Add `vita-sense.com` to Cloudflare DNS and verify all necessary records are present there **before** changing nameservers at the domain registrar. Keep the domain registration at Squarespace if desired; only DNS authority needs to move.
3. Add `vita-sense.com` as a custom domain on the Pages project. Configure `www.vita-sense.com` too, with a redirect to the apex domain if that is the preferred address. Follow Cloudflare's verification prompts and confirm HTTPS is active.
4. At Squarespace Domains, replace the domain's nameservers with the two assigned by Cloudflare. Wait for DNS propagation, then verify that the site, `www` redirect, inbound mail, outbound mail, SPF/DKIM/DMARC, and the appointment form all work. Only then disconnect the old Squarespace website.
5. In the Google Apps Script confirmation email HTML, change the signature image URL from `https://mohamed-imam.github.io/vita-sense/email-signature.png` to `https://vita-sense.com/email-signature.png` once the new domain serves that asset. Redeploy the Apps Script version after editing.

Adding a domain in Pages does not transfer domain registration. Changing nameservers is the live cutover and should be done only after Cloudflare DNS and the Pages preview are verified.

## References

- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Cloudflare Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Cloudflare full DNS setup](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/)
- [Squarespace DNS records](https://support.squarespace.com/hc/en-us/articles/360002101888-Edit-your-domain-s-DNS-records)
