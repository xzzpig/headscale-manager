package db

import (
	"github.com/xzzpig/headscale-manager/graph/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (db *DB) ProjectRoutes(projectId string) ([]*model.Route, error) {
	projectID, _ := primitive.ObjectIDFromHex(projectId)
	return Find[model.Route](db, "route", bson.M{
		"project": projectID,
	})
}
