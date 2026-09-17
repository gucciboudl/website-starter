---
name: thailand-handbook-maintenance
description: 修改、验证和发布 gucciboy.com/thailand 泰国旅行手册，保留用户本地编辑，维护 Google 地图及混合照片，并通过 gucciboudl/website-starter 与 Cloudflare Pages 发布。用于此项目的后续接手与维护。
---

# 泰国旅行手册维护

## 项目定位与接手

此流程记录于 2026-09-17。先检查当前文件和远端状态；账号、工具登录和部署状态需要现场确认，不能沿用旧对话的成功结论。

- 网站：https://gucciboy.com/thailand ，行程锚点 `#itinerary`。
- GitHub：https://github.com/gucciboudl/website-starter ，默认分支 `main`，公开仓库。
- Cloudflare Pages 项目：`website-starter`，默认域名 `https://website-starter-5u7.pages.dev`。
- 已有自定义域名路径映射 `/thailand`。普通内容更新不需要重配 DNS、域名或路径，也不要替换主站。
- 2026 年 9 月 25 日至 10 月 6 日，12 天 11 晚；路线曼谷→普吉镇→卡马拉；返程 10 月 7 日清晨抵达上海。前五天五人，9 月 30 日起六人。具体安排以当前行程数据为准。

识别所处环境：

1. 本机原项目目录为 `C:/Users/刘/Documents/Codex/2026-09-16/b`，这里本身不是 Git 工作树。编辑 `work/thailand.html`，同步生成 `outputs/泰国旅行手册.html`。
2. 真正的仓库 checkout（包括手机端云环境）使用根目录 `thailand.html`。不要为适配本机布局新建另一份网站源码。
3. 根目录 `index.html` 是原网站入口；旅行手册在 `thailand.html`。不要把二者混为一谈。
4. 本文的仓库版本为 `THAILAND_PROJECT_SKILL.md`，由根目录 `AGENTS.md` 引导读取。本机已安装 skill 的副本可能落后；冲突时核对仓库最新正文与代码。

## 修改前先确定基线

- 查看 `AGENTS.md`、工作区差异和远端最新 `main`。本机无 Git 时，可读取公开 raw 源码进行比较并保存带日期的备份；不要把线上构建后的 HTML 当成仓库源码，因为线上含注入后的浏览器密钥。
- 有本地未提交修改、远端新提交或另一个对话的改动时，先比较合并，不能直接覆盖。发布前再次检查基线是否变化。
- `work/*before*.html`、`static-photo-base.html` 是历史备份，旧的 `add-*.cjs`、`apply-static-photos.cjs`、`hybrid-photos.cjs` 等多数从历史快照重建。**不要直接重跑它们来做新修改**，否则会撤销后续功能；直接编辑当前源码，或先改造脚本使用当前基线。
- 日常页面调整延续本项目已建立的修改→验证→发布流程。用户明确要求仅预览、暂停或不发布时遵从；skill 本身不授予其他账号、服务或敏感操作权限。

## 保留数据与页面约定

- 单文件 HTML，简体中文，手机纵向布局，浅色/深色切换，打卡、编辑、折叠日期与交通住宿。固定图片内联；在线地图和 Google 照片允许联网依赖。
- `#trip-data` 是默认行程 JSON，`#saved-data` 是导出文件内嵌的个人状态，脚本读取为 `TRIP` 和 `state`。定位字段后只改相关内容，未知信息保持待补充/待确认。
- `localStorage` 主键当前为 `thailand-handbook-sep25-v1`。朋友的网页编辑保存在各自设备，并不会自动同步到 GitHub。
- 不要清空 localStorage、更换主键，或为了强制刷新随意递增 `TRIP.revision`。当前 revision 迁移会重建默认条目，可能覆盖已有条目的个人修改。
- 改默认行程后，旧设备可能仍显示其保存的条目。需要覆盖旧默认值时，做明确的字段迁移：只更新仍等于旧默认值的字段，保留用户改过的值及自定义条目。不要承诺已同步所有人的本地编辑。
- 保持行程条目 ID 稳定；地图、照片、打卡、迁移均可能依赖 ID。内部 ID 中历史 `trek` 字样不是页面文案，不要为了删除参考来源而重命名内部 ID。
- 新增内容不能虚构预订成功。实用标题优先，emoji 适量。时间为泰国 UTC+7；北京 UTC+8。倒计时当前为 2026-09-25 18:00 泰国时间。
- 离线版通过「保存离线版」下载；仅添加网站到主屏不能保证离线打开。不要把浏览器保存记录误说成多人实时协作。

## 地图、路线与照片

- Google 项目当前为 `gothic-airlock-266907`，已使用 Maps JavaScript API、Routes API、Places API (New)。地图开关由 `googleAllowed()` 控制：指定线上 HTTPS 域名、有网络且非离线导出。localhost 上不出现 Google 地图不代表代码坏了。
- `renderDays()` 后初始化每日地图与照片。地图功能、收藏地点、路线和照片代码均在 HTML 内联脚本中。
- 路线默认：直线距离 800 米内步行，否则打车/驾车；明确航班、渡船等不能强行按公路估计。直线距离只是选方式，不是实际路程。
- 公共交通保留：走到车站的距离/时间、线路名称/上下车站/站数/乘车时长、换乘步行、末段步行距离/时间。用户不要出发时间输入框；当前按查询时刻估算，不能当成旅行当天班表保证。
- 「从当前位置出发」使用 Google Maps directions URL，不填 origin，让 Google 自己取得当前位置。不要在网页中硬编码用户实时位置。
- 当前采用混合照片：`FIXED_PLACE_PHOTOS`、`fixedEntryPhoto()`、`entryPhotoHTML()`、`getEntryPhoto()`、`fillEntryPhoto()`、`setupEntryPhotos()`。
- 记录时共有 17 张固定照片覆盖 19 个行程条目；此数值是快照，后续以当前数据为准。有同一地点、相关度和效果合适的可用实景图就固定，否则保留 Google。不要以另一家同名分店、一般泰国海滩或不相关 SPA 冒充实际地点。
- 固定图内联 data URI，不请求 Google 照片；首次匹配地点链接仍可能请求 Places，匹配成功后仅把 place ID 存入 localStorage。不可说所有 Google API 请求都已取消。
- 照片点击要进入具体 Google 地点（place ID / 已核实 Maps URI），避免退化为仅搜街道地址。修改地点或坐标后，不应继承旧地点照片。
- Google 照片保留懒加载、并发限制、署名和错误占位。不把 API 返回照片或会过期的 photo reference 当永久静态素材存进仓库；涉及缓存规则/价格时核对 Google 当前官方文档。
- 官网、Instagram、X 可帮助查找实景素材，但公开展示不等于转载授权。固定素材记录来源、作者、许可、必要署名与裁切说明；来源不明时保留 Google 即可，不必逐个打断用户询问。

## 密钥与构建

- 仓库源码应只含占位符 `__GOOGLE_MAPS_WEB_KEY__`，当前构建要求恰好一个。
- `build-site.cjs` 从 Cloudflare 环境变量 `GOOGLE_MAPS_WEB_KEY` 注入到 `dist/thailand.html`，复制 `index.html`，生成 `_headers`；构建命令为 `node build-site.cjs`，输出目录 `dist`。现场核对配置后再改，不要无故替换部署方式。
- 浏览器 Maps key 在网站运行时可见，不能宣称使用构建 secret 就实现了前端保密或加密；它依赖 HTTP referrer 与 API 限制。真正服务端秘密不得发到浏览器。
- 不把实际密钥、Cloudflare token、会话 cookie、带密钥的构建输出或生产 HTML提交到 GitHub，也不打印在工具输出/文档中。不改动其他用途的 Google 凭据。

## 验证与发布

1. 修改当前源码，本机同步 `outputs/泰国旅行手册.html`。检查内联脚本语法、行程 JSON 可解析，检查只改了本次目标；不涉及行程时比较修改前后 `#trip-data` 是否一致。检查源码无实际 API key，仍含单个占位符。
2. 对改动做必要的行为验证。例如照片替换检查图片能加载、具体地图链接、无合适图片仍走 Google、改过地点不会误用旧图；不要为纯文案改动跑整个功能测试套件。
3. 本机可用 `node work/preview.cjs`，访问 `http://127.0.0.1:4175/`。服务读取 `outputs/泰国旅行手册.html`，只接受 `/` 或 `/index.html`，不支持随意加查询参数。先检查服务是否已存在，避免重复占端口。云 checkout 用现有环境的静态预览能力。
4. 有可用 Git 身份/连接器时使用正常 diff、commit、push 工作流，遵守当前项目分支策略；不要强推覆盖别人。没有可用 Git 身份但浏览器已登录时，可使用已验证的 GitHub 网页上传流程（下文）。
5. GitHub 提交成功仅代表源码更新。等待 Cloudflare 自动部署，再从 `https://gucciboy.com/thailand` 验证本次特有的代码/文字标记和相应行为。可以读取生产 HTML做布尔验证，但不要输出密钥。
6. 部署通常约半分钟到一分钟，偶有缓存延迟；合理间隔检查。连续两三次仍旧版，就查看 Pages 构建状态/日志与域名路由，不能凭 GitHub 提交成功宣称已上线，也不要为重试创建重复提交。
7. 完成后简短报告改了什么、实际验证了什么，以及线上地址。若仅提交未上线，明确说明。无须改动部署配置的文档更新，只需确认仓库文件已提交。

### GitHub 网页上传后备流程

使用当前环境提供的浏览器工具，先读工具文档；不要复用旧对话的 tab ID、元素索引或登录状态。此流程不要求安装新的插件。

- 打开 `https://github.com/gucciboudl/website-starter/upload/main`；确认仓库和分支。
- 通过真实文件选择器选择当前 `thailand.html`。本机文件为 `work/thailand.html`，上传后位于仓库根目录。
- 写清楚本次修改的提交说明。等待页面从 “Uploading” 变为已列出的文件名，再点击 “Commit changes”。
- 等待仓库显示新提交并记录 commit 链接；若存在并发提交先合并，不能用旧整文件覆盖。
- 日常仅上传本次修改的源文件。不要上传整个 `work`、`outputs`、历史脚本、照片搜索缓存或 `dist`。
- 更新维护流程时，仓库根目录 `THAILAND_PROJECT_SKILL.md` 与 `AGENTS.md` 也可用此流程上传。同步本机 skill 正文，避免两份说明漂移。

## 其他设备或对话

同项目新对话从根目录 `AGENTS.md` 进入本文。云端需先有仓库访问和可提交能力；本机浏览器登录、4175 服务、文件路径不会自动转移到手机。缺少发布能力时保留已完成修改，清楚报告具体缺口，不把本机登录视为云端授权已可用。

## 随身翻译与泰语地址（2026-09-17）

- 01 内包含中/泰/英翻译、Google 翻译网页链接和 iOS 尝试打开 App 入口。网页版带原文和语言；App scheme 不保证预填文字，提供复制原文作为回退。
- `translate-worker.js` 由 `build-site.cjs` 复制为 `dist/_worker.js`，`_routes.json` 仅让 `/api/translate` 进入函数。静态页面仍使用原部署方式。前端请求 `https://website-starter-5u7.pages.dev/api/translate`，不要假设主域名路径代理覆盖 API。
- Cloudflare Production Secret `GOOGLE_TRANSLATE_API_KEY` 仅供服务端使用；Google 凭据名 `Thailand Translation - Cloudflare Server`，仅允许 Cloud Translation API。不得把密钥加入 HTML、日志、文档或仓库。
- 翻译由按钮触发，最多 1000 字；服务端验证来源、语言、长度并使用短时请求限流。来源校验不是身份认证，内存限流不是全局消费上限；需要控制账单时使用 Google 项目配额。
- 地点泰语地址通过 Places 的泰语本地化查询，按可见条目加载，仅保存在内存；匹配不明确时提示查看地图，不编造地址。离线导出不保存 API 地址内容。
- 发布翻译改动时同时核对 HTML、构建脚本、Worker 三者，实际测试译文与错误提示；Google 地点地址需要在正式域名验证。
