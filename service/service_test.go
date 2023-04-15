package service_test

import (
	"context"
	"encoding/json"
	"os"
	"testing"

	"github.com/xzzpig/headscale-manager/api/headscale"
	"github.com/xzzpig/headscale-manager/config"
	"github.com/xzzpig/headscale-manager/db"
	"github.com/xzzpig/headscale-manager/graph/model"
	mycontext "github.com/xzzpig/headscale-manager/server/context"
	"github.com/xzzpig/headscale-manager/service"
	"github.com/xzzpig/headscale-manager/service/loader"
	"github.com/xzzpig/headscale-manager/util"
)

func TestMain(m *testing.M) {
	os.Chdir("../")
	config.SetupEnv()
	db.Connect()
	headscale.SetupHeadscaleClient()

	m.Run()
}

func TestProjectSync(t *testing.T) {
	svc := service.NewProjectService(context.TODO())
	result, err := svc.SyncProjectRoute(nil)
	if err != nil {
		t.Error(err)
	}
	str, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		t.Error(err)
	}
	t.Log(string(str))
}

func TestAll(t *testing.T) {
	ctx := context.TODO()
	commonService := service.NewCommonService[model.Project](ctx, "project")

	projects, err := commonService.All()
	if err != nil {
		t.Error(err)
	}
	str, err := json.MarshalIndent(projects, "", "  ")
	if err != nil {
		t.Error(err)
	}
	t.Log(string(str))
}

func TestLoader(t *testing.T) {
	l := loader.NewLoaders()
	ctx := context.WithValue(context.Background(), mycontext.LOADERS_KEY, l)
	commonService := service.NewCommonService[model.Project](ctx, "project")

	project, err := commonService.ByIDWithLoader(util.Ptr("64267b0e723fd8cdf1199b1a"))
	if err != nil {
		t.Error(err)
	}
	str, err := json.MarshalIndent(project, "", "  ")
	if err != nil {
		t.Error(err)
	}
	t.Log(string(str))

	project, err = commonService.ByIDWithLoader(util.Ptr("64267b0e723fd8cdf1199b1b"))
	if err != nil {
		t.Error(err)
	}
	str, err = json.MarshalIndent(project, "", "  ")
	if err != nil {
		t.Error(err)
	}
	t.Log(string(str))

	project, err = commonService.ByIDWithLoader(util.Ptr("64267b0e723fd8cdf1199b1a"))
	if err != nil {
		t.Error(err)
	}
	str, err = json.MarshalIndent(project, "", "  ")
	if err != nil {
		t.Error(err)
	}
	t.Log(string(str))

	l = loader.NewLoaders()
	ctx = context.WithValue(context.Background(), mycontext.LOADERS_KEY, l)
	commonService = service.NewCommonService[model.Project](ctx, "project")

	project, err = commonService.ByIDWithLoader(util.Ptr("64267b0e723fd8cdf1199b1a"))
	if err != nil {
		t.Error(err)
	}
	str, err = json.MarshalIndent(project, "", "  ")
	if err != nil {
		t.Error(err)
	}
	t.Log(string(str))

}
