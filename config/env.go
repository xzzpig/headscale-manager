package config

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"

	_ "embed"
)

type Config struct {
	Environment string `envconfig:"GO_ENV"`
	Mongo       struct {
		Uri    string `envconfig:"MONGO_URI"`
		Timout int64  `envconfig:"MONGO_TIMEOUT"`
	}
	Headscale struct {
		Url     string `envconfig:"HEADSCALE_URL"`
		Key     string `envconfig:"HEADSCALE_KEY"`
		Timeout int64  `envconfig:"HEADSCALE_TIMEOUT"`
	}
	Endpoints struct {
		GraphQL           string `envconfig:"ENDPOINT_GRAPHQL"`
		GraphQLPlayground string `envconfig:"ENDPOINT_GRAPHQL_PLAYGROUND"`
		UI                string `envconfig:"ENDPOINT_UI"`
		OidcCallback      string `envconfig:"ENDPOINT_OIDC_CALLBACK"`
		ACL               string `envconfig:"ENDPOINT_ACL"`
	}
	Oidc struct {
		Enable       bool     `envconfig:"OIDC_ENABLE"`
		ClientId     string   `envconfig:"OIDC_CLIENT_ID"`
		ClientSecret string   `envconfig:"OIDC_CLIENT_SECRET"`
		IssuerUrl    string   `envconfig:"OIDC_ISSUER_URL"`
		RedirectUrl  string   `envconfig:"OIDC_REDIRECT_URL"`
		Scopes       []string `envconfig:"OIDC_SCOPES"`
		OriginCookie string   `envconfig:"OIDC_ORIGIN_COOKIE"`
		DefaultUser  string   `envconfig:"OIDC_DEFAULT_USER"`
	}
	Auth struct {
		CookieKey string `envconfig:"AUTH_COOKIE_KEY"`
		HeaderKey string `envconfig:"AUTH_HEADER_KEY"`
	}
	Admin struct {
		Groups []string `envconfig:"ADMIN_GROUPS"`
		Users  []string `envconfig:"ADMIN_USERS"`
	}
	ACL struct {
		Enable   bool   `envconfig:"ACL_ENABLE"`
		Base     string `envconfig:"ACL_BASE"`
		Password string `envconfig:"ACL_PASSWORD"`
		Features struct {
			UserSelf   bool `envconfig:"ACL_FEATURE_USER_SELF"`   // user can access device owned by himself
			UserShare  bool `envconfig:"ACL_FEATURE_USER_SHARE"`  // user can share device by tag:share-<username>
			ProjectTag bool `envconfig:"ACL_FEATURE_PROJECT_TAG"` // tag:prj-acc-<project> allows access tag:prj-use-<project> and project routes
		}
		Trigger struct {
			Enable  bool   `envconfig:"ACL_TRIGGER_ENABLE"`
			Cmd     string `envconfig:"ACL_TRIGGER_CMD"`
			Webhook string `envconfig:"ACL_TRIGGER_WEBHOOK"`
		}
	}
}

var config Config

type EnvKey = string

const (
	GO_ENV EnvKey = "GO_ENV"
)

//go:embed .env
var defaultEnv string

func SetupEnv() {
	env := os.Getenv(GO_ENV)
	if env == "" {
		env = "development"
	}

	godotenv.Load(".env." + env + ".local")
	godotenv.Load(".env." + env)
	godotenv.Load()
	envMap, err := godotenv.Unmarshal(defaultEnv)
	if err != nil {
		panic(err)
	}
	for k, v := range envMap {
		if os.Getenv(k) == "" {
			os.Setenv(k, v)
		}
	}

	err = envconfig.Process("hsm", &config)
	if err != nil {
		panic(err)
	}
}

func GetConfig() *Config {
	return &config
}
