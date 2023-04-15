package config_test

import (
	"os"
	"testing"

	"github.com/xzzpig/headscale-manager/config"
)

func TestSetupEnv(t *testing.T) {
	config.SetupEnv()

	t.Log(os.Environ())
}
