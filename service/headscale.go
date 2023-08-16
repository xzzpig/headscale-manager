package service

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"os/exec"
	"strings"

	"github.com/xzzpig/headscale-manager/api/headscale"
	"github.com/xzzpig/headscale-manager/api/headscale/policy"
	"github.com/xzzpig/headscale-manager/config"
	"github.com/xzzpig/headscale-manager/graph/model"
	"go.uber.org/zap"

	mycontext "github.com/xzzpig/headscale-manager/server/context"
)

var ErrNotAccessible = errors.New("not Accessible")

type HeadscaleService struct {
	ctx context.Context
}

func NewHeadscaleService(ctx context.Context) *HeadscaleService {
	return &HeadscaleService{ctx: ctx}
}

func checkAccessHMachine(ctx context.Context, machineId uint64) (bool, error) {
	userInfo, err := mycontext.GetPtrFromContext[model.UserInfo](ctx, mycontext.USER_INFO_KEY)
	if err != nil {
		return false, err
	}
	if userInfo.IsAdmin() {
		return true, nil
	}
	machine, err := headscale.Client.GetMachine(machineId)
	if err != nil {
		return false, err
	}
	if machine.Machine.User.Name != userInfo.Name {
		return false, nil
	}
	return true, nil
}

func (service *HeadscaleService) RenameMachine(machineId uint64, name string) (*model.HMachine, error) {
	access, err := checkAccessHMachine(service.ctx, machineId)
	if err != nil {
		return nil, err
	}
	if !access {
		return nil, ErrNotAccessible
	}

	res, err := headscale.Client.RenameMachine(machineId, name)
	if err != nil {
		return nil, err
	}
	return model.ToHMachine(res.Machine), nil
}

func (service *HeadscaleService) DeleteMachine(machineId uint64) error {
	access, err := checkAccessHMachine(service.ctx, machineId)
	if err != nil {
		return err
	}
	if !access {
		return ErrNotAccessible
	}

	return headscale.Client.DeleteMachine(machineId)
}

func (service *HeadscaleService) GetMachine(machineId uint64) (*model.HMachine, error) {
	access, err := checkAccessHMachine(service.ctx, machineId)
	if err != nil {
		return nil, err
	}
	if !access {
		return nil, ErrNotAccessible
	}

	res, err := headscale.Client.GetMachine(machineId)
	if err != nil {
		return nil, err
	}
	return model.ToHMachine(res.Machine), nil
}

func (service *HeadscaleService) ListMachines() ([]*model.HMachine, error) {
	result, err := headscale.Client.ListMachines()
	if err != nil {
		return nil, err
	}
	machines := make([]*model.HMachine, 0)
	for _, machine := range result.Machines {
		access, err := checkAccessHMachine(service.ctx, machine.Id)
		if err != nil {
			return nil, err
		}
		if access {
			machines = append(machines, model.ToHMachine(machine))
		}
	}
	return machines, nil
}

func (service *HeadscaleService) CreateUser(name string) (*model.HUser, error) {
	user, err := headscale.Client.CreateUser(name)
	if err != nil {
		return nil, err
	}
	if config.GetConfig().ACL.Features.UserSelf || config.GetConfig().ACL.Features.UserShare {
		go service.TriggerUpdate()
	}
	return model.ToHUser(user.User), nil
}

func (service *HeadscaleService) DeleteUser(name string) (bool, error) {
	err := headscale.Client.DeleteUser(name)
	if err != nil {
		return false, err
	}
	if config.GetConfig().ACL.Features.UserSelf || config.GetConfig().ACL.Features.UserShare {
		go service.TriggerUpdate()
	}
	return true, nil
}

func (service *HeadscaleService) RenameUser(oldName string, newName string) (*model.HUser, error) {
	user, err := headscale.Client.RenameUser(oldName, newName)
	if err != nil {
		return nil, err
	}
	if config.GetConfig().ACL.Features.UserSelf || config.GetConfig().ACL.Features.UserShare {
		go service.TriggerUpdate()
	}
	return model.ToHUser(user.User), nil
}

func (svc *HeadscaleService) GenerateACL() (*policy.ACLPolicy, error) {
	aclPolicy := policy.ACLPolicy{}

	aclBase := config.GetConfig().ACL.Base
	if aclBase != "" {
		err := json.Unmarshal([]byte(aclBase), &aclPolicy)
		if err != nil {
			return nil, err
		}
	}

	if config.GetConfig().ACL.Features.UserSelf || config.GetConfig().ACL.Features.UserShare {
		resp, err := headscale.Client.ListUsers()
		if err != nil {
			return nil, err
		}
		for _, user := range resp.Users {
			acl := policy.ACL{
				Action:       "accept",
				Sources:      []string{user.Name},
				Destinations: []string{},
			}

			if config.GetConfig().ACL.Features.UserSelf {
				acl.Destinations = append(acl.Destinations, user.Name+":*")
			}
			if config.GetConfig().ACL.Features.UserShare {
				tagName := "tag:share-" + user.Name
				acl.Destinations = append(acl.Destinations, tagName+":*")
				aclPolicy.TouchTagOwner(tagName)
			}
			if config.GetConfig().ACL.Features.UserPeer {
				tagName := "tag:peer-" + user.Name
				acl.Destinations = append(acl.Destinations, tagName+":*")
				acl.Sources = append(acl.Sources, tagName)
				aclPolicy.TouchTagOwner(tagName)
			}

			aclPolicy.ACLs = append(aclPolicy.ACLs, acl)
		}
	}

	if config.GetConfig().ACL.Features.ProjectTag {
		projectSvc := NewProjectService(svc.ctx)
		routeSvc := NewRouteService(svc.ctx)
		projects, err := projectSvc.All()
		if err != nil {
			return nil, err
		}
		for _, project := range projects {
			srcTagName := "tag:prj-acc-" + *project.Code
			dstTagName := "tag:prj-use-" + *project.Code

			aclPolicy.TouchTagOwner(srcTagName)
			aclPolicy.TouchTagOwner(dstTagName)

			acl := policy.ACL{
				Action:       "accept",
				Sources:      []string{srcTagName},
				Destinations: []string{dstTagName + ":*"},
			}

			routes, err := routeSvc.ProjectRoutes(project.ID)
			if err != nil {
				return nil, err
			}
			for _, route := range routes {
				acl.Destinations = append(acl.Destinations, *route.Name+":*")
			}

			aclPolicy.ACLs = append(aclPolicy.ACLs, acl)
		}
	}

	return &aclPolicy, nil
}

func (svc *HeadscaleService) TriggerUpdate() error {
	if !config.GetConfig().ACL.Trigger.Enable {
		return nil
	}

	logger := zap.L().Named("service").Named("headscale").With(zap.String("method", "GenerateACL"))

	cmdTrigger := config.GetConfig().ACL.Trigger.Cmd
	webhookTrigger := config.GetConfig().ACL.Trigger.Webhook

	var aclStr string
	if cmdTrigger != "" || webhookTrigger != "" {
		acl, err := svc.GenerateACL()
		if err != nil {
			return err
		}
		acls, err := json.Marshal(acl)
		if err != nil {
			return err
		}
		aclStr = string(acls)
	}
	if cmdTrigger != "" {
		cmds := strings.Split(cmdTrigger, " ")
		for i, cmd := range cmds {
			cmds[i] = strings.ReplaceAll(cmd, "@{ACL}", aclStr)
		}
		cmd := exec.Command(cmds[0], cmds[1:]...)
		err := cmd.Run()
		if err != nil {
			logger.Error("error running command", zap.Error(err), zap.String("command", cmdTrigger))
			return err
		}
		logger.Debug("command executed", zap.String("command", cmdTrigger))
	}
	if webhookTrigger != "" {
		_, err := http.Post(webhookTrigger, "application/json", strings.NewReader(aclStr))
		if err != nil {
			logger.Error("error running webhook", zap.Error(err), zap.String("webhook", webhookTrigger))
			return err
		}
		logger.Debug("webhook executed", zap.String("webhook", webhookTrigger))
	}

	return nil
}
