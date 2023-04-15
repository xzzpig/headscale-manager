package loader_test

import (
	"errors"
	"testing"

	"github.com/xzzpig/headscale-manager/service/loader"
	"go.mongodb.org/mongo-driver/mongo"
)

func TestErr(t *testing.T) {
	err := loader.NewObjNotFoundErr("123")
	var objError *loader.ErrorObjNotFound
	if errors.As(err, &objError) {
		t.Log(objError.ID)
	} else {
		t.Error("not found")
	}
	mongoError := mongo.ErrNoDocuments
	if errors.Is(err, mongoError) {
		t.Log("is mongo.ErrNoDocuments")
	} else {
		t.Error("is not mongo.ErrNoDocuments")
	}
	t.Log(err)
}
