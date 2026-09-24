# Security company website - setup guide

Files: `index.html`, `style.css`, `script.js`. No paid services, frameworks or build step. Works on GitHub Pages.

## 1. Details

Filled in: company name, logo, phone, email, address, company number, UK-wide coverage, 24/7 hours, About Us, accreditation logos and Formspree.

Still to do:

- Once your domain is live, add the canonical and og:url tags (see the comment near the top of index.html).
- Testimonials: done (client-approved).

Logo files are in `images/` (`aja-logo-dark-bg.svg` is used on the site; `aja-logo-mark.svg` is the favicon).

## 2. Quote form (Formspree) - DONE, connected to form xppwrbzv

1. Sign up at formspree.io and create a new form. Use the email address you want quote requests sent to.
2. Copy the form ID (the part after `/f/` in the endpoint, e.g. `https://formspree.io/f/xyzabcde` → `xyzabcde`).
3. Replace `[FORMSPREE_FORM_ID]` in `index.html` (it appears twice - quote form and contact form).
4. Submit a test enquiry from the live site and confirm the email arrives.

The free plan has a monthly submission limit - check Formspree's current pricing page. Until the ID is added, the form shows a "not connected yet" notice instead of silently failing.

## 3. Publish on GitHub Pages (free)

1. Create a GitHub account and a new **public** repository (e.g. `security-website`).
2. Click **Add file → Upload files**, drag in `index.html`, `style.css`, `script.js` (and your logo/images), then **Commit**.
3. Go to **Settings → Pages**, set Source to **Deploy from a branch**, branch **main**, folder **/(root)**, and **Save**.
4. After a minute or two your site is live at `https://YOUR-USERNAME.github.io/security-website/`.
5. Optional: add your own domain under **Settings → Pages → Custom domain**.

## 4. Photos

The site currently uses free-to-use Unsplash stock photos loaded from Unsplash's servers. For a more authentic, trustworthy look, replace them with real photos of your team and sites: upload them to the repository (e.g. an `images/` folder) and change each `src="https://images.unsplash.com/…"` to `src="images/your-photo.jpg"`. Keep images under about 300 KB each for fast loading, and update the `alt` text to describe each photo.

## 5. Before launch

- A privacy policy is recommended because the forms collect personal data (UK GDPR). Add a `privacy.html` page and link to it in the footer and next to the forms.
- Submit your site to Google Search Console and set up a Google Business Profile for local search.
- Edit the "Industries We Protect" list so it only shows sectors you actually work in.
- Change brand colours at the top of `style.css` (`--accent` is the gold).
