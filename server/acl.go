package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/xzzpig/headscale-manager/api/oidc/whitelist"
	"github.com/xzzpig/headscale-manager/config"
	"github.com/xzzpig/headscale-manager/service"
	"go.uber.org/zap"
)

func handleACL(c *gin.Context) {
	_, password, _ := c.Request.BasicAuth()
	if password != config.GetConfig().ACL.Password {
		c.Header("WWW-Authenticate", `Basic realm="restricted", charset="UTF-8"`)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	acl, err := service.NewHeadscaleService(c.Request.Context()).GenerateACL()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, acl)
}

func initACL(r *gin.Engine) {
	if !config.GetConfig().ACL.Enable {
		return
	}
	endpoint := config.GetConfig().Endpoints.ACL
	if endpoint != "" {
		r.GET(endpoint, handleACL)
		whitelist.AddWhitelist(endpoint)
		if config.GetConfig().ACL.Password == "" {
			zap.L().Warn("ACL is enabled, but password is empty")
		}
	}
}
