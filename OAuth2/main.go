package main

import (
	"OAuth/backend"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

func main() {
	server := gin.Default()
	store := cookie.NewStore([]byte("secret"))
	server.Use(sessions.Sessions("mysession", store))

	server.GET("/", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, "hello world")
	})

	server.Static("login", "./fronted/login")
	server.Static("islogin", "./fronted/Islogin")
	server.Static("/img", "./fronted/img")

	oauth := server.Group("oauth")
	{
		oauth.GET("/github", backend.GithubOAuthLogin)
	}

	callback := server.Group("callback")
	{
		callback.GET("github", backend.GithubCallBack)
	}

	server.Run(":8080")
}
