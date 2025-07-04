# copy-desktop

这是一个拷贝漫画的第三方客户端，基于 electron + vue 构建。

## NSFW 警告⚠

本软件可能存在裸露、暴力、色情或冒犯等不适宜公众场合的内容，请勿在公共场合使用本软件，避免不必要的纷争。

## 功能

- [x] 登录
- [x] 日夜间模式
- [x] 简易用户信息（需要登录）
- [x] 自动登录
- [x] 收藏记录（需要登录）
- [x] 历史记录（需要登录）
- [x] 漫画模块
  - [x] 搜索
  - [x] 阅读
  - [x] 收藏（需要登录）
  - [x] 详情
  - [x] 分类
  - [x] 下载
  - [x] 发表评论（需要登录）
  - [x] 查看评论
  - [x] 首页推荐
  - [x] 目录阅读
- [x] 轻小说模块
  - [x] 阅读
  - [x] 搜索
  - [x] 详情
  - [x] 收藏（需要登录）
  - [x] 分类
  - [x] 下载
  - [x] 发表评论（需要登录）
  - [x] 查看评论
- [x] 动漫模块
  - [x] 推荐
  - [x] 搜索
  - [x] 详情
  - [x] 收藏（需要登录）
  - [x] 分类
  - [x] 观看（由于接口限制需要登录）
  - [x] 下载
  - [x] 发表评论（需要登录）
  - [x] 查看评论

## 截图

### 漫画

#### 首页

![](./readme-assets/comic/首页1.png)

![](./readme-assets/comic/首页2.png)

![](./readme-assets/comic/首页3.png)

![](./readme-assets/comic/首页4.png)

![](./readme-assets/comic/首页5.png)

#### 详情（日间模式）

![](./readme-assets/comic/详情页（日间模式）.png)

#### 详情（夜间模式）

![](./readme-assets/comic/详情页（夜间模式）.png)

#### 阅读（翻页模式）

![](./readme-assets/comic/阅读（翻页模式）.png)

#### 阅读（滚动模式）

![](./readme-assets/comic/阅读（滚动模式）.png)

#### 搜索

![](./readme-assets/comic/搜索.png)

### 小说

#### 首页

![](./readme-assets/light-novel/首页1.png)

![](./readme-assets/light-novel/首页2.png)

#### 搜索

![](./readme-assets/light-novel/搜索.png)

#### 详情

![](./readme-assets/light-novel/详情.png)

#### 阅读

![](./readme-assets/light-novel/阅读.png)

### 动漫

#### 首页

![](./readme-assets/anime/首页1.png)

![](./readme-assets/anime/首页2.png)

#### 搜索

![](./readme-assets/anime/搜索.png)

#### 详情

![](./readme-assets/anime/详情.png)

#### 播放

![](./readme-assets/anime/播放.png)

### 其他

#### 个人中心

![](./readme-assets/个人中心.png)

#### 设置

![](./readme-assets/设置.png)

## 声明

本软件仅用于教育、学习和研究目的，旨在帮助开发者和用户理解应用程序的工作原理。作者与原始应用程序的开发者、公司或组织无关。所有涉及的代码或技术分析均为个人研究成果，并未用于商业用途或恶意活动。请勿将本软件用于任何违反法律或侵犯原开发者权利的活动。作者不对他人使用本软件产生的任何法律或财务后果承担责任。请在 24 小时内删除本软件。

## 安装包

只提供 win 、 linux 的 x86 绿色包，所有数据（包含下载文件）只在解压的目录中，整体文件夹可随意拷贝移动。mac 用户请使用源码自行构建。

点击[这里](https://github.com/Dedicatus546/copy-desktop/releases)或者右侧的 Release 处下载最新的版本，解压后执行目录内的 copy-desktop 或者 copy-desktop.exe 即可。

相关更新请查看项目的 CHANGELOG 文件。

## 问题

### 读取网址设置失败

TIPS：虽然使用的为拷贝国内的 api ，但依然推荐使用代理进行浏览，速度会快很多。

请在设置中启用代理，这里填写的为默认的 V2rayN 的代理地址，如下图所示：

![](./readme-assets/启用代理.png)

并将选择的 api 添加到你的代理规则中，V2rayN 默认的 v3 路由规则已可以代理 api.copy2000.online 该域名，手动添加如下图：

![](./readme-assets/V2rayN添加代理.png)

### 高分辨率下字体过小

windows 百分百缩放设置下，请在设置中更改缩放等级，建议 2k 屏幕设置为 1.4 ， 4k 屏幕为 1.8 ，如下图

![](./readme-assets/设置缩放等级.png)

### 没有写真模块

这个不做

---

如果你喜欢该软件，动动小手点个 star 就是对我最大的鼓励和帮助🙇‍！