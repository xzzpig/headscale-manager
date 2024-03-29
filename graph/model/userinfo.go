package model

import (
	"github.com/xzzpig/headscale-manager/config"
	"github.com/xzzpig/headscale-manager/util"
	"go.mongodb.org/mongo-driver/bson"
)

func (c *UserInfo) IsAdmin() bool {
	if c.isAdmin == nil {
		c.isAdmin = new(bool)

		*c.isAdmin = util.ArrContainsAny(config.GetConfig().Admin.Groups, c.Groups) || util.ArrContains(config.GetConfig().Admin.Users, c.Name)
	}
	return *c.isAdmin
}

func (c *UserInfo) DBFilter(nameKey string, m bson.M) bson.M {
	if m == nil {
		m = bson.M{}
	}
	if c.IsAdmin() {
		return m
	}
	m[nameKey] = c.Name
	return m
}

func (c *UserInfo) DBFilterEmpty(nameKey string) bson.M {
	if c.IsAdmin() {
		return bson.M{}
	}
	return bson.M{
		"$or": bson.A{
			bson.M{nameKey: c.Name},
			bson.M{nameKey: bson.M{"$exists": false}},
			bson.M{nameKey: bson.M{"$size": 0}},
		},
	}
}
