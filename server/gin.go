package server

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/xzzpig/headscale-manager/api/oidc"
	"github.com/xzzpig/headscale-manager/config"
	"github.com/xzzpig/headscale-manager/front"
	"github.com/xzzpig/headscale-manager/graph"
	mycontext "github.com/xzzpig/headscale-manager/server/context"
	"github.com/xzzpig/headscale-manager/service/loader"
)

// Defining the Graphql handler
func graphqlHandler() gin.HandlerFunc {
	// NewExecutableSchema and Config are in the generated.go file
	// Resolver is in the resolver.go file
	h := handler.NewDefaultServer(graph.NewSchema())

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

// Defining the Playground handler
func playgroundHandler() gin.HandlerFunc {
	h := playground.Handler("GraphQL", config.GetConfig().Endpoints.GraphQL)

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

func ginContextToContextMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.WithValue(c.Request.Context(), mycontext.GIN_CONTEXT_KEY, c)
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

func loaderContextToContextMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.WithValue(c.Request.Context(), mycontext.LOADERS_KEY, loader.NewLoaders())
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

var myConfig = ""

func initConfig() {
	configMap := make(map[string]string)
	configMap["graphqlEndpoint"] = config.GetConfig().Endpoints.GraphQL
	str, err := json.Marshal(configMap)
	if err != nil {
		panic(err)
	}
	myConfig = string(str)
}

func Run() {
	if os.Getenv(config.GO_ENV) == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	initConfig()
	graphqlBase := config.GetConfig().Endpoints.GraphQL
	playgroundBase := config.GetConfig().Endpoints.GraphQLPlayground
	uiBase := strings.TrimSuffix(config.GetConfig().Endpoints.UI, "/")

	// Setting up Gin
	r := gin.Default()

	r.Use(ginContextToContextMiddleware())
	r.Use(loaderContextToContextMiddleware())

	oidc.SetupGin(r)

	if graphqlBase != "" {
		r.POST(graphqlBase, graphqlHandler())
	}
	if playgroundBase != "" {
		r.GET(playgroundBase, playgroundHandler())
	}

	r.GET(uiBase+"/myconfig.js", func(c *gin.Context) {
		c.Header("Cache-Control", "no-cache, no-store")
		c.String(http.StatusOK, "window.myconfig = %s", myConfig)
	})
	initACL(r)
	r.Use(static.Serve(uiBase+"/", front.NewStaticFileSystem()))
	r.Run()
}
