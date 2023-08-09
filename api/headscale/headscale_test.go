package headscale_test

import (
	"context"
	"encoding/json"
	"os"
	"testing"

	v1 "github.com/juanfont/headscale/gen/go/headscale/v1"
	"github.com/xzzpig/headscale-manager/api/headscale"
	"github.com/xzzpig/headscale-manager/config"
	"github.com/xzzpig/headscale-manager/log"
)

func TestMain(m *testing.M) {
	os.Chdir("../../")
	config.SetupEnv()
	log.SetupZap()
	m.Run()
}

func TestListMachines(t *testing.T) {
	headscale.SetupHeadscaleClient()
	defer headscale.Client.Close()

	result, err := headscale.Client.ListMachines()
	if err != nil {
		t.Error(err)
	}
	str, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		t.Error(err)
	}
	t.Log(string(str))
}

func TestGetMachine(t *testing.T) {
	headscale.SetupHeadscaleClient()
	defer headscale.Client.Close()

	result, err := headscale.Client.GetMachine(1)
	if err != nil {
		t.Error(err)
	}

	str, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		t.Error(err)
	}
	t.Log(string(str))
}

func TestGetMachineRoutes(t *testing.T) {
	headscale.SetupHeadscaleClient()
	defer headscale.Client.Close()

	result, err := headscale.Client.ListMachineRoutes(2)
	if err != nil {
		t.Error(err)
	}

	str, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		t.Error(err)
	}
	t.Log(string(str))
}

// func TestEnableRoute(t *testing.T) {
// 	err := headscale.EnableRoute("7", false)
// 	if err != nil {
// 		t.Error(err)
// 	}
// }

func TestListUsers(t *testing.T) {
	headscale.SetupHeadscaleClient()
	defer headscale.Client.Close()

	result, err := headscale.Client.ListUsers()
	if err != nil {
		t.Error(err)
	}

	str, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		t.Error(err)
	}
	t.Log(string(str))
}

func TestCreateUser(t *testing.T) {
	headscale.SetupHeadscaleClient()
	defer headscale.Client.Close()

	result, err := headscale.Client.CreateUser("test")
	if err != nil {
		t.Error(err)
	}

	str, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		t.Error(err)
	}
	t.Log(string(str))
}

func TestDeleteUser(t *testing.T) {
	headscale.SetupHeadscaleClient()
	defer headscale.Client.Close()

	err := headscale.Client.DeleteUser("test")
	if err != nil {
		t.Error(err)
	}
}

func TestRenameUser(t *testing.T) {
	headscale.SetupHeadscaleClient()
	defer headscale.Client.Close()

	result, err := headscale.Client.RenameUser("test", "test2")
	if err != nil {
		t.Error(err)
	}

	str, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		t.Error(err)
	}
	t.Log(string(str))
}

func TestNewHeadscaleServiceClient(t *testing.T) {
	client, conn, cancel, err := headscale.NewHeadscaleServiceClient()
	defer conn.Close()
	defer cancel()
	if err != nil {
		t.Error(err)
	}
	t.Log(client)

}

func TestClient(t *testing.T) {
	headscale.SetupHeadscaleClient()
	defer headscale.Client.Close()

	ctx := context.Background()

	machines, err := headscale.Client.Client.ListUsers(ctx, &v1.ListUsersRequest{})
	if err != nil {
		t.Error(err)
	}
	t.Log(machines)
}
