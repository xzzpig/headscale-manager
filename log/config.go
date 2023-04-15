package log

import (
	"os"

	"github.com/xzzpig/headscale-manager/config"
	"go.uber.org/zap"
)

func SetupZap() {
	env := os.Getenv(config.GO_ENV)
	if env == "development" {
		logger, err := zap.NewDevelopment()
		if err != nil {
			panic(err)
		}
		zap.ReplaceGlobals(logger)
		logger.Info("zap setup finish in development mode")
	} else {
		logger, err := zap.NewProduction()
		if err != nil {
			panic(err)
		}
		zap.ReplaceGlobals(logger)
		logger.Info("zap setup finish in production mode")
	}
}
