package policy

//go:generate wget https://ghproxy.com/https://raw.githubusercontent.com/juanfont/headscale/main/hscontrol/policy/acls_types.go -O acls_types.go

func (aclPolicy *ACLPolicy) GetTagOwners() TagOwners {
	if aclPolicy.TagOwners == nil {
		aclPolicy.TagOwners = make(TagOwners)
	}
	return aclPolicy.TagOwners
}

func (aclPolicy *ACLPolicy) TouchTagOwner(tagName string) {
	_, ok := aclPolicy.GetTagOwners()[tagName]
	if !ok {
		aclPolicy.TagOwners[tagName] = []string{}
	}
}
