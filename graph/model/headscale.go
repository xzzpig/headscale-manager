package model

import (
	v1 "github.com/juanfont/headscale/gen/go/headscale/v1"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func ToHUser(u *v1.User) *HUser {
	if u == nil {
		return nil
	}
	return &HUser{
		ID:   u.Id,
		Name: u.Name,
	}
}

func ToHMachine(m *v1.Machine) *HMachine {
	if m == nil {
		return nil
	}
	return &HMachine{
		ID:          int(m.Id),
		IPAddresses: m.IpAddresses,
		Name:        m.Name,
		LastSeen:    ToTimestamp(m.LastSeen),
		ForcedTags:  m.ForcedTags,
		GivenName:   m.GivenName,
		Online:      m.Online,
		User:        ToHUser(m.User),
	}
}

func ToHRoute(r *v1.Route) *HRoute {
	if r == nil {
		return nil
	}
	return &HRoute{
		ID:         int(r.Id),
		Prefix:     r.Prefix,
		Advertised: r.Advertised,
		Enabled:    r.Enabled,
		IsPrimary:  r.IsPrimary,
		CreatedAt:  ToTimestamp(r.CreatedAt),
		UpdatedAt:  ToTimestamp(r.UpdatedAt),
		DeletedAt:  ToTimestamp(r.DeletedAt),
	}
}

func ToTimestamp(t *timestamppb.Timestamp) *Timestamp {
	if t == nil {
		return nil
	}
	return &Timestamp{Seconds: int(t.Seconds), Nanos: int(t.Nanos)}
}
