export interface NavItem {
  label: string
  href: string
}

export const site = {
  title: 'My Portfolio',
  description: '个人展示网站',
  nav: [
    { label: '首页', href: '/#hero' },
    { label: '关于', href: '/#about' },
    { label: '技能', href: '/#skills' },
    { label: '项目', href: '/#projects' },
    { label: '博客', href: '/blog' },
  ] as NavItem[],
}
