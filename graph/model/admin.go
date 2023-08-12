package model

import (
	"context"

	mycontext "github.com/xzzpig/headscale-manager/server/context"
)

func CheckIsAdmin(ctx context.Context) (bool, error) {
	userInfo, err := mycontext.GetPtrFromContext[UserInfo](ctx, mycontext.USER_INFO_KEY)
	if err != nil {
		return false, err
	}
	return userInfo.IsAdmin(), nil
}
