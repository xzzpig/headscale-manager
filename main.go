package main

import (
	"github.com/xzzpig/headscale-manager/api/headscale"
	"github.com/xzzpig/headscale-manager/config"
	"github.com/xzzpig/headscale-manager/db"
	"github.com/xzzpig/headscale-manager/log"
	"github.com/xzzpig/headscale-manager/server"
)

func main() {
	config.SetupEnv()
	log.SetupZap()
	db.Connect()
	headscale.SetupHeadscaleClient()
	defer headscale.Client.Close()

	server.Run()
}
