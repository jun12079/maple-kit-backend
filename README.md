# Maple Kit Backend 🍁

MapleStory Taiwan Open API 的後端代理服務，使用 Express + TypeScript 建構，提供安全的 API Key 管理與資料聚合功能。

## 快速開始

### 環境需求

- Node.js 18+
- npm 或 yarn

### 安裝

```bash
# 安裝依賴
npm install

# 設定環境變數
cp .env.example .env
```

### 環境變數設定

編輯 `.env` 檔案：

```env
PORT=3001
NODE_ENV=development
MAPLE_API_KEY=your_api_key_here
```

> 前往 [Nexon Open API](https://openapi.nexon.com/) 申請 API Key

### 啟動開發伺服器

```bash
npm run dev
```

伺服器將運行在 `http://localhost:3001`

### 編譯與執行

```bash
# 編譯 TypeScript
npm run build

# 執行編譯後的程式
npm start
```

---

## 專案結構

```
maple-kit-backend/
├── src/
│   ├── index.ts                  # 應用程式入口
│   ├── controllers/              # 控制器層
│   │   ├── index.controller.ts
│   │   └── character.controller.ts
│   ├── routes/                   # 路由層
│   │   ├── routes.ts
│   │   ├── index.route.ts
│   │   └── character.route.ts
│   ├── services/                 # 服務層
│   │   ├── nexonAPI.service.ts   # Nexon API 呼叫
│   │   └── mapleAPI.service.ts   # MapleStory API 邏輯
│   └── types/                    # TypeScript 類型定義
│       └── mapleAPI.ts
├── dist/                         # 編譯輸出
├── .env                          # 環境變數
├── package.json
└── tsconfig.json
```

---

## 技術棧

### 核心框架

- **Node.js** - JavaScript 執行環境
- **Express** - Web 應用框架
- **TypeScript** - 類型安全的 JavaScript

### 開發工具

- **ts-node-dev** - TypeScript 開發模式熱重載
- **dotenv** - 環境變數管理

### 其他套件

- **cors** - 跨域資源共享
- **@types/*** - TypeScript 類型定義

---

## API 端點

### 主要端點

| 端點 | 說明 |
|------|------|
| `GET /` | API 基本資訊 |
| `GET /health` | 健康檢查 |
| `GET /api/maple/id` | 取得角色 OCID |
| `GET /api/maple/character/all` | 取得角色完整資料 |

### 使用範例

```bash
# 取得角色 OCID
curl "http://localhost:3001/api/maple/id?character_name=角色名稱"

# 取得完整角色資料
curl "http://localhost:3001/api/maple/character/all?ocid=YOUR_OCID"
```

---
## 授權條款

本專案使用的授權條款 - 詳見 [LICENSE](LICENSE) 檔案

