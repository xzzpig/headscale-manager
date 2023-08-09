package headscale

import (
	v1 "github.com/juanfont/headscale/gen/go/headscale/v1"
	"go.uber.org/zap"
)

func (c *HeadscaleClient) ListMachines() (*v1.ListMachinesResponse, error) {
	ctx, cancel := c.NewContext()
	defer cancel()
	logger.Debug("ListMachines")
	return c.Client.ListMachines(ctx, &v1.ListMachinesRequest{})
}

func (c *HeadscaleClient) ListMachineRoutes(machineId uint64) (*v1.GetMachineRoutesResponse, error) {
	ctx, cancel := c.NewContext()
	defer cancel()
	logger.Debug("ListMachineRoutes", zap.Uint64("machineId", machineId))
	return c.Client.GetMachineRoutes(ctx, &v1.GetMachineRoutesRequest{
		MachineId: machineId,
	})
}

func (c *HeadscaleClient) GetMachine(machineId uint64) (*v1.GetMachineResponse, error) {
	ctx, cancel := c.NewContext()
	defer cancel()
	logger.Debug("GetMachine", zap.Uint64("machineId", machineId))
	return c.Client.GetMachine(ctx, &v1.GetMachineRequest{
		MachineId: machineId,
	})
}

func (c *HeadscaleClient) EnableRoute(routeId uint64, enable bool) error {
	ctx, cancel := c.NewContext()
	defer cancel()
	logger.Debug("EnableRoute", zap.Uint64("routeId", routeId), zap.Bool("enable", enable))
	if enable {
		_, err := c.Client.EnableRoute(ctx, &v1.EnableRouteRequest{
			RouteId: routeId,
		})
		return err
	} else {
		_, err := c.Client.DisableRoute(ctx, &v1.DisableRouteRequest{
			RouteId: routeId,
		})
		return err
	}
}

func (c *HeadscaleClient) DeleteRoute(routeId uint64) error {
	ctx, cancel := c.NewContext()
	defer cancel()
	logger.Debug("DeleteRoute", zap.Uint64("routeId", routeId))
	_, err := c.Client.DeleteRoute(ctx, &v1.DeleteRouteRequest{
		RouteId: routeId,
	})
	return err
}

func (c *HeadscaleClient) RenameMachine(machineId uint64, name string) (*v1.RenameMachineResponse, error) {
	ctx, cancel := c.NewContext()
	defer cancel()
	logger.Debug("RenameMachine", zap.Uint64("machineId", machineId), zap.String("name", name))
	res, err := c.Client.RenameMachine(ctx, &v1.RenameMachineRequest{
		MachineId: machineId,
		NewName:   name,
	})
	return res, err
}

func (c *HeadscaleClient) DeleteMachine(machineId uint64) error {
	ctx, cancel := c.NewContext()
	defer cancel()
	logger.Debug("DeleteMachine", zap.Uint64("machineId", machineId))
	_, err := c.Client.DeleteMachine(ctx, &v1.DeleteMachineRequest{
		MachineId: machineId,
	})
	return err
}

func (c *HeadscaleClient) SetMachineTags(machineId uint64, tags []string) (*v1.SetTagsResponse, error) {
	ctx, cancel := c.NewContext()
	defer cancel()
	logger.Debug("SetMachineTags", zap.Uint64("machineId", machineId), zap.Strings("tags", tags))
	res, err := c.Client.SetTags(ctx, &v1.SetTagsRequest{
		MachineId: machineId,
		Tags:      tags,
	})
	if err != nil {
		return nil, err
	}
	return res, nil
}

func (c *HeadscaleClient) ListUsers() (*v1.ListUsersResponse, error) {
	ctx, cancel := c.NewContext()
	defer cancel()
	logger.Debug("ListUsers")
	return c.Client.ListUsers(ctx, &v1.ListUsersRequest{})
}

func (c *HeadscaleClient) CreateUser(name string) (*v1.CreateUserResponse, error) {
	ctx, cancel := c.NewContext()
	defer cancel()
	logger.Debug("CreateUser", zap.String("name", name))
	res, err := c.Client.CreateUser(ctx, &v1.CreateUserRequest{
		Name: name,
	})
	return res, err
}

func (c *HeadscaleClient) DeleteUser(name string) error {
	ctx, cancel := c.NewContext()
	defer cancel()
	logger.Debug("DeleteUser", zap.String("name", name))
	_, err := c.Client.DeleteUser(ctx, &v1.DeleteUserRequest{
		Name: name,
	})
	return err
}

func (c *HeadscaleClient) RenameUser(oldName, newName string) (*v1.RenameUserResponse, error) {
	ctx, cancel := c.NewContext()
	defer cancel()
	logger.Debug("RenameUser", zap.String("oldName", oldName), zap.String("newName", newName))
	res, err := c.Client.RenameUser(ctx, &v1.RenameUserRequest{
		OldName: oldName,
		NewName: newName,
	})
	return res, err
}
