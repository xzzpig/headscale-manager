package db_test

import (
	"encoding/json"
	"os"
	"testing"

	"github.com/xzzpig/headscale-manager/config"
	"github.com/xzzpig/headscale-manager/db"
	"github.com/xzzpig/headscale-manager/log"
)

func TestProjectRoutes(t *testing.T) {
	os.Chdir("../")
	config.SetupEnv()
	log.SetupZap()
	db.Connect()

	routes, err := db.Get().ProjectRoutes("64267b0e723fd8cdf1199b1a")
	if err != nil {
		t.Error(err)
	}
	str, err := json.MarshalIndent(routes, "", "  ")
	if err != nil {
		t.Error(err)
	}
	t.Log(string(str))
}
