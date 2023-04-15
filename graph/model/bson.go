package model

import (
	"github.com/xzzpig/headscale-manager/util"
	"go.mongodb.org/mongo-driver/bson"
)

func (project *ProjectInput) ToBson() *bson.M {
	return (&util.BsonMap{M: bson.M{}}).
		SetNotNull("_id", util.GetObjectID(project.ID)).
		SetNotNull("name", project.Name).
		SetNotNull("code", project.Code).
		Set("machine", util.GetObjectID(project.MachineID)).
		SetNotNull("machines", util.GetObjectIDs(project.MachineIDs)).
		ToBsonM()
}
func (input *ProjectInput) GetID() *string { return input.ID }

func (route *RouteInput) ToBson() *bson.M {
	return (&util.BsonMap{M: bson.M{}}).
		SetNotNull("_id", util.GetObjectID(route.ID)).
		SetNotNull("name", route.Name).
		SetNotNull("description", route.Description).
		SetNotNull("project", util.GetObjectID(route.ProjectID)).
		ToBsonM()
}
func (input *RouteInput) GetID() *string { return input.ID }

func (machine *MachineInput) ToBson() *bson.M {
	return (&util.BsonMap{M: bson.M{}}).
		SetNotNull("_id", util.GetObjectID(machine.ID)).
		SetNotNull("name", machine.Name).
		ToBsonM()
}
func (input *MachineInput) GetID() *string { return input.ID }
