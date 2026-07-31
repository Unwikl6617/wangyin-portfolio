# Development Log

## Versioning Rules

- Every accepted website change is recorded here and saved as a local Git commit.
- Each commit uses a short version tag such as `v0.1.0` and can be restored by tag or commit ID.
- `public/assets/` is intentionally excluded from Git because videos and image collections are large. Each log entry lists newly added asset filenames.
- Before a new change, create a checkpoint commit. If the result is not approved, restore the prior checkpoint.

## v0.1.0 - Stable Recovery Baseline

- Rebuilt a stable React + Vite entry point after encoding damage.
- Restored the hero video sequence, hover scan interactions, active navigation indicator, profile, work, ability and contact sections.
- Restored project media player: wheel switching, media stop-on-switch, centered progress nodes and image gallery windowing.
- Project 02 is labeled Campus AI Works and uses `campus-ai-work.mp4` as its first video.
- Project 03 uses the imported 20-image AI gallery.

### Asset Manifest

- `hero-showcase.mp4`, `hero-short-clip.mp4`, `hero-star-road.mp4`
- `campus-ai-work.mp4`, `campus-shen-sui.mp4`
- `project-spaceship.mp4`, `project-mecha-dog.mp4`, `project-thirty-seconds.mp4`
- `ai-gallery-1.png` through `ai-gallery-20.png`
- `wangyin-photo.png`
## v0.1.2 — 固定导航与定位提示
- 导航栏固定在页面顶部。
- 点击或滚动到“关于我 / 作品精选 / 能力体系”时，同步显示对应的紫色底部提示条。
- 保持平滑锚点定位，避免固定导航遮挡章节标题。

## v0.1.3 — 中文界面文案恢复
- 恢复个人介绍、教育经历、作品、能力与底部联系区的中文文案。
- 保留 v0.1.2 的固定导航与模块紫色定位条。

## v0.1.4 — 作品弹窗滚动隔离
- 打开作品播放器时锁定页面背景滚动。
- 鼠标滚轮仅用于切换弹窗内的作品媒体，不再带动主页。

## v0.1.5 — 统一箭头图标
- 将全站按钮与链接箭头统一为右上方向箭头“↗”。

## v0.1.6 — 姓名扫光字形同步
- 姓名扫光层与“王胤”显示文字使用相同字形，避免闪光时出现错误字符。
- 将个人抬头与职位恢复为英文“HELLO, I''M / AI Designer”。

## v0.1.7 — 导航悬停反馈
- 导航链接及“联系我”按钮悬停时显示清晰的主题紫色反馈。

## v0.1.8 — 作品模块英文文案
- 将作品精选、三个项目的分类、标题与说明恢复为英文。
- 将能力模块章节标签与主标题恢复为英文。
