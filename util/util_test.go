package util_test

import (
	"testing"

	"github.com/xzzpig/headscale-manager/util"
	"go.mongodb.org/mongo-driver/bson"
)

func TestBsonMap(t *testing.T) {
	m := &util.BsonMap{bson.M{}}
	m.SetNotNull("a", "b")
	m.SetNotNull("c", nil)
	m.SetNotNull("d", "e")
	m.SetNotNull("f", util.GetObjectID(nil))
	m.SetNotNull("g", util.GetObjectID(util.Ptr("5f3b3a3f1a2f2d2c2c2c2c2c")))
	t.Log(m.ToBsonM())

	t.Log((&util.BsonMap{bson.M{}}).SetNotNull("a", "b").SetNotNull("c", nil).SetNotNull("d", "e").ToBsonM())
}

func TestGetObjectID(t *testing.T) {
	t.Log(util.GetObjectID(nil) == nil)
	t.Log(util.GetObjectID(util.Ptr("5f3b3a3f1a2f2d2c2c2c2c2c")))
}

func TestGetObjectIDs(t *testing.T) {
	t.Log(util.GetObjectIDs(nil) == nil)
	t.Log(util.GetObjectIDs([]*string{util.Ptr("5f3b3a3f1a2f2d2c2c2c2c2c")}))
}
