// Static brand/company info for theme export
// Field set mirrors ringle's packages/shared/brand.json so exports are drop-in compatible

export const SITE_BRAND_INFO = {
  company: {
    name: 'Sam Redpath',
    tagline: 'Solutions Architect & Full Stack Developer',
    website: 'https://samredpath.com',
    portal: 'https://crankymagician.com',
  },
  logo: {
    app: '/default_logo.png',
    appDark: '/default_logo.png',
    appAccent: '/default_logo.png',
    appAccentDark: '/default_logo.png',
    email: '/default_logo.png',
    emailDark: '/default_logo.png',
    emailAccent: '/default_logo.png',
    emailWidth: 128,
    emailHeight: 128,
  },
};

// Colour groups that carry ringle's extra text/icon keys. primary and secondary do not.
export const STATUS_GROUPS = ['error', 'warning', 'info', 'success'];

export const COLOR_GROUPS = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];
