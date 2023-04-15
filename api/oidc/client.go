package oidc

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/gin-gonic/gin"
	"github.com/xzzpig/headscale-manager/config"
	"github.com/xzzpig/headscale-manager/util"
	"go.uber.org/zap"
	"golang.org/x/oauth2"
)

var oauth2Config *oauth2.Config
var verifier *oidc.IDTokenVerifier
var claimsInfo struct {
	ScopesSupported []string `json:"scopes_supported"`
	ClaimsSupported []string `json:"claims_supported"`
}
var oidcConfig struct {
	enable           bool
	callbackEndpoint string
	clientId         string
	clientSecret     string
	issuerUrl        string
	redirectUrl      string
	scopes           []string
	cookieKey        string
	headerKey        string
	originUrlKey     string
}
var logger *zap.Logger

func SetupGin(r *gin.Engine) {
	if oauth2Config == nil {
		Setup()
	}
	if !oidcConfig.enable {
		return
	}
	r.Use(handleRedirect)
	r.GET(oidcConfig.callbackEndpoint, handleCallback)
}

func setupConfig() {
	logger = zap.L().Named("oidc")
	oidcConfig.enable = os.Getenv(config.OIDC_ENABLE) == "true"
	if !oidcConfig.enable {
		return
	}
	logger.Info("oidc is enabled, setting up")
	oidcConfig.callbackEndpoint = os.Getenv(config.ENDPOINT_OIDC_CALLBACK)
	oidcConfig.clientId = os.Getenv(config.OIDC_CLIENT_ID)
	oidcConfig.clientSecret = os.Getenv(config.OIDC_CLIENT_SECRET)
	oidcConfig.issuerUrl = os.Getenv(config.OIDC_ISSUER_URL)
	oidcConfig.redirectUrl = os.Getenv(config.OIDC_REDIRECT_URL)
	oidcConfig.scopes = strings.Split(os.Getenv(config.OIDC_SCOPES), ",")
	oidcConfig.cookieKey = os.Getenv(config.AUTH_COOKIE_KEY)
	oidcConfig.headerKey = os.Getenv(config.AUTH_HEADER_KEY)
	oidcConfig.originUrlKey = os.Getenv(config.OIDC_ORIGIN_COOKIE)

	if oidcConfig.callbackEndpoint == "" {
		logger.Panic("oidc callback endpoint is empty")
	}
	if oidcConfig.clientId == "" {
		logger.Panic("oidc client id is empty")
	}
	if oidcConfig.clientSecret == "" {
		logger.Panic("oidc client secret is empty")
	}
	if oidcConfig.issuerUrl == "" {
		logger.Panic("oidc issuer url is empty")
	}
	if oidcConfig.redirectUrl == "" {
		logger.Panic("oidc redirect url is empty")
	}
	if !util.ArrContains(oidcConfig.scopes, oidc.ScopeOpenID) {
		oidcConfig.scopes = append(oidcConfig.scopes, oidc.ScopeOpenID)
	}
	if oidcConfig.cookieKey == "" {
		oidcConfig.cookieKey = "headscale_manager_token"
	}
	if oidcConfig.headerKey == "" {
		oidcConfig.headerKey = "Authorization"
	}
	if oidcConfig.originUrlKey == "" {
		oidcConfig.originUrlKey = "original_url"
	}
}

func Setup() {
	setupConfig()

	if !oidcConfig.enable {
		return
	}

	ctx := context.Background()
	provider, err := oidc.NewProvider(ctx, oidcConfig.issuerUrl)
	if err != nil {
		logger.Panic("failed to get provider", zap.Error(err))
	}

	err = provider.Claims(&claimsInfo)
	if err != nil {
		logger.Panic("failed to get claims", zap.Error(err))
	}
	logger.Debug("claims", zap.Any("claims", claimsInfo))

	// Configure an OpenID Connect aware OAuth2 client.
	oauth2Config = &oauth2.Config{
		ClientID:     oidcConfig.clientId,
		ClientSecret: oidcConfig.clientSecret,
		RedirectURL:  oidcConfig.redirectUrl,

		// Discovery returns the OAuth2 endpoints.
		Endpoint: provider.Endpoint(),

		// "openid" is a required scope for OpenID Connect flows.
		Scopes: oidcConfig.scopes,
	}
	verifier = provider.Verifier(&oidc.Config{
		ClientID: oidcConfig.clientId,
	})

	logger.Info("oidc setup finished")
}

func doRedirect(c *gin.Context) {
	requestUri := c.Request.URL.RequestURI()
	authCodeUrl := oauth2Config.AuthCodeURL("state")
	logger.Debug("redirecting", zap.String("requestUri", requestUri), zap.String("authCodeUrl", authCodeUrl))
	c.SetCookie(oidcConfig.originUrlKey, requestUri, 0, "/", "", false, true)
	c.Redirect(http.StatusFound, authCodeUrl)
}

func handleRedirect(c *gin.Context) {
	if c.Request.URL.Path == oidcConfig.callbackEndpoint {
		c.Next()
		return
	}
	token, err := c.Cookie(oidcConfig.cookieKey)
	if err != nil {
		token = c.GetHeader(oidcConfig.headerKey)
	}
	if token == "" {
		logger.Debug("no token found, redirecting")
		doRedirect(c)
		return
	}
	_, err = verifier.Verify(c, token)
	if err != nil {
		logger.Debug("token invalid, redirecting", zap.Error(err))
		doRedirect(c)
		return
	}
	// newToken, err := oauth2Config.TokenSource(c, &oauth2.Token{
	// 	AccessToken: token,
	// 	Expiry:      time.Now().Add(time.Hour),
	// }).Token()
	// if err != nil {
	// 	logger.Debug("failed to refresh token, redirecting", zap.Error(err))
	// 	doRedirect(c)
	// 	return
	// }
	// setToken(c, newToken)
	// claims := make(map[string]interface{})
	// if err := idtoken.Claims(&claims); err != nil {
	// 	c.Error(err)
	// 	return
	// }
	// fmt.Println(claims)
	c.Next()
}

func setToken(c *gin.Context, token *oauth2.Token) {
	maxAge := token.Expiry.Unix() - time.Now().Unix()
	c.SetCookie(oidcConfig.cookieKey, token.AccessToken, int(maxAge), "/", "", false, true)
	c.Header(oidcConfig.headerKey, token.AccessToken)
}

func handleCallback(c *gin.Context) {
	oauth2Token, err := oauth2Config.Exchange(c, c.Query("code"))
	if err != nil {
		logger.Debug("failed to exchange token", zap.Error(err))
		c.Error(err)
		return
	}
	rawIDToken, ok := oauth2Token.Extra("id_token").(string)
	if !ok {
		logger.Debug("no id_token found in oauth2 token")
		c.Error(err)
		return
	}
	idToken, err := verifier.Verify(c, rawIDToken)
	if err != nil {
		logger.Debug("failed to verify id_token", zap.Error(err))
		c.Error(err)
		return
	}

	resp := struct {
		OAuth2Token   *oauth2.Token
		IDTokenClaims *json.RawMessage // ID Token payload is just JSON.
	}{oauth2Token, new(json.RawMessage)}

	if err := idToken.Claims(&resp.IDTokenClaims); err != nil {
		logger.Debug("failed to parse id_token claims", zap.Error(err))
		c.Error(err)
		return
	}

	setToken(c, oauth2Token)

	c.SetCookie(oidcConfig.originUrlKey, "", -1, "/", "", false, true)
	originUrl, err := c.Cookie(oidcConfig.originUrlKey)
	if err != nil {
		logger.Debug("no origin url found, redirecting to /")
		originUrl = "/"
	}
	logger.Debug("redirecting to origin url", zap.String("originUrl", originUrl))
	c.Redirect(http.StatusFound, originUrl)
}
