package model_test

import (
	"encoding/json"
	"os"
	"testing"

	"github.com/xzzpig/headscale-manager/api/headscale"
	"github.com/xzzpig/headscale-manager/config"
	"github.com/xzzpig/headscale-manager/graph/model"
	"github.com/xzzpig/headscale-manager/log"
)

func TestMain(m *testing.M) {
	os.Chdir("../../")
	config.SetupEnv()
	log.SetupZap()

	m.Run()
}

func TestToHMachine(t *testing.T) {
	headscale.SetupHeadscaleClient()

	result, err := headscale.Client.ListMachines()
	if err != nil {
		t.Error(err)
	}
	machines := make([]*model.HMachine, len(result.Machines))
	for i, m := range result.Machines {
		machines[i] = model.ToHMachine(m)
	}
	str, err := json.MarshalIndent(machines, "", "  ")
	if err != nil {
		t.Error(err)
	}
	t.Log(string(str))
}

func TestToHMachineRoute(t *testing.T) {
	headscale.SetupHeadscaleClient()

	result, err := headscale.Client.ListMachineRoutes(2)
	if err != nil {
		t.Error(err)
	}
	routes := make([]*model.HRoute, len(result.Routes))
	for i, r := range result.Routes {
		routes[i] = model.ToHRoute(r)
	}
	str, err := json.MarshalIndent(routes, "", "  ")
	if err != nil {
		t.Error(err)
	}
	t.Log(string(str))
}
