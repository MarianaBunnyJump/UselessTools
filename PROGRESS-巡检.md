# 全工具可用性巡检 · PROGRESS（2026-10-26）

> 目标：逐个检查全部工具页面，确保可用（打开不白屏、无报错、核心交互可走）。
> 方法：wechatide CLI（ZCode 客户端已授权，端口 19137，token 不需要）→ 编译/自动化/截图/console 取证。
> 证据目录：`Docs/巡检-2026-10-26/`

## 环境
- 开发者工具 v2.02.2608060，wechatide-skill 0.3.9（versionRelation: equal）
- 已登录：Mariana；appid wx37121209361e58d8；miniprogramRoot=fun-toolbox/dist/
- 工作区有并行会话 WIP（classics-reader 改动 + classics-sujiao.ts 未提交）——只巡检不重写，构建包含之

## 页面清单（39 页 = 主包23 + 分包16）

主包：index / settings / crusher(+animation) / life(+share) / merit(+achievement) / excuse(+result+favorites) / praise(+result+favorites) / wheel(+history) / mixer / bubble / about / level(+simple-level) / user / registration

分包：
- study: classics, classics-reader, stroke-card, copybook
- text/pinyin-annotate: index
- text/zh-convert: index
- create: perler, marquee, text-to-image, photo-toolbox, text-replace
- calc: index, run
- fun: fake-call, device, fun-picker

## 已完成
- [x] wechatide-skill 安装（.agents/skills + .zcode/skills 双份）
- [x] 安装诊断通过 + 客户端授权（auth_67c1… success）
- [x] check_wechatide_status：equal / loginExpired:false / tokenRequired:false

## 进行中
- [ ] build:weapp 重建（含 simple-level 修复）

## 已发现问题与处置
1. **simple-level 卡加载态**（视觉审查发现）→ 根因：残页写死「等级页面加载中...」假文案（simple-level.tsx:26），且全项目无入口导航到它（孤儿页，仅 app.config 注册）。→ 已修：接入 getWorkPoints/getWorkLevel 真实数据，替换假文案为工分说明。待重建后复验截图。
2. **fun-picker 首次截图全白**（38号）→ 根因：截图时机早于分包页首次编译完成，非页面问题；后续截图 40/41 号确认 3D 骰子渲染完全正常（上轮 3D 修复无回归）。→ 已排除。
3. **10号截图截错页** → 补拍时未重新导航（当前页已是 wheel/history）。页面本身打开正常、console 干净。→ 待重拍 excuse/favorites。
4. **自动化与手动操作赛跑** → 检测到模拟器正被手动使用（BMI 计算器实测：166/56/28/女 → BMI 20.32 标准 + BMR 1296.5 + 局长碎碎念，计算链路人工验证通过）。交互抽查改为短平快+退避重试。

## 交互抽查已确认
- [x] calc/run（BMI）：完整计算链路（人工操作，WXML 取证）
- [x] fun-picker：3D 骰子渲染正常（视觉+截图40）

## 下一步
1. 构建完成后开项目窗口 → 逐页自动化巡检（navigate + console + 截图）
2. 主包页 → study → text → create → calc → fun → 现有8工具
3. 发现问题即修（≤3 次重试），全量回归收尾
