package service

import (
	"context"
	"errors"

	"github.com/xzzpig/headscale-manager/api/headscale"
	"github.com/xzzpig/headscale-manager/graph/model"

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
