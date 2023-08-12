package config

import (
	"os"

	"github.com/joho/godotenv"

	_ "embed"
)

type EnvKey = string

const (
	GO_ENV EnvKey = "GO_ENV"

	MONGO_URI     EnvKey = "MONGO_URI"
	MONGO_TIMEOUT EnvKey = "MONGO_TIMEOUT"

	HEADSCALE_URL     EnvKey = "HEADSCALE_URL"
	HEADSCALE_KEY     EnvKey = "HEADSCALE_KEY"
	HEADSCALE_TIMEOUT EnvKey = "HEADSCALE_TIMEOUT"

	ENDPOINT_GRAPHQL            EnvKey = "ENDPOINT_GRAPHQL"
	ENDPOINT_GRAPHQL_PLAYGROUND EnvKey = "ENDPOINT_GRAPHQL_PLAYGROUND"
	ENDPOINT_UI                 EnvKey = "ENDPOINT_UI"
	ENDPOINT_OIDC_CALLBACK      EnvKey = "ENDPOINT_OIDC_CALLBACK"

	OIDC_ENABLE        EnvKey = "OIDC_ENABLE"
	OIDC_CLIENT_ID     EnvKey = "OIDC_CLIENT_ID"
	OIDC_CLIENT_SECRET EnvKey = "OIDC_CLIENT_SECRET"
	OIDC_ISSUER_URL    EnvKey = "OIDC_ISSUER_URL"
	OIDC_REDIRECT_URL  EnvKey = "OIDC_REDIRECT_URL"
	OIDC_SCOPES        EnvKey = "OIDC_SCOPES"
	OIDC_ORIGIN_COOKIE EnvKey = "OIDC_ORIGIN_COOKIE"
	OIDC_DEFAULT_USER  EnvKey = "OIDC_DEFAULT_USER"

	AUTH_COOKIE_KEY EnvKey = "AUTH_COOKIE_KEY"
	AUTH_HEADER_KEY EnvKey = "AUTH_HEADER_KEY"

	ADMIN_GROUPS EnvKey = "ADMIN_GROUPS"
	ADMIN_USERS  EnvKey = "ADMIN_USERS"
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
}
