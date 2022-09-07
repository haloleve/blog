import { jueJinSvg } from '../../tools/icon_path';

export default {
  title: '好好学习',
  description: 'good good study',
  base: '/blog/',
  themeConfig: {
    siteTitle: '天天向上',
    logo: '/logo.svg',
    nav: [
      { text: '手册', link: '/guide/' },
      { text: '配置', link: '/config/' },
      { text: 'github', link: 'https://github.com/haloleve' },
      {
        text: '其他',
        items: [
          {
            items: [
              { text: '列表1', link: '/item-A1' },
              { text: '列表2', link: '/item-A2' },
            ],
          },
          {
            items: [
              { text: '列表3', link: '/item-B1' },
              { text: '列表4', link: '/item-B2' },
            ],
          },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/haloleve' },
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
          text: '手写',
          collapsible: true,
          collapsed: true,
          items: [
            {
              text: '组件库环境搭建',
              link: '/articles/code/deepclone',
            },
          ],
        },
        {
          text: '其他',
          collapsible: true,
          collapsed: true,
          items: [
            {
              text: 'mock.js',
              link: '/articles/mock',
            },
          ],
        },
      ],
    },
  },
};
