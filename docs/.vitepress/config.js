import { jueJinSvg } from '../../tools/icon_path';

export default {
  title: '和光同尘',
  description: 'Just playing around.',
  base: '/blog/',
  themeConfig: {
    siteTitle: 'My Custom Title',
    logo: '/logo.svg',
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'GuideTest', link: '/guide/test' },
      { text: 'gitee', link: 'https://gitee.com/geeksdidi' },
      {
        text: 'Drop Menu',
        items: [
          {
            items: [
              { text: 'Item A1', link: '/item-A1' },
              { text: 'Item A2', link: '/item-A2' },
            ],
          },
          {
            items: [
              { text: 'Item B1', link: '/item-B1' },
              { text: 'Item B2', link: '/item-B2' },
            ],
          },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://gitee.com/geeksdidi' },
      {
        icon: {
          svg: jueJinSvg,
        },
        link: 'https://juejin.cn/',
      },
    ],
    sidebar: {
      '/articles/': [
        {
          text: '组件库源码实现',
          items: [
            {
              text: '组件库环境搭建',
              link: '/articles/组件库环境搭建',
            },
            { text: 'gulp的使用', link: '/articles/gulp的使用' },
          ],
        },
        {
          text: 'vue教程',
          collapsible: true,
          collapsed: true,
          items: [
            {
              text: 'pina和vuex',
              link: '/articles/pina和vuex',
            },
          ],
        },
      ],
    },
  },
};