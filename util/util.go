package util

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"reflect"
	"regexp"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func Ptr[T any](obj T) *T {
	return &obj
}

func UnPtrs[T any](objs []*T) []T {
	if objs == nil {
		return nil
	}
	objs2 := make([]T, len(objs))
	for i, obj := range objs {
		objs2[i] = *obj
	}
	return objs2
}

func GetObjectID(id *string) *primitive.ObjectID {
	if id == nil {
		return nil
	}
	objid, err := primitive.ObjectIDFromHex(*id)
	if err != nil {
		return nil
	}
	return &objid
}

func GetObjectIDs(ids []*string) *[]*primitive.ObjectID {
	if ids == nil {
		return nil
	}
	objids := make([]*primitive.ObjectID, len(ids))
	for i, id := range ids {
		objids[i] = GetObjectID(id)
	}
	return &objids
}

type BsonMap struct {
	bson.M
}

func (m *BsonMap) SetNotNull(key string, value any) *BsonMap {
	if IsNil(value) {
		return m
	}
	m.M[key] = value
	return m
}

func (m *BsonMap) Set(key string, value any) *BsonMap {
	m.M[key] = value
	return m
}

func (m *BsonMap) ToBsonM() *bson.M {
	return &m.M
}

func IsNil(i any) bool {
	if i == nil {
		return true
	}
	v := reflect.ValueOf(i)
	switch v.Kind() {
	case reflect.Chan, reflect.Func, reflect.Interface, reflect.Map, reflect.Ptr, reflect.Slice:
		return v.IsNil()
	}
	return false
}

func ToJsonString[T interface{}](obj T) string {
	str, err := json.Marshal(obj)
	if err != nil {
		return fmt.Sprintf("%#v", obj)
	}
	return string(str)
}

func UnPtrString(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func CheckHttpError(funcName string, resp *http.Response) error {
	if resp.StatusCode != http.StatusOK {
		str, err := io.ReadAll(resp.Body)
		if err != nil {
			return err
		}
		return fmt.Errorf("%s request unexpected status code: %d,body: %s", funcName, resp.StatusCode, string(str))
	}
	return nil
}

func ArrContains[T comparable](arr []T, obj T) bool {
	for _, a := range arr {
		if a == obj {
			return true
		}
	}
	return false
}

func ArrContainsAny[T comparable](arr []T, objs []T) bool {
	for _, obj := range objs {
		if ArrContains(arr, obj) {
			return true
		}
	}
	return false
}

var invalidCharsInUserRegex = regexp.MustCompile("[^a-z0-9-.]+")

const (
	// value related to RFC 1123 and 952.
	LabelHostnameLength = 63
)

var ErrInvalidUserName = errors.New("invalid user name")

// NormalizeToFQDNRules will replace forbidden chars in user
// it can also return an error if the user doesn't respect RFC 952 and 1123.
func NormalizeToFQDNRules(name string, stripEmailDomain bool) (string, error) {
	name = strings.ToLower(name)
	name = strings.ReplaceAll(name, "'", "")
	atIdx := strings.Index(name, "@")
	if stripEmailDomain && atIdx > 0 {
		name = name[:atIdx]
	} else {
		name = strings.ReplaceAll(name, "@", ".")
	}
	name = invalidCharsInUserRegex.ReplaceAllString(name, "-")

	for _, elt := range strings.Split(name, ".") {
		if len(elt) > LabelHostnameLength {
			return "", fmt.Errorf(
				"label %v is more than 63 chars: %w",
				elt,
				ErrInvalidUserName,
			)
		}
	}

	return name, nil
}
