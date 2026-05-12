/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://viajeseguro.site',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/auth/*', '/api/*', '/admin/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/auth/', '/api/', '/admin/'] },
    ],
  },
  transform: async (config, path) => {
    if (path.startsWith('/coche-compartido/')) {
      return { loc: path, changefreq: 'daily', priority: 0.9 };
    }
    return { loc: path, changefreq: config.changefreq, priority: config.priority };
  },
};
