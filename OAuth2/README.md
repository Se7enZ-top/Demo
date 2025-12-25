# 基于OAuth2和gin框架的GitHub登陆模型

## Oauth
Oauth 2.0 是目前最流行的授权机制，用来授权第三方应用，获取用户数据。

### 使用场景：我们为什么要使用OAuth？

假设今天我们要开发一个应用程序，功能是可以将用户存放在 Google 账号下的照片导入应用并进行一些处理，这时候就需要考虑，我们的应用程序该如何获取用户账号下的资源呢？

在以前，我们可能会让用户自行输入其 Google 账号密码，然后我们开发的应用程序通过这组账号密码获取访问照片的权限，进而对照片进行处理。但这样会衍生出很多问题，核心问题在于，如果应用程序通过用户的 Google 账号密码获取权限，那么应用程序获得的权限会过大 —— 应用程序原本只需要照片的访问权限，而通过账号密码则能获取整个账号的使用权。

如果现在有一个不怀好意的应用程序获得了你整个 Google 账号密码的使用权，就可以通过它登录很多不同的网站，甚至进行非法交易等。因此，我们需要一种解决方案：一方面能让应用程序获取所需的资源，另一方面又不会向应用程序开放过多权限，仅授权部分访问功能。

换个角度来看，如果今天我非常信任这个应用程序，将整个账号的权限都交给了它，但某天决定不再使用这个应用程序了，这时候该如何收回权限呢？我们需要重新设置一遍账号密码，才能确保该应用程序不再拥有访问我账号的权限。

+ 总结一下传统方法的缺点：
    1. 应用程序为了后续操作的便利可能会保存用户的账户和密码，无法确定其安全性
    2. 应用程序拥有该账户的所有权限，并且无法限制其权限生效时间
    3. 通过修改账户密码的方式可以更改其权限，但同样的其他应用程序的权限也会同时失效
    4. 当一个应用程序被攻破，意味着可能其他应用程序同样会有被攻破的风险

### Oauth2.0规格书 [RFC6749](https://tools.ietf.org/html/rfc6749)

RFC 6749 中明确定义了 Oauth2.0 的角色：

> ***Oauth 在传统架构中引入了一层授权层，用于分隔客户端和资源所有者。当资源所有者授权客户端（第三方应用程序）访问资源时，存储资源的服务器会向客户端（第三方应用程序）颁发一个 Access Token，客户端获取 Token 后，即可通过该 Token 对资源进行有限度的访问（而非获取全部权限）。***

由上述重点内容可知，Oauth 的核心作用是向第三方应用程序颁发 Token，作为第三方应用与资源网站之间的交互桥梁。

    简单来说，Oauth 就是一种授权机制。以 Google 作为数据存储平台为例，用户告知 Google 授权第三方应用程序获取部分资源，Google 系统会生成一个 Token，第三方应用可以通过该 Token 在授权范围内访问数据。

>**Token vs PassWord**  
>**(1) Token 具有时效性，过期后会自动撤销，不会让第三方应用程序一直持有权限。**  
>**(2) 如果不想继续授权给应用程序，资源所有者可以随时撤销 Token 的有效性。**  
>**(3) Token 最大的优势是支持权限管理，可以只向第三方应用程序开放部分资源的访问权限。**

### 第三方登录流程简述
假设我们的第三方登录网站为 A，支持用户通过 Google 账号登录，流程大致如下：

    A 跳转到 Google 登录界面。
    ↓
    Google 要求用户登录 Google 账号，并询问是否同意向 A 开放权限。
    ↓
    用户同意开放权限，Google 跳转回 A 网站，并在查询字符串（query string）中附带 code。
    ↓
    A 网站在后端使用 code 向 Google 申请 Access Token。
    ↓
    Google 将 Access Token 及相关信息以 JSON 格式返回。
    ↓
    A 网站通过 Access Token 向 Google 请求用户的相关资源。


## 项目核心结构
```plaintxt
OAuth2/
├── main.go          # 程序入口：初始化 Gin 路由、注册中间件、启动 HTTP 服务
├── backend/
│   └── github.go    # 核心业务逻辑：GitHub OAuth2 配置、登录跳转、回调处理
├── frontend/        # 前端页面目录：存放登录入口页、登录成功展示页（HTML/CSS/JS）
└── go.mod/go.sum    # Go 模块依赖管理文件
```

## 环境准备与依赖
1. 开发环境

    Go 1.16+（支持模块管理）

    一个 GitHub 账号（用于创建 OAuth 应用）

2. 核心依赖
    项目依赖以下库：
    >**github.com/gin-gonic/gin：轻量级 Go Web 框架  
    github.com/gin-contrib/sessions：Gin 的会话管理中间件（用于存储 OAuth2 的 state）  
    golang.org/x/oauth2：Go 官方 OAuth2 客户端库  
    golang.org/x/oauth2/github：GitHub 平台的 OAuth2 配置**

    通过 go mod 安装依赖：

   ```bash
    go get github.com/gin-gonic/gin
    go get github.com/gin-contrib/sessions
    go get golang.org/x/oauth2
    ```
## GitHub OAuth2 登录流程详解
OAuth2 登录的核心流程可概括为：申请授权 → 获取 code → 换取 token → 用 token 获取用户信息。以下结合 github.go 代码逐步解析。
### 初始化 OAuth2 配置
首先需要创建 GitHub OAuth 应用，获取 ClientID 和 ClientSecret：  

***登录 GitHub，进入 Settings → Developer settings → OAuth Apps***

点击 "New OAuth App"，填写应用名称、主页 URL（如 http://localhost:8080）和回调 URL（如 http://localhost:8080/callback/redirect）

创建后即可获取 ClientID 和 ClientSecret

在代码中，**getGithubOauthURL** 函数负责初始化 OAuth2 配置：

```go
func getGithubOauthURL() (*oauth2.Config, string) {
    // 从环境变量中获取 ClientID、ClientSecret 和回调 URL
    options := CreateClientOptions("github", "http://localhost:8080/callback/redirect")

    github_config = &oauth2.Config{
        ClientID:     options.getID(),         // GitHub 应用的 ClientID
        ClientSecret: options.getSecret(),     // GitHub 应用的 ClientSecret
        RedirectURL:  options.getRedirectURL(),
        Scopes: []string{                      // 申请的权限范围
            "user",  
            "repo", 
        },
        Endpoint: github.Endpoint, 
    }

    state := GenerateState() // 生成随机 state（用于防止 CSRF 攻击）
    return github_config, state
}
```
关键参数说明：

**Scopes**：定义应用需要访问的用户权限，user 权限可获取用户邮箱、名称等基本信息。

**state**：随机字符串，用于验证回调请求的合法性，防止跨站请求伪造（CSRF）。
### 发起登录请求（跳转至 GitHub 授权页）
当用户点击 "使用 GitHub 登录" 按钮时，前端会请求后端的登录接口（如 /login/github），该接口由 **GithubOauthLogin** 函数处理：

```go
func GithubOauthLogin(ctx *gin.Context) {
    config, state := getGithubOauthURL()
    // 生成 GitHub 授权页面的 URL
    redirectURL := config.AuthCodeURL(state)

    // 将 state 存入 session，用于后续回调验证
    session := sessions.Default(ctx)
    session.Set("state", state)
    if err := session.Save(); err != nil {
        ctx.AbortWithError(http.StatusInternalServerError, err)
        return
    }

    // 重定向用户至 GitHub 授权页面
    ctx.Redirect(http.StatusSeeOther, redirectURL)
}
```
流程说明：

    生成 OAuth2 配置和随机 state。
    ↓
    将 state 存入 session（依赖 gin-contrib/sessions 中间件）。
    ↓
    生成 GitHub 授权 URL 并跳转，用户将在该页面确认是否授权。
### 处理 GitHub 回调（获取用户信息）
用户授权后，GitHub 会将用户重定向回我们配置的回调 URL（如 /oauth/redirect），并携带 code 和 state 参数。**GithubCallBack** 函数负责处理该回调：
```go
func GithubCallBack(ctx *gin.Context) {
    // 1. 验证 state
    session := sessions.Default(ctx)
    storedState := session.Get("state")
    if storedState != ctx.Query("state") {
        ctx.AbortWithError(http.StatusUnauthorized, StateError)
        return
    }

    // 2. 用 code 换取 access_token
    code := ctx.Query("code")
    token, err := github_config.Exchange(ctx, code)
    if err != nil {
        ctx.AbortWithError(http.StatusUnauthorized, err)
        return
    }

    // 3. 用 access_token 调用 GitHub API 获取用户信息
    client := github_config.Client(context.TODO(), token)
    userInfo, err := client.Get("https://api.github.com/user")
    if err != nil {
        ctx.AbortWithError(http.StatusBadRequest, err)
        return
    }
    defer userInfo.Body.Close()

    // 4. 解析用户信息
    info, _ := ioutil.ReadAll(userInfo.Body)
    var user githubUser
    json.Unmarshal(info, &user)

    // 5. 重定向至登录成功页，携带用户信息
    redirectURL, _ := url.Parse(IsLoginURL)
    query := redirectURL.Query()
    query.Add("email", user.Email)
    query.Add("name", user.Name)
    query.Add("source", "github")
    redirectURL.RawQuery = query.Encode()
    ctx.Redirect(http.StatusSeeOther, redirectURL.String())
}
```
流程说明：

    验证 state：对比回调参数中的 state 与 session 中存储的 state，不一致则拒绝请求。
    ↓
    换取 token：使用回调参数中的 code，通过 github_config.Exchange 向 GitHub 申请 access_token。
    ↓
    获取用户信息：用 access_token 构造 HTTP 客户端，调用 GitHub 用户信息 API（https://api.github.com/user）。
    ↓
    解析与跳转：将 API 返回的 JSON 数据解析为 githubUser 结构体，提取关键信息（如邮箱、名称），重定向至前端登录成功页并携带这些信息。

### 运行与测试

#### 配置环境变量：将 GitHub 应用的 ClientID 和 ClientSecret 存入环境变量。
#### 启动服务：运行 main.go 启动 Gin 服务（默认端口为 8080）。
#### 测试流程：

    访问 http://localhost:8080/login 进入登录页。
    ↓
    点击 "GitHub 登录"，跳转至 GitHub 授权页。
    ↓
    授权后自动跳转回回调 URL，最终显示包含用户信息的成功页。
